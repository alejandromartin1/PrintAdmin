import React, { useState } from 'react';
import '../styles/crearFactura.css';

const AgregarCliente = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        tipoCliente: ""
    });

    const [clientes, setClientes] = useState([]); // Estado para almacenar los clientes

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verifica si todos los campos están completos
        if (!formData.nombre || !formData.apellido || !formData.telefono || !formData.correo || !formData.tipoCliente) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Agregar nuevo cliente a la lista
        setClientes([...clientes, formData]);

        // Limpiar formulario
        setFormData({
            nombre: "",
            apellido: "",
            telefono: "",
            correo: "",
            tipoCliente: ""
        });
    };

    return (
        <>
            {/* Formulario */}
            <div className="container-agregar-cliente">
                <h1 className="title-agregar-cliente">Agregar Cliente</h1>
                <form className="form-agregar-cliente" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido:</label>
                        <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="correo">Correo:</label>
                        <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tipoCliente">Tipo de Cliente:</label>
                        <select id="tipoCliente" name="tipoCliente" value={formData.tipoCliente} onChange={handleChange} required>
                            <option value="">Seleccione una opción</option>
                            <option value="empresa">Empresa</option>
                            <option value="maquilador">Maquilador</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-agregar-cliente">Agregar Cliente</button>
                </form>
            </div>

            {/* Tabla de Clientes (Fuera del formulario) */}
            {clientes.length > 0 && (
                <div className="tabla-container">
                    <h2 className="title-tabla">Clientes Agregados</h2>
                    <table className="tabla-clientes">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente, index) => (
                                <tr key={index}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.apellido}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.correo}</td>
                                    <td>{cliente.tipoCliente}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default AgregarCliente;
