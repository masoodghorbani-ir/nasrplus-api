import { connectDatabase, disconnectDatabase } from '../config/database';
import { seedDatabase } from '../database/seeds';
import { Admin } from '../modules/admin/models/admin.model';
import { AdminLoginLog } from '../modules/admin/models/admin-login-log.model';
import { Specialization } from '../modules/lookup/models/specialization.model';
import { AdminType } from '../modules/admin/interfaces/admin.interface';
import { AuthService } from '../modules/admin/services/auth.service';
import { AdminService } from '../modules/admin/services/admin.service';
import { LookupService } from '../modules/lookup/services/lookup.service';

const runTests = async () => {
  console.log('🧪 Starting Expert & Login Audit Logs Verification Tests...\n');

  try {
    await connectDatabase();
    await seedDatabase({ silent: true });

    const adminService = new AdminService();
    const authService = new AuthService();
    const lookupService = new LookupService();

    // 1. Get or create a test specialization
    let spec = await Specialization.findOne();
    if (!spec) {
      spec = await Specialization.create({
        title: 'Test Software Specialization',
        code: 'TEST-SW',
      });
    }
    console.log(`✅ Using Specialization: ${spec.title} (${spec._id})`);

    // 2. Test EXPERT creation without reviewableSpecializations (should fail)
    console.log('\n1️⃣ Testing EXPERT creation without reviewableSpecializations (should fail)...');
    let blockedWithoutSpecs = false;
    try {
      await adminService.createAdmin({
        username: 'fail_expert@nasrplus.ir',
        password: 'Password@123',
        type: AdminType.EXPERT,
      });
    } catch (err: any) {
      blockedWithoutSpecs = true;
      console.log(`✅ Correctly rejected: ${err.message}`);
    }
    if (!blockedWithoutSpecs) {
      throw new Error('❌ Failed: EXPERT was created without reviewableSpecializations!');
    }

    // 3. Test EXPERT creation with valid reviewableSpecializations
    console.log('\n2️⃣ Testing valid EXPERT creation...');
    const testExpertUsername = 'valid_expert@nasrplus.ir';
    await Admin.deleteOne({ username: testExpertUsername });

    const expert = await adminService.createAdmin({
      username: testExpertUsername,
      password: 'ExpertPassword@123',
      type: AdminType.EXPERT,
      fullName: 'مهندس بررسی نرم‌افزار',
      reviewableSpecializations: [spec._id.toString()],
    });

    if (!expert.reviewableSpecializations || expert.reviewableSpecializations.length === 0) {
      throw new Error('❌ Failed: Expert reviewableSpecializations not saved!');
    }
    console.log(`✅ Expert created successfully with type: ${expert.type}, specs count: ${expert.reviewableSpecializations.length}`);

    // 4. Test Specialization referential delete guard
    console.log('\n3️⃣ Testing Specialization delete guard against referenced Expert (should return 409 Conflict)...');
    let deleteSpecBlocked = false;
    try {
      await lookupService.deleteSpecialization(spec._id.toString());
    } catch (err: any) {
      deleteSpecBlocked = true;
      console.log(`✅ Specialization deletion correctly blocked with conflict: ${err.message}`);
    }
    if (!deleteSpecBlocked) {
      throw new Error('❌ Failed: Specialization was deleted despite being referenced by an Expert!');
    }

    // 5. Test AuthService Login with metadata capture
    console.log('\n4️⃣ Testing Expert login and audit log capture...');
    const loginRes = await authService.login(testExpertUsername, 'ExpertPassword@123', {
      ip: '192.168.1.150',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    });

    console.log(`✅ Login successful! Token received: ${loginRes.token.slice(0, 20)}...`);
    console.log(`✅ Admin type in login response: ${loginRes.admin.type}`);
    console.log(`✅ Reviewable specializations in login response: ${loginRes.admin.reviewableSpecializations?.length}`);

    // 6. Verify AdminLoginLog was created
    console.log('\n5️⃣ Verifying login audit log record in database...');
    const log = await AdminLoginLog.findOne({ username: testExpertUsername }).sort({ loginAt: -1 });
    if (!log) {
      throw new Error('❌ Failed: AdminLoginLog was not created upon login!');
    }
    console.log(`✅ Found log record: IP=${log.ip}, Device=${log.device}, Browser=${log.browser}, OS=${log.os}, Status=${log.status}`);

    // 7. Test getLoginLogs query service
    console.log('\n6️⃣ Testing getLoginLogs query and filtering...');
    const logsResult = await adminService.getLoginLogs({
      username: 'valid_expert',
      limit: 10,
    });
    if (logsResult.logs.length === 0) {
      throw new Error('❌ Failed: getLoginLogs did not return the expected log record!');
    }
    console.log(`✅ getLoginLogs returned ${logsResult.logs.length} logs (Total: ${logsResult.pagination.total})`);

    // 8. Test Admin delete guard against login logs reference
    console.log('\n7️⃣ Testing Admin delete guard against referenced login logs (should return 409 Conflict)...');
    let deleteAdminBlocked = false;
    try {
      await adminService.deleteAdmin(expert._id.toString());
    } catch (err: any) {
      deleteAdminBlocked = true;
      console.log(`✅ Admin deletion correctly blocked with conflict: ${err.message}`);
    }
    if (!deleteAdminBlocked) {
      throw new Error('❌ Failed: Admin was deleted despite having audit login logs!');
    }

    // 9. Clean up test data
    console.log('\n8️⃣ Cleaning up test data...');
    await AdminLoginLog.deleteMany({ username: testExpertUsername });
    await Admin.deleteOne({ username: testExpertUsername });
    console.log('✅ Cleanup finished');

    console.log('\n🎉 ALL EXPERT & LOGIN LOG TESTS PASSED SUCCESSFULLY! 🎉\n');
    await disconnectDatabase();
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification test failure:', err);
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  }
};

runTests();
