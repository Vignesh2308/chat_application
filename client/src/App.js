import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LoginComponent';
import Register from './components/RegisterComponent';
import JoinRoom from './components/JoinRoomComponent';
import Chat from './components/ChatComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Navigate to="/login" />} />
        <Route path="/login" exact element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/join" element={<JoinRoom/>} />
        <Route path="/chat/:roomname" element={<Chat/>} />
      </Routes>
    </Router>
  );
}

export default App;
