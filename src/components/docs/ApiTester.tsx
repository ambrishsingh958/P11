import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, RefreshCw, Server, Send } from 'lucide-react';

export const ApiTester: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/courses');
  const [requestBody, setRequestBody] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const endpoints = [
    {
      id: 'GET /api/courses',
      method: 'GET',
      path: '/api/courses',
      defaultBody: ''
    },
    {
      id: 'GET /api/courses/path-waste-circularity',
      method: 'GET',
      path: '/api/courses/path-waste-circularity',
      defaultBody: ''
    },
    {
      id: 'POST /api/progress',
      method: 'POST',
      path: '/api/progress',
      defaultBody: JSON.stringify({
        userId: 'user-citizen-1',
        lessonId: 'les-w-1',
        courseId: 'path-waste-circularity'
      }, null, 2)
    },
    {
      id: 'POST /api/quiz/submit',
      method: 'POST',
      path: '/api/quiz/submit',
      defaultBody: JSON.stringify({
        userId: 'user-citizen-1',
        quizId: 'quiz-w-1',
        answers: {
          'q-w1-1': 1,
          'q-w1-2': 1
        }
      }, null, 2)
    },
    {
      id: 'GET /api/recommendations',
      method: 'GET',
      path: '/api/recommendations?ward=Ward%20174%20(HSR%20Layout)',
      defaultBody: ''
    },
    {
      id: 'GET /api/workshops',
      method: 'GET',
      path: '/api/workshops',
      defaultBody: ''
    },
    {
      id: 'POST /api/workshops/ws-compost-101/rsvp',
      method: 'POST',
      path: '/api/workshops/ws-compost-101/rsvp',
      defaultBody: JSON.stringify({ userId: 'user-citizen-1' }, null, 2)
    },
    {
      id: 'POST /api/field-missions/mission-waste-seg/submit',
      method: 'POST',
      path: '/api/field-missions/mission-waste-seg/submit',
      defaultBody: JSON.stringify({
        userId: 'user-citizen-1',
        latitude: 12.9165,
        longitude: 77.6101,
        photos: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'],
        reflectionNotes: 'Verified 5 households in HSR Layout Sector 2. Residents briefed on SWM 2016 red cross packaging.'
      }, null, 2)
    },
    {
      id: 'GET /api/certificates',
      method: 'GET',
      path: '/api/certificates',
      defaultBody: ''
    },
    {
      id: 'POST /api/ai-tutor/ask',
      method: 'POST',
      path: '/api/ai-tutor/ask',
      defaultBody: JSON.stringify({
        query: 'What are the rules for sanitary waste packaging under Solid Waste Management 2016 in Ward 174?',
        ward: 'Ward 174 (HSR Layout)',
        city: 'Bengaluru',
        language: 'English',
        isEli10: false
      }, null, 2)
    }
  ];

  const handleSelectEndpoint = (endpointId: string) => {
    setSelectedEndpoint(endpointId);
    const ep = endpoints.find((e) => e.id === endpointId);
    if (ep) {
      setRequestBody(ep.defaultBody);
      setResponseData(null);
      setResponseStatus(null);
      setLatencyMs(null);
    }
  };

  const handleExecute = async () => {
    const ep = endpoints.find((e) => e.id === selectedEndpoint);
    if (!ep) return;

    setIsLoading(true);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (ep.method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(ep.path, options);
      const data = await res.json();
      const end = performance.now();

      setResponseStatus(res.status);
      setResponseData(data);
      setLatencyMs(Math.round(end - start));
    } catch (err: any) {
      const end = performance.now();
      setResponseStatus(500);
      setResponseData({ error: err.message || 'Failed to fetch' });
      setLatencyMs(Math.round(end - start));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <Server className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-white">Interactive Backend API Tester</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute live REST requests directly against the Express backend running on Port 3000
            </p>
          </div>
          {latencyMs !== null && (
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
              Latency: {latencyMs}ms
            </div>
          )}
        </div>

        {/* Endpoint Selector Buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Select API Endpoint:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep.id)}
                  className={`p-2 rounded-xl text-left border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        ep.method === 'GET'
                          ? 'bg-blue-900/60 text-blue-300'
                          : 'bg-emerald-900/60 text-emerald-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="truncate">{ep.path.split('?')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Request Execution Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Request Body Column */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Request Payload (JSON):</span>
              <span className="text-[10px] text-slate-500 font-normal">Editable</span>
            </div>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              disabled={selectedEndpoint.startsWith('GET')}
              placeholder={selectedEndpoint.startsWith('GET') ? 'No payload needed for GET requests' : 'Enter JSON payload'}
              className="w-full h-72 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-amber-300 focus:outline-emerald-500 resize-none disabled:opacity-40"
            />
            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Executing Request...' : 'Send API Request'}</span>
            </button>
          </div>

          {/* Response Payload Column */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Server Response:</span>
              {responseStatus && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                      : 'bg-rose-900 text-rose-300 border border-rose-700'
                  }`}
                >
                  HTTP {responseStatus}
                </span>
              )}
            </div>
            <pre className="w-full h-72 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-auto">
              {responseData ? JSON.stringify(responseData, null, 2) : '// Response will appear here after clicking "Send API Request"'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
