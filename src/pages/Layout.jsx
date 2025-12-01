
import React from 'react';
import AIChatbot from '@/components/chat/AIChatbot';

export default function Layout({ children, currentPageName }) {
  // Don't show chatbot on landing page
  const showChatbot = currentPageName !== 'Landing';

  return (
    <div className="min-h-screen">
      {children}
      {showChatbot && <AIChatbot />}
    </div>
  );
}
