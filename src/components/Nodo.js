import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Modal, Alert } from 'react-bootstrap';
import MenuBar from "./MenuBar";

const Nodo = () => {
  const [nodos, setNodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNodoId, setSelectedNodoId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);

  const loadNodos = () => {
    fetch('http://localhost:8095/api/v1/nodos')
      .then(response => response.json())
      .then(data => {
        setNodos(data.data || []);
        setSearchResult([]);
      })
      .catch(error => {
        setError('Error al obtener nodos. Por favor, intenta de nuevo más tarde.');
        console.error('Error al obtener nodos:', error);
      });
  };

  useEffect(() => {
    loadNodos();
  }, []);

  const handleEdit = (nodo) => {
    console.log('Editar nodo:', nodo);
    setSelectedNodoId(nodo.external_registro);
    setShowModal(true);
  };

  const handleEditSubmit = (editedNodoData) => {
    fetch(`http://localhost:8095/api/v1/nodos/editar/${selectedNodoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedNodoData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === '200 OK') {
          loadNodos();
          setShowModal(false);
          setSelectedNodoId(null);
        } else {
          setError('Error al editar nodo. Por favor, intenta de nuevo.');
          console.error('Error al editar nodo:', data);
        }
      })
      .catch(error => {
        setError('Error al editar nodo. Por favor, intenta de nuevo.');
        console.error('Error al editar nodo:', error);
      });
  };

  const handleDelete = (nodo) => {
    console.log('Eliminar nodo:', nodo);
    // Agrega lógica para eliminar el nodo
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNodoId(null);
  };

  const handleSearch = () => {
    const result = nodos.filter(nodo =>
      nodo.nombre.toLowerCase().includes(searchInput.toLowerCase()) ||
      (nodo.descripcion && nodo.descripcion.toLowerCase().includes(searchInput.toLowerCase()))
    );
    setSearchResult(result);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
    handleSearch();  // Llamamos a la función de búsqueda cada vez que cambia el valor
  };


  return (
    <div>
      <MenuBar />
      <div className='container' style={{ marginTop: '20px' }}>
        <div className="row">
          <div className="col-12 text-center">
            <h1>Gestionar Nodos</h1>
          </div>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="row">
          <div className="col-4">
            <Form>
              <Form.Group controlId="formSearch">
                <Form.Control
                  type="text"
                  placeholder="Ingrese registro para buscar"
                  value={searchInput}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </div>
          <div className="col-4">
            <Button variant="primary" onClick={handleSearch}>Buscar</Button>
          </div>
        </div>

        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-12 text-center">
            {searchResult.length > 0 ? (
              <NodoTable nodos={searchResult} onEdit={handleEdit} onDelete={handleDelete} />
            ) : (
              <NodoTable nodos={nodos} onEdit={handleEdit} onDelete={handleDelete} />
            )}
            {selectedNodoId && (
              <EditarNodoModal
                show={showModal}
                handleClose={handleCloseModal}
                nodoData={nodos.find(nodo => nodo.external_registro === selectedNodoId)}
                handleEditSubmit={handleEditSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NodoTable = ({ nodos, onEdit, onDelete }) => {
  return (
    
    <Container>
      
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Nodo Padre</th>
                <th>Nodos Conectados</th>
                <th>Tipo de Nodo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {nodos.map((nodo) => (
                <tr key={nodo.external_registro}>
                  <td>{nodo.nombre}</td>
                  <td>{nodo.descripcion}</td>
                  <td>{nodo.latitud}</td>
                  <td>{nodo.longitud}</td>
                  <td>{nodo.nodoPadre ? nodo.nodoPadre.nombre : 'N/A'}</td>
                  <td>
                    {nodo.nodos_conectados && nodo.nodos_conectados.length > 0 ? (
                      nodo.nodos_conectados.map((conectado) => conectado.nombre).join(', ')
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{nodo.tipoDeNodo === 'zona_segura' ? (
                    <span>
                      Zona Segura <span style={{ color: 'green' }}>✔</span>
                    </span>
                  ) : nodo.tipoDeNodo === 'zona_en_riesgo' ? (
                    <span>
                      Zona en Riesgo <span style={{ color: 'red' }}>✘</span>
                    </span>
                  ) : (
                    'N/A'
                  )}</td>
                  <td>
                    <Button variant="primary" onClick={() => onEdit(nodo)}>Editar</Button>{' '}
                    <Button variant="danger" onClick={() => onDelete(nodo)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

const EditarNodoModal = ({ show, handleClose, nodoData, handleEditSubmit }) => {
  const [editedNodoData, setEditedNodoData] = useState({});

  useEffect(() => {
    setEditedNodoData(nodoData);
  }, [nodoData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedNodoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleEditSubmit(editedNodoData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Nodo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre"
            name="nombre"
            value={editedNodoData.nombre || ''}
            onChange={handleInputChange}
          />
        </Form.Group>
        {/* Repite para otros campos como descripción, latitud, longitud, etc. */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Nodo;
