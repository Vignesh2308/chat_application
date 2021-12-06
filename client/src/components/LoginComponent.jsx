import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from '../utils/toast'
import http from '../utils/http'

const Login = ()=>{
    const [formData, setFormData] = useState({
        username:"",
        password:"",
    })
    const navigate = useNavigate();

    const handleInputChange = (name, value)=>{
        setFormData(prevState=> ({...prevState,[name]:value}))
    }

    const handleLogin = ()=>{
        const {username, password} = formData;
        if(username === null || username===""){
            toast.error("User Name is mandatory");
            return
        }
        else if (password === null || password === ""){
            toast.error("Password is mandatory");
            return
        }
        else{
            http.post(`/login`, formData).then(response=>{
                if(response.status === 200){
                    localStorage.setItem("authToken", response.data.token)
                    localStorage.setItem("username", response.data.user_name)
                    localStorage.setItem("email", response.data.email)
                    toast.success("Login Successful")
                    navigate('/join');
                }
            })
            .catch(error=>{
                toast.error(error);
            })
        }
    }


    return(
        <div className="App-header">
            <h1>Login</h1>
            <input type="text" name="username" value={formData.username} placeholder="Enter the username" onChange={(e)=>handleInputChange(e.target.name, e.target.value)}/>
            <input type="password" name="password" value={formData.password} placeholder="Enter the password" onChange={(e) => handleInputChange(e.target.name, e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
            <p className="contents">New User ? </p>
            <Link className="contents" to="/register" >Sign Up here</Link>
        </div>
    )
}

export default Login;