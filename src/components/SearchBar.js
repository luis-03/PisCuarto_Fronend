import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onSearch(searchInput);
  };

  return (
    <Form>
      <Form.Group controlId="formSearch">
        <Form.Control 
          type="text" 
          placeholder="Ingrese identificación para buscar"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleSearch}>Buscar</Button>
    </Form>
  );
};

export default SearchBar;
