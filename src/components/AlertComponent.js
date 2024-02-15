import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function AlertComponent() {
  const [alerta, setAlerta] = useState(null);
  const [previousIntensity, setPreviousIntensity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8095/api/v1/alertas');
        const data = await response.json();

        if (data.intensidad !== previousIntensity) {
          setAlerta(data);
          setPreviousIntensity(data.intensidad);
        }
      } catch (error) {
        console.error('Error al obtener las alertas:', error);
      }
    };

    // Solicitar permiso de notificación al montar el componente
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'denied') {
          fetchData(); // Si se otorga el permiso o no se niega, obtener las alertas
        }
      });
    } else {
      fetchData(); // Si ya se otorgó el permiso, obtener las alertas
    }

    const interval = setInterval(fetchData, 1000); // Realizar la solicitud cada segundo

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [previousIntensity]);

  useEffect(() => {
    // Enviar notificación si la intensidad es mayor o igual a 4
    if (alerta?.intensidad && alerta.intensidad >= 4) {
      showNotification(alerta.intensidad, alerta.alerta);
    }
  }, [alerta]);

  // Función para mostrar la notificación
  const showNotification = (intensidad, message) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(`Alerta - Se detectó un sismo de: ${intensidad}`, { body: message });
      
      notification.onclick = () => {
        window.open('http://localhost:3000/', '_blank'); // Open in a new tab
        // Alternatively, if you want to redirect in the same tab:
        // window.location.href = 'http://localhost:3000/';
      };
    }
  };

  return (
    <Modal show={alerta && alerta.intensidad >= 4}>
      <Modal.Header closeButton>
        <Modal.Title>¡Alerta!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Intensidad del sismo: {alerta?.intensidad}</p>
        <p>Fecha: {alerta?.fecha}</p>
        <p>Hora: {alerta?.hora}</p>
        <p>{alerta?.alerta}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setAlerta(null)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AlertComponent;
