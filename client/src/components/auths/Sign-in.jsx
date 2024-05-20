import { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';
// import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  

  return (
    <div>
      <h2>Sign In</h2>
      <SignIn/>
    </div>
  );
};

export default SignInPage;
