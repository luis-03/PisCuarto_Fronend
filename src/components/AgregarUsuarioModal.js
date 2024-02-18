import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AgregarUsuarioModal = ({ show, handleClose }) => {
    const [usuario, setUsuario] = useState({
        nombres: '',
        apellidos: '',
        identificacion: '',
        direccion: '',
        telefono: '',
        rol: '',
        correo: '',
        clave: '',
    });

    const roles = ['Administrador', 'Brigadista'];
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUsuario({
            ...usuario,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8095/api/v1/personas/guardar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    identificacion: usuario.identificacion,
                    direccion: usuario.direccion,
                    telefono: usuario.telefono,
                    tipo_persona: usuario.rol,
                    cuenta: {
                        correo: usuario.correo,
                        clave: usuario.clave,
                    },
                }),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Usuario registrado exitosamente:', data);
                handleClose();
            } else {
                console.error('Error al registrar usuario:', data);
                setError(data.data.evento);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            setError('Error al enviar la solicitud');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNombres">
                        <Form.Label>Nombres:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa nombres"
                            name="nombres"
                            value={usuario.nombres}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formApellidos">
                        <Form.Label>Apellidos:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa apellidos"
                            name="apellidos"
                            value={usuario.apellidos}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formIdentificacion">
                        <Form.Label>Número de Identificación:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa número de identificación"
                            name="identificacion"
                            value={usuario.identificacion}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formDireccion">
                        <Form.Label>Dirección:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa dirección"
                            name="direccion"
                            value={usuario.direccion}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formTelefono">
                        <Form.Label>Teléfono:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa número de teléfono"
                            name="telefono"
                            value={usuario.telefono}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formRol">
                        <Form.Label>Rol:</Form.Label>
                        <Form.Control
                            as="select"
                            value={usuario.rol}
                            onChange={handleInputChange}
                            name="rol"
                            required
                        >
                            <option value="">Selecciona un rol</option>
                            {roles.map((rol, index) => (
                                <option key={index} value={rol}>
                                    {rol}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formCorreo">
                        <Form.Label>Correo Electrónico:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingresa correo electrónico"
                            name="correo"
                            value={usuario.correo}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formClave">
                        <Form.Label>Clave:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa una clave"
                            name="clave"
                            value={usuario.clave}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Agregar Usuario
                    </Button>
                </Form>
                {error && (
                    <p className="text-danger mt-3">
                        {error === 'La identificación ya está registrada' ? 'La identificación ya está registrada.' : 
                         error === 'El teléfono ya está registrado' ? 'El teléfono ya está registrado.' : 
                         error === 'El correo ya está registrado' ? 'El correo electrónico ya está registrado.' :
                         'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.'}
                    </p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AgregarUsuarioModal;
