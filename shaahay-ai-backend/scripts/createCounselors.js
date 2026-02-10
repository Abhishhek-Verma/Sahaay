require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Default password for seeded counselors (override via COUNSELOR_DEFAULT_PASSWORD env var)
const DEFAULT_PASSWORD = process.env.COUNSELOR_DEFAULT_PASSWORD || 'Counselor@123';

// 10 Indian counselor data
const counselors = [
  {
    username: 'priya_sharma',
    email: 'priya.sharma@sahaay.com',
    name: 'Dr. Priya Sharma',
    role: 'counselor',
    title: 'Clinical Psychologist',
    specialization: ['Anxiety', 'Depression', 'Stress Management'],
    qualification: 'PhD in Clinical Psychology',
    degree: 'PhD, Clinical Psychology - NIMHANS Bangalore',
    experience: 8,
    phone: '+91-9876543210',
    bio: 'Dr. Priya Sharma is a compassionate clinical psychologist with 8 years of experience helping students overcome anxiety and depression. She specializes in Cognitive Behavioral Therapy and mindfulness-based interventions.',
    officeHours: 'Mon-Fri 9:00 AM - 5:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=4F46E5&color=fff&size=200',
    rating: 4.8,
    totalSessions: 450
  },
  {
    username: 'raj_kumar',
    email: 'raj.kumar@sahaay.com',
    name: 'Dr. Raj Kumar',
    role: 'counselor',
    title: 'Career Counselor',
    specialization: ['Career Counseling', 'Academic Stress'],
    qualification: 'M.Phil in Counseling Psychology',
    degree: 'M.Phil, Counseling Psychology - Delhi University',
    experience: 5,
    phone: '+91-9876543211',
    bio: 'Dr. Raj Kumar helps students navigate academic challenges and career decisions. With 5 years of experience, he provides practical guidance for stress management and goal setting.',
    officeHours: 'Mon-Fri 10:00 AM - 6:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Raj+Kumar&background=059669&color=fff&size=200',
    rating: 4.6,
    totalSessions: 320
  },
  {
    username: 'anita_patel',
    email: 'anita.patel@sahaay.com',
    name: 'Dr. Anita Patel',
    role: 'counselor',
    title: 'Family Therapist',
    specialization: ['Relationship Issues', 'Family Therapy'],
    qualification: 'PhD in Family Therapy',
    degree: 'PhD, Family Therapy - Tata Institute Mumbai',
    experience: 12,
    phone: '+91-9876543212',
    bio: 'Dr. Anita Patel is a seasoned family therapist with 12 years of experience in relationship counseling. She helps students navigate family dynamics and interpersonal relationships.',
    officeHours: 'Tue-Sat 11:00 AM - 7:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Anita+Patel&background=DC2626&color=fff&size=200',
    rating: 4.9,
    totalSessions: 680
  },
  {
    username: 'vikram_singh',
    email: 'vikram.singh@sahaay.com',
    name: 'Dr. Vikram Singh',
    role: 'counselor',
    title: 'Psychiatrist',
    specialization: ['Trauma Counseling', 'PTSD'],
    qualification: 'M.D. Psychiatry',
    degree: 'M.D. Psychiatry - AIIMS New Delhi',
    experience: 15,
    phone: '+91-9876543213',
    bio: 'Dr. Vikram Singh is a board-certified psychiatrist specializing in trauma recovery and PTSD treatment. With 15 years of clinical experience, he provides evidence-based therapeutic interventions.',
    officeHours: 'Mon-Fri 9:00 AM - 4:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=7C3AED&color=fff&size=200',
    rating: 4.9,
    totalSessions: 890
  },
  {
    username: 'sneha_reddy',
    email: 'sneha.reddy@sahaay.com',
    name: 'Dr. Sneha Reddy',
    role: 'counselor',
    title: 'Educational Psychologist',
    specialization: ['Teen Counseling', 'Peer Pressure'],
    qualification: 'M.Phil in Educational Psychology',
    degree: 'M.Phil, Educational Psychology - University of Hyderabad',
    experience: 6,
    phone: '+91-9876543214',
    bio: 'Dr. Sneha Reddy works extensively with teenagers dealing with peer pressure and identity issues. Her empathetic approach helps young students build confidence and resilience.',
    officeHours: 'Mon-Sat 10:00 AM - 6:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=EC4899&color=fff&size=200',
    rating: 4.7,
    totalSessions: 380
  },
  {
    username: 'amit_gupta',
    email: 'amit.gupta@sahaay.com',
    name: 'Dr. Amit Gupta',
    role: 'counselor',
    title: 'Addiction Specialist',
    specialization: ['Addiction Counseling', 'Substance Abuse'],
    qualification: 'PhD in Clinical Psychology',
    degree: 'PhD, Clinical Psychology - PGI Chandigarh',
    experience: 10,
    phone: '+91-9876543215',
    bio: 'Dr. Amit Gupta specializes in addiction recovery and substance abuse counseling. His 10 years of experience help students overcome dependencies and build healthier coping mechanisms.',
    officeHours: 'Mon-Fri 2:00 PM - 8:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Amit+Gupta&background=0891B2&color=fff&size=200',
    rating: 4.8,
    totalSessions: 520
  },
  {
    username: 'kavita_mehta',
    email: 'kavita.mehta@sahaay.com',
    name: 'Dr. Kavita Mehta',
    role: 'counselor',
    title: 'Clinical Psychologist',
    specialization: ['Eating Disorders', 'Body Image Issues'],
    qualification: 'M.Phil in Clinical Psychology',
    degree: 'M.Phil, Clinical Psychology - Christ University Bangalore',
    experience: 7,
    phone: '+91-9876543216',
    bio: 'Dr. Kavita Mehta helps students struggling with eating disorders and body image concerns. Her compassionate approach fosters self-acceptance and healthy lifestyle changes.',
    officeHours: 'Tue-Sat 9:00 AM - 5:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Kavita+Mehta&background=F59E0B&color=fff&size=200',
    rating: 4.7,
    totalSessions: 410
  },
  {
    username: 'rahul_verma',
    email: 'rahul.verma@sahaay.com',
    name: 'Dr. Rahul Verma',
    role: 'counselor',
    title: 'Behavioral Psychologist',
    specialization: ['Sleep Disorders', 'Behavioral Therapy'],
    qualification: 'PhD in Behavioral Psychology',
    degree: 'PhD, Behavioral Psychology - Jamia Millia Islamia',
    experience: 9,
    phone: '+91-9876543217',
    bio: 'Dr. Rahul Verma specializes in treating sleep disorders and behavioral issues. His 9 years of experience in behavioral therapy help students establish healthy routines and habits.',
    officeHours: 'Mon-Fri 11:00 AM - 7:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=10B981&color=fff&size=200',
    rating: 4.6,
    totalSessions: 490
  },
  {
    username: 'deepa_nair',
    email: 'deepa.nair@sahaay.com',
    name: 'Dr. Deepa Nair',
    role: 'counselor',
    title: 'Grief Counselor',
    specialization: ['Grief Counseling', 'Loss and Bereavement'],
    qualification: 'M.Phil in Counseling Psychology',
    degree: 'M.Phil, Counseling Psychology - MG University Kerala',
    experience: 11,
    phone: '+91-9876543218',
    bio: 'Dr. Deepa Nair provides compassionate support for students dealing with grief and loss. Her 11 years of experience help individuals navigate the healing process with empathy and care.',
    officeHours: 'Mon-Sat 10:00 AM - 6:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Deepa+Nair&background=8B5CF6&color=fff&size=200',
    rating: 4.9,
    totalSessions: 640
  },
  {
    username: 'sanjay_desai',
    email: 'sanjay.desai@sahaay.com',
    name: 'Dr. Sanjay Desai',
    role: 'counselor',
    title: 'Clinical Psychologist',
    specialization: ['Anger Management', 'Emotional Regulation'],
    qualification: 'PhD in Clinical Psychology',
    degree: 'PhD, Clinical Psychology - Savitribai Phule Pune University',
    experience: 13,
    phone: '+91-9876543219',
    bio: 'Dr. Sanjay Desai helps students develop healthy anger management and emotional regulation skills. His 13 years of clinical experience provide practical strategies for emotional well-being.',
    officeHours: 'Mon-Fri 9:00 AM - 5:00 PM',
    profileImage: 'https://ui-avatars.com/api/?name=Sanjay+Desai&background=EF4444&color=fff&size=200',
    rating: 4.8,
    totalSessions: 730
  }
];

async function createCounselors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create counselors
    let created = 0;
    let existing = 0;

    for (const counselorData of counselors) {
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

      // Upsert: update existing or create new
      const updateData = { ...counselorData, password: hashedPassword };
      
      const result = await User.findOneAndUpdate(
        { username: counselorData.username },
        { $set: updateData },
        { upsert: true, new: true }
      );

      if (result.createdAt && (Date.now() - new Date(result.createdAt).getTime()) < 5000) {
        created++;
        console.log(`✅ Created counselor: ${counselorData.name} (${counselorData.username})`);
      } else {
        existing++;
        console.log(`🔄 Updated counselor: ${counselorData.name} (${counselorData.username})`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} counselors`);
    console.log(`   Already existed: ${existing} counselors`);
    console.log(`   Total: ${counselors.length} counselors\n`);

    console.log('🔐 Counselor Accounts:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('   Password for all counselors: Set via COUNSELOR_DEFAULT_PASSWORD env var\n');
    counselors.forEach((c, i) => {
      console.log(`${i + 1}. ${c.name} (${c.username})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating counselors:', error);
    process.exit(1);
  }
}

createCounselors();
