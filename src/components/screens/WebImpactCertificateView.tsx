import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Award, 
  Share2, 
  QrCode, 
  CheckCircle2, 
  Printer, 
  Edit3, 
  Check, 
  Recycle, 
  Droplet, 
  Scale, 
  Leaf 
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
    <div className="w-full min-h-full bg-[#F7F6F0] text-[#1B2D22] flex flex-col font-sans print:bg-white print:text-black">
      {/* Top Header */}
      <div className="bg-[#FAF9F5] hairline-b px-6 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#DDD7C9] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal</span>
          </button>
          <div className="text-xs text-[#526357] hidden sm:flex items-center gap-2">
            <span>Impact Ledger</span>
            <span>/</span>
            <span className="text-[#143628] font-bold">Citizen Credentials &amp; Verification</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] text-xs font-semibold flex items-center gap-1.5 border border-[#DDD7C9] transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#1E4B35]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-[#1E4B35] hover:bg-[#153827] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Impact Portal */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-10 flex-1">
        
        {/* Real-Time Citizen Impact Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          <div className="p-5 rounded-3xl bg-white border border-[#DDD7C9] shadow-xs">
            <div className="text-2xl font-black text-[#1E4B35] tabular-nums">12.5 hrs</div>
            <div className="text-xs font-bold text-[#526357] uppercase mt-1">Verified Training</div>
            <div className="text-[11px] text-[#718779] mt-0.5">SWM Rules 2016 &amp; Water Act</div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#DDD7C9] shadow-xs">
            <div className="text-2xl font-black text-[#1C5D82] tabular-nums">48.2 kg</div>
            <div className="text-xs font-bold text-[#526357] uppercase mt-1">CO2 Emissions Avoided</div>
            <div className="text-[11px] text-[#718779] mt-0.5">Via 3-way segregation audits</div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#DDD7C9] shadow-xs">
            <div className="text-2xl font-black text-[#9E4A28] tabular-nums">{userPoints} pts</div>
            <div className="text-xs font-bold text-[#526357] uppercase mt-1">Eco-Points Earned</div>
            <div className="text-[11px] text-[#718779] mt-0.5">Ranked #4 in {wardName}</div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-[#DDD7C9] shadow-xs">
            <div className="text-2xl font-black text-[#143628] tabular-nums">3 Badges</div>
            <div className="text-xs font-bold text-[#526357] uppercase mt-1">Unlocked Tiers</div>
            <div className="text-[11px] text-[#718779] mt-0.5">Silver Marshal Standing</div>
          </div>
        </div>

        {/* Printable Official Certificate (Parchment Aesthetic) */}
        <div className="bg-[#FFFEFC] text-[#1B2D22] rounded-3xl p-8 sm:p-14 border-4 border-[#DCD6C7] shadow-lg relative overflow-hidden max-w-4xl mx-auto print:shadow-none print:border-2 print:m-0 print:p-8">
          
          {/* Certificate Header */}
          <div className="text-center pb-6 hairline-b">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1E4B35] text-white flex items-center justify-center font-black text-xl shadow-xs mb-2">
              PP
            </div>
            <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#1E4B35]">
              PRAJA PULSE CIVIC GOVERNANCE ACADEMY
            </h2>
            <div className="text-sm font-semibold text-[#526357] mt-0.5">
              Certificate of Environmental Competence &amp; Civic Field Leadership
            </div>
          </div>

          {/* Certificate Body */}
          <div className="py-8 text-center space-y-3">
            <p className="text-xs uppercase tracking-wider text-[#526357] font-bold">
              This credential certifies that
            </p>

            <div className="flex items-center justify-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="text-2xl sm:text-3xl font-black text-[#143628] border-b-2 border-[#1E4B35] focus:outline-none text-center px-2"
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 rounded bg-[#EAF3EC] text-[#1E4B35] text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="group flex items-center gap-2 cursor-pointer"
                  title="Click to customize recipient name"
                >
                  <h1 className="text-2xl sm:text-4xl font-black text-[#143628] tracking-tight">
                    {recipientName}
                  </h1>
                  <Edit3 className="w-4 h-4 text-[#7A8E80] group-hover:text-[#1E4B35] print:hidden" />
                </div>
              )}
            </div>

            <div className="text-base sm:text-lg font-bold text-[#1E4B35]">
              {certificate.title}
            </div>

            <p className="text-xs sm:text-sm text-[#526357] max-w-xl mx-auto leading-relaxed pt-2">
              Having successfully demonstrated verified proficiency in <strong>Solid Waste Management Rules 2016</strong>, <strong>Rooftop Rainwater Harvesting</strong>, and conducting certified ground audits in <strong>{wardName}</strong>.
            </p>
          </div>

          {/* Verified Skills */}
          <div className="pt-4 hairline-t">
            <div className="text-[11px] font-bold text-[#526357] uppercase tracking-wider text-center mb-2">
              Verified Legal &amp; Field Competencies
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {certificate.skillsVerified.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#FAF9F5] text-[#143628] text-xs font-semibold border border-[#DDD7C9]"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Signature and Hash */}
          <div className="mt-8 pt-6 hairline-t flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <div className="text-[11px] font-mono text-[#526357]">
                Cert No: <strong>{certificate.certificateNumber}</strong>
              </div>
              <div className="text-[10px] font-mono text-[#718779]">
                SHA-256 Hash: {certificate.verificationHash}
              </div>
              <div className="text-xs font-bold text-[#143628]">
                Issued on {certificate.issueDate}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#143628]">{certificate.signatory.split(',')[0]}</div>
                <div className="text-[10px] text-[#526357]">{certificate.signatory.split(',')[1]}</div>
              </div>
              <div className="p-2 bg-white border border-[#DDD7C9] rounded-2xl shadow-2xs">
                <QrCode className="w-12 h-12 text-[#143628]" />
              </div>
            </div>
          </div>

        </div>

        {/* Badges Section */}
        <section className="space-y-4 print:hidden">
          <div>
            <h3 className="text-lg font-bold text-[#143628]">Civic Eco-Marshal Badges</h3>
            <p className="text-xs text-[#526357]">Earned through verified field audits &amp; high quiz scores</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b) => {
              const isUnlocked = !!b.unlockedAt || userPoints >= b.pointsRequired;
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isUnlocked
                      ? 'bg-white border-[#DDD7C9] shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E8E2D5] opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isUnlocked ? 'bg-[#EAF3EC] text-[#1E4B35]' : 'bg-[#EAE6DC] text-[#7A8E80]'
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
                    <span className="text-[11px] font-bold text-[#526357]">
                      {b.tier}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#143628] mt-3">{b.title}</h4>
                  <p className="text-xs text-[#526357] mt-1 line-clamp-2">{b.description}</p>
                  
                  <div className="mt-3 text-xs font-bold">
                    {isUnlocked ? (
                      <span className="text-[#1E4B35] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked &amp; Verified
                      </span>
                    ) : (
                      <span className="text-[#7A8E80]">Requires {b.pointsRequired} pts</span>
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
