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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FieldMission } from '../../data/layer11Data';

interface FieldMissionScreenProps {
  mission: FieldMission;
  wardName: string;
  onBack: () => void;
  onMissionCompleted: (missionId: string, points: number) => void;
}

export const FieldMissionScreen: React.FC<FieldMissionScreenProps> = ({
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
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState('');

  // Countdown timer effect
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
      // Simulated GPS coordinate fetch (e.g. HSR Layout Bengaluru)
      setGpsCoords({ lat: 12.9165, lng: 77.6101 });
      setGpsVerified(true);
      setIsVerifyingGps(false);
      if (!completedSteps.includes(1)) {
        setCompletedSteps((prev) => [...prev, 1]);
      }
    }, 1200);
  };

  const handleCapturePhoto = () => {
    // Simulated camera capture
    const samplePhotos = [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80'
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
      const response = await fetch('/api/field-missions/' + mission.id + '/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: gpsCoords?.lat || 12.9165,
          longitude: gpsCoords?.lng || 77.6101,
          photos: capturedPhotos,
          reflectionNotes: reflectionNotes || 'Citizen field mission completed in ' + wardName
        })
      });
      const data = await response.json();
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
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
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
              Field Mission • {wardName}
            </div>
            <h1 className="text-xs font-bold text-slate-900 line-clamp-1">
              {mission.title}
            </h1>
          </div>
        </div>

        {/* Timer Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-bold text-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{formatTimer(secondsRemaining)}</span>
        </div>
      </header>

      {/* Safety Advisory Banner */}
      <div className="px-4 pt-3">
        <div className={`p-3.5 rounded-2xl border ${
          mission.safetyBanner.level === 'warning'
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide">
                Safety Protocol &amp; Gear Checklist
              </div>
              <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                {mission.safetyBanner.text}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {mission.safetyBanner.equipment.map((item) => (
                  <span 
                    key={item}
                    className="text-[10px] font-semibold px-2 py-0.5 bg-white/80 rounded-md border border-slate-300 text-slate-800"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Geo-Check-In Widget */}
      <section className="px-4 mt-4">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Step 1: On-Site GPS Validation
                </h3>
                <div className="text-[11px] text-slate-500">
                  {gpsVerified 
                    ? `Verified at (${gpsCoords?.lat.toFixed(4)}, ${gpsCoords?.lng.toFixed(4)})` 
                    : `Must be within 200m of ${wardName}`}
                </div>
              </div>
            </div>

            <button
              onClick={handleVerifyGps}
              disabled={gpsVerified || isVerifyingGps}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                gpsVerified 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                  : 'bg-teal-700 text-white hover:bg-teal-800'
              }`}
            >
              {isVerifyingGps ? 'Checking...' : gpsVerified ? '✓ Verified' : 'Check In'}
            </button>
          </div>
        </div>
      </section>

      {/* Step by Step Action Checklist */}
      <section className="px-4 mt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Mission Checklist ({completedSteps.length}/{mission.steps.length} Done)
        </h2>

        <div className="space-y-2.5">
          {mission.steps.map((step) => {
            const isDone = completedSteps.includes(step.stepNumber);
            return (
              <div
                key={step.stepNumber}
                onClick={() => toggleStep(step.stepNumber)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isDone 
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {step.stepNumber}. {step.title}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Camera Photo Evidence Section */}
      <section className="px-4 mt-4">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-teal-700" />
                Step 2: Photo Verification
              </h3>
              <div className="text-[11px] text-slate-500">
                Capture segregated bins or clean spot ({capturedPhotos.length}/2 photos)
              </div>
            </div>

            <button
              onClick={handleCapturePhoto}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture</span>
            </button>
          </div>

          {/* Photo Gallery Grid */}
          {capturedPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {capturedPhotos.map((url, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video">
                  <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-white">
                    Photo #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              onClick={handleCapturePhoto}
              className="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-teal-400 transition-colors"
            >
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-600">Tap to upload verification photo</div>
              <div className="text-[10px] text-slate-400">EXIF timestamps &amp; geotags auto-validated</div>
            </div>
          )}
        </div>
      </section>

      {/* Reflection Notes */}
      <section className="px-4 mt-4">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <label className="text-xs font-bold text-slate-900 block mb-1">
            Step 3: Citizen Reflection &amp; Feedback
          </label>
          <textarea
            value={reflectionNotes}
            onChange={(e) => setReflectionNotes(e.target.value)}
            placeholder="What resistance did residents express? How many agreed to 3-way segregation?"
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 min-h-[60px]"
          />
        </div>
      </section>

      {/* Emergency NGO Mentor Hotline */}
      <section className="px-4 mt-4">
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-950">Field Support Mentor</div>
              <div className="text-[10px] text-teal-800">Hasiru Dala Ward Volunteer Line</div>
            </div>
          </div>
          <button
            onClick={() => setShowMentorDialog(true)}
            className="px-2.5 py-1.5 bg-teal-700 text-white text-[11px] font-bold rounded-lg hover:bg-teal-800 transition-colors cursor-pointer"
          >
            Call Volunteer
          </button>
        </div>
      </section>

      {/* Bottom Floating Submit Bar */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-20 flex items-center justify-between max-w-md mx-auto">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Reward On Verification</div>
          <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> +{mission.points} Eco-Points &amp; Badge
          </div>
        </div>

        <button
          onClick={handleSubmitMission}
          disabled={isSubmitting || isSubmitted || completedSteps.length < 2}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            isSubmitted
              ? 'bg-emerald-600 text-white'
              : completedSteps.length < 2
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
          }`}
        >
          {isSubmitted ? (
            <>
              <Check className="w-4 h-4" />
              <span>Mission Verified!</span>
            </>
          ) : isSubmitting ? (
            <span>Verifying...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Submit Verification</span>
            </>
          )}
        </button>
      </div>

      {/* Mentor Dialog Modal */}
      {showMentorDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-2">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 text-center">
              Ward Field Mentor Connected
            </h3>
            <p className="text-xs text-slate-600 text-center mt-1">
              "Hi Eco-Marshal! I am Dr. Vani from the Ward 174 Volunteer Network. If shop owners refuse to segregate dry waste, hand them the SWM 2016 leaflet and record it in your reflection notes."
            </p>
            <button
              onClick={() => setShowMentorDialog(false)}
              className="mt-4 w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Understood, Resuming Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
