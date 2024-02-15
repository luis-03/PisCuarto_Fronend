import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AgregarRutaModal = ({ show, handleClose, onConnectNodes }) => {
    const [nodos, setNodos] = useState([]);
    const [selectedNodeOrigen, setSelectedNodeOrigen] = useState(null);
    const [selectedNodeDestino, setSelectedNodeDestino] = useState(null);
    const [nodosDestino, setNodosDestino] = useState([]); // Lista de nodos de destino

    useEffect(() => {
        // Cargar nodos desde la API al montar el componente
        fetch('http://localhost:8095/api/v1/nodos')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data) {
                    setNodos(data.data);
                }
            })
            .catch((error) => console.error('Error al cargar nodos:', error));
    }, []);

    const handleNodeOrigenSelection = (event) => {
        const selectedNodeId = event.target.value;
        const node = nodos.find((nodo) => nodo.external_registro === selectedNodeId);
        setSelectedNodeOrigen(node);
        setSelectedNodeDestino(null);

        

        // Llamar a la API para obtener la lista de nodos de destino basada en el nodo origen seleccionado
        fetch(`http://localhost:8095/api/v1/nodos-cercanos/${selectedNodeId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data) {
                    setNodosDestino(data.data);
                   
                }
            })
            .catch((error) => console.error('Error al cargar nodos de destino:', error));
    };

    const handleNodeDestinoSelection = (event) => {
        const selectedNodeId = event.target.value;
        const node = nodosDestino.find((nodo) => nodo.external_registro === selectedNodeId);
        setSelectedNodeDestino(node);
    };

    const handleConnectNodes = () => {
        if (selectedNodeOrigen && selectedNodeDestino) {
            const origenExternalId = selectedNodeOrigen.external_registro;
            const destinoExternalId = selectedNodeDestino.external_registro;

            // Realizar la llamada POST para conectar nodos
            fetch(`http://localhost:8095/api/v1/nodos/conectar/${origenExternalId}/${destinoExternalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Conexión exitosa:', data);
                    onConnectNodes(origenExternalId, destinoExternalId);
                    handleClose(); // Cerrar el modal después de conectar los nodos

                    // Redireccionar a la página actual (puedes cambiar 'window.location' según tu enrutamiento)
                    window.location.reload(); // Recargar la página actual
                })
                .catch(error => console.error('Error al conectar nodos:', error));
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Ruta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNodoOrigen">
                        <Form.Label>Nodo de Origen:</Form.Label>
                        <Form.Control as="select" onChange={handleNodeOrigenSelection}>
                            <option value="">Selecciona un nodo</option>
                            {nodos.map((nodo) => (
                                <option key={nodo.external_registro} value={nodo.external_registro}>
                                    {nodo.nombre + " "+ nodo.latitud + " "+nodo.longitud}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formNodoDestino">
                        <Form.Label>Nodo de Destino:</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={handleNodeDestinoSelection}
                            disabled={!selectedNodeOrigen}
                        >
                            <option value="">Selecciona un nodo</option>
                            {nodosDestino.map((nodo) => (
                                <option key={nodo.external_registro} value={nodo.external_registro}>
                                    {nodo.nombre}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleConnectNodes}>
                    Conectar Nodos
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AgregarRutaModal;
