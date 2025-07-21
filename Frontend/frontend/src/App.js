import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/home";
import UserDetails from "./components/UserDetails/UserDetais";
import AddUser from "./components/AddUser/AddUser";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <div className="App">
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserDetails />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
