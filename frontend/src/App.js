import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from '@mui/material'; // Add this for consistent baseline styles


import Login from "./components/Users_Login/User_login";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import ProtectedRoute from "./components/Users_Login/ProtectedRoute";

import PlanningWelcomePage from './components/Planning & Monitoring Division/Welcome_Page';
import DataList_Page from "./components/Planning & Monitoring Division/DataList_Page";
import DataDetails_Page from "./components/Planning & Monitoring Division/DataDetails_Page";
import DataInput_Page from "./components/Planning & Monitoring Division/DataInput_Page";

import ExcelFile_Upload from "../src/components/Planning & Monitoring Division/ExcelFile_Upload";
import ExcelDataView from "../src/components/Planning & Monitoring Division/ExcelDataView";
import ExcelFilesList from "../src/components/Planning & Monitoring Division/ExcelFilesList";

// testing 
// import LandDetailsInput from "../src/components/Planning & Monitoring Division/LandInput copy";
// import LandDetailsView from '../src/components/Planning & Monitoring Division/LandDetails copy';
// import LandListVIew from '../src/components/Planning & Monitoring Division/LandList copy';
   

// function App() {
//   return (
//       <Router>
//         <CssBaseline />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/admin" element={<AdminPanel />} />


//           <Route path="/" element={<PlanningWelcomePage />} />
//           <Route path="/data/input" element={<DataInput_Page onSuccess={() => window.location.reload()} />} />
//           <Route path="/edit/data/:id" element={<DataInput_Page />} />
//           <Route path="/data/list" element={<DataList_Page />} />
//           <Route path="/data/details/:id" element={<DataDetails_Page />} />


// {/* testing */}
//           {/* <Route path="/land/input" element={<LandDetailsInput onSuccess={() => window.location.reload()} />} />
//           <Route path="/land/details/:id" element={<LandDetailsView />} /> 
//           <Route path="/Land/List" element={<LandListVIew />} /> */}


//           <Route path="/upload/excelDocument" element={<ExcelFile_Upload />} />
//           <Route path="/excel/data/view" element={<ExcelDataView />} />
//           <Route path="/excel/files" element={<ExcelFilesList />} />
//           <Route path="/excel/file/:id" element={<ExcelDataView />} />
          
//         </Routes>
//       </Router>
//   );
// }



function App() {
  return (
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <PlanningWelcomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/data/input" element={
            <ProtectedRoute>
              <DataInput_Page onSuccess={() => window.location.reload()} />
            </ProtectedRoute>
          } />
          
          <Route path="/edit/data/:id" element={
            <ProtectedRoute>
              <DataInput_Page />
            </ProtectedRoute>
          } />
          
          <Route path="/data/list" element={
            <ProtectedRoute>
              <DataList_Page />
            </ProtectedRoute>
          } />
          
          <Route path="/data/details/:id" element={
            <ProtectedRoute>
              <DataDetails_Page />
            </ProtectedRoute>
          } />

          <Route path="/upload/excelDocument" element={
            <ProtectedRoute>
              <ExcelFile_Upload />
            </ProtectedRoute>
          } />
          
          <Route path="/excel/data/view" element={
            <ProtectedRoute>
              <ExcelDataView />
            </ProtectedRoute>
          } />
          
          <Route path="/excel/data/view/:id" element={
            <ProtectedRoute>
              <ExcelDataView />
            </ProtectedRoute>
          } />
          
          <Route path="/excel/files" element={
            <ProtectedRoute>
              <ExcelFilesList />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
  );
}

export default App;
