// import logo from './logo.svg';
// import './App.css';

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandList from "../src/components/Planning & Monitoring Division/LandList";
import LandForm from "../src/components/Planning & Monitoring Division/LandForm";
import LandDetails from "../src/components/Planning & Monitoring Division/LandDetails";




function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<LandList />} />
            <Route path="/create" element={<LandForm onSuccess={() => window.location.reload()} />} />
            <Route path="/land/:id" element={<LandDetails />} />
            <Route path="/edit/:id" element={<LandForm />} />
        </Routes>
      </Router>
  );
}

export default App;
