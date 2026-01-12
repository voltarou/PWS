import React from "react";

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li
          style={currentPage === "login" ? {...styles.li, ...styles.active} : styles.li}
          onClick={() => setCurrentPage("login")}
        >
          Login
        </li>
        <li
          style={currentPage === "register" ? {...styles.li, ...styles.active} : styles.li}
          onClick={() => setCurrentPage("register")}
        >
          Register
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    marginBottom: "20px",
    borderBottom: "2px solid #3498db",
  },
  ul: {
    listStyle: "none",
    display: "flex",
    padding: 0,
    margin: 0,
  },
  li: {
    padding: "10px 20px",
    cursor: "pointer",
    color: "#2c3e50",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  active: {
    color: "#fff",
    backgroundColor: "#3498db",
    borderRadius: "8px 8px 0 0",
  },
};

export default Navbar;
