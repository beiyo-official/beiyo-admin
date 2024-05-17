import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Security = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // useNavigate hook from react-router-dom for navigation

    const handleSubmit = () => {
        if(password === 'onlyvirgins'){
            navigate('/dashboard');
        } else {
            navigate('/nikalbsdk');
        }
    };

    return (
        <div>
            <h1>Enter the PassKey</h1>
            <label>
                PassKey:
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </label>
            <button onClick={handleSubmit}>Enter</button> {/* Use onClick instead of onSubmit */}
        </div>
    );
};

export default Security;
