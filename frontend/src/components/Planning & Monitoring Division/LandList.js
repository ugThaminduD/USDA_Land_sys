import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LandList.css"

const LandList = () => {
    const [lands, setLands] = useState([]);

    useEffect(() => {
        axios.get("/getALL/lands")
            .then(res => setLands(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`/delete/land/${id}`)
            .then(() => {
                alert("Land deleted successfully!");
                setLands(lands.filter(land => land._id !== id));
            })
            .catch(err => console.error(err));
    };

    return (
        <div >

            <div className="LandList" >

                <button className="btn btn-primary mb-3">
                    <Link to="/create" style={{ color: "white", textDecoration: "none" }}>Create New Land</Link>
                </button>

                <h2>Land Registered List</h2>

                <table className="table table-striped" >
                    <thead className="thead-dark">
                        <tr>
                            <th>Land ID</th>
                            <th>Province</th>
                            <th>District</th>
                            <th>Divisional Secretariat</th>
                            <th>Grama Niladhari Division</th>
                            <th>Land Location</th>
                            <th>Area_of_Land</th>
                            {/* <th>Land Location</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lands.map(land => (
                            <tr key={land._id}>
                                <td>{land._id}</td>
                                <td>{land.Provinces}</td>
                                <td>{land.Districts}</td>
                                <td>{land.Divisional_secretariats}</td>
                                <td>{land.Grama_Niladhari_divisions}</td>
                                <td>{land.Land_location}</td>
                                <td>{land.Area_of_Land}</td>
                                <td>
                                    <Link to={`/land/${land._id}`} className="btn btn-info btn-sm me-2">View</Link>
                                    <Link to={`/edit/land/${land._id}`} className="btn btn-warning btn-sm me-2">Update</Link>

                                    <button onClick={() => handleDelete(land._id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            
            {/* link to single land details page */}
            {/* <ul>
                {lands.map(land => (
                    <li key={land._id}>
                                                            
                        <Link to={`/land/${land._id}`}> 
                            {land.Provinces} - {land.Districts} - {land.Divisional_secretariats} - {land.Grama_Niladhari_divisions} - {land.Land_location} - 
                        </Link>

                        <button onClick={() => handleDelete(land._id)}>Delete</button>
                    </li>
                ))}
            </ul> */}
            
        </div>
    );
};

export default LandList;
