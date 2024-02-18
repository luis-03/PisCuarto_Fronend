import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AgregarRutaModal = ({ show, handleClose, onConnectNodes }) => {
    const [nodos, setNodos] = useState([]);
    const [selectedNodeOrigen, setSelectedNodeOrigen] = useState(null);
    const [selectedNodeDestino, setSelectedNodeDestino] = useState(null);
    const [nodosDestino, setNodosDestino] = useState([]);
    const [loadingNodosDestino, setLoadingNodosDestino] = useState(false);

    useEffect(() => {
        const fetchNodos = async () => {
            try {
                const response = await fetch('http://localhost:8095/api/v1/nodos');
                const data = await response.json();
                if (data && data.data) {
                    setNodos(data.data);
                }
            } catch (error) {
                console.error('Error al cargar nodos:', error);
            }
        };

        fetchNodos();
    }, []);

    const fetchNodosDestino = async (selectedNodeId) => {
        setLoadingNodosDestino(true);
        try {
            const response = await fetch(`http://localhost:8095/api/v1/nodos-cercanos/${selectedNodeId}`);
            const data = await response.json();
            if (data) {
                setNodosDestino(data);
            }
        } catch (error) {
            console.error('Error al cargar nodos de destino:', error);
        } finally {
            setLoadingNodosDestino(false);
        }
    };

    const handleNodeOrigenSelection = async (event) => {
        const selectedNodeId = event.target.value;
        const node = nodos.find((nodo) => nodo.external_registro === selectedNodeId);
        setSelectedNodeOrigen(node);
        setSelectedNodeDestino(null);
        await fetchNodosDestino(selectedNodeId);
    };

    const handleNodeDestinoSelection = async (event) => {
        const selectedNodeId = event.target.value;
        const node = nodosDestino.find((nodo) => nodo.external_id === selectedNodeId);
        
        if (node) {
            console.log(node);
            setSelectedNodeDestino(node);
        } else {
            // Aquí puedes manejar el caso cuando no se encuentra el nodo
            console.error("No se encontró el nodo de destino correspondiente.");
        }
    };

    const handleConnectNodes = async () => {
        console.log(selectedNodeOrigen+" "+selectedNodeDestino);
        if (selectedNodeOrigen && selectedNodeDestino) {
            const origenExternalId = selectedNodeOrigen.external_registro;
            const destinoExternalId = selectedNodeDestino.external_id;

            try {
                // Verificar si los nodos están cargados
                if (!nodos.length || !nodosDestino.length) {
                    console.error('Los nodos no están completamente cargados.');
                    return;
                }

                const response = await fetch(`http://localhost:8095/api/v1/nodos/conectar/${origenExternalId}/${destinoExternalId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Conexión exitosa:', data);
                    onConnectNodes(origenExternalId, destinoExternalId);
                    handleClose();
                    window.location.reload();
                } else {
                    console.error('Error al conectar nodos:', response.statusText);
                }
            } catch (error) {
                console.error('Error al conectar nodos:', error);
            }
        } else {
            console.log("No Entra aquí");
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
                            <option key="" value="">Selecciona un nodo</option>
                            {nodos.map((nodo) => (
                                <option key={nodo.external_registro} value={nodo.external_registro}>
                                    {nodo.nombre} - {nodo.descripcion} {nodo.latitud} {nodo.longitud} 
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formNodoDestino">
                        <Form.Label>Nodo de Destino:</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={handleNodeDestinoSelection}
                            disabled={!selectedNodeOrigen || loadingNodosDestino}
                        >
                            <option key="" value="">Selecciona un nodo</option>
                            {nodosDestino.map((nodo) => (
                                <option key={nodo.external_id} value={nodo.external_id}>
                                    {console.log("tipo de nodo"+nodo.descripcion)}
                                    {nodo.nombre} - {nodo.descripcion} {nodo.latitud} {nodo.longitud}
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
                <Button 
                    variant="primary" 
                    onClick={handleConnectNodes} 
                  
                >
                    Conectar Nodos
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AgregarRutaModal;
