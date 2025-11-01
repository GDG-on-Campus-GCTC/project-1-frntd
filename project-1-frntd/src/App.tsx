import LightRays from './components/LightRays';
import InputBox from './components/InputBox';
import SplitText from './components/SplitText';
import PillNav from './components/PillNava';
import LogoutButton from './components/LogoutButton';
import logo from './assets/logo.png';

function App() {
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/courses' },
    { label: 'Contact', href: '/about' }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
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
        initialLoadAnimation={true}
      />

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
            onLetterAnimationComplete={handleAnimationComplete}
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

      <InputBox />
    </div>
  );
}

export default App;