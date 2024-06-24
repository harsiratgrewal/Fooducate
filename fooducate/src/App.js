import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Meals from './pages/Meals';
import Dashboard from './pages/Dashboard';
import Nutrients from './pages/Nutrients';
import GroceryList from './pages/GroceryList';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

function App() {

  return (
  <Router>
      <Routes>
        <Route exact path='/' element={<SignIn />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/meals' element={<Meals />} />
        <Route path='/grocerylist' element={<GroceryList />} />
        <Route path='/nutrients' element={<Nutrients />} />
        <Route path='/register' element={<Register />} />
        
      </Routes>
    </Router>
  );
}

export default App;
