import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Icon, InputAdornment, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Login = () => {
  const [uniqueId, setuniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword,setShowPassword] = useState(false);

  const handleShowPassword =()=>{
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(uniqueId, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className='min-h-screen flex items-center justify-center' style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}}>
     <Box component="form" className='flex flex-col justify-center w-full items-center gap-4' onSubmit={handleSubmit} sx={{ maxHeight:'100%', maxWidth: 400, mx: 'auto', mt: 10, p: 3, border: '1px solid #ccc', borderRadius: 4,alignItems:"center",justifyContent:'center' }}>
     {/* <a href="/"> <img className='' src="/images/beiyo_logo2.svg" alt="" /></a> */}
      <div>
      <Typography variant="h4" align="center" >Login</Typography>
      <Typography variant="h6" align="center"> Beiyo Dashboard</Typography> 
      </div>
      {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}
     <div className='flex flex-col gap-1 w-full'>
     <TextField
        label="UniqueID"
        type="text"
        value={uniqueId}
        onChange={(e) => setuniqueId(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
      <TextField
      label="Password"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      fullWidth
      sx={{ mb: 2 }}
      required
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleShowPassword}
              edge="end"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword?<EyeIcon/>:<EyeOffIcon/>}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
       <Link to='/forget-password'>Forget Password</Link>
       <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
     </div>
    </Box>
   
   </div>
  );
};

export default Login;
