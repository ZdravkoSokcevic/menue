import React, { useRef, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import '../../../css/components/Login.css'; // Add this file for styles
import LoginAPI from '../../api/Login';
import { useNavigate } from 'react-router-dom';
import TUser from '@/types/TUser';

const Login = () => {
    const navigate = useNavigate();
    const validator = useRef(new SimpleReactValidator({
        element: (message: string) => <div className='text-danger'>{message}</div>,
        validators: {
        // Custom rule for password strength
            strongPassword: {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
                rule: (options) => {
                    const {val, params, validator} = options;
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(val);
                },
                // optional: if you need to pass parameters to your rule
                // messageReplace: (message, params) => message.replace(':min', params[0]),
            },
        }
    }));
    const [credentials, setCredentials] = useState({
        identifier: '',
        password: '',
    });
    const [key, setKey] = useState(Math.random());

    const forceUpdate = () => {
        setKey(Math.random());
    }

    const handleChange = (e: any) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        if(!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
        }else {
            let creds = {
                username: credentials.identifier,
                password: credentials.password
            }
            try {
                console.log('Logging in with:', credentials);
                let success = await LoginAPI.login(creds);
                if(success && success.user && success.access_token) {
                    let u : TUser = success.user;
                    // debugger;
                    // store access token
                    localStorage.setItem('accessToken', success.access_token)
                    localStorage.setItem('user', JSON.stringify(success.user));
                    if(u.role == 'admin')
                        navigate('/admin');
                    else navigate('/home');
                    setKey(Math.random());

                }
            }catch(e) {
                console.error(e);
            }
            // Handle login logic here
            
        }
    };

    return (
        <div className="login-bg d-flex justify-content-center align-items-center vh-100" key={key}>
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-4">Restaurant Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="identifier" className="form-label">Username or Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="identifier"
                            name="identifier"
                            value={credentials.identifier}
                            onChange={handleChange}
                            required
                            placeholder="Enter username or email"
                        />
                        {validator.current.message('identifier', credentials.identifier, 'required|string|max:50')}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                        />
                        {validator.current.message('password', credentials.password, 'required|min:8')}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;