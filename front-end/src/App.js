import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home'
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {

  return (
    <Router>
      <Routes >
        <Route path="/" element={<Home />}></Route>
      </Routes >
    </Router>
  );


}

export default App;

