import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const initialMessages = [
  {
    role: 'bot',
    text: 'Welcome to NYC Transit Voice Bot! Click 🎙️ to ask when the next bus/train arrives, and I will speak back guide + GTABUS promo.'
  }
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [prompt, setPrompt] = useState('');
  const [lat, setLat] = useState('40.7128');
  const [lon, setLon] = useState('-74.0060');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const recognitionRef = useRef();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
      setMessages((prev) => [...prev, { role: 'user', text: transcript }]);
      handleChat(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const speakText = (text) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleChat = async (message) => {
    if (!message?.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/chat', {
        message,
        lat,
        lon
      });
      const reply = response.data?.reply || 'Sorry, service unavailable.';
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
      if (speechEnabled) speakText(reply);
    } catch (error) {
      const errText = 'Chat request failed. Try again.';
      setMessages((prev) => [...prev, { role: 'bot', text: errText }]);
      console.error(error);
      if (speechEnabled) speakText(errText);
    } finally {
      setLoading(false);
    }
  };

  const onSend = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setPrompt('');
    await handleChat(trimmed);
  };

  const onVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser. Use Chrome/Edge mobile/desktop.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const runExampleQuery = (q) => {
    setPrompt(q);
  };

  return (
    <div className="app">
      <header>
        <h1>NYC Transit Voice Chatbot</h1>
        <small>Use mic on the right, or type and send. Voice replies via speech synthesis.</small>
      </header>

      <div style={{ marginTop: 16 }}>
        <label>Latitude</label>
        <input value={lat} onChange={(e) => setLat(e.target.value)} />
        <label>Longitude</label>
        <input value={lon} onChange={(e) => setLon(e.target.value)} />
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => runExampleQuery('When is the next bus near me?')} style={{ marginRight: 8 }}>
          Example: next bus
        </button>
        <button onClick={() => runExampleQuery('Recommend places to visit nearby.')}>Example: suggestions</button>
      </div>

      <div className="chat">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.role}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea
          rows={2}
          value={prompt}
          placeholder="Ask: next bus/train arrival, or where should I go?"
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={onSend} disabled={loading}>
            {loading ? 'Loading...' : 'Send'}
          </button>
          <button onClick={onVoice} style={{ background: isListening ? '#e11d48' : '#f97316' }}>
            {isListening ? 'Stop 🎙️' : 'Speak 🎙️'}
          </button>
          <button onClick={() => setSpeechEnabled((v) => !v)}>{speechEnabled ? '🔊 Voice On' : '🔇 Voice Off'}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
