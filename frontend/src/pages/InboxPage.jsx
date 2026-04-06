import { useCallback, useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { fetchInbox, fetchThread, sendMessage } from '../api/messages.js';
import { useAuth } from '../context/AuthContext.jsx';

export function InboxPage() {
  const { user, isAuthenticated } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const loadInbox = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchInbox(user.id);
      setInbox(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      toast.error('Could not load inbox');
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const openThread = async (thread) => {
    setActiveThread(thread);
    try {
      const data = await fetchThread(user.id, thread.partnerId, thread.propertyId);
      setMessages(data || []);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    } catch {
      toast.error('Could not load messages');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !activeThread) return;
    try {
      const newMsg = await sendMessage(user.id, activeThread.partnerId, activeThread.propertyId, content);
      setMessages(prev => [...prev, newMsg]);
      setContent('');
      loadInbox();
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (!isAuthenticated) return <div className="p-12 text-center text-slate-400">Sign in to view messages.</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold text-white mb-6">Messages</h1>

      <div className="grid lg:grid-cols-[350px_1fr] overflow-hidden rounded-3xl border border-white/10 bg-[#0a1628] shadow-2xl h-[70vh]">
        {/* Inbox Sidebar */}
        <div className="border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050b14]/50 overflow-y-auto">
          {loading ? (
             <p className="p-6 text-sm text-slate-400">Loading inbox...</p>
          ) : inbox.length === 0 ? (
             <p className="p-6 text-sm text-slate-500">No messages yet.</p>
          ) : (
             <ul className="divide-y divide-white/5">
               {inbox.map((thread, idx) => {
                 const isActive = activeThread?.propertyId === thread.propertyId && activeThread?.partnerId === thread.partnerId;
                 return (
                   <li 
                     key={idx}
                     onClick={() => openThread(thread)}
                     className={`p-4 cursor-pointer transition hover:bg-sky-500/10 ${isActive ? 'bg-sky-500/10 border-l-4 border-l-sky-400' : 'border-l-4 border-l-transparent'}`}
                   >
                     <p className="text-sm font-semibold text-white">{thread.partnerName}</p>
                     <p className="text-xs text-sky-300 mt-0.5">{thread.propertyTitle}</p>
                     <p className="text-xs text-slate-400 mt-2 truncate">{thread.latestMessage}</p>
                   </li>
                 )
               })}
             </ul>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-full bg-[#0a1628]">
          {activeThread ? (
            <>
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050b14]/80">
                <div>
                  <h3 className="text-lg font-bold text-white">{activeThread.partnerName}</h3>
                  <p className="text-xs text-slate-400">{activeThread.propertyTitle}</p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(m => {
                  const isMe = m.senderId === user.id;
                  return (
                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${isMe ? 'bg-sky-500 text-white rounded-tr-sm' : 'bg-white/10 text-slate-200 rounded-tl-sm'}`}>
                        {m.content}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#050b14]/50 flex gap-3">
                <input 
                  type="text" 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-white/10 bg-[#0a1628] px-4 py-2 text-sm text-white outline-none focus:border-sky-400/50"
                  required
                />
                <button type="submit" className="rounded-full bg-sky-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-sky-400">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-slate-500 text-sm">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
