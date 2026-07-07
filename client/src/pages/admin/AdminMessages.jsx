import { useState, useEffect } from 'react';
import { messageAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDateTime, getInitials } from '../../utils/helpers';
import { FiMessageCircle, FiChevronRight } from 'react-icons/fi';

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    messageAPI.getConversations()
      .then(({ data }) => setConversations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadMessages = async (conv) => {
    setSelected(conv);
    try {
      const { data } = await messageAPI.getMessages(conv._id);
      setMessages(data);
    } catch {}
  };

  const getOtherParticipants = (conv) => {
    return conv?.participants?.filter((p) => p.role !== 'admin').map((p) => p.name).join(', ') || 'Unknown';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="All Conversations" subtitle="Monitor all chat conversations" />
      <div className="flex h-[calc(100vh-13rem)] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="w-72 lg:w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Conversations ({conversations.length})</h3>
          </div>
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No conversations</div>
          ) : (
            conversations.map((conv) => (
              <button key={conv._id} onClick={() => loadMessages(conv)}
                className={`w-full p-3.5 text-left transition-all border-b border-gray-100 dark:border-gray-700/50 ${
                  selected?._id === conv._id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 border-l-2 border-l-transparent'
                }`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                    <FiMessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{getOtherParticipants(conv)}</p>
                    <p className="text-xs text-gray-400 truncate">{conv.project?.title || 'Project chat'}</p>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
            ))
          )}
        </div>
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{getOtherParticipants(selected)}</p>
                <p className="text-xs text-gray-400">{selected.project?.title}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/30">
                {messages.map((msg, i) => (
                  <div key={msg._id || i} className={`flex ${msg.sender?.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      msg.sender?.role === 'admin'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm shadow-sm'
                    }`}>
                      <p>{msg.content}</p>
                      {msg.fileUrl && <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="block mt-1 text-xs underline opacity-80">View file</a>}
                      <p className="text-[10px] mt-1 opacity-60">{formatDateTime(msg.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-gray-900/30">
              <div className="text-center">
                <FiMessageCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
