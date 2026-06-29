import { Course, Quiz, LeaderboardEntry, Notice } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'phy-1st-hsc',
    title: 'HSC Physics 1st Paper Premium Elite',
    tagline: 'Complete Concepts, Mathematical Solves & Board Question Analysis',
    description: 'Designed specifically for HSC examinees aiming for GPA 5.0 and a rock-solid foundation. Covers Vector, Newtonian Mechanics, Work-Power-Energy, Gravitation, Periodic Motion, Waves, and more. Includes hand-written notes, daily quizzes, and Ashik Vai\'s exclusive shortcut sheets.',
    instructor: 'Ashik Vai (BUET, ME \'19)',
    category: 'HSC 1st Paper',
    price: '৳ 3,000',
    duration: '60+ Hours',
    enrolledCount: 1420,
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    isFeatured: true,
    chapters: [
      {
        id: 'c1-vector',
        title: 'Chapter 02: Vector (ভেক্টর)',
        topics: [
          {
            id: 't1-river-boat',
            title: 'River-Boat Problems (নদী-নৌকার অংক ও ডট-ক্রস গুণফল)',
            lectures: [
              { id: 'l1', title: 'Dot Product & Cross Product Essentials', videoUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80', duration: '42:15', isCompleted: true, isLocked: false },
              { id: 'l2', title: 'River Crossing: Shortest Time vs Shortest Path', videoUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=1200&q=80', duration: '55:40', isCompleted: false, isLocked: false },
              { id: 'l3', title: 'Rain-Umbrella Math Shortcuts', videoUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80', duration: '38:10', isCompleted: false, isLocked: false }
            ]
          },
          {
            id: 't2-vector-calculus',
            title: 'Vector Calculus: Gradient, Divergence, Curl',
            lectures: [
              { id: 'l4', title: 'Gradient & Divergence Physical Meaning', videoUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80', duration: '48:30', isCompleted: false, isLocked: false },
              { id: 'l5', title: 'Curl & Solenoidal/Irrotational Vectors', videoUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80', duration: '52:12', isCompleted: false, isLocked: false }
            ]
          }
        ]
      },
      {
        id: 'c2-mechanics',
        title: 'Chapter 04: Newtonian Mechanics (নিউটনীয় বলবিদ্যা)',
        topics: [
          {
            id: 't3-banking',
            title: 'Circular Motion & Banking of Roads',
            lectures: [
              { id: 'l6', title: 'Centripetal Force & Banking Angle (বাঁক নেওয়ার গতি)', videoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', duration: '50:15', isCompleted: false, isLocked: true },
              { id: 'l7', title: 'Banking with Friction: Extreme Cases', videoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', duration: '46:40', isCompleted: false, isLocked: true }
            ]
          },
          {
            id: 't4-inertia',
            title: 'Moment of Inertia (জড়তার ভ্রামক)',
            lectures: [
              { id: 'l8', title: 'Parallel & Perpendicular Axis Theorem', videoUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80', duration: '1:02:45', isCompleted: false, isLocked: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phy-2nd-hsc',
    title: 'HSC Physics 2nd Paper Premium Pro',
    tagline: 'Crack Thermodynamics, Modern Physics & Electronics with Ashik Vai',
    description: 'Master the high-scoring second paper. Extensive analysis of Carnot Engine, Entropy, Coulomb\'s Law, Photoelectric Effect, Bohr\'s Atom, and Logic Gates. Built for students seeking 100/100 in board exams and outstanding preparation for admission.',
    instructor: 'Ashik Vai (BUET, ME \'19)',
    category: 'HSC 2nd Paper',
    price: '৳ 3,000',
    duration: '55+ Hours',
    enrolledCount: 1180,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    isFeatured: false,
    chapters: [
      {
        id: 'c3-thermo',
        title: 'Chapter 01: Thermodynamics (তাপগতিবিদ্যা)',
        topics: [
          {
            id: 't5-carnot',
            title: 'Carnot Engine & Efficiency',
            lectures: [
              { id: 'l9', title: 'Carnot Cycle Details (কার্নো চক্র ও দক্ষতা)', videoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', duration: '44:18', isCompleted: false, isLocked: false },
              { id: 'l10', title: 'Entropy (এন্ট্রপি) of Reversible & Irreversible Processes', videoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', duration: '51:05', isCompleted: false, isLocked: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phy-admission',
    title: 'BUET & Varsity Admission Physics Intensive Care',
    tagline: 'Ultra Shortcuts, Advanced Concepts, and Previous Year Solves',
    description: 'The ultimate preparation for BUET, RUET, KUET, CUET, Dhaka University (DU KA), and Medical Physics. Ashik Vai guides you through tricky multiple-choice logic, advanced free-body diagrams, relativistic dynamics, and complex circuit analysis. Turn your preparation into top merit ranks.',
    instructor: 'Ashik Vai (BUET, ME \'19)',
    category: 'Admission',
    price: '৳ 4,500',
    duration: '85+ Hours',
    enrolledCount: 2240,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    isFeatured: true,
    chapters: [
      {
        id: 'c4-adv-mechanics',
        title: 'BUET Special: Advanced Mechanics & Spring Mass Systems',
        topics: [
          {
            id: 't6-spring',
            title: 'Complex Spring Connections & Cutting Dynamics',
            lectures: [
              { id: 'l11', title: 'Effective Spring Constant (Series, Parallel, Inclined)', videoUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80', duration: '1:12:30', isCompleted: false, isLocked: false },
              { id: 'l12', title: 'Advanced Friction: Block on Block Problems', videoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80', duration: '1:05:15', isCompleted: false, isLocked: false }
            ]
          }
        ]
      },
      {
        id: 'c5-adv-circuits',
        title: 'DU & Engineering: Tricky Electrical Circuits',
        topics: [
          {
            id: 't7-kirchhoff',
            title: 'Kirchhoff\'s Laws & Symmetry Methods',
            lectures: [
              { id: 'l13', title: 'Nodal Analysis and Bridge Reductions', videoUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80', duration: '58:45', isCompleted: false, isLocked: false }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-vector-daily',
    title: 'Daily Quiz: Vector Dot/Cross & River boat physics',
    courseId: 'phy-1st-hsc',
    courseTitle: 'HSC Physics 1st Paper Premium Elite',
    durationMinutes: 10,
    totalPoints: 50,
    category: 'Daily',
    difficulty: 'Medium',
    questions: [
      {
        id: 'q1_1',
        text: 'নৌকাটি সর্বনিম্ন সময়ে নদী পার হতে চাইলে স্রোতের সাপেক্ষে কত কোণে যাত্রা করতে হবে?',
        options: [
          'α = 0°',
          'α = 90°',
          'α = 120°',
          'α = 180°'
        ],
        correctOptionIndex: 1,
        explanation: 'সর্বনিম্ন সময়ে নদী পার হতে হলে প্রস্থ বরাবর বেগের উপাংশ সর্বোচ্চ হতে হবে। নদী পারাপারে অতিক্রান্ত সময়, t = d / (v * sin α)। সময় t সর্বনিম্ন হবে যখন sin α = 1 বা α = 90°।'
      },
      {
        id: 'q1_2',
        text: 'If vectors A = 2i + 3j - k and B = i + j + 2k are perpendicular to each other, what is the value of their scalar (dot) product A·B?',
        options: [
          '0',
          '3',
          '5',
          '-1'
        ],
        correctOptionIndex: 0,
        explanation: 'দুটি ভেক্টর পরস্পর লম্ব হলে তাদের ডট গুণফলের মান সবসময় শূন্য হয় (A·B = 0), কারণ cos 90° = 0।'
      },
      {
        id: 'q1_3',
        text: 'কোনো কণার উপর প্রযুক্ত বল F = (2i + 3j) N এবং কণার সরণ r = (4i + 5k) m হলে সম্পাদিত কাজ কত?',
        options: [
          '8 J',
          '15 J',
          '23 J',
          '20 J'
        ],
        correctOptionIndex: 0,
        explanation: 'কাজ W = F·r = (2i + 3j)·(4i + 5k) = (2*4) + (3*0) + (0*5) = 8 J।'
      },
      {
        id: 'q1_4',
        text: 'দুটি সমান মানের ভেক্টর কোনো বিন্দুতে ক্রিয়াশীল। এদের লব্ধির মান ভেক্টরদ্বয়ের যেকোনো একটির মানের সমান হলে মধ্যবর্তী কোণ কত?',
        options: [
          '0°',
          '60°',
          '90°',
          '120°'
        ],
        correctOptionIndex: 3,
        explanation: 'লব্ধি R = 2P cos(θ/2)। শর্তমতে R = P, তাই P = 2P cos(θ/2) => cos(θ/2) = 1/2 => θ/2 = 60° => θ = 120°।'
      },
      {
        id: 'q1_5',
        text: 'P = 3i - j + 2k এবং Q = i + mj - k ভেক্টরদ্বয় পরস্পর সমান্তরাল হলে m এর মান কত?',
        options: [
          '-1/3',
          '1/3',
          '3',
          '-3'
        ],
        correctOptionIndex: 0,
        explanation: 'দুটি ভেক্টর সমান্তরাল হবার শর্ত: Px/Qx = Py/Qy => 3/1 = -1/m => m = -1/3।'
      }
    ]
  },
  {
    id: 'quiz-mechanics-mega',
    title: 'Mega Exam: Newtonian Mechanics & Circular Motion (BUET Standard)',
    courseId: 'phy-1st-hsc',
    courseTitle: 'HSC Physics 1st Paper Premium Elite',
    durationMinutes: 15,
    totalPoints: 100,
    category: 'Mega',
    difficulty: 'Admission Standard',
    questions: [
      {
        id: 'q2_1',
        text: 'কোনো বাঁকের ব্যাসার্ধ 50m। যদি রাস্তাটি 5m চওড়া হয় এবং বাইরের কিনারা ভিতরের কিনারা অপেক্ষা 0.5m উঁচু হয়, তবে সর্বোচ্চ কত বেগে গাড়ি নিরাপদে বাঁক নিতে পারবে? (g = 9.8 ms^-2)',
        options: [
          '5 ms^-1',
          '7 ms^-1',
          '9.9 ms^-1',
          '15 ms^-1'
        ],
        correctOptionIndex: 2,
        explanation: 'এখানে sin θ = h/d = 0.5/5 = 0.1। অতি ক্ষুদ্র কোণের ক্ষেত্রে tan θ ≈ sin θ = 0.1। ব্যাংকিং কোণের সূত্র v = √(rg tan θ) = √(50 * 9.8 * 0.1) = √49 = 7 ms^-1 (অথবা সঠিক ত্রিকোণমিতিক হিসাবে প্রায় 7 ms^-1)।'
      },
      {
        id: 'q2_2',
        text: 'A fly-wheel rotating at 120 RPM slows down at a constant rate of 2 rad/s^2. How many seconds will it take to stop completely?',
        options: [
          '3.14 s',
          '6.28 s',
          '12.56 s',
          '2.0 s'
        ],
        correctOptionIndex: 1,
        explanation: 'Initial angular velocity ω₀ = 2πN / 60 = 2π * 120 / 60 = 4π ≈ 12.56 rad/s. Retardation α = 2 rad/s^2. Since final velocity ω = 0, using ω = ω₀ - αt => 0 = 4π - 2t => t = 2π ≈ 6.28 seconds.'
      },
      {
        id: 'q2_3',
        text: 'একটি ভরহীন স্প্রিং এর এক প্রান্তে 2 kg ভর ঝুলিয়ে দিলে স্প্রিংটি 0.1 m প্রসারিত হয়। দোলনকাল কত হবে?',
        options: [
          '0.63 s',
          '1.26 s',
          '2.0 s',
          '0.31 s'
        ],
        correctOptionIndex: 0,
        explanation: 'স্প্রিং ধ্রুবক k = mg/x = (2 * 9.8) / 0.1 = 196 N/m। দোলনকাল T = 2π√(m/k) = 2π√(2 / 196) = 2π√(1/98) ≈ 0.63 s।'
      }
    ]
  },
  {
    id: 'quiz-thermo-admission',
    title: 'Engineering Special: Carnot Engine & Entropy Concepts',
    courseId: 'phy-2nd-hsc',
    courseTitle: 'HSC Physics 2nd Paper Premium Pro',
    durationMinutes: 10,
    totalPoints: 50,
    category: 'Mega',
    difficulty: 'Admission Standard',
    questions: [
      {
        id: 'q3_1',
        text: 'একটি কার্নো ইঞ্জিন 300 K এবং 600 K তাপমাত্রার দুটি উৎসের মধ্যে কাজ করছে। ইঞ্জিনের দক্ষতা কত?',
        options: [
          '25%',
          '50%',
          '75%',
          '100%'
        ],
        correctOptionIndex: 1,
        explanation: 'কার্নো ইঞ্জিনের দক্ষতা, η = (1 - T_sink / T_source) * 100% = (1 - 300 / 600) * 100% = 50%।'
      },
      {
        id: 'q3_2',
        text: 'ইঞ্জিনের দক্ষতা বাড়িয়ে 60% করতে হলে সিংকের তাপমাত্রা অপরিবর্তিত রেখে উৎসের তাপমাত্রা কত বাড়াতে হবে?',
        options: [
          '150 K',
          '250 K',
          '100 K',
          '750 K'
        ],
        correctOptionIndex: 0,
        explanation: 'নতুন দক্ষতা η\' = 0.60। সিংকের তাপমাত্রা T_sink = 300 K। সুতরাং, 0.60 = 1 - 300 / T_new => 300 / T_new = 0.40 => T_new = 750 K। পূর্বে উৎসের তাপমাত্রা ছিল 600 K। সুতরাং বৃদ্ধি = 750 - 600 = 150 K।'
      }
    ]
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, id: 'st1', name: 'Md. Shajahan Ahmed', institution: 'Notre Dame College (NDC)', batch: 'Admission Engineering 2026', points: 1250, quizzesTaken: 24, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
  { rank: 2, id: 'st2', name: 'Nusrat Jahan Mim', institution: 'Viqarunnisa Noon College', batch: 'HSC 2026 Batch A', points: 1190, quizzesTaken: 22, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { rank: 3, id: 'st3', name: 'Fahim Faisal', institution: 'Dhaka College', batch: 'Admission Varsity Intensive', points: 1120, quizzesTaken: 25, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  { rank: 4, id: 'st4', name: 'Samiur Rahman', institution: 'Rajshahi College', batch: 'HSC 2026 Batch B', points: 1040, quizzesTaken: 19, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80' },
  { rank: 5, id: 'st5', name: 'Ayesha Siddika', institution: 'Chittagong College', batch: 'Admission Engineering 2026', points: 980, quizzesTaken: 20, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80' },
  { rank: 6, id: 'st6', name: 'Zeeshan Mahmud', institution: 'St. Joseph Higher Secondary', batch: 'HSC 2026 Batch A', points: 920, quizzesTaken: 18, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: '🔴 Physics 1st Paper Vector Exam Postponed to Friday!',
    content: 'প্রিয় শিক্ষার্থীরা, আমাদের আগামীকালের ভেক্টর ডট-ক্রস ও নদী নৌকা সংক্রান্ত ডেইলি কুইজটি অনিবার্য কারণে স্থগিত করে আগামী শুক্রবার রাত ৯:০০ টায় নেওয়া হবে। তোমরা আরও ভালোভাবে রিভিশন দেওয়ার সময় পাচ্ছো, কাজেই পরীক্ষায় সবার ভালো করা চাই! কোনো সমস্যা থাকলে ডাউট ক্লিয়ারিং গ্রুপে প্রশ্ন পোস্ট করো।',
    date: 'June 29, 2026',
    category: 'Exam',
    isPinned: true,
    targetBatch: 'HSC 1st Paper',
    author: 'Ashik Vai'
  },
  {
    id: 'n2',
    title: '📚 Thermodynamics Class Hand-Written Notes Uploaded!',
    content: 'কার্নো চক্র ও এন্ট্রপির চমৎকার সব ভিজ্যুয়াল উদাহরণ ও গাণিতিক সূত্রের শর্টকাট সম্বলিত ক্লাসের রঙিন হ্যান্ড-রিটেন নোট পিডিএফ আকারে ম্যাটেরিয়াল সেকশনে আপলোড করে দেওয়া হয়েছে। এখনই ডাউনলোড করে পড়া শুরু করে দাও।',
    date: 'June 28, 2026',
    category: 'Material',
    isPinned: false,
    targetBatch: 'HSC 2nd Paper',
    author: 'Ashik Vai'
  },
  {
    id: 'n3',
    title: '⚡ LIVE Doubt Clearing Session on Zoom - Tonight at 8:30 PM',
    content: 'আজ রাত ৮:৩০ মিনিটে আমাদের স্পেশাল ডাউট সলভিং লাইভ অনুষ্ঠিত হবে। স্প্রিং এর ভর ঝুলানো অংক, ব্লক-অন-ব্লক ও বৃত্তাকার ব্যাংকিং এর সব কঠিন কঠিন গাণিতিক সমস্যা নিয়ে লাইভে আলোচনা হবে। জুমে জয়েন করার পাসওয়ার্ড ও লিংক ক্লাসের কিছুক্ষণ পূর্বে এই ড্যাশবোর্ড নোটিশে এবং টেলিগ্রাম প্রাইভেট গ্রুপে শেয়ার করা হবে।',
    date: 'June 29, 2026',
    category: 'Class Time',
    isPinned: true,
    targetBatch: 'Admission',
    author: 'Ashik Vai'
  },
  {
    id: 'n4',
    title: '💡 HSC Board Exam 2026 Guidelines & Suggessions Booklet',
    content: 'বোর্ড স্ট্যান্ডার্ড সৃজনশীল (CQ) কীভাবে লিখলে ফুল মার্কস নিশ্চিত করা যায় এবং সময় বণ্টন কেমন হওয়া উচিত— তা নিয়ে একটি ডেমো বুকলেট পিডিএফ আকারে পাবলিশ করা হয়েছে। HSC 2026 ব্যাচের সবার জন্য এটি পড়া বাধ্যতামূলক।',
    date: 'June 25, 2026',
    category: 'General',
    isPinned: false,
    targetBatch: 'All',
    author: 'Ashik Admin'
  }
];
