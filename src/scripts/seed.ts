import { connectDatabase, disconnectDatabase } from '../config/database';
import {
  MembershipType,
  Specialization,
  Rank,
  NatureOfMembership,
  AcademicField,
  AcademicQualification,
} from '../modules/lookup/models';
import { CompanyInformation } from '../modules/company/models';
import { Member, MemberAddress, MemberTelephone } from '../modules/members/models';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDatabase();

    // Clear existing data in dev
    await Promise.all([
      MembershipType.deleteMany({}),
      Specialization.deleteMany({}),
      Rank.deleteMany({}),
      NatureOfMembership.deleteMany({}),
      AcademicField.deleteMany({}),
      AcademicQualification.deleteMany({}),
      CompanyInformation.deleteMany({}),
      Member.deleteMany({}),
      MemberAddress.deleteMany({}),
      MemberTelephone.deleteMany({}),
    ]);

    console.log('🧹 Cleaned existing collections.');

    // 1. Membership Types
    const membershipTypes = await MembershipType.create([
      { title: 'Individual Member', code: 'INDIVIDUAL', description: 'Certified software engineers and IT professionals' },
      { title: 'Legal Entity Member', code: 'LEGAL', description: 'Software and hardware companies' },
      { title: 'Store Member', code: 'STORE', description: 'Retailers and IT equipment stores' },
      { title: 'Honorary Member', code: 'HONORARY', description: 'Eminent professors and industry veterans' },
    ]);

    // 2. Specializations
    const specializations = await Specialization.create([
      { title: 'Software and Information Systems', code: 'SOFTWARE', description: 'Web, mobile, and enterprise applications' },
      { title: 'Hardware and Electronics', code: 'HARDWARE', description: 'Servers, PCs, and electronic devices' },
      { title: 'Networks and Telecommunications', code: 'NETWORK', description: 'Infrastructure, routers, and data centers' },
      { title: 'Cybersecurity', code: 'SECURITY', description: 'SOC, pentesting, and information security' },
      { title: 'AI and Data Science', code: 'AI_DATA', description: 'Machine learning, big data, and analytics' },
    ]);

    // 3. Ranks
    const ranks = await Rank.create([
      { title: 'Grade 1 (Senior)', level: 1, description: 'Highest qualification grade' },
      { title: 'Grade 2 (Intermediate)', level: 2, description: 'Intermediate qualification grade' },
      { title: 'Grade 3 (Junior)', level: 3, description: 'Entry-level professional grade' },
    ]);

    // 4. Nature of Membership
    const natureOfMemberships = await NatureOfMembership.create([
      { title: 'Continuous', code: 'CONTINUOUS', description: 'Voting member with full rights' },
      { title: 'Associate', code: 'ASSOCIATE', description: 'Non-voting affiliate member' },
      { title: 'Honorary', code: 'HONORARY', description: 'Special honorary guild status' },
    ]);

    // 5. Academic Fields
    const academicFields = await AcademicField.create([
      { title: 'Computer Engineering', code: 'CE' },
      { title: 'Information Technology', code: 'IT' },
      { title: 'Computer Science', code: 'CS' },
      { title: 'Artificial Intelligence', code: 'AI' },
    ]);

    // 6. Academic Qualifications
    const qualifications = await AcademicQualification.create([
      {
        title: 'Master of Science in Software Engineering',
        academicField: academicFields[0]._id,
        degreeLevel: 'MASTER',
        institution: 'University of Tehran',
        graduationYear: 2020,
      },
      {
        title: 'Bachelor of Science in Information Technology',
        academicField: academicFields[1]._id,
        degreeLevel: 'BACHELOR',
        institution: 'Sharif University of Technology',
        graduationYear: 2018,
      },
    ]);

    // 7. Sample Company Information
    const sampleCompany = await CompanyInformation.create({
      title: 'Nasr Data Solutions Co.',
      companyType: 'KNOWLEDGE_BASED',
      nationalId: '10101234567',
      registrationNumber: '456789',
      economicCode: '411234567890',
      ceoName: 'Ali Rezaei',
      establishmentDate: new Date('2015-03-21'),
      website: 'https://nasrplus.ir',
      email: 'info@nasrplus.ir',
      description: 'Enterprise IT solutions and cloud software provider',
    });

    // 8. Sample Member
    const sampleMember = await Member.create({
      memberCode: '21010045',
      memberType: 'INDIVIDUAL',
      nationalCode: '0012345678',
      firstName: 'Masoud',
      lastName: 'Mohammadi',
      fatherName: 'Ali',
      gender: 'MALE',
      birthDate: new Date('1990-05-21'),
      membershipTypeId: membershipTypes[0]._id,
      specializationId: specializations[0]._id,
      rankId: ranks[0]._id,
      latestAcademicQualifications: qualifications[0]._id,
      natureOfMembership: natureOfMemberships[0]._id,
      companyInformation: sampleCompany._id,
      status: 'ACTIVE',
      membershipDate: new Date('2022-01-01'),
      expiryDate: new Date('2027-01-01'),
    });

    // 9. Sample Address
    await MemberAddress.create({
      membershipId: sampleMember._id,
      addressType: 'WORK',
      province: 'Tehran',
      city: 'Tehran',
      postalCode: '1417755331',
      address: 'Motahari St., No. 12, Unit 4',
      isPrimary: true,
    });

    // 10. Sample Telephone
    await MemberTelephone.create({
      membershipId: sampleMember._id,
      phoneType: 'MOBILE',
      phoneNumber: '09121234567',
      countryCode: '+98',
      isPrimary: true,
      title: 'Personal Mobile',
    });

    console.log('✅ Seeding completed successfully!');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

void seedDatabase();
