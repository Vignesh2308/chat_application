import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../utils/http";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        setFormData(prevState => ({ ...prevState, [name]: value }))
    }

    const handleRegister = ()=>{
        const {username, password, email, confirmPassword} = formData;
        if(username === null || username===""){
            toast.error("User Name is mandatory");
            return
        }
        else if (email === null || email === ""){
            toast.error("Email is mandatory");
            return
        }
        else if (password === null || password === ""){
            toast.error("Password is mandatory");
            return
        }
        else if (password !== confirmPassword){
            toast.error("Password does not match");
            return
        }
        else{
            http.post(`/register`, formData).then(response=>{
                if(response.status === 200){
                    toast.success("Registration Successful")
                    navigate('/login');
                }
                console.log(response);
            })
            .catch(error=>{
                toast.error(error);
            })
        }
    }

    return (
        <div className="App-header">
            <h1>Register</h1>
            <input type="text" name="username" value={formData.username} placeholder="Enter the username" onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
            <input type="email" name="email" value={formData.email} placeholder="Enter your email" onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
            <input type="password" name="password" value={formData.password} placeholder="Enter the password" onChange={(e) => handleInputChange(e.target.name, e.target.value)}/>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="Re-Enter the username" onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            <p className="contents">Existing User ? </p>
            <Link className="contents" to="/login">Login here</Link>
        </div>
    )
}

export default Register;