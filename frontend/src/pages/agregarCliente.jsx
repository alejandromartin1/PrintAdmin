import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/agregarCliente.css';

const AgregarCliente = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        numero_telefono: "",
        correo: "",
        tipo_cliente: ""
    });

    const [modalType, setModalType] = useState("");
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [setShowModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [clientes, setClientes] = useState([]);

    const obtenerClientes = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/clientes');
            const data = await res.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    useEffect(() => {
        obtenerClientes();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleShowModal = (type, cliente = null) => {
        setModalType(type);
        setSelectedCliente(cliente);
        if (type === 'eliminar') {
            setDeleteModal(true);
        } else if (type === 'agregar') {
            setFormData({
                nombre: "",
                apellido: "",
                numero_telefono: "",
                correo: "",
                tipo_cliente: ""
            });
            setShowFormModal(true);
        } else if (type === 'editar' && cliente) {
            setFormData(cliente);
            setShowFormModal(true);
        }
    };

    const handleCloseModal = () => {
        setDeleteModal(false);
        setShowFormModal(false);
        setSelectedCliente(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const method = modalType === 'editar' ? 'PUT' : 'POST';
            const url = modalType === 'editar'
                ? `http://localhost:5000/api/cliente/${selectedCliente.id}`
                : 'http://localhost:5000/api/cliente';
    
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (response.ok) {
                setShowModal(true);
                setFormData({
                    nombre: '',
                    apellido: '',
                    numero_telefono: '',
                    correo: '',
                    tipo_cliente: '',
                });
                obtenerClientes(); // Recargar la lista
                setTimeout(() => setShowModal(false));
                handleCloseModal();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con la API');
        }
    };
    

    const handleDelete = async () => {
        if (!selectedCliente?.id) return alert("Cliente no válido para eliminar.");

        try {
            const response = await fetch(`http://localhost:5000/api/cliente/${selectedCliente.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                obtenerClientes();
                handleCloseModal();
            } else {
                alert("Error al eliminar cliente: " + data.message);
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('Error al conectar con la API');
        }
    };

    return (
        <>
            {/* Botón para mostrar el modal de agregar */}
            <div className="container-agregar-cliente">
                <h1 className="title-agregar-cliente">Clientes</h1>
                <button className="btn-agregar-cliente" onClick={() => handleShowModal("agregar")}>Agregar Cliente</button>
            </div>

            {/* Modal del formulario */}
            {showFormModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{modalType === 'editar' ? "Editar Cliente" : "Agregar Cliente"}</h2>
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
                                <input type="tel" id="telefono" name="numero_telefono" value={formData.numero_telefono} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="correo">Correo:</label>
                                <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipoCliente">Tipo de Cliente:</label>
                                <select id="tipoCliente" name="tipo_cliente" value={formData.tipo_cliente} onChange={handleChange} required>
                                    <option value="">Seleccione una opción</option>
                                    <option value="empresa">Empresa</option>
                                    <option value="maquilador">Maquilador</option>
                                    <option value="cliente">Cliente</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button type="submit" className="btn-confirm">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Modal de eliminar */}
            {modalType === "eliminar" && showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Confirmar Eliminación</h2>
                        {selectedCliente && (
                            <p>¿Estás seguro de que quieres eliminar <strong>{selectedCliente.nombre} {selectedCliente.apellido}</strong>?</p>
                        )}
                        <div className="modal-buttons">
                            <button className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                            <button className="btn-confirm" onClick={handleDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de clientes */}
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
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente, index) => (
                                <tr key={index}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.apellido}</td>
                                    <td>{cliente.numero_telefono}</td>
                                    <td>{cliente.correo}</td>
                                    <td>{cliente.tipo_cliente}</td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleShowModal("eliminar", cliente)}>
                                            <FontAwesomeIcon icon={faTrash} /> Eliminar
                                        </button>
                                        <button className="btn-edit" onClick={() => handleShowModal("editar", cliente)}>
                                            <FontAwesomeIcon icon={faEdit} /> Editar
                                        </button>
                                    </td>
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
