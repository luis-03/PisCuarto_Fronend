import React, { useState, useEffect } from "react";

const NodeMenu = ({ onSelect }) => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await fetch("http://localhost:8095/api/v1/nodos");
                const responseData = await response.json();
                const data = Array.isArray(responseData.data) ? responseData.data : [];
                setNodes(data);
            } catch (error) {
                console.error("Error fetching nodes:", error);
            }
        };

        fetchNodes();
    }, []);

    return (
        <div>
            <button onClick={() => onSelect(null)}>Ubicación Actual</button>
            <select onChange={(e) => {
                const selectedNodeId = e.target.value;
                const selectedNode = nodes.find(node => node.id === selectedNodeId);
                onSelect(selectedNode);
            }}>
                <option value="">Seleccionar Nodo</option>
                {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.nombre}</option>
                ))}
            </select>
        </div>
    );
};

export default NodeMenu;
