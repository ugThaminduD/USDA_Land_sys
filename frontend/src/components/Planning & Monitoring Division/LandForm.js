import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from "axios";
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


    const provinces = [
        "Central Province", "Eastern Province", "North Central Province",
        "Northern Province", "North Western Province", "Sabaragamuwa Province",
        "Southern Province", "Uva Province", "Western Province"
    ];

    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", 
        "Colombo", "Galle", "Gampaha", "Hambantota", 
        "Jaffna", "Kalutara", "Kandy", "Kegalle", 
        "Kilinochchi", "Kurunegala", "Mannar", "Matale", 
        "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", 
        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", 
        "Vavuniya"
    ];


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
             <form onSubmit={handleSubmit} className="container mt-4" >  {/* */}
                <div className="LandForm" >

                    <h1>{landId ? "Edit Land Entry" : "Create Land Entry"}</h1>

                    <h3>Land Location</h3>
                    <div className="container_Land">
                        
                        <div className="sec01">                           
                            <div>
                                <label  >Province:</label>                               {/* Province Dropdown */}
                                <select class="form-select"  
                                    aria-label="Default select example"
                                    name="Provinces" 
                                    value={formData.Provinces} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option selected>Open this select menu</option>
                                    {provinces.map((province, index) => (
                                        <option key={index} value={province}>
                                            {province}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label  >District:</label>                            {/* District Dropdown */}
                                <select class="form-select"  
                                    aria-label="Default select example"
                                    name="Districts" 
                                    value={formData.Districts} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option selected>Select a District</option>
                                    {districts.map((district, index) => (
                                        <option key={index} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sec02">
                            <div>
                                <label >Divisional Secretariats:</label>
                                <input type="text" 
                                    name="Divisional_secretariats" 
                                    className="form-control"
                                    placeholder="Divisional Secretariat" 
                                    value={formData.Divisional_secretariats} 
                                    nChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div  >
                                <label >Grama Niladhari Divisions:</label>
                                <input type="text" 
                                    name="Grama_Niladhari_divisions" 
                                    className="form-control"
                                    placeholder="Grama Niladhari Divisions" 
                                    value={formData.Grama_Niladhari_divisions} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>
                         
                    </div>

                    <h3>Land Details</h3>
                    <div className="container_Land_Details">
                        
                        <div className="sec03">
                            <label  >Land_address:</label>
                            <input type="text" 
                                name="Land_address" 
                                className="form-control"
                                placeholder="Land Address" 
                                value={formData.Land_address} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="sec03">
                            <label  >Land_location:</label>
                            <input type="text" 
                                name="Land_location" 
                                className="form-control"
                                placeholder="Land Location" 
                                value={formData.Land_location} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="sec03">
                            <label  >Area_of_Land:</label>
                            <input type="text" 
                                name="Area_of_Land" 
                                className="form-control"
                                placeholder="Area of Land" 
                                value={formData.Area_of_Land} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="sec03">
                            <label  >Land Description:</label>
                            <input type="text" 
                                name="Land_description" 
                                className="form-control"
                                placeholder="Land Description" 
                                value={formData.Land_description} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                    </div>

                    <h3>Land Ownership</h3>
                    <div className="container_Ownership">

                    <div className="sec04">
                            <div>
                                <label  >Land Ownership:</label>
                                <select class="form-select"  aria-label="Default select example">
                                    <option selected>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="sec03">
                            <label  >Land owner name:</label>
                            <input type="text" 
                                name="Land_owner_name" 
                                className="form-control"
                                placeholder="Owner Name" 
                                value={formData.Land_owner_name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="sec03">
                            <label  >Email:</label>
                            <input type="email" 
                                name="email" 
                                className="form-control"
                                placeholder="Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="sec03">
                            <label  >Phone Number:</label>
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
