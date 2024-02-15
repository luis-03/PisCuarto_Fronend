import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';


const Home = () => {
    const [state, setState] = useState({
        longitude: 0,
        latitude: 0
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                setState({
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                });
            },
            function (error) {
                console.log(error);
            },
            { enableHighAccuracy: true }
        );
    }, []); // Agrega un array vacío como segundo argumento para que useEffect se ejecute solo una vez

    return (
        <div>
            <h1>Ubicación Actual</h1>
            <p>Longitud: {state.longitude}</p>
            <p>Latitud: {state.latitude}</p>
            <Link to={{pathname: '/map', state,}}> Ver localización</Link>
        </div>
    );
};

export default Home;
