require('dotenv').config();
const { connectDB, isMongoActive, dataFilePath } = require('./config/db');
const { User, Event, Registration, generateId, saveFileData } = require('./models');
const { MongooseUser, MongooseEvent, MongooseRegistration } = require('./models/schemas');

// Helper to format Date as YYYY-MM-DD
function formatYYYYMMDD(date) {
  return date.toISOString().split('T')[0];
}

async function runSeed() {
  console.log('>>> [SEED] Initiating database seeding...');
  await connectDB();

  // Reference date: today
  const now = new Date();
  const todayStr = formatYYYYMMDD(now);

  function offsetDays(days) {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return formatYYYYMMDD(d);
  }

  // 1. Define exact 12 events (7 past, 5 upcoming)
  const eventDefinitions = [
    // 7 Past events
    {
      title: 'National AI & Robotics Symposium 2026',
      description: 'Annual gathering of artificial intelligence researchers, student roboticists, and tech innovators featuring competitive coding hackathons and live autonomous drone demonstrations.',
      category: 'Technical',
      date: offsetDays(-28),
      time: '09:30 AM',
      venue: 'Main Auditorium, Tech Block A',
      capacity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'Inter-College Chess Championship',
      description: 'FIDE-rated blitz and classical chess championship with grandmaster commentary, timed knockout brackets, and university championship trophies.',
      category: 'Sports',
      date: offsetDays(-21),
      time: '10:00 AM',
      venue: 'Indoor Sports Complex, Hall 2',
      capacity: 64,
      imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'Acoustic Unplugged Musical Evening',
      description: 'An intimate evening of indie music, student band performances, jazz quartets, and original songwriting showcase under the university amphitheater lights.',
      category: 'Cultural',
      date: offsetDays(-16),
      time: '06:00 PM',
      venue: 'Central Quad Amphitheater',
      capacity: 150,
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'Quantum Computing Research Colloquium',
      description: 'Distinguished lecture series delving into qubit topologies, quantum error correction protocols, and practical quantum algorithm simulations.',
      category: 'Academic',
      date: offsetDays(-12),
      time: '02:00 PM',
      venue: 'Seminar Hall 3, Science Complex',
      capacity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'University Football League Quarter-Finals',
      description: 'High-octane collegiate football tournament featuring top university squads competing for a spot in the statewide championship bracket.',
      category: 'Sports',
      date: offsetDays(-8),
      time: '04:30 PM',
      venue: 'Varsity Athletics Stadium',
      capacity: 200,
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'Annual Street Theatre & Drama Showcase',
      description: 'Socially poignant street plays (Nukkad Natak), contemporary one-act theatre, and monologue competitions presented by the dramatic society.',
      category: 'Cultural',
      date: offsetDays(-5),
      time: '05:00 PM',
      venue: 'Student Activity Center Lawn',
      capacity: 100,
      imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'Full-Stack Web3 & Cloud Architecture Workshop',
      description: 'Hands-on developer workshop covering distributed systems, Docker containers, zero-knowledge proofs, and microservice deployment pipelines.',
      category: 'Technical',
      date: offsetDays(-2),
      time: '11:00 AM',
      venue: 'Computer Science Lab 4',
      capacity: 75,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },

    // 5 Upcoming events (dates >= today)
    {
      title: 'HackCampus 2026: 36-Hour National Hackathon',
      description: 'The flagship annual 36-hour hackathon bringing together 100+ collegiate teams to solve real-world problems in HealthTech, EdTech, FinTech, and Green energy.',
      category: 'Technical',
      date: offsetDays(4),
      time: '09:00 AM',
      venue: 'Innovation Hub, 4th Floor',
      capacity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'Verve 2026: Inter-Collegiate Cultural Festival',
      description: 'The mega annual cultural festival of dance battles, fashion runway, Battle of the Bands, stand-up comedy, and culinary carnival.',
      category: 'Cultural',
      date: offsetDays(9),
      time: '11:00 AM',
      venue: 'Main Campus Grounds & Auditorium',
      capacity: 250,
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'Annual Inter-Department Athletics Meet',
      description: 'Track and field competition spanning 100m sprint, 4x100m relay, long jump, shot put, and high jump with medals and department trophy.',
      category: 'Sports',
      date: offsetDays(14),
      time: '08:00 AM',
      venue: 'Olympic Standard Track Field',
      capacity: 150,
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'International Conference on Climate Science & AI',
      description: 'Peer-reviewed academic conference on computational sustainability, climate data modeling, renewable smart grids, and global policy.',
      category: 'Academic',
      date: offsetDays(20),
      time: '10:00 AM',
      venue: 'Executive Convention Center',
      capacity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    },
    {
      title: 'CyberSecurity & Ethical Hacking Capture-The-Flag (CTF)',
      description: 'Competitive Jeopardy and Attack-Defense style cyber-security CTF covering reverse engineering, cryptography, web exploitation, and digital forensics.',
      category: 'Technical',
      date: offsetDays(27),
      time: '01:00 PM',
      venue: 'Advanced Cybersecurity Lab B',
      capacity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      createdBy: 'admin@college.edu'
    }
  ];

  // 2. Define users: 1 admin + student accounts
  const seedUsers = [
    {
      uid: 'admin_master_001',
      name: 'System Administrator',
      email: 'admin@college.edu',
      role: 'admin',
      createdAt: new Date(now.getTime() - 90 * 86400000).toISOString()
    },
    {
      uid: 'student_alex_001',
      name: 'Alex Smith',
      email: 'alex.smith@college.edu',
      role: 'student',
      createdAt: new Date(now.getTime() - 40 * 86400000).toISOString()
    },
    {
      uid: 'student_priya_002',
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      role: 'student',
      createdAt: new Date(now.getTime() - 35 * 86400000).toISOString()
    },
    {
      uid: 'student_marcus_003',
      name: 'Marcus Vance',
      email: 'marcus.vance@college.edu',
      role: 'student',
      createdAt: new Date(now.getTime() - 30 * 86400000).toISOString()
    },
    {
      uid: 'student_sarah_004',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@college.edu',
      role: 'student',
      createdAt: new Date(now.getTime() - 25 * 86400000).toISOString()
    },
    {
      uid: 'student_david_005',
      name: 'David Kim',
      email: 'david.kim@college.edu',
      role: 'student',
      createdAt: new Date(now.getTime() - 20 * 86400000).toISOString()
    }
  ];

  // Generate 80 student profiles for realistic participation
  const firstNames = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Amelia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper', 'Rohan', 'Ananya', 'Aarav', 'Diya', 'Kabir', 'Isha', 'Reyansh', 'Tara', 'Arjun', 'Meera'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Sharma', 'Verma', 'Gupta', 'Rao', 'Nair', 'Kapoor'];

  for (let i = 1; i <= 80; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    seedUsers.push({
      uid: `stu_gen_${i}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@college.edu`,
      role: 'student',
      createdAt: new Date(now.getTime() - (45 - (i % 30)) * 86400000).toISOString()
    });
  }

  // 3. Prepare events array with generated IDs
  const createdEvents = eventDefinitions.map((evt, idx) => ({
    _id: generateId(),
    ...evt,
    createdAt: new Date(now.getTime() - (60 - idx * 3) * 86400000).toISOString()
  }));

  // 4. Generate EXACTLY 436 registrations, with EXACTLY 48 created today!
  // Target: Total = 436, Today = 48, Prior = 388 (436 - 48)
  const TOTAL_TARGET_REGISTRATIONS = 436;
  const TODAY_TARGET_REGISTRATIONS = 48;
  const PRIOR_TARGET_REGISTRATIONS = TOTAL_TARGET_REGISTRATIONS - TODAY_TARGET_REGISTRATIONS; // 388

  const seedRegistrations = [];
  const userRegistrationSet = new Set(); // Prevent duplicates per (eventId, userId)

  // Seed Alex Smith (demo student) with 3 registrations (1 past, 2 upcoming)
  const alexUid = 'student_alex_001';
  const alexEvents = [createdEvents[0], createdEvents[7], createdEvents[8]]; // 1 past, 2 upcoming
  alexEvents.forEach((evt, idx) => {
    const regDate = idx === 1 ? now.toISOString() : new Date(now.getTime() - (10 - idx * 2) * 86400000).toISOString();
    const catCode = evt.category.substring(0, 3).toUpperCase();
    const ticketId = `TKT-${catCode}-2026-${1000 + idx}`;
    seedRegistrations.push({
      _id: generateId(),
      eventId: evt._id,
      userId: alexUid,
      registeredAt: regDate,
      ticketId
    });
    userRegistrationSet.add(`${evt._id}_${alexUid}`);
  });

  // Calculate remaining registrations needed
  let remainingPrior = PRIOR_TARGET_REGISTRATIONS - (seedRegistrations.filter(r => !r.registeredAt.startsWith(todayStr)).length);
  let remainingToday = TODAY_TARGET_REGISTRATIONS - (seedRegistrations.filter(r => r.registeredAt.startsWith(todayStr)).length);

  // Helper to add a registration if not duplicate and within capacity
  let ticketCounter = 2000;

  // Distribute prior registrations (388 total)
  let userIdx = 1;
  let attempts = 0;
  while (remainingPrior > 0 && attempts < 10000) {
    attempts++;
    const evt = createdEvents[Math.floor(Math.random() * createdEvents.length)];
    const user = seedUsers[userIdx % seedUsers.length];
    userIdx++;
    const key = `${evt._id}_${user.uid}`;

    if (!userRegistrationSet.has(key)) {
      // Pick random prior days (between 1 and 25 days ago)
      const daysAgo = 1 + Math.floor(Math.random() * 25);
      const regTime = new Date(now.getTime() - daysAgo * 86400000 - Math.floor(Math.random() * 36000000)).toISOString();
      const catCode = evt.category.substring(0, 3).toUpperCase();
      ticketCounter++;
      
      seedRegistrations.push({
        _id: generateId(),
        eventId: evt._id,
        userId: user.uid,
        registeredAt: regTime,
        ticketId: `TKT-${catCode}-2026-${ticketCounter}`
      });
      userRegistrationSet.add(key);
      remainingPrior--;
    }
  }

  // Distribute today's registrations (48 total)
  attempts = 0;
  while (remainingToday > 0 && attempts < 10000) {
    attempts++;
    // Mostly for upcoming events or recent events
    const evt = createdEvents[5 + Math.floor(Math.random() * 7)];
    const user = seedUsers[userIdx % seedUsers.length];
    userIdx++;
    const key = `${evt._id}_${user.uid}`;

    if (!userRegistrationSet.has(key)) {
      // Time today between 8 AM and current time
      const hoursOffset = Math.floor(Math.random() * 8);
      const regTime = new Date(now.getTime() - hoursOffset * 1800000).toISOString();
      const catCode = evt.category.substring(0, 3).toUpperCase();
      ticketCounter++;

      seedRegistrations.push({
        _id: generateId(),
        eventId: evt._id,
        userId: user.uid,
        registeredAt: regTime,
        ticketId: `TKT-${catCode}-2026-${ticketCounter}`
      });
      userRegistrationSet.add(key);
      remainingToday--;
    }
  }

  console.log(`>>> [SEED STATS CHECK] Total Events generated: ${createdEvents.length}`);
  console.log(`>>> [SEED STATS CHECK] Total Registrations generated: ${seedRegistrations.length}`);
  const upcomingCount = createdEvents.filter(e => e.date >= todayStr).length;
  console.log(`>>> [SEED STATS CHECK] Upcoming Events count: ${upcomingCount}`);
  const todayRegCount = seedRegistrations.filter(r => r.registeredAt.startsWith(todayStr)).length;
  console.log(`>>> [SEED STATS CHECK] Today's Registrations count: ${todayRegCount}`);

  // 5. Write to File Store (db.json)
  const fullData = {
    users: seedUsers,
    events: createdEvents,
    registrations: seedRegistrations
  };
  saveFileData(fullData);
  console.log(`>>> [SEED] Successfully persisted sample data to ${dataFilePath}`);

  // 6. Write to MongoDB if connected
  if (isMongoActive()) {
    try {
      console.log('>>> [SEED] Synchronizing to live MongoDB database...');
      await MongooseUser.deleteMany({});
      await MongooseEvent.deleteMany({});
      await MongooseRegistration.deleteMany({});

      await MongooseUser.insertMany(seedUsers);
      await MongooseEvent.insertMany(createdEvents);
      await MongooseRegistration.insertMany(seedRegistrations);
      console.log('>>> [SEED] Live MongoDB database successfully populated.');
    } catch (mErr) {
      console.error('Error synchronizing to MongoDB:', mErr.message);
    }
  }

  console.log('>>> [SEED] Seeding successfully completed!');
  console.log('====================================================');
  console.log('  DEMO CREDENTIALS:');
  console.log('  Admin:   admin@college.edu      (Password: admin123)');
  console.log('  Student: alex.smith@college.edu (Password: student123)');
  console.log('====================================================');
}

if (require.main === module) {
  runSeed().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}

module.exports = runSeed;
