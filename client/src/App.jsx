import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import HostelList from './components/HostelList';
import HostelForm from './components/HostelForm';
import RoomList from './components/RoomList';
import ResidentList from './components/ResidentList';
import PaymentList from './components/PaymentList';
import SideBar from './components/Sider';
import  { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './components/login';
import Layout from './context/LayoutContext';
import RentSummaryPage from './components/RentSummary';
import MonthlyExpenses from './components/MonthlyExpenss';
import ResidentForm from './components/RegistrationForm';



const App = () => {
    
  return (
    
    <div style={{display:'flex',minWidth:'100vw',minHeight:'100vh'}}>
        <CssBaseline />
      
      
    <Router>
    <AuthProvider>
    <Layout>
      <Routes>
        
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
          } />
        <Route path="/hostels" element={<ProtectedRoute>
          <HostelList /></ProtectedRoute>
          } />
        {/* <Route path="/hostels/:id" element={<HostelForm />} /> */}
      <Route path='/rooms' element={<ProtectedRoute><RoomList/></ProtectedRoute>}/>
      <Route path='/resident' element={<ProtectedRoute> <ResidentList/> </ProtectedRoute>}/>
      <Route path='/payment' element={<ProtectedRoute><PaymentList/></ProtectedRoute>}/>
      <Route path='/monthly-summary' element={<ProtectedRoute><RentSummaryPage/></ProtectedRoute>}/> 
      <Route path='/monthly-expenses' element={<ProtectedRoute><MonthlyExpenses/></ProtectedRoute>}/> 
      <Route path='/resident-registration' element={<ProtectedRoute><ResidentForm/></ProtectedRoute>}/> 

      {/* <Route path='/booking-page' element={<ProtectedRoute><BookingForm/></ProtectedRoute>}/> */}
      </Routes>
      </Layout>
      </AuthProvider>
    </Router>
    
    </div>
   
  );
};

export default App;














































// import { useState, useEffect } from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import HostelList from './components/HostelList';
// import RoomList from './components/RoomList';
// import InventoryList from './components/InventoryList';
// import Dashboard from './components/DashBoard';
// import Bsdk from './components/Bsdk';
// import Security from './components/Security';
// import BedList from './components/BedList';
// import SignInPage from './components/auths/Sign-in';
// import SignUpPage from './components/auths/Sign-up';
// import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
// import Home from './components/Home';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import Stack from '@mui/material/Stack';
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import CleaningChart from './components/CleaningChart';
// import NewResidentList from './components/newResidentlist';
// import StudentForm from './components/StudentForm';
// import AmountForm from './components/amountUpdate';
// import Payment from './components/Payment';
// import CashPayments from './components/CashPayments';


// const theme = createTheme({
//   components: {
//     MuiStack: {
//       defaultProps: {
//         useFlexGap: true,
//       },
//     },
//   },
// });


// function App() {
//   const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
//   console.log(PUBLISHABLE_KEY);

//   if (!PUBLISHABLE_KEY) {
//     throw new Error("Missing Publishable Key");
//   }

//   return (
//     <div id='main'>
      
//       <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
//       <ThemeProvider theme={theme}>
//         <Router style={{ display: 'flex' , flexDirection:'column' }}>
//        <Header/>
//           <Routes>
//             <Route path="/sign-in" element={<SignInRedirect />} />
//             <Route path="/sign-up" element={<SignUpRedirect />} />
//             <Route path="/" element={<Home />} />

//             <Route 
//               path="/rooms/:roomId/beds" 
//               element={
//                 <SignedIn>
//                   <BedList />
//                 </SignedIn>
//               } 
//             />
//              <Route path="/hostels/:hostelId/cleaning-chart" element={ <SignedIn><CleaningChart/></SignedIn>} />
//             <Route 
//               path="/dashboard" 
//               element={
//                 <SignedIn>
//                   <Dashboard />
//                 </SignedIn>
//               } 
//             />

//             <Route 
//               path="/hostels" 
//               element={
//                 <SignedIn>
//                   <HostelList />
//                 </SignedIn>
//               } 
//             />
//             <Route  
//               path='/amount-form'
//               element={
//                 <SignedIn>
//                   <AmountForm />
//                 </SignedIn>
//               }/>
//             <Route 
//               path="/student-form" 
//               element={
//                 <SignedIn>
//                   <StudentForm />
//                 </SignedIn>
//               } 
//             />
//               <Route 
//               path="/payments" 
//               element={
//                 <SignedIn>
//                   <Payment />
//                 </SignedIn>
//               } 
//             />
//                          <Route 
//               path="/cashPayment" 
//               element={
//                 <SignedIn>
//                   <CashPayments />
//                 </SignedIn>
//               } 
//             />
//             <Route 
//               path="/new-resident" 
//               element={
//                 <SignedIn>
//                   <NewResidentList />
//                 </SignedIn>
//               } 
//             />
//             <Route 
//               path="/rooms" 
//               element={
//                 <SignedIn>
//                   <RoomList />
//                 </SignedIn>
//               } 
//             />

//             {/* <Route 
//               path='/inventory' 
//               element={
//                 <SignedIn>
//                   <InventoryList />
//                 </SignedIn>
//               } 
//             /> */}

//             <Route 
//               path='/nikalbsdk' 
//               element={
//                 <SignedIn>
//                   <Bsdk />
//                 </SignedIn>
//               } 
//             />
//             <Route 
//               path='/security' 
//               element={
//                 <SignedIn>
//                   <Security />
//                 </SignedIn>
//               } 
//             />
//                {/* <Route 
//               path='/createManagerForm' 
//               element={
//                 <SignedIn>
//                   <CreateManagerForm/>
//                 </SignedIn>
//               } 
//             /> */}

//             <Route 
//               path="*" 
//               element={<RedirectToSignIn />} 
//             />
//           </Routes>
//         </Router>
//         </ThemeProvider>
//       </ClerkProvider>
//        */}
//     </div>
//   );
// }

// function SignInRedirect() {
//   const { isSignedIn } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isSignedIn) {
//       navigate('/security');
//     }
//   }, [isSignedIn, navigate]);

//   return (
//     <SignedOut>
//       <SignInPage />
//     </SignedOut>
//   );
// }

// function SignUpRedirect() {
//   const { isSignedIn } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isSignedIn) {
//       navigate('/security');
//     } 
//   }, [isSignedIn, navigate]);

//   return (
//     <SignedOut>
//       <SignUpPage />
//     </SignedOut>
//   );
// }

// export default App;
