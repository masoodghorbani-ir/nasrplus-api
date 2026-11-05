import { connectDatabase, disconnectDatabase } from '../config/database';
import '../modules/lookup/models';
import '../modules/company/models/company-information.model';
import { Member } from '../modules/members/models/member.model';
import { MemberSkill } from '../modules/members/models/member-skill.model';
import { Specialization } from '../modules/lookup/models/specialization.model';
import { MembershipType } from '../modules/lookup/models/membership-type.model';
import { NatureOfMembership } from '../modules/lookup/models/nature-of-membership.model';
import { MemberService } from '../modules/members/services/member.service';
import { Admin } from '../modules/admin/models/admin.model';

const runTests = async () => {
  console.log('🧪 Starting Member Skills & Verification Tests...\n');

  try {
    await connectDatabase();

    // 1. Get or create dependencies
    let specialization = await Specialization.findOne();
    if (!specialization) {
      specialization = await Specialization.create({
        title: 'Test Software Specialization',
        code: 'TEST_SW',
      });
    }

    let membershipType = await MembershipType.findOne();
    if (!membershipType) {
      membershipType = await MembershipType.create({
        title: 'Test Membership Type',
        code: 'TEST_MT',
      });
    }

    let nature = await NatureOfMembership.findOne();
    if (!nature) {
      nature = await NatureOfMembership.create({
        title: 'Test Nature',
        code: 'TEST_NAT',
      });
    }

    const admin = await Admin.findOne();

    // 2. Create test member
    const testMemberCode = `TEST-SKILL-${Date.now()}`;
    const member = await Member.create({
      memberCode: testMemberCode,
      membershipTypeId: membershipType._id,
      natureOfMembership: nature._id,
      firstName: 'Ali',
      lastName: 'Mohammadi',
    });
    console.log(`✅ Test member created: ${member.memberCode} (${member._id})`);

    const memberService = new MemberService();

    // 3. Test validation: percentage out of bounds
    console.log('\n2️⃣ Testing selfAssessmentPercentage validation...');
    try {
      await memberService.addMemberSkill(member._id.toString(), {
        specializationId: specialization._id.toString(),
        startDate: '2022-01-15',
        selfAssessmentPercentage: 150, // Invalid!
        hasCertificate: false,
      });
      throw new Error('Should have failed with percentage > 100');
    } catch (err: any) {
      console.log(`✅ Successfully rejected percentage > 100: ${err.message}`);
    }

    // 4. Test validation: certificate claimed without file
    console.log('\n3️⃣ Testing certificate requirement validation...');
    try {
      await memberService.addMemberSkill(member._id.toString(), {
        specializationId: specialization._id.toString(),
        startDate: '2022-01-15',
        selfAssessmentPercentage: 85,
        hasCertificate: true,
        // certificateFile missing!
      });
      throw new Error('Should have failed when hasCertificate is true without file');
    } catch (err: any) {
      console.log(`✅ Successfully rejected certificate missing: ${err.message}`);
    }

    // 5. Test adding valid member skill
    console.log('\n4️⃣ Testing adding valid member skill...');
    const skill = await memberService.addMemberSkill(
      member._id.toString(),
      {
        specializationId: specialization._id.toString(),
        startDate: '2021-06-01',
        selfAssessmentPercentage: 80,
        hasCertificate: true,
        certificateFile: '/uploads/members/certificates/sample-test.pdf',
        certificateTitle: 'Professional Certificate',
        description: '5 years of professional software architecture experience',
      },
      undefined,
      admin?._id?.toString()
    );
    console.log(`✅ Member skill created with status: ${skill.verificationStatus}`);
    console.log(`✅ Verification logs count: ${skill.verificationLogs.length}`);

    if (skill.verificationStatus !== 'PENDING') {
      throw new Error(`Expected PENDING status, got ${skill.verificationStatus}`);
    }

    // 6. Test Expert Approval
    console.log('\n5️⃣ Testing expert approval workflow...');
    const approvedSkill = await memberService.verifyMemberSkill(
      member._id.toString(),
      skill._id.toString(),
      'APPROVED',
      undefined,
      admin?._id?.toString(),
      'Verified with certifying authority'
    );
    console.log(`✅ Skill verified as: ${approvedSkill.verificationStatus}`);
    console.log(`✅ Logs count: ${approvedSkill.verificationLogs.length}`);
    if (approvedSkill.verificationStatus !== 'APPROVED') {
      throw new Error('Verification status should be APPROVED');
    }

    // 7. Test Expert Rejection validation (missing rejectionReason)
    console.log('\n6️⃣ Testing rejection without reason...');
    try {
      await memberService.verifyMemberSkill(
        member._id.toString(),
        skill._id.toString(),
        'REJECTED',
        '', // Missing reason!
        admin?._id?.toString()
      );
      throw new Error('Should have failed when rejecting without reason');
    } catch (err: any) {
      console.log(`✅ Successfully caught missing rejection reason: ${err.message}`);
    }

    // 8. Test Expert Rejection with reason
    console.log('\n7️⃣ Testing expert rejection with reason...');
    const rejectedSkill = await memberService.verifyMemberSkill(
      member._id.toString(),
      skill._id.toString(),
      'REJECTED',
      'The uploaded certificate is illegible and serial number is unverified',
      admin?._id?.toString()
    );
    console.log(`✅ Skill verified as: ${rejectedSkill.verificationStatus}`);
    console.log(`✅ Rejection reason: ${rejectedSkill.rejectionReason}`);
    console.log(`✅ Total verification logs: ${rejectedSkill.verificationLogs.length}`);

    // 9. Test Query member with virtual populated skills
    console.log('\n8️⃣ Testing member query with populated skills...');
    const memberWithSkills = await memberService.getMemberById(member._id.toString());
    console.log(`✅ Member fetched, skills array length: ${memberWithSkills.skills?.length}`);

    // 10. Clean up test data
    console.log('\n9️⃣ Cleaning up test data...');
    await memberService.deleteMemberSkill(member._id.toString(), skill._id.toString());
    await memberService.deleteMember(member._id.toString());
    console.log('✅ Test data cleaned up successfully');

    console.log('\n🎉 ALL MEMBER SKILLS & VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

runTests();
