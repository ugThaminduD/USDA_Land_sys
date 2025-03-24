import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from '@mui/material'; // Add this for consistent baseline styles


import LandList from "../src/components/Planning & Monitoring Division/LandList";
import LandForm from "../src/components/Planning & Monitoring Division/LandForm";
import LandDetails from "../src/components/Planning & Monitoring Division/LandDetails";
import LandInput from "../src/components/Planning & Monitoring Division/LandInput";



function App() {
  return (
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/input" element={<LandInput onSuccess={() => window.location.reload()} />} />
          <Route path="/edit/land/:id" element={<LandInput />} />
          <Route path="/" element={<LandList />} />
          {/* <Route path="/create" element={<LandForm onSuccess={() => window.location.reload()} />} /> */}
          <Route path="/land/:id" element={<LandDetails />} />
          {/* <Route path="/edit/land/:id" element={<LandForm />} /> */}
        </Routes>
      </Router>
  );
}

export default App;
