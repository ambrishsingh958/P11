import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Award, 
  Share2, 
  Download, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  Leaf, 
  Droplet, 
  Scale, 
  Recycle, 
  Check, 
  Printer,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge, Certificate } from '../../data/layer11Data';

interface WebImpactCertificateViewProps {
  certificate: Certificate;
  badges: Badge[];
  userPoints: number;
  wardName: string;
  onBack: () => void;
}

export const WebImpactCertificateView: React.FC<WebImpactCertificateViewProps> = ({
  certificate,
  badges,
  userPoints,
  wardName,
  onBack,
}) => {
  const [recipientName, setRecipientName] = useState(certificate.recipientName);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Check out my verified PrajaPulse Civic Environmental Marshal Certificate: ${certificate.certificateNumber}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    window.print();
  };

  return (
    <div className="w-full min-h-full bg-slate-900 text-slate-100 flex flex-col print:bg-white print:text-black">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span>Impact Ledger</span>
            <span>/</span>
            <span className="text-white font-semibold">Citizen Credentials &amp; Verification</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Credential'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Impact Portal */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-10 flex-1">
        
        {/* Real-Time Citizen Impact Ticker (Desktop 4 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-md">
            <div className="text-2xl font-black text-emerald-400">12.5 hrs</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-1">Verified Training</div>
            <div className="text-[11px] text-slate-500 mt-0.5">SWM Rules 2016 + Water Act</div>
          </div>
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-md">
            <div className="text-2xl font-black text-teal-400">48.2 kg</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-1">CO2 Emissions Avoided</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Through 3-bin segregation audits</div>
          </div>
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-md">
            <div className="text-2xl font-black text-amber-400">{userPoints} pts</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-1">Eco-Points Earned</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Ranked #4 in {wardName}</div>
          </div>
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-md">
            <div className="text-2xl font-black text-purple-400">3 Badges</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-1">Unlocked Tiers</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Silver Marshal Standing</div>
          </div>
        </div>

        {/* Official Certificate Card (Printable & High-Fidelity) */}
        <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border-4 border-amber-300 shadow-2xl relative overflow-hidden max-w-4xl mx-auto print:shadow-none print:border-2 print:m-0 print:p-8">
          
          {/* Subtle Watermark */}
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none"></div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b-2 border-amber-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-lg mb-2">
              PP
            </div>
            <h2 className="text-xs font-black tracking-widest uppercase text-emerald-900">
              PRAJA PULSE CIVIC GOVERNANCE ACADEMY
            </h2>
            <div className="text-sm font-semibold text-slate-500 mt-0.5">
              Certificate of Environmental Competence &amp; Civic Field Leadership
            </div>
          </div>

          {/* Body */}
          <div className="py-8 text-center space-y-3">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              This credential certifies that
            </p>

            <div className="flex items-center justify-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="text-2xl sm:text-3xl font-black text-slate-900 border-b-2 border-emerald-600 focus:outline-none text-center px-2"
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="group flex items-center gap-2 cursor-pointer hover:opacity-80"
                  title="Click to customize recipient name"
                >
                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {recipientName}
                  </h1>
                  <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 print:hidden" />
                </div>
              )}
            </div>

            <div className="text-base sm:text-lg font-bold text-emerald-800">
              {certificate.title}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
              Having successfully completed the accredited coursework on <strong>Municipal Solid Waste Rules 2016</strong>, <strong>Rooftop Rainwater Harvesting</strong>, and demonstrated verified field auditing competence in <strong>{wardName}</strong>.
            </p>
          </div>

          {/* Verified Competencies */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              Verified Legal &amp; Field Competencies
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {certificate.skillsVerified.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Signature & Verification QR */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <div className="text-[11px] font-mono text-slate-500">
                Cert No: <strong>{certificate.certificateNumber}</strong>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                SHA-256 Hash: {certificate.verificationHash}
              </div>
              <div className="text-xs font-bold text-slate-700">
                Issued on {certificate.issueDate}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900">{certificate.signatory.split(',')[0]}</div>
                <div className="text-[10px] text-slate-500">{certificate.signatory.split(',')[1]}</div>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
            </div>
          </div>

        </div>

        {/* Badges Showcase Grid */}
        <section className="space-y-4 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Civic Eco-Marshal Badges</h3>
              <p className="text-xs text-slate-400">Awarded for active neighborhood audits &amp; high quiz scores</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b) => {
              const isUnlocked = !!b.unlockedAt || userPoints >= b.pointsRequired;
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isUnlocked
                      ? 'bg-slate-950/80 border-slate-800 shadow-md'
                      : 'bg-slate-950/30 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-600'
                    }`}>
                      {b.id.includes('waste') ? (
                        <Recycle className="w-5 h-5" />
                      ) : b.id.includes('water') ? (
                        <Droplet className="w-5 h-5" />
                      ) : b.id.includes('advocate') ? (
                        <Scale className="w-5 h-5" />
                      ) : (
                        <Leaf className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isUnlocked ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {b.tier}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-3">{b.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{b.description}</p>
                  
                  <div className="mt-3 text-xs font-bold">
                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked &amp; Verified
                      </span>
                    ) : (
                      <span className="text-slate-500">Requires {b.pointsRequired} pts</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
