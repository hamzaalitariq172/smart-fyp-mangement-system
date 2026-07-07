import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { messageAPI, projectAPI } from '../../services/api';
import { getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FiSend, FiMessageCircle, FiPaperclip, FiCheckCircle, FiSmile, FiFile, FiX, FiDownload, FiArrowLeft } from 'react-icons/fi';

const EMOJIS = ['😀','😂','😍','🤔','👍','👎','🙌','🎉','🔥','💯','✅','❌','⭐','💡','📌','🎯','❤️','💬','📎','🚀'];

const ChatWindow = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatProject, setNewChatProject] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEnd = useRef(null);
  const typingTimeout = useRef(null);
  const activeConvRef = useRef(null);

  useEffect(() => {
    activeConvRef.current = activeConv;
  }, [activeConv]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.sender?._id !== user._id && activeConvRef.current?._id === msg.conversation) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === msg._id)) return prev;
          return [...prev, { ...msg, status: 'read' }];
        });
      }
      loadConversations();
    };

    const handleMessageSent = (msg) => {
      setMessages((prev) => prev.map((m) =>
        (m._id === msg._id || m._id?.startsWith('temp-')) ? { ...msg, status: 'sent' } : m
      ));
    };

    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };

    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => { const next = new Set(prev); next.delete(userId); return next; });
    };

    const handleUserTyping = ({ conversationId, senderId }) => {
      if (conversationId === activeConvRef.current?._id && senderId !== user._id) {
        setTypingUsers((prev) => new Set(prev).add(senderId));
      }
    };

    const handleUserStoppedTyping = ({ conversationId, senderId }) => {
      setTypingUsers((prev) => { const next = new Set(prev); next.delete(senderId); return next; });
    };

    const handleMessagesRead = ({ conversationId }) => {
      if (conversationId === activeConvRef.current?._id) {
        setMessages((prev) => prev.map((m) => m.sender?._id !== user._id ? { ...m, isRead: true } : m));
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageSent', handleMessageSent);
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageSent', handleMessageSent);
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, user]);

  useEffect(() => {
    loadConversations();
    projectAPI.getAll().then(({ data }) => setProjects(data?.projects || (Array.isArray(data) ? data : []))).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const loadConversations = async () => {
    try {
      const { data } = await messageAPI.getConversations();
      setConversations(data);
    } catch {} finally { setLoading(false); }
  };

  const loadMessages = async (conv) => {
    setActiveConv(conv);
    setShowSidebar(false);
    setMessages([]);
    setTypingUsers(new Set());
    try {
      const { data } = await messageAPI.getMessages(conv._id);
      setMessages(data.map((m) => ({ ...m, status: m.isRead ? 'read' : 'sent' })));
      socket?.emit('markRead', { conversationId: conv._id, userId: user._id });
    } catch {}
  };

  const sendMessage = async () => {
    const text = content.trim();
    if ((!text && !file) || !activeConv || sending || !socket) return;

    setSending(true);
    const tempId = `temp-${Date.now()}`;
    let fileUrl = '';
    let fileName = '';

    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { data } = await projectAPI.uploadDocument(activeConv.project?._id || activeConv.project, fd);
        fileUrl = data.url || `/uploads/${file.name}`;
        fileName = file.name;
      } catch {}
    }

    const optimisticMsg = {
      _id: tempId, conversation: activeConv._id,
      sender: { _id: user._id, name: user.name, avatar: user.avatar },
      content: text, fileUrl, fileName, createdAt: new Date().toISOString(), status: 'sending',
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setContent('');
    setFile(null);

    socket.emit('sendMessage', {
      conversationId: activeConv._id, senderId: user._id, content: text, fileUrl, fileName,
    });

    setSending(false);
  };

  const handleTyping = useCallback(() => {
    if (!activeConv || !socket) return;
    socket.emit('typing', { conversationId: activeConv._id, senderId: user._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId: activeConv._id, senderId: user._id });
    }, 1000);
  }, [activeConv, user, socket]);

  const createNewConversation = async () => {
    if (!newChatProject) return;
    try {
      const project = projects.find((p) => p._id === newChatProject);
      const supervisorId = project.supervisor?._id;
      if (!supervisorId) return toast.error('Project has no assigned supervisor');
      const participantIds = [supervisorId];
      await messageAPI.createConversation({ participantIds, project: newChatProject });
      toast.success('Chat started');
      setShowNewChat(false);
      loadConversations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create chat');
    }
  };

  const getOther = (conv) => conv?.participants?.find((p) => p._id !== user._id);
  const isOnline = (userId) => onlineUsers.has(userId);
  const isTyping = (userId) => typingUsers.has(userId);

  return (
    <div className="flex h-[calc(100vh-13rem)] md:h-[calc(100vh-10rem)] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className={`w-72 lg:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 ${showSidebar ? 'flex' : 'hidden'} lg:flex`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Messages</h3>
            <button onClick={() => setShowNewChat(true)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">+ New Chat</button>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{conversations.length} conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
              <FiMessageCircle className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs mt-1">Ask your supervisor or student to start a chat</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOther(conv);
              const active = activeConv?._id === conv._id;
              return (
                <button key={conv._id} onClick={() => loadMessages(conv)}
                  className={`w-full p-3.5 text-left transition-all duration-200 border-b border-gray-100 dark:border-gray-700/50 ${
                    active ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 border-l-2 border-l-transparent'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">{getInitials(other?.name)}</span>
                      </div>
                      {isOnline(other?._id) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{other?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{conv.project?.title || 'Project chat'}</p>
                      <p className="text-[10px] text-gray-400">
                        {isOnline(other?._id) ? <span className="text-emerald-500">● Online</span> : 'Offline'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-w-0 ${showSidebar ? 'hidden' : 'flex'} lg:flex`}>
        {activeConv ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3">
              <button onClick={() => setShowSidebar(true)} className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <FiArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">{getInitials(getOther(activeConv)?.name)}</span>
                </div>
                {isOnline(getOther(activeConv)?._id) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{getOther(activeConv)?.name}</p>
                <p className="text-xs">
                  {isTyping(getOther(activeConv)?._id) ? (
                    <span className="text-primary-500 animate-pulse">typing...</span>
                  ) : isOnline(getOther(activeConv)?._id) ? (
                    <span className="text-emerald-500">● Online</span>
                  ) : (
                    <span className="text-gray-400">Offline</span>
                  )}
                  <span className="text-gray-400 mx-1.5">·</span>
                  <span className="text-gray-400">{activeConv.project?.title}</span>
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/30">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">No messages yet. Start a conversation!</div>
              )}
              {messages.map((msg, i) => {
                const isMe = msg.sender?._id === user._id;
                const showDate = i === 0 || (msg.createdAt && messages[i - 1]?.createdAt && new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString());
                return (
                  <div key={msg._id || i}>
                    {showDate && (
                      <div className="flex items-center justify-center my-3">
                        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                      {!isMe && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center flex-shrink-0 mb-1">
                          <span className="text-[9px] font-semibold text-white">{getInitials(msg.sender?.name)}</span>
                        </div>
                      )}
                      <div className="max-w-[75%] group">
                        <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                          isMe ? 'bg-primary-600 text-white rounded-2xl rounded-br-sm' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-600'
                        }`}>
                          {msg.content && <p>{msg.content}</p>}
                          {msg.fileUrl && (
                            <div className={`mt-1.5 p-2 rounded-lg flex items-center gap-2 ${isMe ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-600'}`}>
                              <FiFile className="w-4 h-4 flex-shrink-0" />
                              <span className="text-xs truncate flex-1">{msg.fileName || 'File'}</span>
                              <a href={msg.fileUrl} target="_blank" rel="noreferrer" download onClick={(e) => e.stopPropagation()}>
                                <FiDownload className="w-4 h-4 hover:opacity-70" />
                              </a>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px] text-gray-400">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          {isMe && msg.status === 'sending' && <FiCheckCircle className="w-3 h-3 text-gray-400" />}
                          {isMe && msg.status === 'sent' && <FiCheckCircle className="w-3 h-3 text-gray-400" />}
                          {isMe && msg.status === 'read' && <FiCheckCircle className="w-3 h-3 text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping(getOther(activeConv)?._id) && (
                <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center">
                    <span className="text-[9px] font-semibold text-white">...</span>
                  </div>
                  typing...
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {showEmoji && (
                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {EMOJIS.map((emoji) => (
                    <button key={emoji} type="button" onClick={() => { setContent((prev) => prev + emoji); setShowEmoji(false); }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-lg">
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowEmoji(!showEmoji)} className="btn-secondary px-3 text-gray-400 hover:text-gray-600">
                  <FiSmile className="w-5 h-5" />
                </button>
                <label className="btn-secondary px-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <FiPaperclip className="w-5 h-5" />
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                </label>
                <input type="text" value={content} onChange={(e) => { setContent(e.target.value); handleTyping(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  className="input-field flex-1" placeholder="Type your message..." />
                <button onClick={sendMessage} disabled={(!content.trim() && !file) || sending} className="btn-primary px-5 disabled:opacity-50">
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
              {file && (
                <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                  <FiFile className="w-4 h-4 text-primary-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 truncate">{file.name}</span>
                  <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500"><FiX className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-gray-900/30">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="w-10 h-10 opacity-40" />
              </div>
              <p className="text-base font-medium text-gray-500 dark:text-gray-400">Select a conversation</p>
              <p className="text-sm text-gray-400 mt-1">Choose a chat from the left to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {showNewChat && (
        <div className="modal-overlay animate-fade-in z-50" onClick={() => setShowNewChat(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Start New Chat</h3>
            <select value={newChatProject} onChange={(e) => setNewChatProject(e.target.value)} className="select-field mb-4">
              <option value="">Select a project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={createNewConversation} className="btn-primary flex-1">Start Chat</button>
              <button onClick={() => setShowNewChat(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
