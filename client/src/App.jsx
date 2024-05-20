import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HostelList from './components/HostelList';
import RoomList from './components/RoomList';
import InventoryList from './components/InventoryList';
import Dashboard from './components/DashBoard';
import Bsdk from './components/Bsdk';
import Security from './components/Security';
import BedList from './components/BedList';
import SignInPage from './components/auths/Sign-in';
import SignUpPage from './components/auths/Sign-up';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import Home from './components/Home';

function App() {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  console.log(PUBLISHABLE_KEY);

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  return (
    <div id='main'>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Router>
          <Routes>
            <Route path="/sign-in" element={<SignInRedirect />} />
            <Route path="/sign-up" element={<SignUpRedirect />} />
            <Route path="/" element={<Home />} />

            <Route 
              path="/rooms/:roomId/beds" 
              element={
                <SignedIn>
                  <BedList />
                </SignedIn>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              } 
            />

            <Route 
              path="/hostels" 
              element={
                <SignedIn>
                  <HostelList />
                </SignedIn>
              } 
            />

            <Route 
              path="/rooms" 
              element={
                <SignedIn>
                  <RoomList />
                </SignedIn>
              } 
            />

            <Route 
              path='/inventory' 
              element={
                <SignedIn>
                  <InventoryList />
                </SignedIn>
              } 
            />

            <Route 
              path='/nikalbsdk' 
              element={
                <SignedIn>
                  <Bsdk />
                </SignedIn>
              } 
            />
            <Route 
              path='/security' 
              element={
                <SignedIn>
                  <Security />
                </SignedIn>
              } 
            />

            <Route 
              path="*" 
              element={<RedirectToSignIn />} 
            />
          </Routes>
        </Router>
      </ClerkProvider>
    </div>
  );
}

function SignInRedirect() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/security');
    }
  }, [isSignedIn, navigate]);

  return (
    <SignedOut>
      <SignInPage />
    </SignedOut>
  );
}

function SignUpRedirect() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/security');
    } 
  }, [isSignedIn, navigate]);

  return (
    <SignedOut>
      <SignUpPage />
    </SignedOut>
  );
}

export default App;
