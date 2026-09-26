import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Onboard from './pages/Onboard';
import Attendance from './pages/Attendance';
import FoodSelection from './pages/FoodSelection';
import Photo from './pages/Photo';
import Finish from './pages/Finish';
import Admin from './pages/Admin';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Onboard />} />
        <Route path="/attendance/:teamId" element={<Attendance />} />
        <Route path="/food/:teamId" element={<FoodSelection />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/finish" element={<Finish />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative overflow-x-hidden">
      {/* Header Logo */}
      <div className="w-full flex justify-center pt-8 pb-4 px-4">
        <img 
          src="/RED-Cypher-Colour-Dark.png" 
          alt="RED Cypher Logo" 
          className="h-24 md:h-32 object-contain drop-shadow-md"
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 z-10">
        <Router>
          <AnimatedRoutes />
        </Router>
      </div>

    </div>
  );
}

export default App;
