import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AgregarNodoModal = ({ show, handleClose }) => {
    const [nodo, setNodo] = useState({
        nombre: '',
        latitud: '',
        longitud: '',
        capus: '',
        facultades: '',
        tipoDeNodo: '',
    });

    const capusOptions = ['Centro', 'Sur'];

    const [facultadesOptions, setFacultadesOptions] = useState([
        'Facultad Agropecuaria y de Recursos Naturales Renovables',
        'Facultad de la Energía, las Industrias y los Recursos Naturales no Renovables',
        'Facultad de la Educación, el Arte y la Comunicación',
        'Facultad Jurídica, Social y Administrativa',
        'Facultad de la Salud Humana',
        'Facultad de Arquitectura, Diseño y Urbanismo',
        'Facultad de Bioquímica y Ciencias Biológicas',
        'Facultad de Ciencias Agrarias',
        'Facultad de Ciencias Económicas',
        'Facultad de Ingeniería y Ciencias Hídricas',
    ]);

    const tipoDeNodoOptions = ['Zona Segura', 'Area en riesgo', 'Area abierta', 'Zona Segura'];

    const [error, setError] = useState('');

    useEffect(() => {
        // Filtrar las facultades según el campus seleccionado
        if (nodo.capus === 'Centro') {
            setFacultadesOptions(['Facultad de la Salud Humana', 'Facultad de Bioquímica y Ciencias Biológicas']);
        } else if (nodo.capus === 'Sur') {
            setFacultadesOptions([
                'Facultad Agropecuaria y de Recursos Naturales Renovables',
                'Facultad de la Energía, las Industrias y los Recursos Naturales no Renovables',
                'Facultad de la Educación, el Arte y la Comunicación',
                'Facultad Jurídica, Social y Administrativa',
                'Facultad de Arquitectura, Diseño y Urbanismo',
                'Facultad de Ciencias Agrarias',
                'Facultad de Ciencias Económicas',
                'Facultad de Ingeniería y Ciencias Hídricas',
            ]);
        }
    }, [nodo.capus]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNodo({
            ...nodo,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8095/api/v1/nodos/guardar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nodo.nombre,
                    descripcion: nodo.descripcion,
                    referencia: nodo.referencia,
                    facultad: nodo.facultades,

                    latitud: parseFloat(nodo.latitud),
                    longitud: parseFloat(nodo.longitud),
                    tipoDeNodo: nodo.tipoDeNodo,

                    capus: nodo.capus,
                    nodoPadreId: null,
                    nodosConectadosIds: [],
                }),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Nodo registrado exitosamente:', data);
                handleClose();
            } else {
                console.error('Error al registrar nodo:', data);
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
                <Modal.Title>Agregar Nodo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el nombre"
                            name="nombre"
                            value={nodo.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescripcion">
                        <Form.Label>Descripción:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese la descripción"
                            name="descripcion"
                            value={nodo.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formReferencia">
                        <Form.Label>Referencia:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese la referencia"
                            name="referencia"
                            value={nodo.referencia}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formLatitud">
                        <Form.Label>Latitud:</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            placeholder="Ingrese la latitud"
                            name="latitud"
                            value={nodo.latitud}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formLongitud">
                        <Form.Label>Longitud:</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            placeholder="Ingrese la longitud"
                            name="longitud"
                            value={nodo.longitud}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formCapus">
                        <Form.Label>Capus:</Form.Label>
                        <Form.Control
                            as="select"
                            name="capus"
                            value={nodo.capus}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un capus</option>
                            {capusOptions.map((capus, index) => (
                                <option key={index} value={capus}>
                                    {capus}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formFacultades">
                        <Form.Label>Facultades:</Form.Label>
                        <Form.Control
                            as="select"
                            name="facultades"
                            value={nodo.facultades}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona una facultad</option>
                            {facultadesOptions.map((facultad, index) => (
                                <option key={index} value={facultad}>
                                    {facultad}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formTipoNodo">
                        <Form.Label>Tipo de nodo:</Form.Label>
                        <Form.Control
                            as="select"
                            name="tipoDeNodo"
                            value={nodo.tipoDeNodo}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un tipo de nodo</option>
                            <option value="zona_segura">Zona Segura</option>
                            <option value="zona_en_riesgo">Zona a Evacuar</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                {error && (
                    <p className="text-danger mt-3">
                        {error === 'Error específico 1' ? 'Mensaje específico 1.' :
                            error === 'Error específico 2' ? 'Mensaje específico 2.' :
                                'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.'}
                    </p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Agregar Nodo
                </Button>
            </Modal.Footer>
        </Modal>
    );

};

export default AgregarNodoModal;
