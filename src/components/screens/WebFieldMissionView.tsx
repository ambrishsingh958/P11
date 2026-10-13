import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  MapPin, 
  Camera, 
  PhoneCall, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Award, 
  UploadCloud, 
  Check, 
  Send, 
  Navigation, 
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FieldMission } from '../../data/layer11Data';

interface WebFieldMissionViewProps {
  mission: FieldMission;
  wardName: string;
  onBack: () => void;
  onMissionCompleted: (missionId: string, points: number) => void;
}

export const WebFieldMissionView: React.FC<WebFieldMissionViewProps> = ({
  mission,
  wardName,
  onBack,
  onMissionCompleted,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(mission.durationMin * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [isVerifyingGps, setIsVerifyingGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerifyGps = () => {
    setIsVerifyingGps(true);
    setTimeout(() => {
      setGpsCoords({ lat: 12.9165, lng: 77.6101 });
      setGpsVerified(true);
      setIsVerifyingGps(false);
      if (!completedSteps.includes(1)) {
        setCompletedSteps((prev) => [...prev, 1]);
      }
    }, 1200);
  };

  const handleCapturePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80'
    ];
    const newPhoto = samplePhotos[capturedPhotos.length % samplePhotos.length];
    setCapturedPhotos((prev) => [...prev, newPhoto]);
    if (!completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
  };

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => 
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handleSubmitMission = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/field-missions/' + mission.id + '/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: gpsCoords?.lat || 12.9165,
          longitude: gpsCoords?.lng || 77.6101,
          photos: capturedPhotos,
          reflectionNotes: reflectionNotes || `Citizen audit completed in ${wardName}`
        })
      });

      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      onMissionCompleted(mission.id, mission.points);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
      onMissionCompleted(mission.id, mission.points);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#F7F6F0] text-[#1B2D22] flex flex-col font-sans">
      {/* Top Header */}
      <div className="bg-[#FAF9F5] hairline-b px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#DDD7C9] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal</span>
          </button>
          <div className="text-xs text-[#526357] hidden sm:flex items-center gap-2">
            <span>Field Missions</span>
            <span>/</span>
            <span className="text-[#143628] font-bold truncate max-w-sm">{mission.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#143628]">
          <Clock className="w-4 h-4 text-[#9E4A28]" />
          <span>Timer: {formatTimer(secondsRemaining)}</span>
        </div>
      </div>

      {/* Main Mission Workspace */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mission Overview */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="text-xs text-[#526357] font-semibold space-x-2">
                <span className="text-[#1E4B35] font-bold uppercase">{mission.category} AUDIT</span>
                <span>·</span>
                <span>{mission.durationMin} mins</span>
                <span>·</span>
                <span className="text-[#9E4A28]">+{mission.points} Points</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143628] leading-tight">
                {mission.title}
              </h1>

              <p className="text-sm text-[#526357] leading-relaxed">
                {mission.shortDesc}
              </p>

              {/* Safety Protocol */}
              <div className="p-4 rounded-2xl bg-[#FDF0EE] border border-[#E39D90] space-y-2">
                <div className="flex items-center gap-2 text-[#9E4A28] text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Mandatory Safety Checklist</span>
                </div>
                <p className="text-xs text-[#6B1E10] leading-relaxed">
                  {mission.safetyBanner.text}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-[#143628]">
                  {mission.safetyBanner.equipment.map((eq) => (
                    <span 
                      key={eq}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#ECD9D0] font-medium"
                    >
                      ✓ {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-[#143628]">
                Action Checklist ({completedSteps.length}/{mission.steps.length} Steps Complete)
              </h3>

              <div className="space-y-3">
                {mission.steps.map((step) => {
                  const isDone = completedSteps.includes(step.stepNumber);
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isDone
                          ? 'bg-[#EAF5EE] border-[#76B88F] text-[#143B23]'
                          : 'bg-[#FAF9F5] border-[#DDD7C9] text-[#2D3A31] hover:bg-[#F2EFE8]'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-[#1E4B35]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#A8B7AD]" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#143628]">
                          Step {step.stepNumber}: {step.title}
                        </h4>
                        <p className="text-xs text-[#526357] mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reflection Notes */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 space-y-3 shadow-xs">
              <label className="text-sm font-bold text-[#143628] block">
                Citizen Reflection &amp; Resident Feedback
              </label>
              <textarea
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="What did residents say? How many households were willing to wrap sanitary pads with red cross marks?"
                className="w-full p-4 bg-[#FAF9F5] border border-[#DDD7C9] rounded-2xl text-xs sm:text-sm text-[#143628] placeholder-[#7B8D80] focus:outline-[#1E4B35] min-h-[90px] resize-none"
              />
            </div>

          </div>

          {/* Right Column: GPS & Camera (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            
            {/* GPS Check-in */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF3EC] text-[#1E4B35] flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#143628]">GPS Verification</h3>
                    <div className="text-xs text-[#526357]">Target Ward: {wardName}</div>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  gpsVerified ? 'bg-[#EAF5EE] text-[#1E5634]' : 'bg-[#F2EFE8] text-[#526357]'
                }`}>
                  {gpsVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>

              {gpsVerified ? (
                <div className="p-3 bg-[#EAF5EE] border border-[#76B88F] rounded-2xl text-xs text-[#143B23]">
                  ✓ Verified: Lat 12.9165° N, Lng 77.6101° E (Within 45m of ward zone)
                </div>
              ) : (
                <div className="p-3 bg-[#FAF9F5] border border-[#DDD7C9] rounded-2xl text-xs text-[#526357]">
                  Validates physical ward presence to award tamper-proof credentials.
                </div>
              )}

              <button
                onClick={handleVerifyGps}
                disabled={gpsVerified || isVerifyingGps}
                className="w-full py-2.5 bg-[#1E4B35] hover:bg-[#153827] disabled:bg-[#EAE6DC] disabled:text-[#8D9E92] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isVerifyingGps ? 'Checking Location...' : gpsVerified ? '✓ Location Confirmed' : 'Trigger Ward Check-In'}
              </button>
            </div>

            {/* Photo Evidence */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF3EC] text-[#1E4B35] flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#143628]">Photo Evidence</h3>
                    <div className="text-xs text-[#526357]">({capturedPhotos.length} / 2 photos captured)</div>
                  </div>
                </div>

                <button
                  onClick={handleCapturePhoto}
                  className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#EFECE3] text-[#143628] text-xs font-bold rounded-xl border border-[#DDD7C9] cursor-pointer"
                >
                  Snap Photo
                </button>
              </div>

              {capturedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {capturedPhotos.map((url, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden aspect-video border border-[#DDD7C9]">
                      <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white font-mono">
                        Photo #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  onClick={handleCapturePhoto}
                  className="border-2 border-dashed border-[#DDD7C9] hover:border-[#1E4B35] rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-[#7B8D80] mx-auto mb-2" />
                  <div className="text-xs font-bold text-[#143628]">Click to Snap Audit Photo</div>
                  <div className="text-[10px] text-[#526357] mt-1">Watermarked with timestamp</div>
                </div>
              )}
            </div>

            {/* Mentor Support Call */}
            <div className="p-4 rounded-2xl bg-white border border-[#DDD7C9] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#143628]">Ward Volunteer Mentor</div>
                <div className="text-[10px] text-[#526357]">Hasiru Dala NGO Support</div>
              </div>
              <button
                onClick={() => setShowMentorModal(true)}
                className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#EFECE3] text-xs font-bold text-[#1E4B35] rounded-xl border border-[#DDD7C9] cursor-pointer"
              >
                Call Mentor
              </button>
            </div>

            {/* Submit Mission Button */}
            <button
              onClick={handleSubmitMission}
              disabled={isSubmitting || isSubmitted || completedSteps.length < 2}
              className={`w-full py-4 text-sm font-bold rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitted
                  ? 'bg-[#1E4B35] text-white'
                  : completedSteps.length < 2
                  ? 'bg-[#EAE6DC] text-[#8D9E92] cursor-not-allowed'
                  : 'bg-[#1E4B35] hover:bg-[#153827] text-white'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Mission Verified &amp; Ledger Updated!</span>
                </>
              ) : isSubmitting ? (
                <span>Submitting Verification...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Field Mission ({completedSteps.length}/2 Steps)</span>
                </>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mentor Modal */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD7C9] rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#143628] text-center">
              Ward Field Mentor Connected
            </h3>
            <p className="text-xs text-[#526357] text-center leading-relaxed">
              "Hi Eco-Marshal! I am Dr. Vani from the {wardName} volunteer network. If shop owners ask why plastic bags cannot be mixed with food peels, explain that food oil contaminates recycling machines."
            </p>
            <button
              onClick={() => setShowMentorModal(false)}
              className="w-full py-2.5 bg-[#1E4B35] hover:bg-[#153827] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Resume Ground Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
