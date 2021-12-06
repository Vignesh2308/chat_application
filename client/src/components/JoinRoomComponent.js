import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from '../utils/toast'
import http from '../utils/http'

const JoinRoom = () => {
    const [roomName, setRoomName] = useState("")
    const navigate = useNavigate();

    const handleJoin = () => {
        if (roomName === null || roomName === "") {
            toast.error("Room Number is mandatory");
            return
        }
        else {
            http.post(`/join`, roomName).then(response => {
                if (response.status === 200) {
                    toast.success("Joined Successfully")
                    navigate(`/chat/${roomName}`);
                }
            })
                .catch(error => {
                    toast.error(error);
                })
        }
    }
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div className="App-header">
            <h1 style={{display:"inline-block"}}>Join Room
                <button style={{float:"right", marginTop:"25px"}} onClick={handleLogout}>Logout</button>
            </h1>
            <input type="text" name="roomName" value={roomName} placeholder="Enter the roomName" onChange={(e) => setRoomName(e.target.value)} />
            <button onClick={handleJoin}>Join</button>
        </div>
    )
}

export default JoinRoom;