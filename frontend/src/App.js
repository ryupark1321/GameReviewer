import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './components/Home';
import Game from './components/Game';
import Games from './components/Games';

function App() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/games/all")
      .then((res) => {
        setGames(res.data)
      })
  })
  const filterFunction = (item) => {
    return !(item['name'] === "" && item['name'] === "test2" && item['name'] === 'test3' && item['name'] === 'Pieterw test app76 ( 216938 )');
  };
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/all" element={<Games games={ games } />}/>
          <Route path="/games/:id" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
