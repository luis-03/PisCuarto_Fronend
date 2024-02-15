import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import Markers from "./Markers";
import placesData from '../assets/data.json';
import { useLocation } from 'react-router-dom';
import MenuBar from "./MenuBar";


const MapView2 = () => {
    const { places } = placesData;
    const [state, setState] = useState({
        currenlocation:{lat:'-4.029817', lng:'-79.199492'},
        zoom:20
    })
    const location = useLocation();
    console.log("prueba");

    console.log(location);
    return (
       
            <div> <MapContainer center={state.currenlocation} zoom={state.zoom}>
             
             console.log("En el retun"+location())
             <TileLayer
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 attribution="OpenStreetMap"
             />
             <Markers places={places}/>
         </MapContainer></div>
       
       
        
    );
}
export default MapView2;
