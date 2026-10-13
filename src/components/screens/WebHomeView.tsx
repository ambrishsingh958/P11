import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  Calendar, 
  Clock, 
  Search, 
  Bot, 
  Leaf, 
  Droplets, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  MapPin,
  Flame,
  Wind
} from 'lucide-react';
import { Course, FieldMission, Workshop, Badge } from '../../data/layer11Data';
import { WasteSortingLab } from '../ecoFeatures/WasteSortingLab';
import { RainwaterCalculator } from '../ecoFeatures/RainwaterCalculator';
import { WardEcoTelemetry } from '../ecoFeatures/WardEcoTelemetry';

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
  onEarnPoints: (points: number) => void;
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
  onRsvpWorkshop,
  onEarnPoints
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [aiQuickQuery, setAiQuickQuery] = useState<string>('');
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'sorting_lab' | 'rwh_calc'>('sorting_lab');

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'waste', label: 'Solid Waste & Circularity' },
    { id: 'water', label: 'Water Commons & Aquifers' },
    { id: 'rights', label: 'Environmental Civic Rights' },
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

  return (
    <div className="w-full min-h-full bg-[#F7F6F0] text-[#1B2D22] font-sans">
      
      {/* 1. Natural Botanical Hero Header */}
      <section className="w-full bg-[#122A1E] text-[#EDEBE1] border-b border-[#214332] px-6 py-10 lg:py-14 relative shrink-0">
        {/* Subtle Organic Background Linework */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#89B399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Hero Overview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8EB89D]">
              <span>PrajaPulse Ecosystem</span>
              <span aria-hidden="true">·</span>
              <span>Layer 11</span>
              <span aria-hidden="true">·</span>
              <span>Civic Environmental Academy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F4EC] tracking-tight leading-tight">
              Turn Ecological Knowledge Into Local Civic Leadership
            </h1>

            <p className="text-[#C5D5CB] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Scientific curriculum on municipal waste segregation, rooftop aquifer recharge, and environmental rights under the 74th Amendment. Conduct verified field audits in <strong>{selectedWard}</strong> to protect urban commons.
            </p>

            {/* Quick AI Consultation Bar */}
            <div className="pt-2">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (aiQuickQuery.trim()) onOpenAiTutor(aiQuickQuery);
                }}
                className="flex items-center gap-2 bg-[#0C1D15] border border-[#27533E] p-2 rounded-2xl shadow-md max-w-xl"
              >
                <div className="pl-3 text-[#79B490]">
                  <Bot className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={aiQuickQuery}
                  onChange={(e) => setAiQuickQuery(e.target.value)}
                  placeholder={`Ask Prakriti AI about ${selectedWard} municipal laws, waste, or trees...`}
                  className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#EDEBE1] placeholder-[#718779] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#3B8061] text-[#F5F4EC] font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Consult AI Tutor
                </button>
              </form>
            </div>

            {/* Ward Impact Ticker */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[#9BBBA6]">
              <div>
                <strong className="text-white text-base block font-bold">4,820 kg</strong>
                <span>Wet Waste Composted</span>
              </div>
              <div className="hidden sm:block text-[#27533E]">|</div>
              <div>
                <strong className="text-white text-base block font-bold">124,000 L</strong>
                <span>Monsoon Rain Recharged</span>
              </div>
              <div className="hidden sm:block text-[#27533E]">|</div>
              <div>
                <strong className="text-white text-base block font-bold">342 Marshals</strong>
                <span>Active in {selectedWard.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Daily Eco Challenge & Ward Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Daily Challenge Card */}
            <div className="bg-[#1A3A2B] border border-[#2B5B44] rounded-3xl p-6 text-[#F5F4EC] shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9EC7AB]">
                <span className="font-bold uppercase tracking-wider text-[#A2D4B2]">
                  Daily 2-Minute Micro-Action
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> 2 min read
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                Sanitary Waste Red-Cross Packaging Protocol
              </h3>
              
              <p className="text-xs text-[#C5D9CC] leading-relaxed">
                Under SWM Rules 2016, sanitary napkins and diapers must be wrapped in paper with a prominent red 'X' to safeguard waste workers from biohazards.
              </p>

              <div className="pt-3 hairline-t border-[#2B5B44] flex items-center justify-between">
                <span className="text-xs font-bold text-[#E9C46A]">
                  +30 Eco-Points Reward
                </span>
                <button
                  onClick={() => onSelectCourse(courses[0].id)}
                  className="px-4 py-2 bg-[#EDEBE1] hover:bg-white text-[#122A1E] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Start Micro-Lesson →
                </button>
              </div>
            </div>

            {/* Ward Context Alert Box */}
            <div className="bg-[#10241A] border border-[#214332] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#8EB89D]">Hyper-Local Civic Scope</div>
                <div className="text-xs font-bold text-white mt-0.5">{selectedWard}</div>
                <div className="text-[11px] text-[#718779]">2 Chronic Dump Reports In Progress</div>
              </div>
              <button
                onClick={onOpenContextualModal}
                className="px-3 py-1.5 bg-[#1B3A2C] hover:bg-[#254F3C] text-[#CBE2D4] text-xs font-semibold rounded-xl border border-[#2C5741] transition-colors cursor-pointer"
              >
                Inspect Issues
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-10 flex-1">
        
        {/* Real-time Ward Ecological Telemetry Bar */}
        <WardEcoTelemetry wardName={selectedWard} />

        {/* 2. Interactive Ecological Sandboxes */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#143628]">
                Interactive Environmental Laboratories
              </h2>
              <p className="text-xs text-[#526357] mt-0.5">
                Simulate real municipal segregation rules and rooftop hydrology before stepping onto the street
              </p>
            </div>

            {/* Segmented Control for Labs */}
            <div className="flex items-center gap-1 p-1 bg-[#EAE6DC] rounded-xl border border-[#DCD5C6] self-start sm:self-auto">
              <button
                onClick={() => setActiveInteractiveTab('sorting_lab')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeInteractiveTab === 'sorting_lab'
                    ? 'bg-white text-[#143628] shadow-xs'
                    : 'text-[#5C6E61] hover:text-[#143628]'
                }`}
              >
                3-Way Waste Sorter
              </button>
              <button
                onClick={() => setActiveInteractiveTab('rwh_calc')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeInteractiveTab === 'rwh_calc'
                    ? 'bg-white text-[#143628] shadow-xs'
                    : 'text-[#5C6E61] hover:text-[#143628]'
                }`}
              >
                Rainwater &amp; Aquifer Calculator
              </button>
            </div>
          </div>

          {activeInteractiveTab === 'sorting_lab' ? (
            <WasteSortingLab onEarnPoints={onEarnPoints} />
          ) : (
            <RainwaterCalculator />
          )}
        </section>

        {/* 3. Filterable Courses Catalog */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#143628]">
                Accredited Environmental Curriculum
              </h2>
              <p className="text-xs text-[#526357] mt-0.5">
                Curated micro-modules designed to be completed in under 20 minutes
              </p>
            </div>

            {/* Search and Level Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7B8D80]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules, acts, skills..."
                  className="pl-9 pr-3 py-2 bg-white border border-[#DCD6C7] rounded-xl text-xs text-[#143628] placeholder-[#7B8D80] focus:outline-[#2A6546] w-56 sm:w-64"
                />
              </div>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 bg-white border border-[#DCD6C7] rounded-xl text-xs text-[#143628] font-semibold focus:outline-[#2A6546] cursor-pointer"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E4B35] text-white shadow-xs'
                      : 'bg-white text-[#526357] hover:text-[#1E4B35] border border-[#DDD7C9]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredCourses.map((course) => {
              const totalLessons = course.modules.flatMap(m => m.lessons);
              const completedCount = totalLessons.filter(l => completedLessonIds.includes(l.id)).length;
              const percent = Math.round((completedCount / (totalLessons.length || 1)) * 100);

              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="bg-white border border-[#DDD7C9] hover:border-[#1E4B35] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Card Media Banner */}
                  <div className="relative h-44 w-full bg-[#E5DFD3] overflow-hidden">
                    <img 
                      src={course.bannerUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Unboxed Editorial Metadata over media */}
                    <div className="absolute bottom-3 left-3 text-white text-xs font-medium space-x-1.5 drop-shadow-sm">
                      <span className="font-bold">{course.level}</span>
                      <span>·</span>
                      <span>{course.durationMin} mins</span>
                      <span>·</span>
                      <span>SDG {course.sdgGoals.join(', ')}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-xs text-[#143628] rounded-lg text-xs font-bold">
                      +{course.points} pts
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs text-[#5C6E61] font-medium mb-1">
                        {course.modules.length} modules · {totalLessons.length} micro-lessons
                      </div>

                      <h3 className="text-base font-bold text-[#143628] leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-xs text-[#526357] mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] text-[#526357]">
                        {course.skillTags.map((t, idx) => (
                          <span key={t} className="bg-[#F3EFE6] px-2 py-0.5 rounded-md border border-[#E2DBD0]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar & Launch Link */}
                    <div className="pt-3 hairline-t space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#526357]">
                        <span>Progress</span>
                        <span className="font-bold text-[#1E4B35]">{percent}%</span>
                      </div>
                      <div className="w-full bg-[#EAE6DC] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#2D6A4F] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs font-bold text-[#1E4B35]">
                        <span>{percent > 0 ? 'Resume Lesson' : 'Start Course'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Split Section: Field Missions & Community Masterclasses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Field Missions (7 Cols) */}
          <section className="lg:col-span-7 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#143628]">
                Civic Field Missions in {selectedWard}
              </h2>
              <p className="text-xs text-[#526357] mt-0.5">
                Practical audits with satellite GPS and photo verification
              </p>
            </div>

            <div className="space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => onSelectMission(mission.id)}
                  className="p-5 rounded-3xl bg-white border border-[#DDD7C9] hover:border-[#1E4B35] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="text-xs text-[#5C6E61] font-semibold space-x-1.5">
                      <span className="uppercase text-[#2D6A4F]">{mission.category}</span>
                      <span>·</span>
                      <span>{mission.durationMin} mins</span>
                      <span>·</span>
                      <span>GPS Required</span>
                    </div>

                    <h3 className="text-sm font-bold text-[#143628]">
                      {mission.title}
                    </h3>
                    
                    <p className="text-xs text-[#526357] line-clamp-2 leading-relaxed">
                      {mission.shortDesc}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 hairline-t sm:border-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#9E4A28]">+{mission.points} pts</div>
                      <div className="text-[10px] text-[#6E7E72]">Unlocks Badge</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMission(mission.id);
                      }}
                      className="px-4 py-2 bg-[#1E4B35] hover:bg-[#153827] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Deploy Mission →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NGO Field Masterclasses (5 Cols) */}
          <section className="lg:col-span-5 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#143628]">
                NGO Partner Masterclasses
              </h2>
              <p className="text-xs text-[#526357] mt-0.5">
                Layer 8 verified civil society partners
              </p>
            </div>

            <div className="space-y-3">
              {workshops.map((ws) => (
                <div 
                  key={ws.id}
                  className="p-4 rounded-3xl bg-white border border-[#DDD7C9] space-y-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={ws.instructor.avatar} 
                      alt={ws.instructor.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#DDD7C9]" 
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#143628]">{ws.title}</h4>
                      <div className="text-[11px] text-[#5C6E61]">
                        {ws.instructor.name} · {ws.partnerNgo}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#5C6E61] flex items-center justify-between">
                    <span>{ws.date}</span>
                    <span className="font-semibold text-[#1E4B35]">{ws.ward}</span>
                  </div>

                  <div className="pt-2 hairline-t flex items-center justify-between">
                    <span className="text-[11px] text-[#6E7E72]">
                      {ws.registeredCount} / {ws.maxSeats} seats reserved
                    </span>
                    <button
                      onClick={() => onRsvpWorkshop(ws.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        ws.isRegistered
                          ? 'bg-[#EAF3EC] text-[#1E4B35] border border-[#A4CFB1]'
                          : 'bg-[#1E4B35] hover:bg-[#153827] text-white'
                      }`}
                    >
                      {ws.isRegistered ? '✓ Seat Reserved' : 'Reserve Free Seat'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
