import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
        <div>
            <button>
                <Link to="/create">Create New Land</Link>
            </button>

            <h2>Land List</h2>
            
            <ul>
                {lands.map(land => (
                    <li key={land._id}>
                                                            {/* link to single land details page */}
                        <Link to={`/land/${land._id}`}> 
                            {land.Provinces} - {land.Districts} - {land.Divisional_secretariats} - {land.Grama_Niladhari_divisions} - {land.Land_location} - 
                        </Link>

                        <button onClick={() => handleDelete(land._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LandList;
