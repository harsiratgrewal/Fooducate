import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Meals from './pages/Meals';
import Dashboard from './pages/Dashboard';
import Nutrients from './pages/Nutrients';
import GroceryList from './pages/GroceryList';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import MealPlan from './pages/MealPlan';
import RecipeDetails from './pages/RecipeDetails';
import Objectives from './pages/Objectives';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/mealplan" element={<MealPlan />} />
        <Route path="/grocerylist" element={<GroceryList />} />
        <Route path="/nutrients" element={<Nutrients />} />
        <Route path="/register" element={<Register />} />
        <Route path="/objectives" element={<Objectives />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;