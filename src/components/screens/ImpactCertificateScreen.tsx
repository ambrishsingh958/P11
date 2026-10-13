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
  ExternalLink,
  Flame,
  Leaf,
  Droplet,
  Scale,
  Recycle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge, Certificate } from '../../data/layer11Data';

interface ImpactCertificateScreenProps {
  certificate: Certificate;
  badges: Badge[];
  userPoints: number;
  wardName: string;
  onBack: () => void;
}

export const ImpactCertificateScreen: React.FC<ImpactCertificateScreenProps> = ({
  certificate,
  badges,
  userPoints,
  wardName,
  onBack,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Check out my verified PrajaPulse Civic Environmental Marshal Certificate: ${certificate.certificateNumber}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 pb-28">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xs font-bold text-slate-900">
            Citizen Eco-Portfolio &amp; Credentials
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Impact Stats Dashboard */}
      <section className="px-4 pt-4">
        <div className="p-4 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
              Verified Civic Environmental Ledger
            </span>
            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {userPoints} Points
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-emerald-800">
            <div className="bg-white/10 rounded-xl p-2">
              <div className="text-base font-extrabold text-white">12.5</div>
              <div className="text-[9px] text-teal-200 uppercase mt-0.5">Hours Trained</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <div className="text-base font-extrabold text-white">48.2</div>
              <div className="text-[9px] text-teal-200 uppercase mt-0.5">Kg CO2 Offset</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <div className="text-base font-extrabold text-white">3</div>
              <div className="text-[9px] text-teal-200 uppercase mt-0.5">Field Audits</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <div className="text-base font-extrabold text-amber-400">#4</div>
              <div className="text-[9px] text-teal-200 uppercase mt-0.5">{wardName.split(' ')[0]} Rank</div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Certificate Card Preview */}
      <section className="px-4 mt-5">
        <div className="bg-white rounded-2xl border-2 border-amber-300/80 p-5 shadow-sm relative overflow-hidden print:m-0 print:border-none print:shadow-none">
          {/* Subtle Watermark Badge */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-100/50 rounded-full blur-xl pointer-events-none"></div>

          {/* Header of Certificate */}
          <div className="text-center pb-3 border-b border-amber-100">
            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs mb-1.5">
              PP
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-900">
              PrajaPulse Civic Governance Academy
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              Certificate of Environmental Competence &amp; Citizen Action
            </div>
          </div>

          {/* Certificate Body */}
          <div className="py-4 text-center">
            <p className="text-[11px] text-slate-500">This is proudly presented to</p>
            <h2 className="text-base font-extrabold text-slate-900 mt-0.5 tracking-tight">
              {certificate.recipientName}
            </h2>
            <div className="text-xs font-bold text-emerald-800 mt-1">
              {certificate.title}
            </div>

            <p className="text-[10px] text-slate-600 mt-2 px-2 leading-relaxed">
              For demonstrating verifiable proficiency in Municipal Solid Waste Rules 2016, Rooftop Rainwater Harvesting calculations, and conducting certified ground audits in {wardName}.
            </p>
          </div>

          {/* Verified Skills Pill */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
              Verified Competencies
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {certificate.skillsVerified.slice(0, 4).map((skill, idx) => (
                <span 
                  key={idx}
                  className="text-[9px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Certificate Footer with Hash & QR Code */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[9px] text-slate-400 font-mono">ID: {certificate.certificateNumber}</div>
              <div className="text-[9px] text-slate-400 font-mono">Hash: {certificate.verificationHash.slice(0, 16)}...</div>
              <div className="text-[10px] font-semibold text-slate-800 mt-0.5">{certificate.issueDate}</div>
            </div>

            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
              <QrCode className="w-8 h-8 text-slate-800" />
            </div>
          </div>
        </div>

        {/* Action Button: Download PDF */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF'}</span>
          </button>
        </div>
      </section>

      {/* Unlocked Badges Section */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Civic Badges &amp; Tiers ({badges.filter(b => b.unlockedAt).length}/{badges.length})
          </h3>
          <span className="text-[11px] text-emerald-700 font-semibold">Tier: Silver Marshal</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((badge) => {
            const isUnlocked = !!badge.unlockedAt || userPoints >= badge.pointsRequired;
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : 'bg-slate-100/70 border-slate-200/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                    isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {badge.id.includes('waste') ? (
                      <Recycle className="w-4 h-4" />
                    ) : badge.id.includes('water') ? (
                      <Droplet className="w-4 h-4" />
                    ) : badge.id.includes('advocate') ? (
                      <Scale className="w-4 h-4" />
                    ) : (
                      <Leaf className="w-4 h-4" />
                    )}
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isUnlocked ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {badge.tier}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                  {badge.description}
                </p>

                <div className="mt-2 text-[10px] font-semibold text-slate-400">
                  {isUnlocked ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span>Requires {badge.pointsRequired} pts</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
