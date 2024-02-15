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
        markersData: [],
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

                    getMarkersData(userLocation);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
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

        const getMarkersData = async (userLocation) => {
            try {
                const response = await fetch("http://localhost:8095/api/v1/nodos");
                const responseData = await response.json();

                const data = Array.isArray(responseData.data) ? responseData.data : [];

                const coordinatesData = data.map(nodo => ({
                    lat: nodo.latitud,
                    lng: nodo.longitud,
                    info: nodo
                }));

                const connectedNodes = data.filter(nodo => nodo.nodoPadre && nodo.nodos_conectados.length === 0);

                const polylinesData = connectedNodes.map(nodo => ({
                    positions: [
                        { lat: nodo.latitud, lng: nodo.longitud },
                        { lat: nodo.nodoPadre.latitud, lng: nodo.nodoPadre.longitud }
                    ],
                    color: "blue"
                }));

                setState((currentState) => ({
                    ...currentState,
                    markersData: coordinatesData,
                    polylinesData: polylinesData
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
                        polylinesData: [...currentState.polylinesData, nearestNodePolyline]
                    }));
                }
            } catch (error) {
                console.error("Error getting data:", error);
            }
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

                        {state.markersData.map((marker, index) => (
                            <Marker
                                key={index}
                                position={marker}
                                icon={marker.info.tipoDeNodo === 'zona_en_riesgo' ? zonaNoSeguraIcon : zonaSeguraIcon}
                            >
                                <Popup>
                                    <div>
                                        <p>{marker.info.nombre}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {state.polylinesData.map((polyline, index) => (
                            <Polyline
                                key={index}
                                positions={polyline.positions}
                                color={polyline.color}
                            />
                        ))}

                        {state.polylinesData.length > 0 && (
                            <Polyline
                                positions={state.polylinesData[state.polylinesData.length - 1].positions}
                                color="blue"
                            />
                        )}
                    </MapContainer>
                ) : (
                    <p>Obteniendo ubicación...</p>
                )}
            </div>
        </div>
    );
}

export default MapView;
