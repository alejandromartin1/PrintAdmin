// src/pages/NotFound.jsx

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#white", // fondo amarillo claro
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#f44336", // rojo fuerte
          color: "#fff",
          borderRadius: "50%",
          width: "120px",
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3.5rem",
          fontWeight: "700",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          marginBottom: "20px",
        }}
      >
        404
      </div>

      <h2 style={{ fontSize: "2rem", color: "#ff6363", marginBottom: "10px" }}>
        Página no encontrada
      </h2>

      <p
        style={{
          fontSize: "1.1rem",
          color: "#ff6363", // rosa fuerte tirando a rojo
          marginBottom: "30px",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        
      </p>

      <Link
        to="/dashboard"
        style={{
          backgroundColor: "#4caf50", // verde
          color: "#fff",
          padding: "12px 26px",
          fontSize: "1rem",
          fontWeight: "600",
          borderRadius: "8px",
          textDecoration: "none",
          transition: "0.3s ease",
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#43a047";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#4caf50";
        }}
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
