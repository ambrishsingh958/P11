import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Bot, 
  User, 
  Globe2, 
  Baby, 
  MapPin, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw,
  Volume2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  suggestedActions?: { title: string; target: string; type: string }[];
  isEli10?: boolean;
}

interface AIEcoTutorScreenProps {
  wardName: string;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectMission: (missionId: string) => void;
}

export const AIEcoTutorScreen: React.FC<AIEcoTutorScreenProps> = ({
  wardName,
  onBack,
  onSelectLesson,
  onSelectMission,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'tutor',
      text: `Namaste! I am Prakriti AI, your civic Eco-Tutor for ${wardName}. Ask me anything about waste rules, rainwater harvesting, illegal tree felling, or how to organize your apartment!`,
      timestamp: 'Just now',
      suggestedActions: [
        { title: 'Learn 3-Bin Rules (2 min)', target: 'les-w-1', type: 'lesson' },
        { title: 'Audit Ward Segregation', target: 'mission-waste-seg', type: 'mission' }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Kannada' | 'Tamil'>('English');
  const [isEli10, setIsEli10] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How do I segregate sanitary pads under SWM 2016?',
    'What should I do if a neighbor is cutting a street tree?',
    'How can our apartment do Rainwater Harvesting?',
    'Explain composting like I am 10 years old'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
        text: 'Under SWM Rules 2016, wet waste should be handed over daily to municipal tippers, and sanitary waste wrapped in paper with a red cross. Let us keep our neighborhood clean!',
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
      // Voice input simulation / speech recognition
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Is home composting mandatory in our ward?');
      }, 2500);
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
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <span>Prakriti Eco-Tutor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-600" />
              <span>{wardName} context</span>
            </div>
          </div>
        </div>

        {/* Language & Simple Mode Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEli10(!isEli10)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
              isEli10 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Explain Like I'm 10"
          >
            <Baby className="w-3 h-3 text-amber-600" />
            <span>ELI-10</span>
          </button>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 cursor-pointer"
          >
            <option value="English">EN</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Kannada">ಕನ್ನಡ</option>
            <option value="Tamil">தமிழ்</option>
          </select>
        </div>
      </header>

      {/* Chat Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {!isUser && (
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] shrink-0 mb-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Text-to-speech button for assistant response */}
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      <button 
                        onClick={() => handleSpeakText(msg.text)}
                        className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] shrink-0 mb-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Action Suggestion Buttons Attached to Tutor Response */}
              {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2 ml-8 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((action, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => {
                        if (action.type === 'lesson') onSelectLesson(action.target);
                        else onSelectMission(action.target);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{action.title}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-xs text-xs text-slate-500 shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] ml-1">Consulting municipal by-laws...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Chips */}
      <div className="px-3 py-1.5 bg-white/60 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-[10px] font-medium text-slate-700 bg-white border border-slate-200 rounded-full px-2.5 py-1 whitespace-nowrap hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Message Bar */}
      <div className="shrink-0 p-3 bg-white border-t border-slate-200">
        {isRecording && (
          <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-800 font-bold flex items-center justify-center gap-1.5 animate-pulse">
            <Mic className="w-4 h-4 text-rose-600" />
            <span>Listening to voice in {selectedLanguage}... (Speak now)</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isRecording 
                ? 'bg-rose-500 text-white border-rose-600' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Voice input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isEli10 ? "Ask a fun question (ELI-10 mode)..." : `Ask about ${wardName} rules, laws, tests...`}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 text-slate-900"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
