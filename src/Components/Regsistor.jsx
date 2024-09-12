import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {

    const Navigate=useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        branch: '',
        year: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://iic-backend-lcp6.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Registration successful');
                Navigate("/")
                // localStorage.setItem('token', result.token);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className='container'>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='name' required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='email' required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder='password' required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder='phone' required />
                </div>
                <div>
                    <label>Branch:</label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder='branch' required />
                </div>
                <div>
                    <label>Year:</label>
                    <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder='year' required />
                </div>
                <div className="d-flex justify-content-end mt-2">
                    <Button type="submit">Register</Button>
                </div>
            </form>
        </div>
    );
};

export default Register;
