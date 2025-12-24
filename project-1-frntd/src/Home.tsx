import { useState, useEffect } from 'react';
import LightRays from './components/LightRays';
import InputBox from './components/InputBox';
import SplitText from './components/SplitText';
import PillNav from './components/PillNava';
import LogoutButton from './components/LogoutButton';
import NewChatButton from './components/NewChatButton';
import ChatContainer, { Message } from './components/ChatContainer';
import logo from './assets/logo.png';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Mark as animated after initial mount
    setHasAnimated(true);
  }, []);

  useEffect(() => {
    // Disable scrolling on home page
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setIsLoading(false);
  };



  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const generateAIResponse = (userMessage: string): string => {
    // Simulated AI responses - replace with actual API call
    const responses = [
      "That's an interesting question! Let me help you with that.",
    ];
    
    // For demo purposes, return a random response
    return responses[Math.floor(Math.random() * responses.length)] + 
           `\n\nYou asked: "${userMessage}"\n\nThis is a simulated response need to add actual AI integration.`;
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `assistant-${Date.now()}`,
        content: generateAIResponse(content),
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="#E6E6FA"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />
      <LogoutButton/>
      {hasMessages && <NewChatButton onClick={handleNewChat} />}
      <PillNav
        logo={logo}
        logoAlt="GCET Study Hub"
        items={navItems}
        activeHref="/"
        ease="power2.easeOut"
        baseColor="rgba(255, 255, 255, 0.95)"
        pillColor="rgba(255, 255, 255, 0.15)"
        hoveredPillTextColor="#0a0a0a"
        pillTextColor="rgba(255, 255, 255, 0.9)"
        initialLoadAnimation={!hasAnimated}
      />

      {!hasMessages && (
        <div className="absolute top-[25%] left-0 right-0 z-20 w-full px-6">
          <div className="flex flex-col items-center justify-center w-full">
            <SplitText
              text="Welcome to GCET Study Hub"
              tag="h1"
              className="welcome-text"
              splitType="chars"
              delay={35}
              duration={1}
              from={{ opacity: 0, y: 40, scale: 0.95 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              ease="power2.out"
              threshold={0.1}
              textAlign="center"
            />

            <SplitText
              text="Your AI-Powered Learning Companion"
              tag="p"
              className="subtitle-text"
              splitType="words"
              delay={35}
              duration={1}
              from={{ opacity: 0, y: 40, scale: 0.95 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              ease="power2.out"
              threshold={0.1}
              textAlign="center"
            />
          </div>
        </div>
      )}

      {hasMessages && <ChatContainer messages={messages} isLoading={isLoading} />}

      <InputBox onSendMessage={handleSendMessage} hasMessages={hasMessages} />
    </div>
  );
}

export default App;