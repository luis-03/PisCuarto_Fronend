import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8095/api/v1/inicio_sesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: email,
                    clave: password,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                // Si la respuesta es exitosa, se muestra un mensaje de inicio de sesión exitoso
                console.log('Inicio de sesión exitoso:', data);
                // También podrías almacenar el token de sesión en el almacenamiento local o en una cookie
                // Redirige al usuario a la página de mapas (/map) después del inicio de sesión exitoso
                navigate('/map');
            } else {
                // Si la respuesta contiene un error, se muestra el mensaje de error
                console.error('Error al iniciar sesión:', data);
                setError(data.msg);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    };

    const handleSignUpClick = () => {
        // Redirige al usuario a la ruta /mapUsuario
        navigate('/map2');
    };
    
    return (
        <div
            className="container-fluid"
            style={{
                backgroundImage: "url('https://www.unl.edu.ec/sites/default/files/galeria/2022/02/b.jpg')",
                backgroundSize: 'cover',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div className="card p-4">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Iniciar sesión</button>
                </form>
                {error && <p className="text-danger mt-3">{error}</p>}
                <p className="text-center mt-3">
                    ¿No tienes cuenta?<br/>Ingresa a las rutas de evacuación desde<br/>&nbsp;
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={handleSignUpClick}
                    >
                        AQUÍ
                    </button>
                </p>
            </div>
        </div>
    );
};
export default Login;