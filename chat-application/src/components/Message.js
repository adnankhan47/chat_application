import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
});


function Message() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    console.log('Connecting to Socket.IO server...');

    const handleChatMessage = (message) => {
      console.log('Received chat message:', message);
      setChat((prevChat) => [...prevChat, { from: 'cb', msag: message }]);
    };

    socket.on('chatMessage', handleChatMessage);

    return () => {
      console.log('Disconnecting from Socket.IO server...');
      socket.off('chatMessage', handleChatMessage);
    };
  }, []); 

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const handleSend = async () => {
    if (msg !== '') {
      try {
        socket.emit("ask", msg);

        setChat((prevChat) => [
          ...prevChat,
          { from: 'our', msag: msg },
        ]);

        setMsg('');
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleLogout = () => {
    // Clearing token and username from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Navigate to the login screen
    navigate('/login');
  };

  return (
    <div>

      <div className="info_n_logout">
        <h2 className="username" >Welcome, {username}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="chatContainer">
        <div id="chatt" className="chatt" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          {chat.map((msg, index) => (
            <div key={index} className={msg.from === 'cb' ? 'bot' : 'user'}>
              {msg.msag}
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: '10px' }}>
        <div className="input">
          <input
            type="text"
            name="msg"
            placeholder="What would you like to ask the bot..."
            onChange={(e) => handleChange(e)}
            className="form-control"
            value={msg}
          />
          <button onClick={() => handleSend()} className="btn btn-primary">
            <b>Send a Message 🚀</b>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;

