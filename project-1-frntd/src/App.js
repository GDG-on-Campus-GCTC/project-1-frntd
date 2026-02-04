import { useEffect, useState } from 'react';
import './App.css';
import { checkAuthStatus } from './services/agent';

function App() {
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await checkAuthStatus();
      setBackendData(data);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔌 Backend Connection Test</h1>
        
        {loading && <p>Testing connection...</p>}
        
        {error && (
          <div style={{ color: '#ff4444', padding: '20px', background: '#ffe6e6', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
            <h3>❌ Connection Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {backendData && (
          <div style={{ padding: '20px', background: '#e6ffe6', borderRadius: '8px', marginTop: '20px', maxWidth: '600px' }}>
            <h3>✅ Backend Connected Successfully!</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Your frontend is now communicating with the backend on port 3000
            </p>
            <div style={{ marginTop: '15px', textAlign: 'left' }}>
              <strong>Response from backend:</strong>
              <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px', color: '#000', overflow: 'auto', marginTop: '10px' }}>
                {JSON.stringify(backendData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <button 
          onClick={testBackendConnection}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            background: '#61dafb',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          🔄 Test Connection Again
        </button>
      </header>
    </div>
  );
}

export default App;