import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Flame, 
  Award, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter,
  Bot,
  Users,
  Leaf,
  Droplets,
  Scale,
  Zap,
  Play,
  Share2
} from 'lucide-react';
import { Course, FieldMission, Workshop, Badge } from '../../data/layer11Data';

interface WebHomeViewProps {
  courses: Course[];
  missions: FieldMission[];
  workshops: Workshop[];
  badges: Badge[];
  userPoints: number;
  selectedWard: string;
  completedLessonIds: string[];
  onSelectCourse: (courseId: string) => void;
  onSelectMission: (missionId: string) => void;
  onOpenAiTutor: (prefillQuery?: string) => void;
  onOpenCertificate: () => void;
  onOpenContextualModal: () => void;
  onRsvpWorkshop: (workshopId: string) => void;
}

export const WebHomeView: React.FC<WebHomeViewProps> = ({
  courses,
  missions,
  workshops,
  badges,
  userPoints,
  selectedWard,
  completedLessonIds,
  onSelectCourse,
  onSelectMission,
  onOpenAiTutor,
  onOpenCertificate,
  onOpenContextualModal,
  onRsvpWorkshop
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [aiQuickQuery, setAiQuickQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'waste', label: 'Waste & Circularity', icon: Leaf },
    { id: 'water', label: 'Water & Aquifers', icon: Droplets },
    { id: 'rights', label: 'Civic Legal Rights', icon: Scale },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
    const matchesSearch = searchQuery === '' || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skillTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesLevel && matchesSearch;
  });

  const activeMission = missions[0];

  return (
    <div className="w-full min-h-full bg-slate-900 text-slate-100 flex flex-col">
      {/* Hero Portal Header */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-b border-slate-800 px-6 py-10 lg:py-14 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PrajaPulse Ecosystem • Layer 11</span>
              <span className="text-slate-500">|</span>
              <span className="text-teal-200">Municipal Education &amp; Field Action</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Turn Environmental Awareness Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Civic Leadership</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Master Solid Waste Management rules 2016, rooftop rainwater harvesting physics, and constitutional environmental rights. Complete verified ground audits in <strong>{selectedWard}</strong> to earn verified credentials.
            </p>

            {/* Quick AI Question Bar */}
            <div className="pt-2">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (aiQuickQuery.trim()) onOpenAiTutor(aiQuickQuery);
                }}
                className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/80 p-2 rounded-2xl shadow-xl max-w-xl"
              >
                <div className="pl-3 text-emerald-400">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <input
                  type="text"
                  value={aiQuickQuery}
                  onChange={(e) => setAiQuickQuery(e.target.value)}
                  placeholder={`Ask Prakriti AI about ${selectedWard} waste, trees, or water laws...`}
                  className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Ask AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Real-Time Citizen Impact Ticker */}
            <div className="grid grid-cols-3 gap-3 pt-3 max-w-xl">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="text-lg font-black text-emerald-400">4,820 kg</div>
                <div className="text-[11px] text-slate-400">Wet Waste Diverted</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="text-lg font-black text-teal-400">124,000 L</div>
                <div className="text-[11px] text-slate-400">Rainwater Harvested</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="text-lg font-black text-amber-400">342 Marshals</div>
                <div className="text-[11px] text-slate-400">Certified in Ward</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Daily Challenge & Ward Highlights Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Daily Challenge Card */}
            <div className="bg-gradient-to-br from-emerald-900/90 to-teal-900/80 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Today's Civic Action
                </span>
                <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 2 Min Read
                </span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                Sanitary Waste Red-Cross Marking Protocol
              </h3>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Under SWM Rules 2016, sanitary waste must be wrapped in paper with a distinct red symbol. Protect sanitation workers from direct exposure to biohazards.
              </p>

              <div className="mt-4 pt-3 border-t border-emerald-700/50 flex items-center justify-between">
                <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>+30 Eco-Points</span>
                </div>
                <button
                  onClick={() => onSelectCourse(courses[0].id)}
                  className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Start Lesson &amp; Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ward Context Alert Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-teal-300">Active Civic Ward</div>
                  <div className="text-sm font-bold text-white">{selectedWard}</div>
                  <div className="text-[11px] text-slate-400">2 Chronic Reports Pending Resolution</div>
                </div>
              </div>
              <button
                onClick={onOpenContextualModal}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Inspect Issues
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Website Body Area */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-10 flex-1">
        
        {/* Section 1: Courses Catalog with Filters */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-bold text-white">Curated Civic Environmental Courses</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Scientific &amp; legal curriculum aligned with United Nations Sustainable Development Goals
              </p>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules, skills, tags..."
                  className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-emerald-500 w-52 sm:w-64"
                />
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-semibold focus:outline-emerald-500 cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Courses Grid (Responsive Desktop 3-column / Tablet 2-column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredCourses.map((course) => {
              const totalLessons = course.modules.flatMap(m => m.lessons);
              const completedCount = totalLessons.filter(l => completedLessonIds.includes(l.id)).length;
              const percent = Math.round((completedCount / (totalLessons.length || 1)) * 100);

              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 rounded-3xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-emerald-950/20 group cursor-pointer flex flex-col"
                >
                  {/* Banner Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img 
                      src={course.bannerUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-600/90 backdrop-blur-md text-white shadow-sm">
                        {course.level}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700">
                        SDG {course.sdgGoals.join(', ')}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{course.points} pts</span>
                    </div>
                  </div>

                  {/* Course Details Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.durationMin} mins total</span>
                        <span>•</span>
                        <span>{course.modules.length} modules</span>
                        <span>•</span>
                        <span>{totalLessons.length} micro-lessons</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Skill Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {course.skillTags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar & Action */}
                    <div className="pt-3 border-t border-slate-850 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Completion</span>
                        <span className="font-extrabold text-emerald-400">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                        <span>{percent > 0 ? 'Resume Learning' : 'Start Course'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Split View - Active Field Missions & NGO Workshops */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Field Missions (7 Cols) */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-teal-500/20 text-teal-400">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-bold text-white">Civic Field Action &amp; Missions</h2>
                </div>
                <p className="text-xs text-slate-400">Step 2 of the loop: Apply your lessons on the ground</p>
              </div>

              <span className="text-xs font-bold text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-800">
                GPS Verified
              </span>
            </div>

            <div className="space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => onSelectMission(mission.id)}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                        {mission.category.toUpperCase()} AUDIT
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-teal-400" /> {mission.durationMin} mins
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                      {mission.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {mission.shortDesc}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-850">
                    <div className="text-right">
                      <div className="text-sm font-black text-amber-400">+{mission.points} pts</div>
                      <div className="text-[10px] text-slate-500">Unlocks Badge</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMission(mission.id);
                      }}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Deploy Mission</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NGO Field Masterclasses & Workshops (5 Cols) */}
          <section className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-bold text-white">NGO Partner Masterclasses</h2>
                </div>
                <p className="text-xs text-slate-400">Layer 8 Verified Network</p>
              </div>
            </div>

            <div className="space-y-3">
              {workshops.map((ws) => (
                <div 
                  key={ws.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={ws.instructor.avatar} 
                        alt={ws.instructor.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{ws.title}</h4>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          {ws.instructor.name} • {ws.partnerNgo}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{ws.date}</span>
                    <span className="text-indigo-400 font-semibold">{ws.ward}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {ws.registeredCount} / {ws.maxSeats} seats reserved
                    </span>
                    <button
                      onClick={() => onRsvpWorkshop(ws.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        ws.isRegistered
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {ws.isRegistered ? '✓ Registered' : 'Reserve Free Seat'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Section 3: Verified Badges & Certification Showcase Banner */}
        <section className="bg-gradient-to-r from-slate-950 via-emerald-950/60 to-slate-950 border border-emerald-900/60 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Verifiable Civic Environmental Credential</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Official PrajaPulse Civic Environmental Marshal Certification
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upon passing the core municipal courses and executing 3 verified field missions, earn a tamper-proof certificate equipped with cryptographic SHA-256 verification and QR validation for municipal RWAs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCertificate}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              View My Citizen Credentials
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
