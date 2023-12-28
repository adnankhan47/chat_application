import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
});

export default socket;