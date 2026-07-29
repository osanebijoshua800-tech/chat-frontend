import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat-backend-9wx6.onrender.com');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send-message', {
        sender: username,
        text: message
      });
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>💬 Realtime Chat</h2>
      <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
        style={{ width: '80%', padding: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px', width: '18%' }}>Send</button>
    </div>
  );
}

export default App;