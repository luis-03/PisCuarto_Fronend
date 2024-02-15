import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const Menu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [filteredNodes, setFilteredNodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getNodes = async () => {
        try {
            const response = await fetch("http://localhost:8095/api/v1/nodos");
            const responseData = await response.json();
            const data = Array.isArray(responseData.data) ? responseData.data : [];
            setNodes(data);
            setFilteredNodes(data.slice(0, 10));
        } catch (error) {
            console.error("Error getting nodes:", error);
        }
    };

    const handleNodeSelection = async (node) => {
        setShowMenu(false);
        // Handle node selection logic here
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (showMenu) {
            getNodes();
        }
    }, [showMenu]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        setFilteredNodes(nodes.filter(node => node.nombre.toLowerCase().includes(searchTerm.toLowerCase())).slice(startIndex, endIndex));
    }, [nodes, currentPage, searchTerm]);

    return (
        <div>
            <Button variant="primary" onClick={toggleMenu}>Mostrar Menú</Button>
            {showMenu && (
                <div>
                    <Button variant="secondary" onClick={toggleMenu}>Ocultar Menú</Button>
                    <Form.Control type="text" placeholder="Buscar por nombre" value={searchTerm} onChange={handleSearch} />
                    <ul className="list-group">
                        {filteredNodes.map(node => (
                            <li key={node.external_registro} className="list-group-item">
                                <Button variant="link" onClick={() => handleNodeSelection(node)}>{node.nombre}</Button> 
                            </li>
                        ))}
                    </ul>
                    <ul className="pagination">
                        {Array.from({ length: Math.ceil(nodes.length / 10) }).map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <Button variant="link" className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;
