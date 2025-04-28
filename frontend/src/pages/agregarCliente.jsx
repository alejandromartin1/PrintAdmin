import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
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
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const obtenerClientes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/clientes');
            const data = await res.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los clientes',
            });
        } finally {
            setIsLoading(false);
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
        setIsLoading(true);
        
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
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: modalType === 'editar' 
                        ? 'Cliente actualizado correctamente' 
                        : 'Cliente agregado correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
                setFormData({
                    nombre: '',
                    apellido: '',
                    numero_telefono: '',
                    correo: '',
                    tipo_cliente: '',
                });
                obtenerClientes();
                handleCloseModal();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Ocurrió un error',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCliente?.id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Cliente no válido para eliminar',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/cliente/${selectedCliente.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Cliente eliminado correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
                obtenerClientes();
                handleCloseModal();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Error al eliminar cliente',
                });
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="clientes-container">
            {/* Encabezado */}
            <div className="clientes-header">
                <h1 className="clientes-title">
                    <FontAwesomeIcon icon={faUser} className="clientes-title-icon" />
                    Gestión de Clientes
                </h1>
                <button 
                    className="clientes-add-btn" 
                    onClick={() => handleShowModal("agregar")}
                    disabled={isLoading}
                >
                    <FontAwesomeIcon icon={faPlus} /> Agregar Cliente
                </button>
            </div>

            {/* Modal del formulario */}
            {showFormModal && (
                <div className="clientes-modal-overlay">
                    <div className="clientes-form-modal">
                        <h2 className="clientes-modal-title">
                            {modalType === 'editar' ? "Editar Cliente" : "Nuevo Cliente"}
                        </h2>
                        <form className="clientes-form" onSubmit={handleSubmit}>
                            <div className="clientes-form-group">
                                <label htmlFor="nombre" className="clientes-form-label">Nombre:</label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={formData.nombre} 
                                    onChange={handleChange} 
                                    className="clientes-form-input"
                                    required 
                                />
                            </div>
                            <div className="clientes-form-group">
                                <label htmlFor="apellido" className="clientes-form-label">Apellido:</label>
                                <input 
                                    type="text" 
                                    id="apellido" 
                                    name="apellido" 
                                    value={formData.apellido} 
                                    onChange={handleChange} 
                                    className="clientes-form-input"
                                    required 
                                />
                            </div>
                            <div className="clientes-form-group">
                                <label htmlFor="telefono" className="clientes-form-label">Teléfono:</label>
                                <input 
                                    type="tel" 
                                    id="telefono" 
                                    name="numero_telefono" 
                                    value={formData.numero_telefono} 
                                    onChange={handleChange} 
                                    className="clientes-form-input"
                                    required 
                                />
                            </div>
                            <div className="clientes-form-group">
                                <label htmlFor="correo" className="clientes-form-label">Correo:</label>
                                <input 
                                    type="email" 
                                    id="correo" 
                                    name="correo" 
                                    value={formData.correo} 
                                    onChange={handleChange} 
                                    className="clientes-form-input"
                                    required 
                                />
                            </div>
                            <div className="clientes-form-group">
                                <label htmlFor="tipoCliente" className="clientes-form-label">Tipo de Cliente:</label>
                                <select 
                                    id="tipoCliente" 
                                    name="tipo_cliente" 
                                    value={formData.tipo_cliente} 
                                    onChange={handleChange} 
                                    className="clientes-form-select"
                                    required
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="empresa">Empresa</option>
                                    <option value="maquilador">Maquilador</option>
                                    <option value="cliente">Cliente</option>
                                </select>
                            </div>
                            <div className="clientes-modal-buttons">
                                <button 
                                    type="button" 
                                    className="clientes-modal-cancel" 
                                    onClick={handleCloseModal}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="clientes-modal-confirm"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de eliminar */}
            {modalType === "eliminar" && showDeleteModal && (
                <div className="clientes-modal-overlay">
                    <div className="clientes-delete-modal">
                        <h2 className="clientes-modal-title">Confirmar Eliminación</h2>
                        {selectedCliente && (
                            <p className="clientes-delete-text">
                                ¿Estás seguro de que quieres eliminar al cliente 
                                <strong> {selectedCliente.nombre} {selectedCliente.apellido}</strong>?
                            </p>
                        )}
                        <div className="clientes-modal-buttons">
                            <button 
                                className="clientes-modal-cancel" 
                                onClick={handleCloseModal}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="clientes-modal-delete" 
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de clientes */}
            <div className="clientes-table-container">
                <h2 className="clientes-subtitle">Listado de Clientes</h2>
                
                {isLoading && clientes.length === 0 ? (
                    <div className="clientes-loading">Cargando clientes...</div>
                ) : clientes.length > 0 ? (
                    <table className="clientes-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.apellido}</td>
                                    <td>{cliente.numero_telefono}</td>
                                    <td>{cliente.correo}</td>
                                    <td>
                                        <span className={`clientes-badge clientes-badge-${cliente.tipo_cliente}`}>
                                            {cliente.tipo_cliente}
                                        </span>
                                    </td>
                                    <td className="clientes-actions">
                                        <button 
                                            className="clientes-btn-edit" 
                                            onClick={() => handleShowModal("editar", cliente)}
                                            disabled={isLoading}
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Editar
                                        </button>
                                        <button 
                                            className="clientes-btn-delete" 
                                            onClick={() => handleShowModal("eliminar", cliente)}
                                            disabled={isLoading}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="clientes-empty">
                        No hay clientes registrados. Agrega tu primer cliente.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgregarCliente;