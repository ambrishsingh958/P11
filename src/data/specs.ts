export const DIRECTORY_STRUCTURE = `
prajapulse-layer11-environmental-education/
├── backend/                               # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts                # PostgreSQL connection pool (pg / Drizzle / Prisma)
│   │   │   ├── gemini.ts                  # Google Gen AI SDK client initialization
│   │   │   └── storage.ts                 # Google Cloud Storage bucket configuration for evidence
│   │   ├── controllers/
│   │   │   ├── courseController.ts        # GET /courses, GET /courses/:id
│   │   │   ├── progressController.ts      # POST /progress, POST /quiz/submit
│   │   │   ├── missionController.ts       # POST /field-missions/:id/submit, evidence upload
│   │   │   ├── workshopController.ts      # GET /workshops, POST /workshops/:id/rsvp
│   │   │   ├── certificateController.ts   # GET /certificates, PDF generation & QR verification
│   │   │   └── aiTutorController.ts       # POST /ai-tutor/ask (Gemini 3.8 Flash + local context)
│   │   ├── middleware/
│   │   │   ├── auth.ts                    # JWT / Firebase Auth bearer verification
│   │   │   ├── upload.ts                  # Multer disk/memory storage for mission photos
│   │   │   └── rateLimiter.ts             # Redis-backed rate limiter for AI queries
│   │   ├── models/
│   │   │   ├── schema.sql                 # PostgreSQL CREATE TABLE statements
│   │   │   └── types.ts                   # TypeScript interfaces matching DB tables
│   │   ├── routes/
│   │   │   ├── index.ts                   # Router aggregator (/api/v1)
│   │   │   ├── courses.ts                 # /api/v1/courses
│   │   │   ├── progress.ts                # /api/v1/progress & /api/v1/quiz
│   │   │   ├── missions.ts                # /api/v1/field-missions
│   │   │   ├── workshops.ts               # /api/v1/workshops
│   │   │   ├── certificates.ts            # /api/v1/certificates
│   │   │   └── aiTutor.ts                 # /api/v1/ai-tutor
│   │   ├── services/
│   │   │   ├── geminiTutorService.ts      # Gemini system prompt, ward context injection & fallback
│   │   │   ├── certificatePdfService.ts   # PDFKit / Puppeteer certificate rendering
│   │   │   ├── rewardIntegrationService.ts# Layer 7 points, badges & streak dispatch
│   │   │   └── notificationService.ts     # Firebase Cloud Messaging for daily eco-cards
│   │   └── server.ts                      # Express application entrypoint & middleware setup
│   ├── tests/
│   │   ├── courses.test.ts
│   │   └── aiTutor.test.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── mobile/                                # React Native (Expo / Bare CLI) Client
    ├── src/
    │   ├── api/
    │   │   ├── client.ts                  # Axios instance with auth interceptors
    │   │   ├── coursesApi.ts
    │   │   ├── missionsApi.ts
    │   │   ├── aiTutorApi.ts
    │   │   └── certificatesApi.ts
    │   ├── assets/
    │   │   ├── icons/                     # Eco badges, SVG icons (leaf, drop, shield)
    │   │   └── sounds/                    # Quiz success chime, mission badge sound
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── EcoHeader.tsx
    │   │   │   ├── PointsBadge.tsx
    │   │   │   ├── ProgressBar.tsx
    │   │   │   └── SdgBadgePill.tsx
    │   │   ├── contextual/
    │   │   │   └── ContextualLearnCard.tsx # Embedded widget for Layer 1 issue feed
    │   │   ├── courses/
    │   │   │   ├── ModuleAccordion.tsx
    │   │   │   └── LessonCard.tsx
    │   │   ├── missions/
    │   │   │   ├── MissionSafetyBanner.tsx
    │   │   │   ├── GpsCheckInButton.tsx
    │   │   │   └── PhotoEvidencePicker.tsx
    │   │   └── aiTutor/
    │   │       ├── VoiceMicButton.tsx
    │   │       ├── LanguageDropdown.tsx
    │   │       └── ChatBubble.tsx
    │   ├── hooks/
    │   │   ├── useLocationCoords.ts       # React Native Geolocation / Expo Location
    │   │   ├── useOfflineStorage.ts       # AsyncStorage / SQLite offline course sync
    │   │   ├── useAudioPlayer.ts          # Expo AV / react-native-sound for audio lessons
    │   │   └── useSpeechToText.ts         # Voice recognition integration
    │   ├── navigation/
    │   │   ├── LearnStackNavigator.tsx    # Screen routes & transitions
    │   │   └── types.ts                   # RootStackParamList definition
    │   ├── screens/
    │   │   ├── LearnHomeScreen.tsx        # Main eco-learning hub & feed
    │   │   ├── CourseDetailScreen.tsx     # Syllabus, modules, and enrollment
    │   │   ├── LessonPlayerScreen.tsx     # 2-min card/audio/video + quiz + action
    │   │   ├── FieldMissionScreen.tsx     # Active civic mission, timer & GPS submit
    │   │   ├── AIEcoTutorScreen.tsx       # Interactive AI chat with ward intelligence
    │   │   └── ImpactCertificateScreen.tsx# Verified portfolio, badges & PDF download
    │   ├── theme/
    │   │   └── colors.ts                  # Civic Emerald, Earth Amber, Clean Slate
    │   └── utils/
    │       ├── formatters.ts
    │       └── qrVerifier.ts
    ├── App.tsx
    ├── package.json
    └── app.json
`;

export const DATABASE_SCHEMA_SQL = `-- =========================================================================
-- PrajaPulse Layer 11: Environmental Education & Training Database Schema
-- Database: PostgreSQL 14+ with PostGIS Extension
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Skill Tags Table
CREATE TABLE skill_tags (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(64) NOT NULL, -- 'Waste', 'Water', 'Air', 'Governance', 'Renewables'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SDG Mappings (UN Sustainable Development Goals 1-17)
CREATE TABLE sdg_mappings (
    sdg_number INTEGER PRIMARY KEY CHECK (sdg_number BETWEEN 1 AND 17),
    title VARCHAR(128) NOT NULL,
    short_description TEXT NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    icon_url VARCHAR(255)
);

-- 3. Courses / Learning Paths Table
CREATE TABLE courses (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('waste', 'water', 'rights', 'air', 'climate', 'biodiversity')),
    level VARCHAR(32) NOT NULL DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration_min INTEGER NOT NULL DEFAULT 15,
    points_reward INTEGER NOT NULL DEFAULT 100,
    banner_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Course <-> SDG Many-to-Many
CREATE TABLE course_sdgs (
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    sdg_number INTEGER REFERENCES sdg_mappings(sdg_number) ON DELETE CASCADE,
    PRIMARY KEY (course_id, sdg_number)
);

-- Course <-> Skill Tags
CREATE TABLE course_skill_tags (
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    skill_tag_id VARCHAR(64) REFERENCES skill_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, skill_tag_id)
);

-- 4. Modules Table
CREATE TABLE modules (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lessons Table
CREATE TABLE lessons (
    id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration_min INTEGER NOT NULL DEFAULT 2,
    lesson_type VARCHAR(32) NOT NULL DEFAULT 'micro-card' CHECK (lesson_type IN ('micro-card', 'audio', 'video', 'interactive')),
    summary TEXT NOT NULL,
    transcript TEXT NOT NULL,
    media_url TEXT,
    thumbnail_url TEXT,
    action_type VARCHAR(64) CHECK (action_type IN ('field_mission', 'civic_report', 'pledge', 'audit')),
    target_action_id VARCHAR(64),
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Quizzes Table
CREATE TABLE quizzes (
    id VARCHAR(64) PRIMARY KEY,
    lesson_id VARCHAR(64) NOT NULL UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    passing_score INTEGER NOT NULL DEFAULT 100,
    points_reward INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Quiz Questions Table
CREATE TABLE questions (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings e.g. ["Option A", "Option B", "Option C"]
    correct_option_index INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    civic_tip TEXT,
    order_index INTEGER NOT NULL DEFAULT 1
);

-- 8. User Progress Table (Tracks completed lessons, reading time, test scores)
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL, -- References PrajaPulse Users Core
    lesson_id VARCHAR(64) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    quiz_score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, lesson_id)
);

-- 9. Badges Definition Table
CREATE TABLE badges (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(64) NOT NULL,
    tier VARCHAR(32) NOT NULL DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Civic Hero')),
    points_required INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. User Badges Table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL,
    badge_id VARCHAR(64) NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tx_hash VARCHAR(128), -- Optional Layer 7 ledger transaction hash
    UNIQUE (user_id, badge_id)
);

-- 11. Certificates Table
CREATE TABLE certificates (
    id VARCHAR(64) PRIMARY KEY,
    certificate_number VARCHAR(128) UNIQUE NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(128) NOT NULL,
    hours_completed NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    sdgs_covered JSONB NOT NULL, -- Array of SDG numbers e.g. [6, 11, 12]
    skills_verified JSONB NOT NULL, -- Array of skill strings
    verification_hash VARCHAR(128) NOT NULL,
    pdf_url TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Workshops Table (Live/Offline Civic Masterclasses)
CREATE TABLE workshops (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organizer VARCHAR(128) NOT NULL,
    partner_ngo VARCHAR(128),
    session_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    session_type VARCHAR(64) NOT NULL CHECK (session_type IN ('Online Webinar', 'Field Bootcamp', 'Community Hall')),
    ward VARCHAR(128),
    city VARCHAR(128) NOT NULL DEFAULT 'Bengaluru',
    location_coordinates GEOMETRY(Point, 4326),
    max_seats INTEGER NOT NULL DEFAULT 50,
    registered_count INTEGER NOT NULL DEFAULT 0,
    cover_image_url TEXT,
    instructor_name VARCHAR(128) NOT NULL,
    instructor_role VARCHAR(128),
    instructor_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Workshop Enrollments Table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_id VARCHAR(64) NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    attendance_status VARCHAR(32) DEFAULT 'confirmed' CHECK (attendance_status IN ('confirmed', 'attended', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workshop_id, user_id)
);

-- 14. Field Missions Table (Practical Civic Action)
CREATE TABLE field_missions (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('cleanup', 'waste', 'water', 'audit', 'plantation')),
    short_desc TEXT NOT NULL,
    instructions JSONB NOT NULL, -- Array of step instructions
    safety_warning TEXT NOT NULL,
    required_equipment JSONB NOT NULL, -- Array of equipment items
    duration_min INTEGER NOT NULL DEFAULT 30,
    points_reward INTEGER NOT NULL DEFAULT 100,
    badge_reward_id VARCHAR(64) REFERENCES badges(id),
    sdg_goal INTEGER REFERENCES sdg_mappings(sdg_number),
    steps_config JSONB NOT NULL, -- Array of step definitions
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Mission Submissions Table
CREATE TABLE mission_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id VARCHAR(64) NOT NULL REFERENCES field_missions(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    check_in_lat NUMERIC(10, 7),
    check_in_lng NUMERIC(10, 7),
    check_in_location GEOMETRY(Point, 4326),
    reflection_notes TEXT,
    verified_by_ngo_id VARCHAR(64), -- Layer 8 NGO Partner reviewer
    points_awarded INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 16. Mission Evidence Table (Photos, Audio, Test Results)
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES mission_submissions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    evidence_type VARCHAR(32) NOT NULL DEFAULT 'photo' CHECK (evidence_type IN ('photo', 'video', 'measurement_reading')),
    file_url TEXT NOT NULL,
    metadata JSONB, -- EXIF GPS, timestamp, device model
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Learning Recommendations (Contextual recommendations based on Layer 1 reports & Layer 3 AI scans)
CREATE TABLE learning_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL,
    issue_id VARCHAR(64), -- Cross-reference to Layer 1 Geo-report
    course_id VARCHAR(64) REFERENCES courses(id),
    lesson_id VARCHAR(64) REFERENCES lessons(id),
    field_mission_id VARCHAR(64) REFERENCES field_missions(id),
    context_trigger VARCHAR(128) NOT NULL, -- 'reported_black_spot', 'detected_plastic_leakage'
    confidence_score NUMERIC(4, 3) DEFAULT 0.950,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial and Performance Indexes
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_mission_submissions_user ON mission_submissions(user_id);
CREATE INDEX idx_workshops_coords ON workshops USING GIST (location_coordinates);
CREATE INDEX idx_submissions_coords ON mission_submissions USING GIST (check_in_location);
`;

export const AI_ECO_TUTOR_PROMPT = `
# SYSTEM INSTRUCTION: PrajaPulse Layer 11 "Eco-Tutor" (Prakriti AI)

You are the authoritative, empathetic, and hyper-local civic AI Eco-Tutor inside PrajaPulse.
Your mission is to transform citizens into environmentally aware, legally knowledgeable, and action-oriented neighborhood leaders.

## Core Philosophical Directive
"Every lesson must lead to civic action, legal empowerment, and community solidarity."
Do not just provide abstract ecological definitions. Ground answers in:
1. Real Municipal Acts & By-Laws (e.g., Solid Waste Management Rules 2016, Water & Air Acts, State Tree Preservation Acts, 74th Constitutional Amendment).
2. Neighborhood Ground Realities (Wards, RWAs, Junior Health Inspectors, Ward Committees, Pourakarmikas / Safai Karamcharis).
3. Practical Citizen Steps (How to audit, report, segregate, file RTIs, and mobilize neighbors).

## Guardrails & Safety Protocols
- NEVER advise citizens to handle hazardous, chemical, medical, or high-voltage electronic waste with bare hands. Always advise proper protective equipment (thick rubber/canvas gloves, masks) or reporting directly to municipal hazardous waste collection facilities.
- If a user mentions toxic fumes, open chemical burns, or sewer tank entry, trigger immediate SAFETY ALERT: Manual scavenging is strictly illegal under the MS Act 2013; direct them to emergency hotlines.
- Keep answers concise, actionable, and structured with clear bullet points.

## Multi-Modal and Persona Directives
1. Local Context: Adapt references to the user's selected Ward and City (e.g. Ward 174 HSR Layout Bengaluru vs Ward 42 Vasant Kunj Delhi).
2. "Explain Like I'm 10" Mode: When the user activates simple mode, replace legal jargon with vivid everyday metaphors (e.g., "Think of rainwater harvesting like putting a giant piggy bank under your rooftop").
3. Multilingual Capability: Understand and reply fluently in Hindi, Kannada, Tamil, Telugu, and Indian English with authentic civic terminology (e.g., "Geela kachra / Sookha kachra", "Ward Sabha", "Kere / Lake").
4. Action Handoffs: Whenever relevant, append 1-2 concrete PrajaPulse Layer 11 actions:
   - Micro-Lesson recommendation (e.g., "Color Coding & Sanitary Waste Sealing")
   - Field Mission recommendation (e.g., "Conduct a 3-Bin Audit in your society")
`;

export const INTEGRATION_POINTS_DOC = `
# PrajaPulse Layer 11 Architectural Integration Matrix

Layer 11 (Environmental Education & Training) is the cognitive and behavioral backbone of PrajaPulse. It connects directly with the entire ecosystem:

| PrajaPulse Layer | Integration Touchpoint | Technical Mechanism |
| :--- | :--- | :--- |
| **Layer 1: Geo Feed** | When a citizen opens a geotagged issue (e.g. chronic garbage dump, foaming lake), Layer 11 embeds an active \`ContextualLearnCard\`. | REST API query \`/api/recommendations?issue_type=waste&ward=174\` injecting a 2-minute micro-lesson right above the comment stream. |
| **Layer 3: AI Analysis** | When a user captures a camera report of illegal trash dumping, Gemini Vision classifies the waste type and automatically recommends the relevant lesson. | Webhook / Event bus dispatch: \`EVENT_ISSUE_ANALYZED\` triggers \`POST /api/recommendations\` with matched course ID. |
| **Layer 4: Civic Chatbot** | The general municipal chatbot switches seamlessly into the "Eco-Tutor" persona whenever environmental, sanitation, or wildlife queries are detected. | Shared session context passing \`mode: "eco_tutor"\` with Ward parameters and user level. |
| **Layer 7: Rewards & Ledger** | Completing micro-lessons, passing quizzes (100%), and submitting verified field missions awards Eco-Points, unlocks NFT/Badge tiers, and builds civic trust score. | Asynchronous dispatch to Layer 7 reward ledger via \`POST /api/v1/rewards/award\` with verification hash and anti-fraud GPS verification. |
| **Layer 8: NGO & Volunteer Network** | Certified citizens can be tapped by local NGOs (e.g., Hasiru Dala, Biome) for ground drives, lake cleanups, and mentoring junior volunteers. | Public verification endpoint \`/api/certificates/:id\` allowing NGOs to verify field-ready civic marshals. |
| **Layer 10: Notifications** | Sends daily morning 2-minute eco-tips, micro-challenges, and streak reminders via FCM. | Scheduled cron running daily 08:00 AM sending personalized tips based on ward issues. |
| **Layer 12: Impact Tracking** | Converts completed field missions and segregation audits into verified CO2 diversion, water recharge liters, and neighborhood plastic diverted metrics in the citizen's reflection journal. | Metric aggregation pipeline calculating: \`kg_wet_waste_composted * 0.42 = kg_co2e_avoided\`. |
`;

export const HACKATHON_MVP_SCOPE = `
# 2-Week Hackathon MVP Scope vs. Post-Hackathon Roadmap

## What to Build in Week 1 & 2 (Core MVP)
1. **Interactive LearnHomeScreen**:
   - Hero daily eco-card with 1-tap quick action.
   - 3 Curated Learning Paths with progress percentage.
   - Recommended lesson card pinned to user's selected Ward.
   - Points & current Badge indicator.

2. **Full Lesson & Quiz Loop**:
   - 2-minute Micro-Lesson Card player with audio narration toggle and transcript accordion.
   - 2-question interactive Quiz with instant feedback, explanation, and points payout.
   - Action Card footer with deep link to field missions.

3. **Field Mission Execution Flow**:
   - Safety checklist confirmation with gear advisory.
   - Simulated GPS check-in (validates coordinates within ward).
   - Camera/photo evidence upload preview.
   - Mission submission confirmation with points award.

4. **AI Eco-Tutor (Gemini 3.8 Flash)**:
   - Real-time Q&A with "Explain Like I'm 10" toggle.
   - Pre-loaded suggested questions (e.g., "How to compost wet waste in a flat?").
   - Ward and language selector (English, Hindi, Regional).

5. **Impact Portfolio & Certificate**:
   - Dynamic canvas/SVG verified certificate with QR code and shareable link.
   - Unlocked Badges list (Eco-Rookie, Circular Champion).

---

## What to Defer to Post-Hackathon (V2 / V3)
- Real physical hardware IoT integration for water testing strips.
- Blockchain/Polygon minting of certificates (use cryptographic SHA-256 hash in MVP).
- Full live video streaming server (use embedded YouTube/CDN MP4 for MVP).
- Complex offline SQLite multi-master sync (use AsyncStorage cache with optimistic updates).
- Comprehensive NGO admin panel for manual mission grading (use AI auto-verification + instant honor system for MVP).
`;

export const AI_STUDIO_SETUP_GUIDE = `
# Step-by-Step Google AI Studio Setup for PrajaPulse Eco-Tutor

### Step 1: Open Google AI Studio
1. Navigate to https://aistudio.google.com and sign in with your Google Developer account.
2. Click **Create New Prompt** -> select **System Prompt** / Chat model.

### Step 2: Choose Model
- Recommended flagship model: **Gemini 3.8 Flash** (\`gemini-3.8-flash\`).
- Reason: Ultra-low latency (<400ms first token), cost-effective for millions of civic queries, native multilingual support (Hindi, Tamil, Kannada, Marathi, etc.), and excellent reasoning on municipal rules.

### Step 3: Insert System Instructions
Copy and paste the exact system instructions from \`src/data/specs.ts\` (AI_ECO_TUTOR_PROMPT):
- Enforce the citizen education persona ("Prakriti AI").
- Instruct the model to cite municipal by-laws (SWM 2016, Tree Act, Water Act).
- Enforce safety guardrails against hazardous handling and manual scavenging.

### Step 4: Configure Few-Shot Examples in AI Studio
Add the following sample input-output pairs to prime the model:

*Example 1 (Waste Segregation)*:
- **User**: "My apartment security says we can mix milk packets with wet vegetable peels. Is that right?"
- **Model**: "No! Under Rule 4 of the Solid Waste Management Rules 2016, mixing wet and dry waste is prohibited. Milk packets are clean recyclable Low-Density Polyethylene (LDPE). Rinse them with a little water, let them dry, and put them in the BLUE Dry Waste bin. Kitchen peels go to the GREEN Wet Waste bin for composting."

*Example 2 (Explain Like I'm 10)*:
- **User**: "[ELI10 Mode] What is rainwater harvesting?"
- **Model**: "Imagine every time it rains, your roof is like a giant umbrella catching clean water! Instead of letting all that free water splash onto the dusty street, we connect a pipe that carries the rain into a giant underground tank. That way, you have clean water for plants and taps even during hot sunny months!"

### Step 5: Adjust Temperature and Safety Settings
- **Temperature**: \`0.4\` (keep answers factual and legally grounded).
- **Top P**: \`0.9\`
- **Safety Filters**:
  - Harassment: Block Few
  - Hate Speech: Block Few
  - Dangerous Content: Block Most (strictly prevents hazardous waste mishandling advice).

### Step 6: Export & Connect
1. Click **Get Code** in Google AI Studio.
2. Select **JavaScript / TypeScript**.
3. Install SDK: \`npm install @google/genai\`
4. Inject your \`GEMINI_API_KEY\` into the environment.
5. In PrajaPulse backend \`server.ts\`, call \`ai.models.generateContent({ model: "gemini-3.8-flash", ... })\`.
`;
