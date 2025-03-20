import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LandDetails = () => {
    const { id } = useParams();
    const [land, setLand] = useState(null);

    useEffect(() => {
        axios.get(`/get/land/${id}`)
            .then(res => setLand(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!land) return <p>Loading...</p>;

    return (
        <div>
            <h2>Land Location</h2>
            <p><strong>Province:</strong> {land.Provinces}</p>
            <p><strong>District:</strong> {land.Districts}</p>
            <p><strong>Divisional Secretariat:</strong> {land.Divisional_secretariats}</p>
            <p><strong>Grama Niladhari Division:</strong> {land.Grama_Niladhari_divisions}</p>

            <h3>Land Details</h3>
            <p><strong>Land Address:</strong> {land.Land_address || "Not provided"}</p>
            <p><strong>Land Location:</strong> {land.Land_location}</p>
            <p><strong>Area of Land:</strong> {land.Area_of_Land}</p>
            <p><strong>Description:</strong> {land.Land_description}</p>
            <p><strong>Land Image:</strong> {land.Land_image ? <img src={land.Land_image} alt="Land Photos" /> : "No image available"}</p>

            <h3>Local Agent</h3>
            <p><strong>Local Agent Name:</strong> {land.local_employee_name}</p>
            <p><strong>Local Agent Phone:</strong> {land.local_employee_phone_number}</p>

            <h3>USDA Entry Details</h3>
            <p><strong>USDA Entry Employee Name:</strong> {land.USDA_Entry_employee_name}</p>
            <p><strong>Day of Entry:</strong> {new Date(land.Day_of_Entry).toLocaleDateString()}</p>

            <h3>Owner Details</h3>
            <p><strong>Owner Name:</strong> {land.Land_owner_name}</p>
            <p><strong>Owner Email:</strong> {land.email}</p>
            <p><strong>Owner Phone:</strong> {land.phone_number}</p>

            <p><strong>Last Updated:</strong> {new Date(land.updatedAt).toLocaleDateString()}</p>
            <p><strong>Created On:</strong> {new Date(land.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default LandDetails;
