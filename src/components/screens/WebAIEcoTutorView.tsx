import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Baby, 
  MapPin, 
  Volume2,
  Leaf,
  Droplets,
  Scale
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
            <span>Prakriti AI Eco-Tutor</span>
            <span>/</span>
            <span className="text-[#143628] font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#1E4B35]" />
              {wardName} Municipal Knowledge Active
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEli10(!isEli10)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isEli10
                ? 'bg-[#1E4B35] text-white border-[#1E4B35]'
                : 'bg-white border-[#DDD7C9] text-[#143628] hover:bg-[#FAF9F5]'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>ELI-10 Mode {isEli10 ? 'ON' : 'OFF'}</span>
          </button>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-[#DDD7C9] rounded-xl text-xs font-bold text-[#143628] focus:outline-[#1E4B35] cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
          </select>
        </div>
      </div>

      {/* Main Console */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        
        {/* Left Topics */}
        <div className="hidden md:flex flex-col w-72 lg:w-80 space-y-4 shrink-0">
          <div className="bg-white border border-[#DDD7C9] rounded-3xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#526357] uppercase tracking-wider">
              Statutory Knowledge Bases
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#DDD7C9] flex items-center gap-2.5 text-[#143628]">
                <Leaf className="w-4 h-4 text-[#1E4B35]" />
                <span>SWM Rules 2016 By-Laws</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#DDD7C9] flex items-center gap-2.5 text-[#143628]">
                <Droplets className="w-4 h-4 text-[#1C5D82]" />
                <span>Water Act &amp; RWH Mandates</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#DDD7C9] flex items-center gap-2.5 text-[#143628]">
                <Scale className="w-4 h-4 text-[#9E4A28]" />
                <span>State Tree Preservation Acts</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DDD7C9] rounded-3xl p-5 space-y-2.5 flex-1 overflow-y-auto shadow-xs">
            <h3 className="text-xs font-bold text-[#526357] uppercase tracking-wider">
              Frequent Citizen Inquiries
            </h3>
            <div className="space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EFE8] border border-[#DDD7C9] text-xs text-[#143628] transition-all cursor-pointer leading-relaxed"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chat Canvas */}
        <div className="flex-1 bg-white border border-[#DDD7C9] rounded-3xl flex flex-col overflow-hidden shadow-xs">
          
          {/* Stream */}
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
                      <div className="w-8 h-8 rounded-xl bg-[#1E4B35] text-white flex items-center justify-center font-bold shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#1E4B35] text-white rounded-tr-xs'
                          : 'bg-[#FAF9F5] border border-[#DDD7C9] text-[#143628] rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {!isUser && (
                        <div className="mt-3 pt-2.5 hairline-t flex items-center justify-between text-xs text-[#526357]">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="text-[#1E4B35] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read Aloud</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[#EFECE3] text-[#143628] flex items-center justify-center font-bold shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Action Deep-Links */}
                  {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2.5 ml-11 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            if (act.type === 'lesson') onSelectLesson(act.target);
                            else onSelectMission(act.target);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#DDD7C9] hover:border-[#1E4B35] text-[#1E4B35] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{act.title}</span>
                          <span>→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1E4B35] text-white flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD7C9] rounded-2xl text-xs text-[#526357]">
                  Consulting SWM Rules 2016 and {wardName} data via Gemini 3.8 Flash...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Console */}
          <div className="p-4 bg-[#FAF9F5] hairline-t space-y-3">
            {isRecording && (
              <div className="p-2.5 bg-[#FDF0EE] border border-[#E39D90] text-[#9E4A28] rounded-xl text-center text-xs font-bold animate-pulse flex items-center justify-center gap-2">
                <Mic className="w-4 h-4" />
                <span>Listening in {selectedLanguage}... (Speak now)</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleVoice}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#9E4A28] text-white border-[#9E4A28]'
                    : 'bg-white text-[#143628] border-[#DDD7C9]'
                }`}
                title="Voice Input"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isEli10 ? "Ask an easy question (ELI-10 mode)..." : `Ask Prakriti AI about ${wardName} laws, waste, or trees...`}
                className="flex-1 px-4 py-3 bg-white border border-[#DDD7C9] rounded-2xl text-xs sm:text-sm text-[#143628] placeholder-[#7B8D80] focus:outline-[#1E4B35]"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="px-5 py-3 bg-[#1E4B35] hover:bg-[#153827] disabled:bg-[#EAE6DC] disabled:text-[#8D9E92] text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
