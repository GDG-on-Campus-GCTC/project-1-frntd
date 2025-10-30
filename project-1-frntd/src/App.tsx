import LightRays from './components/LightRays';
import InputBox from './components/InputBox';

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Full-page background light rays */}
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


      <div>
      <InputBox/>
    </div> 

    </div>
  );
}

export default App;
