import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
import AgregarUsuarioModal from './AgregarUsuarioModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import { useLocation } from 'react-router-dom';
import MenuBar from "./MenuBar";

const Persona = () => {
  const [personas, setPersonas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch('http://localhost:8095/api/v1/personas', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '', // Enviar el token en el encabezado de autorización
          },
        });
        const data = await response.json();
        setPersonas(data.data || []);
      } catch (error) {
        console.error('Error al obtener personas:', error);
      }
    };

    fetchPersonas();
  }, [token]);

  const handleEdit = (persona) => {
    setSelectedUserId(persona.identificacion);
    setShowModal(true);
  };

  const handleDelete = (persona) => {
    console.log('Eliminar persona:', persona);
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      fetch(`http://localhost:8095/api/v1/personas/obtener/identificacion/${searchInput}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === '200 OK') {
            setSearchResult([data.data]);
            setSearchInput('');
          } else {
            console.error('Error al buscar persona:', data);
          }
        })
        .catch(error => {
          console.error('Error al buscar persona:', error);
        });
    } else {
      fetch('http://localhost:8095/api/v1/personas', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
        .then(response => response.json())
        .then(data => {
          setPersonas(data.data || []);
        })
        .catch(error => {
          console.error('Error al obtener personas:', error);
        });
    }
  };

  return (
    <div>
      <div><MenuBar></MenuBar></div>
      <div className='container' style={{ marginTop: '20px' }}>
        <div className="row">
          <div className="col-12 text-center">
            <h1>Gestionar Usuarios</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <Form>
              <Form.Group controlId="formSearch">
                <Form.Control
                  type="text"
                  placeholder="Ingrese identificación para buscar"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
            <Button variant="success" onClick={handleCreate}>Crear Nuevo Usuario</Button>
          </div>
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-12 text-center">
            {searchResult.length > 0 ? (
              <PersonaTable personas={searchResult} onEdit={handleEdit} onDelete={handleDelete} />
            ) : (
              <PersonaTable personas={personas} onEdit={handleEdit} onDelete={handleDelete} />
            )}
            <AgregarUsuarioModal show={showModal && !selectedUserId} handleClose={handleCloseModal} />
            {selectedUserId && <EditarUsuarioModal show={showModal} handleClose={handleCloseModal} identificacion={selectedUserId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonaTable = ({ personas, onEdit, onDelete }) => {
  return (
    <Container>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Dirección</th>
                <th>Identificación</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((persona) => (
                <tr key={persona.identificacion}>
                  <td>{persona.nombres || persona.Nombres}</td>
                  <td>{persona.apellidos || persona.Apellidos}</td>
                  <td>{persona.direccion || persona.Direccion}</td>
                  <td>{persona.identificacion || persona.Identificacion}</td>
                  <td>{persona.telefono || persona.Telefono}</td>
                  <td>
                    <Button variant="primary" onClick={() => onEdit(persona)}>Editar</Button>{' '}
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

export default Persona;
