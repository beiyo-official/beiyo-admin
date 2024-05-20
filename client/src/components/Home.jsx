import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Welcome to the Admin Dashboard</h2>
    <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Sign Up</Link>
  </div>
);

export default Home;
