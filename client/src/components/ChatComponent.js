import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import toast from '../utils/toast'
import ScrollToBottom from 'react-scroll-to-bottom';
var io = require('socket.io-client')


const END_POINT = "http://localhost:3000";

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const username = localStorage.getItem("username");
    var socket = io.connect({ path: END_POINT, reconnect: true });
    const { roomname } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        socket.emit('join', { username, roomname }, (error) => {
            if (error) {
                toast.error(error);
            }
        });
    }, [END_POINT]);

    useEffect(() => {
        setMessages([{text: `Hello ${username}`, user:"admin"}])
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    }

    const leaveRoom = () => {
        navigate('/join');
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
        setMessages(prevState => ([...prevState, { text: message, user: username }]))
        var messageContainer = document.getElementById("messageBox");
        console.log(messageContainer)
        messageContainer.scrollIntoView(false)
        setMessage("")
    }

    return (
        <div className="App-header">
            <h1 style={{display:"inline-block"}}>Chat Room : {roomname}
                <button style={{float:"right", marginTop:"25px"}} onClick={handleLogout}>Logout</button>
            </h1>
            <div className="container">
                <div className="messageBox" id="messageBox">
                    <ScrollToBottom className="scrollBar">
                        {messages.map((message, index) => (
                            <>
                                <p key={index} className={message.user === username ? "messageRight" : "messageLeft"}>{message.text} <small className="userName">{message.user}</small></p>
                            </>
                        ))}
                    </ScrollToBottom>
                </div>
                <form className="form">
                    <input
                        className="messageInput"
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={({ target: { value } }) => setMessage(value)}
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
                </form>
            </div>
                <button className="sendButton" onClick={leaveRoom}>Leave Room</button>
        </div>
    )
}

export default Chat;