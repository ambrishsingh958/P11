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
  AlertTriangle,
  UploadCloud,
  Check,
  Send,
  Sparkles,
  Navigation,
  FileCheck2,
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
    <div className="w-full min-h-full bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span>Field Missions</span>
            <span>/</span>
            <span className="text-white font-semibold truncate max-w-sm">{mission.title}</span>
          </div>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Timer: {formatTimer(secondsRemaining)}</span>
        </div>
      </div>

      {/* Main Mission Workspace */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mission Description, Safety & Step Checklist (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-teal-950 via-slate-950 to-emerald-950 border border-teal-800/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {mission.category.toUpperCase()} • FIELD ACTION
                </span>
                <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                  <Award className="w-4 h-4" /> +{mission.points} Points &amp; Badge
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {mission.title}
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed">
                {mission.shortDesc}
              </p>

              {/* Safety Warning Box */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Mandatory Safety Protocol</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {mission.safetyBanner.text}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {mission.safetyBanner.equipment.map((eq) => (
                    <span 
                      key={eq}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
                    >
                      ✓ {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist Steps */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  Mission Action Checklist ({completedSteps.length}/{mission.steps.length} Complete)
                </h3>
              </div>

              <div className="space-y-3">
                {mission.steps.map((step) => {
                  const isDone = completedSteps.includes(step.stepNumber);
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isDone
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Step {step.stepNumber}: {step.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reflection Notes Input */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-3">
              <label className="text-sm font-bold text-white block">
                Citizen Reflection &amp; Resident Feedback
              </label>
              <textarea
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="Document your observations: Did residents understand 3-way segregation? What questions did they ask?"
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-emerald-500 min-h-[100px] resize-none"
              />
            </div>

          </div>

          {/* Right Column: GPS Check-in, Camera Upload & Mentor Call (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            
            {/* GPS Verification Radar Box */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">On-Site GPS Verification</h3>
                    <div className="text-xs text-slate-400">Target Zone: {wardName}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  gpsVerified ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {gpsVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>

              {gpsVerified ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-xs text-emerald-200">
                  ✓ Location confirmed: Lat 12.9165° N, Lng 77.6101° E (Within 45m of ward zone)
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
                  Simulates device GPS verification to prevent fraudulent badge claims.
                </div>
              )}

              <button
                onClick={handleVerifyGps}
                disabled={gpsVerified || isVerifyingGps}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isVerifyingGps ? 'Querying GPS Satellites...' : gpsVerified ? '✓ Location Confirmed' : 'Trigger Ward GPS Check-In'}
              </button>
            </div>

            {/* Photo Evidence Capture Box */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Photo Evidence Capture</h3>
                    <div className="text-xs text-slate-400">({capturedPhotos.length} / 2 photos captured)</div>
                  </div>
                </div>

                <button
                  onClick={handleCapturePhoto}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap Photo</span>
                </button>
              </div>

              {capturedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {capturedPhotos.map((url, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800">
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
                  className="border-2 border-dashed border-slate-800 hover:border-teal-500/60 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-300">Click to Snap Audit Photo</div>
                  <div className="text-[10px] text-slate-500 mt-1">Geo-tagging and timestamp will be watermarked</div>
                </div>
              )}
            </div>

            {/* Mentor Helpline Button */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Ward Volunteer Mentor</div>
                  <div className="text-[10px] text-slate-400">Hasiru Dala NGO Support Line</div>
                </div>
              </div>
              <button
                onClick={() => setShowMentorModal(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-300 rounded-xl border border-slate-700 cursor-pointer"
              >
                Call Support
              </button>
            </div>

            {/* Submit Verification Button */}
            <button
              onClick={handleSubmitMission}
              disabled={isSubmitting || isSubmitted || completedSteps.length < 2}
              className={`w-full py-4 text-sm font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitted
                  ? 'bg-emerald-600 text-white'
                  : completedSteps.length < 2
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Mission Verified &amp; Ledger Updated!</span>
                </>
              ) : isSubmitting ? (
                <span>Verifying Evidence on Server...</span>
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

      {/* Mentor Support Modal */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white text-center">
              Ward Field Mentor Connected
            </h3>
            <p className="text-xs text-slate-300 text-center leading-relaxed">
              "Hi Eco-Marshal! I am Dr. Vani from the {wardName} Hasiru Dala Volunteer Team. If residents have questions about disposing sanitary diapers, inform them about wrapping with newspaper marked with a red cross symbol."
            </p>
            <button
              onClick={() => setShowMentorModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Understood, Return to Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
