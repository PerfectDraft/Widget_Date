import { useState, useCallback, useEffect } from 'react';
import { chatWithAI } from '../services/api';

const INITIAL_MESSAGES = [
  { role: 'model', text: 'Chào đằng ấy 👋! Mình là trợ lý AI Hẹn Hò. Đằng ấy muốn ăn món Việt, đồ Âu sang chảnh, hay đi một nơi nào đó thật Chill? Cứ tâm sự chi tiết ở đây nha!' }
];

export function useChat(userId: string | null = null) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>(INITIAL_MESSAGES);
  const [isChatting, setIsChatting] = useState(false);

  // Reset when user changes
  useEffect(() => {
    setChatMessages(INITIAL_MESSAGES);
  }, [userId]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const respText = await chatWithAI(chatMessages, userMsg.text);
      setChatMessages(prev => [...prev, { role: 'model', text: respText }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'model', text: 'Hệ thống đang bận, đằng ấy gửi lại nhé!' }]);
    } finally {
      setIsChatting(false);
    }
  }, [chatInput, chatMessages]);

  return {
    isChatOpen, setIsChatOpen,
    chatInput, setChatInput,
    chatMessages, setChatMessages, isChatting,
    handleSendMessage,
  };
}
