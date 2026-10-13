export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'waste' | 'water' | 'rights' | 'air' | 'climate';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMin: number;
  points: number;
  sdgGoals: number[];
  skillTags: string[];
  bannerUrl: string;
  modulesCount: number;
  lessonsCount: number;
  completedLessons?: number;
  modules: Module[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  durationMin: number;
  type: 'micro-card' | 'audio' | 'video' | 'interactive';
  summary: string;
  transcript: string;
  audioUrl?: string;
  videoThumbnail?: string;
  actionCard: {
    title: string;
    description: string;
    actionType: 'field_mission' | 'civic_report' | 'pledge' | 'audit';
    targetActionId?: string;
  };
  quiz: Quiz;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  points: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  civicTip: string;
}

export interface FieldMission {
  id: string;
  title: string;
  category: 'cleanup' | 'waste' | 'water' | 'audit';
  shortDesc: string;
  instructions: string[];
  safetyBanner: {
    level: 'warning' | 'info';
    text: string;
    equipment: string[];
  };
  durationMin: number;
  points: number;
  badgeRewardId: string;
  sdgGoal: number;
  steps: {
    stepNumber: number;
    title: string;
    requiresGps: boolean;
    requiresPhoto: boolean;
    description: string;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Civic Hero';
  pointsRequired: number;
  unlockedAt?: string;
}

export interface Workshop {
  id: string;
  title: string;
  organizer: string;
  partnerNgo: string;
  date: string;
  time: string;
  type: 'Online Webinar' | 'Field Bootcamp' | 'Community Hall';
  ward: string;
  city: string;
  registeredCount: number;
  maxSeats: number;
  isRegistered?: boolean;
  coverImage: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  title: string;
  recipientName: string;
  issueDate: string;
  hoursCompleted: number;
  sdgsCovered: number[];
  skillsVerified: string[];
  verificationHash: string;
  issuer: string;
  signatory: string;
}

export const SAMPLE_LEARNING_PATHS: Course[] = [
  {
    id: "path-waste-circularity",
    title: "Waste Segregation & Circular Neighborhoods",
    description: "Master 3-way municipal waste segregation, home composting, and organizing zero-waste apartment complexes under the SWM Rules 2016.",
    category: "waste",
    level: "Beginner",
    durationMin: 18,
    points: 150,
    sdgGoals: [11, 12, 13],
    skillTags: ["Waste Audit", "Composting", "Civic By-laws", "Citizen Mobilization"],
    bannerUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    modulesCount: 2,
    lessonsCount: 4,
    completedLessons: 2,
    modules: [
      {
        id: "mod-w-1",
        courseId: "path-waste-circularity",
        title: "Module 1: The 3-Way Segregation Protocol",
        description: "Scientific segregation at source: Wet, Dry, and Domestic Hazardous Waste.",
        orderIndex: 1,
        lessons: [
          {
            id: "les-w-1",
            moduleId: "mod-w-1",
            courseId: "path-waste-circularity",
            title: "Color Coding & Sanitary Waste Sealing",
            durationMin: 2,
            type: "micro-card",
            summary: "Learn the mandatory municipal color codes: Green (Wet), Blue (Dry), and Red/Marked (Hazardous). Sanitary waste must always be wrapped in newspaper marked with a red cross.",
            transcript: "Under SWM Rules 2016, segregating at source is a civic duty, not an option. Wet waste contains 80% moisture which causes toxic leachate and methane in landfills when mixed with dry plastic. Use green bins for kitchen scraps, blue bins for recyclable plastics, paper, and glass (rinsed and clean), and securely wrap menstrual hygiene products in paper with a red 'X' mark so sanitation workers do not handle biohazards with bare hands.",
            actionCard: {
              title: "Home 3-Bin Audit",
              description: "Audit your kitchen bins today. Label three separate bags or bins and take a photo.",
              actionType: "field_mission",
              targetActionId: "mission-waste-seg"
            },
            quiz: {
              id: "quiz-w-1",
              lessonId: "les-w-1",
              title: "Check Your Segregation Reflex",
              passingScore: 100,
              points: 25,
              questions: [
                {
                  id: "q-w1-1",
                  question: "How should sanitary waste (diapers, pads) be packed for municipal sanitation workers?",
                  options: [
                    "Thrown openly in the dry waste bin",
                    "Wrapped in paper marked with a red cross/symbol",
                    "Flushed down the toilet drain",
                    "Mixed with kitchen wet waste"
                  ],
                  correctAnswer: 1,
                  explanation: "Marking with a red cross alerts sanitation workers to handle the parcel hygienically without opening or touching bio-hazardous fluids.",
                  civicTip: "Sanitation workers are frontline civic heroes; wrapping sanitary waste protects their safety and dignity."
                },
                {
                  id: "q-w1-2",
                  question: "Why should recyclables like milk packets or food containers be rinsed before dry bin disposal?",
                  options: [
                    "To make them heavier",
                    "To prevent food residue from contaminating dry recyclables and breeding maggots",
                    "It is legally required to use bleach",
                    "Only glass needs rinsing"
                  ],
                  correctAnswer: 1,
                  explanation: "Greasy or contaminated dry waste cannot be mechanically sorted and often gets rejected into dumping grounds.",
                  civicTip: "A simple 5-second rinse preserves 100% recyclability of the polymer."
                }
              ]
            }
          },
          {
            id: "les-w-2",
            moduleId: "mod-w-1",
            courseId: "path-waste-circularity",
            title: "Overcoming Black Dump Spots in Your Ward",
            durationMin: 3,
            type: "audio",
            summary: "How to identify, report, and transform chronic dumping corners using community diplomacy and Ward Committee engagement.",
            transcript: "When an open corner in your ward becomes a chronic garbage dump spot, reporting on PrajaPulse Layer 1 is step one. Step two is understanding why: is the municipal tipper truck missing that street timing? Work with the local Resident Welfare Association (RWA) and the Ward Junior Health Inspector. Once cleaned, paint the wall with rangoli or eco-murals—psychologically, clean painted spaces deter repeat offenders by over 80%.",
            actionCard: {
              title: "Report or Adopt a Spot",
              description: "Pin a black spot on PrajaPulse Layer 1 geo feed and notify the local ward sanitation team.",
              actionType: "civic_report"
            },
            quiz: {
              id: "quiz-w-2",
              lessonId: "les-w-2",
              title: "Ward Spot Intervention Quiz",
              passingScore: 100,
              points: 25,
              questions: [
                {
                  id: "q-w2-1",
                  question: "What is proven to be the most effective civic intervention to stop repeat littering at an open black spot?",
                  options: [
                    "Erecting a high metal barbed fence",
                    "Clean-up followed by wall painting/plantation and RWA vigil",
                    "Ignoring it until the monsoon washes it away",
                    "Moving the trash to the next street"
                  ],
                  correctAnswer: 1,
                  explanation: "Community beautification combined with local vigilance activates social proof and community ownership.",
                  civicTip: "Organize a weekend ward street-art drive with local schoolchildren."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "path-water-sanitation",
    title: "Urban Water Commons & Stormwater Literacy",
    description: "Understand lake rejuvenation, rooftop rainwater harvesting (RWH), borewell recharge, and holding local water supply boards accountable.",
    category: "water",
    level: "Intermediate",
    durationMin: 22,
    points: 180,
    sdgGoals: [6, 11, 14],
    skillTags: ["RWH Audit", "Water Quality Testing", "Lake Wardenship", "Groundwater Rights"],
    bannerUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    modulesCount: 2,
    lessonsCount: 3,
    completedLessons: 0,
    modules: [
      {
        id: "mod-wat-1",
        courseId: "path-water-sanitation",
        title: "Module 1: Rainwater Harvesting & Groundwater Recharge",
        description: "The physics and municipal bylaws of decentralized water resilience.",
        orderIndex: 1,
        lessons: [
          {
            id: "les-wat-1",
            moduleId: "mod-wat-1",
            courseId: "path-water-sanitation",
            title: "Calculating Your Rooftop Rainwater Potential",
            durationMin: 2,
            type: "micro-card",
            summary: "Formula: Area (sq.m) × Annual Rainfall (mm) × Runoff Coefficient (0.85). Discover how a 1200 sq.ft terrace can harvest 100,000+ liters each year.",
            transcript: "Every square meter of concrete rooftop receives thousands of liters of clean rainwater each monsoon. Rather than letting this storm runoff overwhelm street gutters and cause urban flash floods, a simple dual-chamber sand-gravel filter can channel this water straight into storage tanks or open recharge wells. By replenishing unconfined shallow aquifers, community borewells are preserved from drying up in peak summer.",
            actionCard: {
              title: "Field Mission: Terrace RWH Check",
              description: "Inspect downpipes and calculate harvestable volume for your household or society.",
              actionType: "field_mission",
              targetActionId: "mission-water-test"
            },
            quiz: {
              id: "quiz-wat-1",
              lessonId: "les-wat-1",
              title: "Water Calculations",
              passingScore: 100,
              points: 30,
              questions: [
                {
                  id: "q-wat1-1",
                  question: "What is the primary benefit of directing rooftop rainwater into an open recharge well instead of direct drains?",
                  options: [
                    "It causes mosquitos immediately",
                    "It replenishes shallow groundwater aquifers and prevents street flooding",
                    "It decreases municipal water pressure",
                    "It increases rooftop temperature"
                  ],
                  correctAnswer: 1,
                  explanation: "Recharge wells filter rainwater into local aquifers, raising the neighborhood water table.",
                  civicTip: "Check your local municipal building bylaws: RWH is legally mandatory for plots above 1200 sq.ft in most Indian metros."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "path-environmental-rights",
    title: "Environmental Civic Rights & Legal Accountability",
    description: "Learn how to file RTI queries for tree felling, utilize the National Green Tribunal (NGT) orders, and leverage the 74th Constitutional Amendment for ward-level climate action.",
    category: "rights",
    level: "Advanced",
    durationMin: 25,
    points: 200,
    sdgGoals: [16, 11, 15],
    skillTags: ["RTI for Ecology", "Ward Committee Rules", "Tree Protection Act", "Civic Petitions"],
    bannerUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    modulesCount: 2,
    lessonsCount: 3,
    completedLessons: 1,
    modules: [
      {
        id: "mod-rig-1",
        courseId: "path-environmental-rights",
        title: "Module 1: The Citizen's Legal Toolkit",
        description: "RTI, Ward Sabhas, and Environmental Protection Act provisions.",
        orderIndex: 1,
        lessons: [
          {
            id: "les-rig-1",
            moduleId: "mod-rig-1",
            courseId: "path-environmental-rights",
            title: "Questioning Illegal Tree Felling",
            durationMin: 3,
            type: "video",
            summary: "Learn what permits are required by law before any municipal or private tree cutting, and how to verify Tree Officer permissions in under 10 minutes.",
            transcript: "Under the State Tree Preservation Act, no tree can be lopped or felled without public notice, 15-day objection period, and written sanction from the designated Tree Officer. If you see unauthorized cutting in your lane: 1. Request the sanction copy immediately. 2. Photograph the tree, GPS location, and contractor vehicle number. 3. Call the Forest Cell hotline and file an urgent flash report on PrajaPulse Layer 1.",
            actionCard: {
              title: "Tree Census in Your Lane",
              description: "Count and photograph 5 mature canopy trees along your morning commute.",
              actionType: "civic_report"
            },
            quiz: {
              id: "quiz-rig-1",
              lessonId: "les-rig-1",
              title: "Tree Preservation Protocol",
              passingScore: 100,
              points: 35,
              questions: [
                {
                  id: "q-rig1-1",
                  question: "Can a road contractor cut a roadside banyan tree without a public notice and Tree Officer permission?",
                  options: [
                    "Yes, if they are paving the road",
                    "No, public notice and Tree Officer permission are legally mandatory under Tree Preservation Acts",
                    "Yes, if it is done after 10 PM",
                    "Only traffic police permission is needed"
                  ],
                  correctAnswer: 1,
                  explanation: "Citizen participation and public objections are statutory rights under state tree preservation laws.",
                  civicTip: "Save your local Forest Department mobile helpline on your phone speed dial."
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

export const SAMPLE_FIELD_MISSIONS: FieldMission[] = [
  {
    id: "mission-waste-seg",
    title: "Ward Zero-Waste Segregation Audit",
    category: "waste",
    shortDesc: "Audit 5 nearby households or commercial shops on 3-way segregation and submit photo evidence.",
    instructions: [
      "Carry your PrajaPulse eco-marshal badge ID.",
      "Check wet, dry, and sanitary waste separation.",
      "Explain the red cross sanitary protocol if missing.",
      "Record GPS pin and upload 2 verification photos."
    ],
    safetyBanner: {
      level: "info",
      text: "Safety First: Wear cotton gloves. Do NOT touch sharp or biohazard objects with bare hands.",
      equipment: ["Protective Gloves", "Face Mask", "Digital Camera", "Notepad"]
    },
    durationMin: 30,
    points: 100,
    badgeRewardId: "badge-waste-champion",
    sdgGoal: 12,
    steps: [
      {
        stepNumber: 1,
        title: "GPS Check-In at Audit Zone",
        requiresGps: true,
        requiresPhoto: false,
        description: "Verify your physical presence at the designated ward lane or apartment gate."
      },
      {
        stepNumber: 2,
        title: "Segregation Inspection & Photo",
        requiresGps: false,
        requiresPhoto: true,
        description: "Photograph the 3-bin setup (Green wet bin + Blue dry bag + Wrapped sanitary)."
      },
      {
        stepNumber: 3,
        title: "Citizen Feedback & Reflection",
        requiresGps: false,
        requiresPhoto: false,
        description: "Log how many residents were aware of the sanitary red-cross labeling by-law."
      }
    ]
  },
  {
    id: "mission-water-test",
    title: "Neighborhood Tap & Lake Water TDS/pH Test",
    category: "water",
    shortDesc: "Conduct a basic rapid water strip test of community tanker, tap, or public lake water.",
    instructions: [
      "Use approved test strips or TDS digital meter.",
      "Test pH, dissolved solids (TDS), and visual clarity.",
      "Log the readings to PrajaPulse public water database."
    ],
    safetyBanner: {
      level: "warning",
      text: "Do NOT drink test water. Keep away from sewage outfalls and maintain safe distance from lake edges.",
      equipment: ["Clean sample vials", "Test strips", "Hand Sanitizer"]
    },
    durationMin: 20,
    points: 120,
    badgeRewardId: "badge-water-guardian",
    sdgGoal: 6,
    steps: [
      {
        stepNumber: 1,
        title: "Water Sample Collection",
        requiresGps: true,
        requiresPhoto: true,
        description: "Photograph sample container with date and geotag visible."
      },
      {
        stepNumber: 2,
        title: "Strip Colorimetric Comparison",
        requiresGps: false,
        requiresPhoto: true,
        description: "Photograph test strip against color reference card within 60 seconds."
      }
    ]
  },
  {
    id: "mission-spot-cleanup",
    title: "Black Spot Plog & Transformation Drive",
    category: "cleanup",
    shortDesc: "Mobilize 3 peers to pick up dry plastics from a public pavement and hand over to municipal tippers.",
    instructions: [
      "Coordinate with Ward health supervisor.",
      "Separate hard recyclables from non-recyclable multi-layered plastics.",
      "Submit before-and-after photo comparison."
    ],
    safetyBanner: {
      level: "warning",
      text: "Heavy duty gloves and closed-toe footwear are mandatory. Report medical waste or syringes to supervisor immediately.",
      equipment: ["Heavy Canvas Gloves", "Gunny Bags", "Tongs", "First Aid Kit"]
    },
    durationMin: 45,
    points: 150,
    badgeRewardId: "badge-eco-marshal",
    sdgGoal: 11,
    steps: [
      {
        stepNumber: 1,
        title: "Before State Snapshot",
        requiresGps: true,
        requiresPhoto: true,
        description: "Take a wide-angle geotagged photo of the dumping area before intervention."
      },
      {
        stepNumber: 2,
        title: "Weigh or Bag Count Verification",
        requiresGps: false,
        requiresPhoto: true,
        description: "Document number of bags segregated and handed over to the BBMP/Municipal vehicle."
      },
      {
        stepNumber: 3,
        title: "After Transformation Snapshot",
        requiresGps: false,
        requiresPhoto: true,
        description: "Show the clean sidewalk ready for citizen pedestrian use."
      }
    ]
  }
];

export const SAMPLE_BADGES: Badge[] = [
  {
    id: "badge-eco-rookie",
    title: "Eco-Rookie",
    category: "Foundation",
    description: "Completed your first micro-lesson and scored 100% on a civic environmental quiz.",
    icon: "Sprout",
    tier: "Bronze",
    pointsRequired: 50,
    unlockedAt: "2026-10-10"
  },
  {
    id: "badge-waste-champion",
    title: "Circular Champion",
    category: "Waste Management",
    description: "Mastered SWM 2016 rules and conducted 1 verified household segregation audit.",
    icon: "Recycle",
    tier: "Silver",
    pointsRequired: 150,
    unlockedAt: "2026-10-12"
  },
  {
    id: "badge-water-guardian",
    title: "Jal Rakshak (Water Guardian)",
    category: "Water Commons",
    description: "Completed rainwater harvesting module and submitted 1 neighborhood water quality test.",
    icon: "Droplets",
    tier: "Silver",
    pointsRequired: 250
  },
  {
    id: "badge-eco-marshal",
    title: "Ward Eco-Marshal",
    category: "Civic Leadership",
    description: "Led a spot plogging drive and completed 3 certified field missions in your ward.",
    icon: "ShieldAlert",
    tier: "Gold",
    pointsRequired: 450
  },
  {
    id: "badge-green-advocate",
    title: "Constitutional Green Advocate",
    category: "Civic Rights",
    description: "Completed Environmental Civic Rights path and drafted an RTI or Ward Committee proposal.",
    icon: "Scale",
    tier: "Civic Hero",
    pointsRequired: 700
  }
];

export const SAMPLE_WORKSHOPS: Workshop[] = [
  {
    id: "ws-compost-101",
    title: "Community Home Composting & Khamba Setup",
    organizer: "Hasiru Dala & PrajaPulse",
    partnerNgo: "Hasiru Dala Waste Alliance",
    date: "Saturday, Oct 24, 2026",
    time: "10:00 AM - 11:30 AM IST",
    type: "Field Bootcamp",
    ward: "Ward 174 - HSR Layout",
    city: "Bengaluru",
    registeredCount: 42,
    maxSeats: 50,
    isRegistered: true,
    coverImage: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Dr. Vani Murthy",
      role: "Urban Composting Pioneer & Citizen Mentor",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "ws-lake-watch",
    title: "Lake Water Testing & Biodiversity Citizen Science",
    organizer: "Jal Seva Trust & Ward Committee 42",
    partnerNgo: "Biome Environmental Trust",
    date: "Sunday, Nov 01, 2026",
    time: "07:30 AM - 09:30 AM IST",
    type: "Community Hall",
    ward: "Ward 42 - Vasant Kunj / Mehrauli",
    city: "New Delhi",
    registeredCount: 28,
    maxSeats: 35,
    isRegistered: false,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Shubha Ramachandran",
      role: "Water Resource Specialist & Hydrogeologist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  }
];

export const SAMPLE_CERTIFICATE: Certificate = {
  id: "cert-pp-2026-9041",
  certificateNumber: "PP-ENV-2026-KA-4291",
  title: "Certified Civic Environmental Marshal (Level 1)",
  recipientName: "Aarav Sharma",
  issueDate: "October 12, 2026",
  hoursCompleted: 12,
  sdgsCovered: [6, 11, 12, 13, 16],
  skillsVerified: [
    "Municipal Solid Waste Rules 2016",
    "Ward-Level Segregation Auditing",
    "Rooftop Rainwater Harvesting Inspection",
    "Citizen Science Water Quality Testing",
    "Constitutional Environmental Advocacy"
  ],
  verificationHash: "sha256-e9b41a772c5db08409e3e78a2cb6582",
  issuer: "PrajaPulse Civic Governance Academy",
  signatory: "Dr. Ananya Roy, Director of Environmental Policy & Citizen Engagement"
};

export const LOCAL_WARD_ISSUES = [
  {
    id: "issue-882",
    ward: "Ward 174 (HSR Layout)",
    title: "Chronic Unsegregated Dump Behind 14th Main Park",
    category: "Waste Segregation",
    reportsCount: 14,
    status: "Action In Progress",
    recommendedLessonId: "les-w-1",
    actionCardText: "Learn 3-way segregation protocol and how to enforce RWA penalties."
  },
  {
    id: "issue-899",
    ward: "Ward 42 (Vasant Kunj)",
    title: "Stormwater Drain Clogging & Stagnant Wastewater",
    category: "Water & Drainage",
    reportsCount: 9,
    status: "Verified by AI",
    recommendedLessonId: "les-wat-1",
    actionCardText: "Understand stormwater infiltration vs sewage mixing under municipal acts."
  }
];
