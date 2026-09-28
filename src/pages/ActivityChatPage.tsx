import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { getPostTypeMeta } from '@/data/postTypes';
import { ConversationPurposeModal } from '@/components/ConversationPurposeModal';
import { Modal } from '@/components/Modal';
import { generateConversationSummary, processConversationAIInput, type AIResponse, type ConversationAnalysis } from '@/lib/aiEngine';
import { Calendar, Clock, AlertTriangle, Lock, Play, CheckCircle2, ArrowRight, FileText, Send, X, MessageSquare, Sparkles, Mic, MicOff, Phone, Plus, Hand } from 'lucide-react';
import type { ConversationSummary, ConversationDuration, ConversationSession, CollaborationOutcome } from '@/data/types';

const WARNING_THRESHOLD = 2 * 60;

type TimerState = 'idle' | 'running' | 'warning' | 'ended';

const RESPONSE_OPTIONS = [
  { id: 'opt1', text: 'مهتم بالتعاون معك حالا في أي مشروع متعلق بهذا المجال.' },
  { id: 'opt2', text: 'سرني معرفتك والتواصل معك في مشاريع مستقبلية.' },
  { id: 'opt3', text: 'شكرا لوقتك ولكنني غير مهتم بهذا المجال.' },
];

export function ActivityChatPage({ postId }: { postId: string }) {
  const {
    posts, activityChats, sendActivityMessage, currentUser, navigate,
    tasks, addTask, saveConversationSummary,
    startConversation, completeConversation, getConversationByPostId, conversations,
    extendConversation, voteConversationOutcome,
  } = useApp();

  const post = posts.find((p) => p.id === postId);
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [input, setInput] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [aiSummary, setAiSummary] = useState<ConversationSummary | null>(null);
  const [showConversationAI, setShowConversationAI] = useState(false);
  const [convAIInput, setConvAIInput] = useState('');
  const [convAIMessages, setConvAIMessages] = useState<Array<{ id: string; role: 'user' | 'ai'; text: string; analysis?: ConversationAnalysis }>>([]);
  const [convAITyping, setConvAITyping] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [hasEndedEarly, setHasEndedEarly] = useState(false);
  const [myOutcomeVote, setMyOutcomeVote] = useState<CollaborationOutcome | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(null);
  const durationRef = useRef<ConversationDuration>(20);
  const autoEndedRef = useRef(false);
  const extendedRef = useRef<number>(0);

  const messages = activityChats[postId] ?? [];
  const activeConversation = getConversationByPostId(postId);

  useEffect(() => {
    if (activeConversation && timerState === 'idle' && !autoEndedRef.current) {
      const elapsed = Math.floor((Date.now() - new Date(activeConversation.startedAt).getTime()) / 1000);
      const totalDuration = activeConversation.extendedDuration ?? activeConversation.durationMinutes;
      const total = totalDuration * 60;
      const remaining = Math.max(0, total - elapsed);
      extendedRef.current = totalDuration - activeConversation.durationMinutes;
      if (remaining <= 0) {
        setTimerState('ended');
      } else {
        setSecondsLeft(remaining);
        durationRef.current = activeConversation.durationMinutes;
        conversationIdRef.current = activeConversation.id;
        setTimerState(remaining <= WARNING_THRESHOLD ? 'warning' : 'running');
      }
    }
  }, [activeConversation, timerState]);

  useEffect(() => {
    if (timerState === 'running' || timerState === 'warning') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimerState('ended');
            return 0;
          }
          if (prev <= WARNING_THRESHOLD + 1 && timerState === 'running') {
            setTimerState('warning');
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [timerState]);

  useEffect(() => {
    if (timerState === 'ended' && !autoEndedRef.current && conversationIdRef.current) {
      autoEndedRef.current = true;
      handleAutoEnd();
    }
  }, [timerState, hasEndedEarly]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleExtend = useCallback(() => {
    if (!conversationIdRef.current) return;
    extendConversation(conversationIdRef.current, 10);
    extendedRef.current += 10;
    setSecondsLeft((prev) => prev + 10 * 60);
    setTimerState('running');
  }, [extendConversation]);

  const handleEndEarly = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(0);
    setTimerState('ended');
    setHasEndedEarly(true);
  }, []);

  const handleStartMic = useCallback(async () => {
    if (micActive) {
      micStream?.getTracks().forEach((t) => t.stop());
      setMicStream(null);
      setMicActive(false);
      return;
    }
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setMicActive(true);
    } catch (err) {
      setMicError('Microphone access is required for voice conversation. Please allow microphone permission in your browser settings and try again.');
    }
  }, [micActive, micStream]);

  useEffect(() => {
    return () => {
      micStream?.getTracks().forEach((t) => t.stop());
    };
  }, [micStream]);

  const handleVoteOutcome = useCallback((outcome: CollaborationOutcome) => {
    if (!conversationIdRef.current) return;
    voteConversationOutcome(conversationIdRef.current, currentUser.id, outcome);
    setMyOutcomeVote(outcome);
  }, [voteConversationOutcome, currentUser.id]);

  const activeConv = conversations.find((c) => c.id === conversationIdRef.current);
  const allVoted = activeConv?.outcomeVotes && Object.keys(activeConv.outcomeVotes).length >= 1;
  const bothCollaborate = activeConv?.outcomeVotes && Object.values(activeConv.outcomeVotes).every((v) => v === 'collaborate');

  const handleAutoEnd = useCallback(() => {
    if (!post || !conversationIdRef.current) return;
    const allMsgs = activityChats[postId] ?? [];
    const participants = Array.from(new Set(allMsgs.map((m) => m.senderName)));
    const duration = durationRef.current;

    const summary = generateConversationSummary(allMsgs, post.title, postId, duration, participants);
    saveConversationSummary(summary);
    setAiSummary(summary);
    completeConversation(conversationIdRef.current);
  }, [post, activityChats, postId, saveConversationSummary, completeConversation]);

  const handleStartFromModal = useCallback((purpose: string, durationMinutes: ConversationDuration) => {
    setShowPurposeModal(false);
    const convId = startConversation(postId, purpose, durationMinutes);
    conversationIdRef.current = convId;
    durationRef.current = durationMinutes;
    autoEndedRef.current = false;
    setAiSummary(null);
    setSecondsLeft(durationMinutes * 60);
    setTimerState('running');
  }, [startConversation, postId]);

  const handleSend = useCallback(() => {
    if (!input.trim() || timerState === 'ended' || timerState === 'idle') return;
    sendActivityMessage(postId, {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    });
    setInput('');
  }, [input, timerState, sendActivityMessage, postId, currentUser]);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setShowConfirm(true);
  };

  const handleConfirmSend = () => {
    const option = RESPONSE_OPTIONS.find((o) => o.id === selectedOption);
    if (option) {
      sendActivityMessage(postId, {
        id: `m${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: option.text,
        timestamp: new Date().toISOString(),
      });
    }
    setShowConfirm(false);
    setSelectedOption(null);
  };

  const handleConvAISubmit = useCallback(() => {
    if (!convAIInput.trim()) return;
    const userMsg = { id: `conv-ai-user-${Date.now()}`, role: 'user' as const, text: convAIInput.trim() };
    setConvAIMessages((prev) => [...prev, userMsg]);
    setConvAIInput('');
    setConvAITyping(true);
    setTimeout(() => {
      const response: AIResponse = processConversationAIInput(userMsg.text, messages, post?.title ?? 'Conversation');
      setConvAIMessages((prev) => [...prev, { id: `conv-ai-${Date.now()}`, role: 'ai', text: response.text, analysis: response.richContent?.kind === 'conversation-analysis' ? response.richContent.analysis : undefined }]);
      setConvAITyping(false);
    }, 700);
  }, [convAIInput, messages, post]);

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setSelectedOption(null);
  };

  if (!post) {
    return (
      <PageShell>
        <BackButton />
        <div className="rounded-3xl bg-white p-12 text-center shadow-card">
          <p className="font-display text-xl font-bold text-navy-500">Activity not found</p>
        </div>
      </PageShell>
    );
  }

  const meta = getPostTypeMeta(post.type);
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isLocked = timerState === 'ended';
  const showEndButtons = timerState === 'warning';

  return (
    <PageShell>
      <BackButton label="Back to post" />
      <div className="mx-auto max-w-4xl">
        {/* Header with timer */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-card-lg bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{meta.icon}</span>
            <div>
              <h1 className="font-display text-xl font-bold text-navy-500">{post.title}</h1>
              <p className="text-sm font-semibold text-navy-400">
                {activeConversation ? `Purpose: ${activeConversation.purpose}` : 'Team Chat'} · {post.membersJoined} members
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {timerState !== 'idle' && (
              <div className={`flex items-center gap-2 rounded-pill px-4 py-2 font-display text-lg font-bold tabular-nums transition ${
                timerState === 'ended' ? 'bg-poppy-400 text-white' :
                timerState === 'warning' ? 'bg-peach-400 text-white animate-pulse' :
                'bg-sage-400 text-white'
              }`}>
                <Clock size={18} />
                {timeStr}
              </div>
            )}
            {timerState === 'idle' && (
              <button
                onClick={() => setShowPurposeModal(true)}
                className="flex items-center gap-1.5 rounded-btn bg-fuchsia-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-fuchsia-600"
              >
                <MessageSquare size={16} /> Start Conversation
              </button>
            )}
            <div className="flex items-center gap-1.5 rounded-pill bg-cream-200 px-3 py-2 text-xs font-bold text-navy-500">
              <Calendar size={14} />
              Due {new Date(post.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* 2-minute warning banner with Extend/End buttons */}
        {timerState === 'warning' && (
          <div className="mb-4 rounded-card-lg border-2 border-peach-400 bg-peach-300/20 px-4 py-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="text-peach-600 shrink-0" size={22} />
              <div>
                <p className="text-sm font-bold text-peach-600">Your conversation is ending soon</p>
                <p className="text-xs font-semibold text-peach-600/80">Would you like to extend it?</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExtend}
                className="flex items-center gap-1.5 rounded-btn bg-sage-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sage-600"
              >
                <Plus size={16} /> Extend 10 minutes
              </button>
              <button
                onClick={handleEndEarly}
                className="flex items-center gap-1.5 rounded-btn bg-poppy-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-poppy-500"
              >
                <X size={16} /> End Conversation
              </button>
            </div>
          </div>
        )}

        {/* Timer ended banner */}
        {timerState === 'ended' && (
          <div className="mb-4 flex items-center gap-3 rounded-card-lg border-2 border-poppy-400 bg-poppy-400/10 px-4 py-3 animate-fade-in">
            <Lock className="text-poppy-500 shrink-0" size={22} />
            <div>
              <p className="text-sm font-bold text-poppy-500">Conversation time ended</p>
              <p className="text-xs font-semibold text-poppy-500/80">Chat is locked. AI summary generated below. Select your collaboration outcome.</p>
            </div>
          </div>
        )}

        {/* Voice meeting controls */}
        {timerState !== 'idle' && timerState !== 'ended' && (
          <div className="mb-4 flex items-center gap-3 rounded-card-lg bg-white p-3 shadow-soft">
            <button
              onClick={handleStartMic}
              className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-bold transition ${
                micActive ? 'bg-poppy-400 text-white hover:bg-poppy-500' : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {micActive ? <MicOff size={16} /> : <Mic size={16} />}
              {micActive ? 'Stop Microphone' : 'Start Voice Meeting'}
            </button>
            {micActive && (
              <div className="flex items-center gap-2 text-sm font-bold text-teal-600">
                <span className="flex h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
                Voice active
              </div>
            )}
            {micError && (
              <p className="flex-1 text-xs font-semibold text-poppy-500">{micError}</p>
            )}
          </div>
        )}

        {/* Chat area */}
        <div className="flex flex-col rounded-card-lg bg-white shadow-card overflow-hidden" style={{ height: '45vh' }}>
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                {timerState === 'idle' ? (
                  <>
                    <MessageSquare className="mb-2 text-navy-400/40" size={32} />
                    <p className="text-sm font-semibold text-navy-400">Start a purpose-driven conversation to begin chatting</p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-navy-400">No messages yet. Start the conversation!</p>
                )}
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isArabic = /[\u0600-\u06FF]/.test(msg.text);
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-message-pop`}>
                    <div className={`max-w-[75%] rounded-card px-4 py-2.5 ${isMe ? 'bg-fuchsia-500 text-white' : 'bg-cream-200 text-navy-500'}`}>
                      {!isMe && <p className="mb-0.5 text-xs font-bold text-lavender-600">{msg.senderName}</p>}
                      <p className={`text-sm font-semibold ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>{msg.text}</p>
                      <p className={`mt-1 text-[10px] ${isMe ? 'text-white/70' : 'text-navy-400/70'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-cream-200 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLocked || timerState === 'idle'}
                placeholder={isLocked ? 'Chat locked — conversation ended' : timerState === 'idle' ? 'Start a conversation to begin chatting' : 'Type a message...'}
                className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none transition disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLocked || timerState === 'idle' || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500 text-white transition hover:bg-fuchsia-600 hover:scale-105 disabled:opacity-40 disabled:scale-100"
              >
                {isLocked ? <Lock size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Ask AI button — appears during active conversation */}
        {timerState !== 'idle' && !showConversationAI && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setShowConversationAI(true)}
              className="flex items-center gap-2 rounded-pill bg-gradient-to-r from-lavender-500 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white shadow-pop transition hover:scale-105"
            >
              <Sparkles size={16} /> Ask AI Assistant
            </button>
          </div>
        )}

        {/* In-conversation AI panel */}
        {showConversationAI && (
          <div className="mt-3 rounded-card-lg border-2 border-lavender-300 bg-white p-4 shadow-card animate-fade-in">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-lavender-400 to-fuchsia-400">
                  <Sparkles size={16} className="text-white" />
                </div>
                <h3 className="font-display text-sm font-bold text-navy-500">Conversation AI Assistant</h3>
              </div>
              <button onClick={() => setShowConversationAI(false)} className="rounded-btn p-1.5 text-navy-400 hover:bg-cream-200">
                <X size={16} />
              </button>
            </div>

            <div className="mb-3 max-h-48 overflow-y-auto scrollbar-hide space-y-2">
              {convAIMessages.length === 0 && (
                <div className="rounded-btn bg-cream-50 p-3">
                  <p className="text-xs font-semibold text-navy-400">I can help with: summarizing, extracting key points, identifying tasks, finding deadlines, suggesting next steps, and more. Just ask!</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['Summarize this conversation', 'What did we agree on?', 'What tasks were assigned?', 'What are the next steps?'].map((q) => (
                      <button key={q} onClick={() => { setConvAIInput(q); }} className="rounded-btn border border-lavender-300 bg-lavender-200/30 px-2 py-1 text-[11px] font-bold text-navy-500 transition hover:bg-lavender-200">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {convAIMessages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-card px-3 py-2 ${m.role === 'user' ? 'bg-fuchsia-500 text-white' : 'bg-cream-100 text-navy-500'}`}>
                    <p className="whitespace-pre-line text-xs font-semibold">{m.text}</p>
                    {m.analysis && (
                      <div className="mt-2 space-y-1.5 border-t border-cream-300 pt-2">
                        {m.analysis.mainTopics.length > 0 && <AnalysisMini title="Topics" items={m.analysis.mainTopics} />}
                        {m.analysis.keyPoints.length > 0 && <AnalysisMini title="Key Points" items={m.analysis.keyPoints} />}
                        {m.analysis.agreedTasks.length > 0 && <AnalysisMini title="Tasks" items={m.analysis.agreedTasks} />}
                        {m.analysis.deadlines.length > 0 && <AnalysisMini title="Deadlines" items={m.analysis.deadlines} />}
                        {m.analysis.suggestedNextSteps.length > 0 && <AnalysisMini title="Next Steps" items={m.analysis.suggestedNextSteps} />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {convAITyping && (
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-lavender-400" />
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-lavender-400 animate-typing-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-lavender-400 animate-typing-dot" style={{ animationDelay: '200ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-lavender-400 animate-typing-dot" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={convAIInput}
                onChange={(e) => setConvAIInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConvAISubmit()}
                placeholder="Ask about this conversation..."
                className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-3 py-2 text-xs font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
              />
              <button
                onClick={handleConvAISubmit}
                disabled={!convAIInput.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500 text-white transition hover:bg-fuchsia-600 disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
        {showEndButtons && !showConfirm && (
          <div className="mt-4 rounded-card-lg border-2 border-lavender-300 bg-lavender-200/20 p-5 animate-fade-in">
            <h3 className="mb-1 font-display text-base font-bold text-navy-500">How would you like to continue?</h3>
            <p className="mb-4 text-xs font-semibold text-navy-400">Select a response to send to the other participant before the conversation ends.</p>
            <div className="space-y-2">
              {RESPONSE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full rounded-btn border-2 px-4 py-3 text-right text-sm font-semibold transition ${
                    selectedOption === opt.id
                      ? 'border-fuchsia-400 bg-fuchsia-300/20 text-navy-500'
                      : 'border-cream-300 bg-white text-navy-500 hover:border-lavender-400 hover:bg-lavender-200/20'
                  }`}
                  dir="rtl"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}



        {/* AI Summary card — shown when conversation ends */}
        {timerState === 'ended' && aiSummary && (
          <div className="mt-4 rounded-card-lg border-2 border-lavender-300 bg-white p-5 shadow-card animate-fade-in">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-lavender-400 to-fuchsia-400">
                <Sparkles size={16} className="text-white" />
              </div>
              <h3 className="font-display text-base font-bold text-navy-500">AI Conversation Summary</h3>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-btn bg-cream-50 p-2.5">
                <p className="font-bold uppercase text-navy-400 mb-0.5">Duration</p>
                <p className="font-bold text-navy-500">{durationRef.current} minutes</p>
              </div>
              <div className="rounded-btn bg-cream-50 p-2.5">
                <p className="font-bold uppercase text-navy-400 mb-0.5">Participants</p>
                <p className="font-bold text-navy-500">{aiSummary.participants.length}</p>
              </div>
            </div>

            <p className="mb-3 text-sm font-semibold text-navy-500">{aiSummary.summary}</p>

            {aiSummary.mainTopic && (
              <div className="mb-3 rounded-btn bg-cream-50 p-2.5">
                <p className="font-bold uppercase text-navy-400 mb-0.5 text-xs">Main Topic</p>
                <p className="text-sm font-bold text-navy-500">{aiSummary.mainTopic}</p>
              </div>
            )}

            {aiSummary.skillsDiscussed && aiSummary.skillsDiscussed.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Skills Discussed</p>
                <div className="flex flex-wrap gap-1.5">
                  {aiSummary.skillsDiscussed.map((s) => (
                    <span key={s} className="rounded-btn bg-sky-300/50 px-2 py-0.5 text-xs font-bold text-sky-600">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {aiSummary.keyPoints.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Key Points</p>
                <ul className="space-y-1">
                  {aiSummary.keyPoints.map((kp, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
                      <CheckCircle2 size={12} className="text-sage-500 mt-0.5 shrink-0" /> {kp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.decisions && aiSummary.decisions.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Decisions / Agreements</p>
                <ul className="space-y-1">
                  {aiSummary.decisions.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
                      <CheckCircle2 size={12} className="text-teal-500 mt-0.5 shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.collaborationAreas && aiSummary.collaborationAreas.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Collaboration Areas</p>
                <ul className="space-y-1">
                  {aiSummary.collaborationAreas.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
                      <ArrowRight size={12} className="text-fuchsia-500 mt-0.5 shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.deadlines && aiSummary.deadlines.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Deadlines Mentioned</p>
                <ul className="space-y-1">
                  {aiSummary.deadlines.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
                      <Clock size={12} className="text-peach-500 mt-0.5 shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.actionItems.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Tasks / Action Items</p>
                <ul className="space-y-1">
                  {aiSummary.actionItems.map((ai, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
                      <ArrowRight size={12} className="text-fuchsia-500 mt-0.5 shrink-0" /> {ai}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.unresolvedPoints && aiSummary.unresolvedPoints.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Unresolved Points</p>
                <ul className="space-y-1">
                  {aiSummary.unresolvedPoints.map((u, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
                      <AlertTriangle size={12} className="text-poppy-400 mt-0.5 shrink-0" /> {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.nextSteps && aiSummary.nextSteps.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase text-navy-400">Next Steps</p>
                <ul className="space-y-1">
                  {aiSummary.nextSteps.map((ns, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
                      <ArrowRight size={12} className="text-lavender-500 mt-0.5 shrink-0" /> {ns}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <PillButton variant="teal" className="flex-1" onClick={() => navigate({ name: 'team-workspace', postId })}>
                <CheckCircle2 size={16} /> Go to Team Workspace
              </PillButton>
              <PillButton variant="white" className="flex-1" onClick={() => navigate({ name: 'conversations' })}>
                <FileText size={16} /> View All Conversations
              </PillButton>
            </div>
          </div>
        )}

        {/* Collaboration outcome — shown after conversation ends */}
        {timerState === 'ended' && aiSummary && (
          <div className="mt-4 rounded-card-lg border-2 border-fuchsia-300 bg-white p-5 shadow-card animate-fade-in">
            <h3 className="mb-1 font-display text-base font-bold text-navy-500">What would you like to do?</h3>
            <p className="mb-4 text-xs font-semibold text-navy-400">Select your response. Each participant chooses independently.</p>
            <div className="space-y-2">
              <OutcomeButton
                emoji="🟢"
                label="Collaborate on this project"
                active={myOutcomeVote === 'collaborate'}
                onClick={() => handleVoteOutcome('collaborate')}
              />
              <OutcomeButton
                emoji="🔵"
                label="Stay connected for future projects"
                active={myOutcomeVote === 'stay-connected'}
                onClick={() => handleVoteOutcome('stay-connected')}
              />
              <OutcomeButton
                emoji="⚪"
                label="Not interested"
                active={myOutcomeVote === 'not-interested'}
                onClick={() => handleVoteOutcome('not-interested')}
              />
            </div>
            {myOutcomeVote && (
              <div className="mt-3 rounded-btn bg-cream-50 p-3 text-center">
                <p className="text-sm font-bold text-navy-500">
                  Your response recorded: {myOutcomeVote === 'collaborate' ? 'Collaborate' : myOutcomeVote === 'stay-connected' ? 'Stay connected' : 'Not interested'}
                </p>
                {bothCollaborate && (
                  <p className="mt-2 text-sm font-bold text-sage-600">
                    Both participants want to collaborate! You can now access the Team Workspace.
                  </p>
                )}
                {bothCollaborate && (
                  <PillButton variant="teal" className="mt-3 w-full" onClick={() => navigate({ name: 'team-workspace', postId })}>
                    <Hand size={16} /> Enter Team Workspace
                  </PillButton>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick task add — appears during active conversation */}
        {timerState !== 'ended' && timerState !== 'idle' && (
          <QuickTaskAdd postId={postId} addTask={addTask} />
        )}

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate({ name: 'post-detail', postId: post.id })}
            className="text-sm font-bold text-navy-400 hover:text-fuchsia-500 transition"
          >
            View post details
          </button>
        </div>
      </div>

      <ConversationPurposeModal
        open={showPurposeModal}
        onClose={() => setShowPurposeModal(false)}
        post={post}
        onStart={handleStartFromModal}
      />

      <Modal open={showConfirm} onClose={handleCancelConfirm} title="Confirm Response">
        <p className="mb-4 text-sm font-bold text-navy-500">Send this response to the other participant?</p>
        <div className="mb-5 rounded-card-lg bg-cream-50 p-4">
          <p className="text-base font-semibold text-navy-500 text-right" dir="rtl">
            {selectedOption ? RESPONSE_OPTIONS.find((o) => o.id === selectedOption)?.text : ''}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <PillButton variant="white" onClick={handleCancelConfirm}>
            <X size={16} /> Cancel
          </PillButton>
          <PillButton variant="primary" onClick={handleConfirmSend}>
            <Send size={16} /> Send
          </PillButton>
        </div>
      </Modal>
    </PageShell>
  );
}

function AnalysisMini({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase text-navy-400">{title}</p>
      <ul className="space-y-0.5">
        {items.slice(0, 3).map((item, i) => (
          <li key={i} className="text-[11px] font-semibold text-navy-500 flex items-start gap-1">
            <span className="text-navy-400/40">·</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OutcomeButton({ emoji, label, active, onClick }: { emoji: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-btn border-2 px-4 py-3 text-left text-sm font-semibold transition flex items-center gap-3 ${
        active ? 'border-fuchsia-400 bg-fuchsia-300/20 text-navy-500' : 'border-cream-300 bg-white text-navy-500 hover:border-lavender-400 hover:bg-lavender-200/20'
      }`}
    >
      <span className="text-lg">{emoji}</span>
      {label}
    </button>
  );
}

function QuickTaskAdd({ postId, addTask }: { postId: string; addTask: (postId: string, title: string, assignee?: string) => void }) {
  const [taskInput, setTaskInput] = useState('');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!taskInput.trim()) return;
    addTask(postId, taskInput.trim());
    setTaskInput('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-3 rounded-card bg-white p-3 shadow-soft">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Quick add a task during conversation..."
          className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-3 py-2 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
        />
        <button
          onClick={handleAdd}
          disabled={!taskInput.trim()}
          className="flex items-center gap-1.5 rounded-btn bg-sage-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-sage-600 disabled:opacity-40"
        >
          {added ? <CheckCircle2 size={14} /> : <Play size={14} />}
          {added ? 'Added!' : 'Add Task'}
        </button>
      </div>
    </div>
  );
}
