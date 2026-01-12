import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import EQList from "./components/EQList";
import EQForm from "./components/EQForm";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [username, setUsername] = useState("");
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");

  const handleLogin = (t, r, u) => {
    setToken(t);
    setRole(r);
    setUsername(u);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
    setUsername("");
    setCurrentPage("login");
  };

  return (
    <div className="container">
      <h1>EQ & Sound Profile</h1>

      {!token ? (
        <>
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {currentPage === "login" ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Register />
          )}
        </>
      ) : (
        <>
          <p>
            Logged in as: {username} ({role}){" "}
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </p>
          {role === "admin" && (
            <EQForm
              token={token}
              editData={editData}
              onSaved={() => setEditData(null)}
              onLogout={handleLogout}
            />
          )}
          <EQList
            token={token}
            role={role}
            onEdit={(data) => setEditData(data)}
            onLogout={handleLogout}
          />
        </>
      )}
    </div>
  );
}

export default App;
