import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from "axios";
// import backgroundImage from '../Planning & Monitoring Division/images/letterformbg.jpg';
import "./LandForm.css"


const LandForm = ({ landId, onSuccess }) => {
    const [formData, setFormData] = useState({
        Provinces: "",
        Districts: "",
        Divisional_secretariats: "",
        Grama_Niladhari_divisions: "",

        Land_address: "",
        Land_location: "",
        Area_of_Land: "",
        Land_description: "",

        local_employee_name: "",
        local_employee_phone_number: "",

        USDA_Entry_employee_name: "",
        Day_of_Entry: "",

        Land_owner_name: "",
        email: "",
        phone_number: ""
    });

    useEffect(() => {
        if (landId) {
            axios.get(`/get/land/${landId}`)
                .then(res => setFormData(res.data))
                .catch(err => console.error(err));
        }
    }, [landId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleProvinceSelect = (province) => {
        setFormData({ ...formData, Provinces: province });
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiCall = landId 
            ? axios.put(`/update/land/${landId}`, formData)
            : axios.post("/add", formData);
        
        apiCall.then(() => {
            alert(landId ? "Land updated successfully!" : "Land created successfully!");
            onSuccess();
        }).catch(err => console.error(err));
    };

    

    return (
        <div>
            <form onSubmit={handleSubmit} className="container mt-4">
                <div className="LandForm" >

                    <h1>{landId ? "Edit Land Entry" : "Create Land Entry"}</h1>

                    <div className="container_Land">
                        <h3>Land Location</h3>
                        <div className="dropdown">
                            <label htmlFor="dropdownMenu" className="form-label">Select the Province:</label>
                            <button type="button"
                                className="dropdown_btn"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {formData.Provinces || "select"}
                            </button>
                            <div className="dropdown-menu">
                                {/* Sri Lanka Provinces */}
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Central Province")}>Central Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Eastern Province")}>Eastern Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("North Central Province")}>North Central Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Northern Province")}>Northern Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("North Western Province")}>North Western Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Sabaragamuwa Province")}>Sabaragamuwa Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Southern Province")}>Southern Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Uva Province")}>Uva Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Western Province")}>Western Province</a>
                            </div>
                        </div>

                        <div className="dropdown">
                            <label htmlFor="dropdownMenu" className="form-label">Select the District:</label>
                            <button type="button"
                                className="dropdown_btn"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {formData.Provinces || "select"}
                            </button>
                            <div className="dropdown-menu">
                                {/* Sri Lanka Provinces */}
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Central Province")}>Central Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Eastern Province")}>Eastern Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("North Central Province")}>North Central Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Northern Province")}>Northern Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("North Western Province")}>North Western Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Sabaragamuwa Province")}>Sabaragamuwa Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Southern Province")}>Southern Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Uva Province")}>Uva Province</a>
                                <a className="dropdown-item" onClick={() => handleProvinceSelect("Western Province")}>Western Province</a>
                            </div>
                        </div>



                        {/* <div className="form-group">
                            <input type="text" 
                                name="Districts" 
                                className="form-control"
                                placeholder="District" 
                                value={formData.Districts} 
                                onChange={handleChange} 
                                required 
                            />
                        </div> */}
                        
                        <div className="form-group">
                            <input type="text" 
                                name="Divisional_secretariats" 
                                className="form-control"
                                placeholder="Divisional Secretariat" 
                                value={formData.Divisional_secretariats} 
                                nChange={handleChange} 
                                required 
                            />
                        </div> 
                    </div>
                    
                    <div className="container_Land_Details">
                        <h3>Land Details</h3>
                        <div className="form-group">
                            <input type="text" 
                                name="Land_location" 
                                className="form-control"
                                placeholder="Land Location" 
                                value={formData.Land_location} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <input type="text" 
                                name="Area_of_Land" 
                                className="form-control"
                                placeholder="Area of Land" 
                                value={formData.Area_of_Land} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="container_Ownership">
                        <h3>Land Ownership</h3>
                        <div className="form-group">
                            <input type="text" 
                                name="Land_owner_name" 
                                className="form-control"
                                placeholder="Owner Name" 
                                value={formData.Land_owner_name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <input type="email" 
                                name="email" 
                                className="form-control"
                                placeholder="Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <input type="text" 
                                name="phone_number" 
                                className="form-control"
                                placeholder="Phone Number" 
                                value={formData.phone_number} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <button type="submit">{landId ? "Update Land" : "Create Land"}</button>
                </div>
            </form>
        </div>
    );
};

export default LandForm;
