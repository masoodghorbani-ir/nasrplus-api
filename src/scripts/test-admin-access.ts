import { connectDatabase, disconnectDatabase } from '../config/database';
import { seedDatabase } from '../database/seeds';
import { Admin } from '../modules/admin/models/admin.model';
import { Permission } from '../modules/admin/models/permission.model';
import { AdminType } from '../modules/admin/interfaces/admin.interface';
import { AuthService } from '../modules/admin/services/auth.service';
import { AdminService } from '../modules/admin/services/admin.service';
import { accessControl } from '../common/middlewares/access-control.middleware';
import { Request, Response } from 'express';

const runTests = async () => {
  console.log('🧪 Starting Admin & Access Control Verification Tests...\n');

  try {
    await connectDatabase();

    // 1. Run Seeder
    console.log('1️⃣ Running database seeder...');
    await seedDatabase({ silent: true });

    // Verify Superadmin was seeded
    const superadmin = await Admin.findOne({ type: AdminType.SUPERADMIN }).populate('permissions');
    if (!superadmin) {
      throw new Error('❌ Superadmin was not found after seeding!');
    }
    console.log(`✅ Superadmin exists: ${superadmin.username} (type: ${superadmin.type})`);

    // Verify credentials
    const isPasswordValid = await superadmin.comparePassword('superadmin@12345678');
    if (!isPasswordValid) {
      throw new Error('❌ Superadmin password verification failed!');
    }
    console.log('✅ Superadmin password hashes match: superadmin@12345678');

    // 2. Test Login via AuthService
    console.log('\n2️⃣ Testing AuthService login...');
    const authService = new AuthService();
    const loginRes = await authService.login('superadmin@nasrplus.ir', 'superadmin@12345678');
    console.log(`✅ Login successful! Generated JWT token: ${loginRes.token.slice(0, 25)}...`);

    // 3. Test Singleton constraint: Try creating a SECOND Superadmin
    console.log('\n3️⃣ Testing SUPERADMIN uniqueness constraint...');
    let secondSuperadminBlocked = false;
    try {
      const secondAdmin = new Admin({
        username: 'another_super@nasrplus.ir',
        password: 'password123',
        type: AdminType.SUPERADMIN,
      });
      await secondAdmin.save();
    } catch (err: any) {
      secondSuperadminBlocked = true;
      console.log(`✅ Creating second SUPERADMIN correctly blocked by schema hook / index: ${err.message}`);
    }

    if (!secondSuperadminBlocked) {
      throw new Error('❌ CRITICAL: Second SUPERADMIN was created! Uniqueness constraint failed!');
    }

    // 4. Create a regular admin with limited permissions
    console.log('\n4️⃣ Testing Regular Admin creation with specific permissions...');
    const adminService = new AdminService();

    // Clean up test admin if exists
    await Admin.deleteOne({ username: 'test_operator@nasrplus.ir' });

    const memberReadPerm = await Permission.findOne({ key: 'members:read' });
    if (!memberReadPerm) {
      throw new Error('❌ Permission members:read not found in seeded permissions!');
    }

    const testAdmin = await adminService.createAdmin({
      username: 'test_operator@nasrplus.ir',
      password: 'OperatorPass@123',
      type: AdminType.ADMIN,
      fullName: 'Test Operator',
      permissions: [memberReadPerm._id.toString()],
    });
    console.log(`✅ Created test operator admin: ${testAdmin.username} with permission: [members:read]`);

    // 5. Test updating regular admin to SUPERADMIN (should be blocked!)
    console.log('\n5️⃣ Testing updating regular admin to SUPERADMIN...');
    let updateToSuperadminBlocked = false;
    try {
      await adminService.updateAdmin(testAdmin._id.toString(), {
        type: AdminType.SUPERADMIN,
      });
    } catch (err: any) {
      updateToSuperadminBlocked = true;
      console.log(`✅ Updating to SUPERADMIN correctly blocked: ${err.message}`);
    }

    if (!updateToSuperadminBlocked) {
      throw new Error('❌ CRITICAL: Regular admin was updated to SUPERADMIN! Constraint failed!');
    }

    // 6. Test Route Access Control Middleware
    console.log('\n6️⃣ Testing Route Access Control Middleware...');

    // Login as operator to get token
    const operatorLogin = await authService.login('test_operator@nasrplus.ir', 'OperatorPass@123');

    // Helper to invoke middleware
    const executeMiddleware = (
      middleware: any,
      req: Partial<Request>
    ): Promise<{ passed: boolean; error?: any }> => {
      return new Promise((resolve) => {
        const mockRes = {} as Response;
        middleware(req as Request, mockRes, (err?: any) => {
          if (err) {
            resolve({ passed: false, error: err });
          } else {
            resolve({ passed: true });
          }
        });
      });
    };

    // A. Public route without token
    const publicMw = accessControl('public');
    const pubRes = await executeMiddleware(publicMw, { headers: {} });
    if (!pubRes.passed) throw new Error('❌ Public route failed without token!');
    console.log('✅ Public route: Allowed without token');

    // B. Private route ('members:read') without token
    const privateReadMw = accessControl('private', 'members:read');
    const privNoTokenRes = await executeMiddleware(privateReadMw, { headers: {} });
    if (privNoTokenRes.passed || privNoTokenRes.error?.statusCode !== 401) {
      throw new Error('❌ Private route did not reject request without token!');
    }
    console.log('✅ Private route without token: Correctly rejected (401 Unauthorized)');

    // C. Private route ('members:read') with Operator token (has permission)
    const privWithPermRes = await executeMiddleware(privateReadMw, {
      headers: { authorization: `Bearer ${operatorLogin.token}` },
    });
    if (!privWithPermRes.passed) {
      throw new Error(`❌ Operator with members:read was denied access: ${privWithPermRes.error?.message}`);
    }
    console.log('✅ Private route (members:read) with Operator: Correctly allowed');

    // D. Private route ('companies:delete') with Operator token (lacks permission)
    const privateDeleteMw = accessControl('private', 'companies:delete');
    const privWithoutPermRes = await executeMiddleware(privateDeleteMw, {
      headers: { authorization: `Bearer ${operatorLogin.token}` },
    });
    if (privWithoutPermRes.passed || privWithoutPermRes.error?.statusCode !== 403) {
      throw new Error('❌ Operator without companies:delete was not rejected with 403!');
    }
    console.log('✅ Private route (companies:delete) with Operator lacking permission: Correctly rejected (403 Forbidden)');

    // E. Private route ('companies:delete') with Superadmin token (bypasses private permissions)
    const superPrivRes = await executeMiddleware(privateDeleteMw, {
      headers: { authorization: `Bearer ${loginRes.token}` },
    });
    if (!superPrivRes.passed) {
      throw new Error(`❌ Superadmin was denied access to private route: ${superPrivRes.error?.message}`);
    }
    console.log('✅ Private route (companies:delete) with Superadmin: Correctly allowed');

    // F. Superadmin-only route with Operator token (should fail)
    const superadminMw = accessControl('superadmin');
    const operatorOnSuperRouteRes = await executeMiddleware(superadminMw, {
      headers: { authorization: `Bearer ${operatorLogin.token}` },
    });
    if (operatorOnSuperRouteRes.passed || operatorOnSuperRouteRes.error?.statusCode !== 403) {
      throw new Error('❌ Regular admin accessed superadmin-only route!');
    }
    console.log('✅ Superadmin-only route with Operator: Correctly rejected (403 Forbidden)');

    // G. Superadmin-only route with Superadmin token (should pass)
    const superOnSuperRouteRes = await executeMiddleware(superadminMw, {
      headers: { authorization: `Bearer ${loginRes.token}` },
    });
    if (!superOnSuperRouteRes.passed) {
      throw new Error('❌ Superadmin was rejected from superadmin-only route!');
    }
    console.log('✅ Superadmin-only route with Superadmin: Correctly allowed');

    // Clean up test admin
    await Admin.deleteOne({ username: 'test_operator@nasrplus.ir' });

    console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
    await disconnectDatabase();
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification test failure:', err);
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  }
};

void runTests();
