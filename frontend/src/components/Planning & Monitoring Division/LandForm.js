import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate for navigation
import axios from "axios";
import "./LandForm.css"


const LandForm = ({ onSuccess }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const { id } = useParams(); // Get landId from URL

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

        Land_ownership: "",
        Land_owner_name: "",
        Land_owner_name_address: "",
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
    const land_ownerships = [
        "Government", "Private Own"
    ];


    useEffect(() => {
        // console.log('landId:', id); // Debugging Log the landId

        if (id) {
            axios.get(`/get/land/${id}`)
                .then(res => {
                    // console.log('Fetched Land Data:', res.data); // Debugging Log fetched data
                    setFormData(res.data);
                })
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
 

    const handleHomeButtonClick = () => {
        navigate('/'); // Navigate to the home page
    };

    const handleSubmit = (e) => {
        console.log("Submitting form data:", formData); // Add this line to check the form data

        e.preventDefault();
        const apiCall = id 
        
            ? axios.put(`/update/land/${id}`, formData)
            : axios.post("/add", formData);
        
        apiCall.then(() => {
            alert(id ? "Land updated successfully!" : "Land created successfully!");
            onSuccess();
            // navigate('/'); 
        }).catch((err) => {
            console.error(err);
            // alert("An error occurred. Please try again.");
        })
    };

    

    return (
        <div>
            
            <form onSubmit={handleSubmit} className="container mt-4"  >  {/* style={{ width: "auto" }}*/}
                
                <div className="LandForm" >

                    <button
                        className='btn btn-warning'
                        onClick={handleHomeButtonClick}
                        style={{
                            top: '20px',
                            left: '20px',
                            width: '120px',
                            border: 'solid',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '20px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        ⬅️ Back
                    </button>
                    <h1 className="form-header">{id ? "Edit Land Entry" : "Create Land Entry"}</h1 >

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
                                    <option value="">Select a Province</option>
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
                                    <option value="">Select a District</option>
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
                                    className="form-input"
                                    placeholder="Divisional Secretariat" 
                                    value={formData.Divisional_secretariats} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label >Grama Niladhari Divisions:</label>
                                <input type="text" 
                                    name="Grama_Niladhari_divisions" 
                                    className="form-input"
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
                                className="form-input"
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
                                className="form-input"
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
                                className="form-input"
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
                                className="form-input"
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
                                <select class="form-select"  
                                    aria-label="Default select example"
                                    name="Land_ownership" 
                                    value={formData.Land_ownership} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option selected>Select Land Ownership</option>
                                    {land_ownerships.map((land_ownership, index) => (
                                        <option key={index} value={land_ownership}>
                                            {land_ownership}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="sec03">
                            <label  >Land owner name:</label>
                            <input type="text" 
                                name="Land_owner_name" 
                                className="form-input"
                                placeholder="Owner Name" 
                                value={formData.Land_owner_name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="sec03">
                            <label  >Land owner Address:</label>
                            <input type="text" 
                                name="Land_owner_address" 
                                className="form-input"
                                placeholder="Owner Name Address" 
                                value={formData.Land_owner_address} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="sec03">
                            <label  >Email:</label>
                            <input type="email" 
                                name="email" 
                                className="form-input"
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
                                className="form-input"
                                placeholder="Phone Number" 
                                value={formData.phone_number} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                        {id ? "Update Land" : "Create Land"}
                    </button>
                    <button className='btn btn-warning' onClick={handleHomeButtonClick} >
                        ⬅️ Back
                    </button>

                </div>
            </form>
        </div>
    );
};

export default LandForm;
