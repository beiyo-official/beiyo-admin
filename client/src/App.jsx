import { useState } from 'react'
// import '@radix-ui/themes/styles.css';
import './App.css'
// import 'swiper/css';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import HostelList from './components/HostelList';
import RoomList from './components/RoomList';
import InventoryList from './components/InventoryList';
import Dashboard from './components/DashBoard';
// import Homepage from './pages/Homepage';
// import About from './pages/About';
// import Hostel from './pages/Hostel';
// import Navbar from './pages/Home page/Nav';
// import AOS from 'aos';
// import 'aos/dist/aos.css'; 
// import Footer from './pages/Home page/Footer';
// import HostelDetail from './pages/HostelDetail';
// import Privacypolicy from './pages/FooterComponents/Privacypolicy';
// import OwnerForm from './components/OwnerForm';
// import HomeOfConduct from './pages/FooterComponents/HomeOfConduct';
// import Achievement from './pages/FooterComponents/Achievement';
// import ListYourProperty from './pages/ListYourProperty';

// AOS.init();



function App() {


  return (
    <div id='main'>
  <Router>
         <Routes>
         <Route path="/" exact element={<Dashboard />} />
         <Route path="/hostels" exact element={<HostelList />} />
          <Route path="/rooms" exact element={<RoomList />} />
          <Route path='/inventory' exact element={ <InventoryList />}/>
         </Routes>
  </Router>
    </div>
  )
}

export default App