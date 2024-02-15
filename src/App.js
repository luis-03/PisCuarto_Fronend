import './App.css';
import MapView from './components/MapView';
import MapView2 from './components/MapView2';
import Nodo from './components/Nodo';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Persona from './components/Persona';



function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/map" element ={ <MapView />}/>
        <Route path="/map2" element ={ <MapView2 />}/>
        <Route path="/nodo" element ={ <Nodo />}/>

       
        <Route path="/" element ={<Login />}/>
        <Route path="/persona" element ={<Persona />}/>
      </Routes>
    </Router>
    
    );
}

export default App;
