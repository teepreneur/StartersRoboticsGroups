// ---- Site configuration ----
const SITE = {
  // The student profiles below are SAMPLE placeholders from the design.
  // Keep this false until real, parent-consented profiles replace them.
  SHOW_STUDENTS: false,
  whatsapp: '233544198026',
  phone: '054 419 8026',
  email: 'support@starterstech.com',
  instagram: '@starters_robotics_groups',
  origin: 'https://roboticsgroups.starterstech.com'
};

const STAGES = [
  { n: 1, name: 'Raíz', mean: 'Root', ages: '3–5', ring: '#6B6567', inner: '#231F20', line: 'Screen-free. Stories, songs and building blocks teach step-by-step thinking, wheels and simple circuits.', titles: ['Computational Thinking 1', 'Simple Machines', 'Basic Circuits', 'Competition'] },
  { n: 2, name: 'Méngyá', mean: 'Sprout', ages: '6–8', ring: '#7A2229', inner: '#231F20', line: 'First screens. Typing, staying safe online, block coding, and making a real robot move on command.', titles: ['Digital Literacy', 'Block Coding', 'Computational Thinking 2', 'Coding Machines', 'Robotics Algebra', 'Stable Drivetrain', 'Rules Literacy', 'Navigation Mastery', 'Competition'] },
  { n: 3, name: 'Chéngzhǎng', mean: 'Growth', ages: '9–10', ring: '#9A3338', inner: '#231F20', line: 'Gears, sensors and Arduino electronics, plus researching well in the age of AI.', titles: ['Machines & Mechanics', 'Research in the AI Age', 'Programming Robots', 'Intro to Arduino', 'Mechanisms', 'Sensor Control 1', 'Pressure Performance 1', 'Competition'] },
  { n: 4, name: 'Florecer', mean: 'Bloom', ages: '11–12', ring: '#B84242', inner: '#231F20', line: 'Typed code, precision driving, and a first look at AI and connected devices.', titles: ['Modular Mechanics', 'Encoder + Gyro', 'Calibration', 'Sensor Control 2', 'Text-Based Code', 'Machine Learning & AI', 'Pressure Performance 2', 'IoT', 'PID Control', 'Competition'] },
  { n: 5, name: 'Cumbre', mean: 'Summit', ages: '13–15', ring: '#B84242', inner: '#B84242', line: 'Drones, CAD design, robots that think for themselves, and coaching younger students.', titles: ['Drone Technology', 'Robust Autonomy', 'Fast Line Follower', 'CAD & Drawing', 'Teaching & Coaching', 'Software Discipline', 'Pressure Performance 3', 'Competition'] }
];

const COMPS = [
  { name: 'Enjoy AI', level: 'GLOBAL', blurb: 'AI and robotics challenges by age category. Our youngest students compete here from Raíz.', note: 'Global Finals · China · December 2026' },
  { name: 'MRC Global Olympiad', level: 'GLOBAL', blurb: 'International robotics olympiad with category missions and scoring rules. Entered from Méngyá.', note: 'Greece · March' },
  { name: 'World Robot Olympiad', level: 'GLOBAL', blurb: 'Teams design, build and program robots to solve a new themed challenge each season.', note: 'National rounds lead to the international final' },
  { name: 'Pan-African Robotics Competition', level: 'CONTINENTAL', blurb: 'Africa-wide robotics and AI competition for students.', note: '1st place · 2024' },
  { name: 'Ghana Robotics Competition', level: 'NATIONAL', blurb: 'Schools and clubs from across Ghana go head to head.', note: '1st place · 2023' },
  { name: 'Robofest', level: 'INTERNATIONAL', blurb: 'Autonomous robots only. Students must program, not remote-control.', note: '' },
  { name: 'VEX', level: 'INTERNATIONAL', blurb: 'Build-and-drive matches where design, driving and teamwork all count.', note: '' },
  { name: 'AI for Good', level: 'GLOBAL', blurb: 'Robotics and AI applied to real-world problems.', note: '' }
];

const RECORD = [
  { place: '1ST', event: 'Pan-African Robotics Competition · 2024' },
  { place: '1ST', event: 'Ghana Robotics Competition · 2023' },
  { place: '2ND', event: 'CoderZ World Championship, Global · 2021' }
];

const FAQS = [
  { q: 'What age can my child start?', a: 'From age 3. Our first stage, Raíz (ages 3–5), is completely screen-free: stories, songs and building blocks.' },
  { q: 'Does my child need any experience?', a: 'No. Every child starts with the foundations, and coaches move them on when they are ready.' },
  { q: 'When and where are sessions?', a: 'Saturdays at Starters Hub, Lashibi-Sakumono, Accra. Message us on WhatsApp for session times and to book a visit.' },
  { q: 'How do badges and assessments work?', a: 'Each course earns a badge by passing a hands-on build and a short theory check. Assessments run in the school holidays: December 2026, April 2027 and August 2027. Retakes are welcome.' },
  { q: 'Will my child compete?', a: 'Every stage includes a competition course, from Enjoy AI for our youngest to international olympiads. We talk with you about which events suit your child.' },
  { q: 'How can I follow my child’s progress?', a: 'Through their badges and certificates, which you can see and celebrate at home.' },
  { q: 'What does it cost?', a: 'Message us on 054 419 8026 or email support@starterstech.com for current fees.' }
];

// SAMPLE DATA: replace with real profiles (with parental consent) before enabling SHOW_STUDENTS.
const range = (stage, n) => Array.from({ length: n }, (_, i) => `${stage}.${i + 1}`);
const STUDENTS = [
  { slug: 'ama-o', first: 'Ama', name: 'Ama O.', age: 9, stage: 3, since: '2023', photo: '', tagline: 'Builds fast, debugs faster. Never leaves a loose cable.', badges: [...range(1, 4), '2.1', '2.2', '2.3', '2.4', '2.6', '2.8', '3.1', '3.3'], comps: [{ year: '2026', name: 'Enjoy AI · Ghana', result: 'Team competitor' }], facts: ['Wants to build a robot that sorts plastic for recycling', 'Favourite sensor: colour'], quote: 'When the robot finally drives straight, I feel like a scientist.' },
  { slug: 'kwame-a', first: 'Kwame', name: 'Kwame A.', age: 14, stage: 5, since: '2021', photo: '', tagline: 'Team captain and our go-to driver under pressure.', badges: [...range(1, 4), ...range(2, 9), ...range(3, 8), ...range(4, 10), '5.2', '5.3', '5.5'], comps: [{ year: '2024', name: 'Pan-African Robotics Competition', result: 'Winning team' }], facts: ['Coaches the Méngyá group on Saturdays', 'Plans to study mechatronics'], quote: 'Calm hands win matches. Panic loses them.' }
];
