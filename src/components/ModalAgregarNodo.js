import React from 'react';
import { Modal } from 'react-bootstrap';


const ModalAgregarNodo = ({ show, handleClose }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Lógica para manejar el envío del formulario
    };

    return (
        <Modal show={show} handleClose={handleClose}>
            <div className="modal-content">
                <h2>Agregar Nodo</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre:
                        <input type="text" value="Nodo Prueba" readOnly />
                    </label>
                    <label>
                        Instalaciones:
                        <select>
                            <option value="Campus central">Campus central</option>
                            <option value="Campus Sur">Campus Sur</option>
                        </select>
                    </label>
                    <label>
                        Facultad:
                        <select>
                            <option value="Medicina">Medicina</option>
                            <option value="Administración">Administración</option>
                            <option value="Computación">Computación</option>
                        </select>
                    </label>
                    {/* Otros campos */}
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </Modal>
    );
};

export default ModalAgregarNodo;
