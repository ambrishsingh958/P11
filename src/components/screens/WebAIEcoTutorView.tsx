import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Bot, 
  User, 
  Baby, 
  MapPin, 
  ShieldAlert, 
  ArrowRight, 
  Volume2,
  Trash2,
  Scale,
  Leaf,
  Droplets,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  suggestedActions?: { title: string; target: string; type: string }[];
  isEli10?: boolean;
}

interface WebAIEcoTutorViewProps {
  wardName: string;
  initialQuery?: string;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectMission: (missionId: string) => void;
}

export const WebAIEcoTutorView: React.FC<WebAIEcoTutorViewProps> = ({
  wardName,
  initialQuery,
  onBack,
  onSelectLesson,
  onSelectMission,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'tutor',
      text: `Namaste! I am Prakriti AI, your civic Eco-Tutor for ${wardName}. I am trained on the Solid Waste Management Rules 2016, Tree Preservation Acts, and Rainwater Harvesting bylaws. How can I assist your neighborhood today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { title: 'Learn 3-Bin Rules (2 min)', target: 'les-w-1', type: 'lesson' },
        { title: 'Audit Ward Segregation', target: 'mission-waste-seg', type: 'mission' }
      ]
    }
  ]);

  const [inputText, setInputText] = useState(initialQuery || '');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Kannada' | 'Tamil'>('English');
  const [isEli10, setIsEli10] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How do I segregate sanitary pads under SWM 2016?',
    'What should I do if a contractor is cutting a roadside tree without notice?',
    'How does rooftop rainwater harvesting recharge our borewell?',
    'Explain composting like I am 10 years old',
    'How to report illegal garbage burning in our ward?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle auto-send if initialQuery provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEli10
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          ward: wardName,
          city: 'Bengaluru',
          language: selectedLanguage,
          isEli10
        })
      });

      const data = await response.json();
      const tutorMessage: ChatMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.reply || 'Let us continue taking action for our city!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions
      };
      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err) {
      console.error(err);
      const tutorMessage: ChatMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: `Under Solid Waste Management Rules 2016, wet waste must be handed over daily to municipal tippers for composting, dry waste sent to Dry Waste Collection Centers (DWCC), and sanitary waste securely wrapped with a red cross. Let us protect our ward's environment!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, tutorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Is rooftop rainwater harvesting mandatory for our house size?');
      }, 2000);
    }
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
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
            <span>Prakriti AI Eco-Tutor</span>
            <span>/</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {wardName} Context Active
            </span>
          </div>
        </div>

        {/* Controls: Language and ELI-10 Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEli10(!isEli10)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isEli10
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>ELI-10 Mode {isEli10 ? 'ON' : 'OFF'}</span>
          </button>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-emerald-500 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
          </select>
        </div>
      </div>

      {/* Main Chat Workspace Grid (Left Sidebar Topics + Right Large Chat Console) */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        
        {/* Left Topic Quick-Prompts Panel (Hidden on small mobile, visible on desktop) */}
        <div className="hidden md:flex flex-col w-72 lg:w-80 space-y-4 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Statutory Knowledge Bases
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>SWM Rules 2016 By-Laws</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <Droplets className="w-4 h-4 text-teal-400" />
                <span>Water Act 1974 &amp; RWH Mandates</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <Scale className="w-4 h-4 text-purple-400" />
                <span>State Tree Preservation Acts</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-2.5 flex-1 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Frequent Citizen Inquiries
            </h3>
            <div className="space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/50 border border-slate-800 text-xs text-slate-300 transition-all cursor-pointer leading-relaxed"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Large Chat Stream Console */}
        <div className="flex-1 bg-slate-950/90 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-3 max-w-[85%]">
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-tr-xs shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-lg'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Text to Speech Trigger */}
                      {!isUser && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read Out Aloud</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Suggestion Action Buttons */}
                  {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2.5 ml-11 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            if (act.type === 'lesson') onSelectLesson(act.target);
                            else onSelectMission(act.target);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 hover:border-emerald-500 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{act.title}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-slate-950 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Consulting SWM Rules 2016 and {wardName} data via Gemini 3.8 Flash...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Message Input Console */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            {isRecording && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-center text-xs font-bold animate-pulse flex items-center justify-center gap-2">
                <Mic className="w-4 h-4 text-rose-400" />
                <span>Listening in {selectedLanguage}... (Speak now)</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleVoice}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                }`}
                title="Voice Input"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isEli10 ? "Ask a fun eco question (ELI-10 mode)..." : `Ask Prakriti AI about ${wardName} laws, waste, or trees...`}
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-emerald-500"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
