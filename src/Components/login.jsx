import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://iic-backend-lcp6.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log(result)
            if (response.ok) {
                toast.success('Login successful');
                localStorage.setItem('token', `${result.token}`);
                // localStorage.setItem('isAdmin', );
                setTimeout(()=>{
                    window.location.reload() 
                },500)
                // console.log(result)
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>Want to signup?<a className='mx-2' href={"/signup"}>signup</a></div>
                <div className="d-flex justify-content-end mt-2">
                    <Button className='mx-2' variant="primary" type={"submit"} >Login</Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
