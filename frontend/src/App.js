import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from '@mui/material'; // Add this for consistent baseline styles


import LandList from "../src/components/Planning & Monitoring Division/LandList";
import LandDetails from "../src/components/Planning & Monitoring Division/LandDetails";
import LandInput from "../src/components/Planning & Monitoring Division/LandInput";
import ExcelFile_Upload from "../src/components/Planning & Monitoring Division/ExcelFile_Upload";
import ExcelDataView from "../src/components/Planning & Monitoring Division/ExcelDataView";
import ExcelFilesList from "../src/components/Planning & Monitoring Division/ExcelFilesList";



function App() {
  return (
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/input" element={<LandInput onSuccess={() => window.location.reload()} />} />
          <Route path="/edit/land/:id" element={<LandInput />} />
          <Route path="/" element={<LandList />} />
          <Route path="/land/:id" element={<LandDetails />} />

          <Route path="/upload/excelDocument" element={<ExcelFile_Upload />} />
          <Route path="/excel/data/view" element={<ExcelDataView />} />
          <Route path="/excel/files" element={<ExcelFilesList />} />
          <Route path="/excel/file/:id" element={<ExcelDataView />} />
          
        </Routes>
      </Router>
  );
}

export default App;
