import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useLocation } from 'react-router-dom';
import MenuBar from "./MenuBar";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import zonaNoSeguraImage from '../assets/ubicacion.webp';
import zonaSeguraImage from '../assets/zona-segura.webp';
import userLocationIconImage from '../assets/user-location.webp';

const MapView = () => {
    const [state, setState] = useState({
        currentLocation: null,
        zoom: 20,
        nearestNode: null,
        polylinesData: []
    });

    const location = useLocation();

    useEffect(() => {
        const getUserLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocation = { lat: latitude, lng: longitude };

                    setState((currentState) => ({
                        ...currentState,
                        currentLocation: userLocation
                    }));

                    getNearestNode(userLocation);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        };

        const getNearestNode = async (userLocation) => {
            try {
                const response = await fetch("http://localhost:8095/api/v1/nodos");
                const responseData = await response.json();
        
                const data = Array.isArray(responseData.data) ? responseData.data : [];
        
                const coordinatesData = data.map(nodo => ({
                    lat: nodo.latitud,
                    lng: nodo.longitud,
                    info: nodo
                }));
        
                const nearestNode = findNearestNode(userLocation, coordinatesData);
        
                if (nearestNode) {
                    const nearestNodePolyline = {
                        positions: [
                            { lat: userLocation.lat, lng: userLocation.lng },
                            { lat: nearestNode.latitud, lng: nearestNode.longitud }
                        ],
                        color: "blue"
                    };
        
                    setState((currentState) => ({
                        ...currentState,
                        nearestNode: nearestNode,
                        polylinesData: [nearestNodePolyline]
                    }));
        
                    const nearestNodeExternalId = nearestNode.external_registro;
        
                    // Hacer una solicitud HTTP al endpoint para obtener la ruta
                    const rutaResponse = await fetch(`http://localhost:8095/api/v1/ruta/${nearestNodeExternalId}`);
                    const rutaData = await rutaResponse.json();
        
                    console.log("Resultado de la solicitud de ruta:", rutaData);
                }
            } catch (error) {
                console.error("Error getting data:", error);
            }
        };
        
        const findNearestNode = (userLocation, markersData) => {
            if (markersData.length === 0) {
                console.error("No hay nodos disponibles para calcular el nodo más cercano.");
                return null;
            }

            let nearestNode = markersData.reduce((prev, current) => {
                const prevDistance = Math.sqrt(
                    Math.pow(prev.lat - userLocation.lat, 2) + Math.pow(prev.lng - userLocation.lng, 2)
                );

                const currentDistance = Math.sqrt(
                    Math.pow(current.lat - userLocation.lat, 2) + Math.pow(current.lng - userLocation.lng, 2)
                );

                return prevDistance < currentDistance ? prev : current;
            });

            return nearestNode.info;
        };

        getUserLocation();
    }, []);  // <-- Dependencias vacías para que se ejecute solo en el montaje

    const userLocationIcon = new L.Icon({
        iconUrl: userLocationIconImage,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const zonaNoSeguraIcon = new L.Icon({
        iconUrl: zonaNoSeguraImage,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const zonaSeguraIcon = new L.Icon({
        iconUrl: zonaSeguraImage,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    return (
        <div>
            <div><MenuBar></MenuBar></div>
            <div>
                {state.currentLocation ? (
                    <MapContainer center={state.currentLocation} zoom={state.zoom}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="OpenStreetMap"
                        />

                        {state.currentLocation && (
                            <Marker
                                position={state.currentLocation}
                                icon={userLocationIcon}
                            >
                                <Popup>
                                    <div>
                                        <p>Tu ubicación actual</p>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {state.nearestNode && (
                            <Marker
                                position={{ lat: state.nearestNode.latitud, lng: state.nearestNode.longitud }}
                                icon={state.nearestNode.tipoDeNodo === 'zona_en_riesgo' ? zonaNoSeguraIcon : zonaSeguraIcon}
                            >
                                <Popup>
                                    <div>
                                        <p>{state.nearestNode.nombre}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {state.polylinesData.map((polyline, index) => (
                            <Polyline
                                key={index}
                                positions={polyline.positions}
                                color={polyline.color}
                            />
                        ))}
                    </MapContainer>
                ) : (
                    <p>Obteniendo ubicación...</p>
                )}
            </div>
        </div>
    );
}

export default MapView;
