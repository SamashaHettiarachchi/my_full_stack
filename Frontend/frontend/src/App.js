import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./fontawesome"; // Import FontAwesome configuration
import "./styles/icons.css"; // Import enhanced icon styling

// Import components
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/home";
import UserDetails from "./components/UserDetails/UserDetais";
import AddUser from "./components/AddUser/AddUser";
import EditUser from "./components/EditUser/EditUser";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import UserAnalytics from "./components/UserAnalytics/UserAnalytics";
import IconDemo from "./components/IconDemo/IconDemo";

function App() {
  return (
    <div className="App">
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserDetails />} />
          <Route path="/userdetails" element={<UserDetails />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<UserAnalytics />} />
          <Route path="/icon-demo" element={<IconDemo />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
