import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgregarNodoModal from './AgregarNodoModal';
import AgregarRutaModal from './AgregarRutaModal';
import Persona from './Persona';
import AlertComponent from './AlertComponent';

const MenuBar = () => {
    const [showAgregarNodoModal, setShowAgregarNodoModal] = useState(false);
    const [showAgregarRutaModal, setShowAgregarRutaModal] = useState(false);
    const [showAgregarUsuarioModal, setShowAgregarUsuarioModal] = useState(false);
    const [token, setToken] = useState(null); // Estado del token
    const [rol, setRol] = useState(null); // Estado del rol del usuario
    const history = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRol = localStorage.getItem('rol');
        if (storedToken) {
            setToken(storedToken);
            setRol(storedRol);
        }
    }, []);

    const handleCloseAgregarNodoModal = () => setShowAgregarNodoModal(false);
    const handleShowAgregarNodoModal = () => setShowAgregarNodoModal(true);

    const handleCloseAgregarRutaModal = () => setShowAgregarRutaModal(false);
    const handleShowAgregarRutaModal = () => setShowAgregarRutaModal(true);

    const handleGestionarUsuarioClick = () => {
        history('/persona');
        window.location.reload(); // Refrescar la página
    };

    const handleGestionarNodoClick = () => {
        history('/nodo');
        window.location.reload(); // Refrescar la página
    };

    const handleMapaClick = () => {
        history('/map');
        window.location.reload(); // Refrescar la página
    };

    const handleModificarPlanEmergenciaClick = () => {
        window.open('https://drive.google.com/drive/folders/1ZXYLhbc-Mjte8jFfV5RYAWP5UczolTXG?usp=sharing', '_blank');
        window.location.reload(); // Refrescar la página
    };

    const handleCerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        history('/map2');
        window.location.reload(); 
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src="https://joinforwater.ngo/wp-content/uploads/2022/05/logo-unl-HC-01-e1651758359420.png" alt="Logo" height="90" />
                </a>
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <h5 className="mb-0">Ruta de evacuación</h5>
                </a>
                {token && (
                    <AlertComponent/>
                )}
                {token && (rol === 'administrador' || rol === 'brigadista') && (
                    <>
                        <button className="nav-link btn btn-outline-primary mx-2" onClick={handleShowAgregarNodoModal}>
                            Agregar Nodo
                        </button>
                        <AgregarNodoModal show={showAgregarNodoModal} handleClose={handleCloseAgregarNodoModal} />

                        <button className="nav-link btn btn-outline-primary mx-2" onClick={handleShowAgregarRutaModal}>
                            Agregar Ruta
                        </button>
                        <AgregarRutaModal show={showAgregarRutaModal} handleClose={handleCloseAgregarRutaModal} />
                        
                        {rol === 'administrador' && (
                            <>
                                <button className="nav-link btn btn-outline-primary mx-2" onClick={handleGestionarUsuarioClick}>
                                    Gestionar Usuario
                                </button>
                                <button className="nav-link btn btn-outline-primary mx-2" onClick={handleGestionarNodoClick}>
                                    Gestionar Nodo
                                </button>
                            </>
                        )}
                        <button className="nav-link btn btn-outline-primary mx-2" onClick={handleCerrarSesion}>
                            Cerrar Sesión
                        </button>
                        <button className="nav-link btn btn-outline-primary mx-2" onClick={handleMapaClick}>
                            Mapa
                        </button>
                        <button className="nav-link btn btn-outline-primary mx-2" onClick={handleModificarPlanEmergenciaClick}>
                            Plan de Emergencia
                        </button>
                    </>
                )}
                {!token && (
                    <>
                        <button className="nav-link btn btn-outline-primary mx-2" onClick={() => history('/')}>
                            Iniciar Sesión
                        </button>
                        <button className="nav-link btn btn-outline-primary mx-2" onClick={handleModificarPlanEmergenciaClick}>
                            Plan de Emergencia
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default MenuBar;
