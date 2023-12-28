import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Register from './components/Register';
import Login from './components/Login';
import Message from './components/Message';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />   
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/message" element={<Message />} />
          </Routes> 
        </Router>
      </div>
    );
  }
}


export default App;




