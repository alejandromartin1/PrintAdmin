import React, { useState } from "react";
import "../styles/inventario.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const Inventario = () => {
    const [products, setProducts] = useState([
        { id: 1, producto: "Laptop", cantidad: 10, precio: 1200, descripcion: "Laptop HP 15.6 pulgadas", fechaIngreso: "2021-10-01" },
        { id: 2, producto: "Mouse", cantidad: 30, precio: 25, descripcion: "Mouse inalámbrico", fechaIngreso: "2021-10-01" },
        { id: 3, producto: "Teclado", cantidad: 20, precio: 50, descripcion: "Teclado inalámbrico", fechaIngreso: "2021-10-01" },
        { id: 4, producto: "Monitor", cantidad: 11, precio: 200, descripcion: "Monitor 24 pulgadas", fechaIngreso: "2021-10-01" },
        { id: 5, producto: "Audífonos", cantidad: 15, precio: 30, descripcion: "Audífonos con micrófono", fechaIngreso: "2021-10-01" },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalType, setModalType] = useState(""); // "agregar", "editar" o "eliminar"
    const [formData, setFormData] = useState({
        producto: "",
        cantidad: "",
        precio: "",
        descripcion: "",
        fechaIngreso: new Date().toISOString().split("T")[0],
    });

    // Abrir modal
    const handleShowModal = (type, product) => {
        setModalType(type);
        setSelectedProduct(product);
        setFormData(product || {
            producto: "",
            cantidad: "",
            precio: "",
            descripcion: "",
        });
        setShowModal(true);
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const nuevaFecha = new Date().toISOString().split("T")[0]; // Obtiene la fecha en formato "YYYY-MM-DD"
    
        if (modalType === "editar") {
            setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...p, ...formData } : p)));
        } else {
            setProducts([...products, { id: Date.now(), ...formData, fechaIngreso: nuevaFecha }]);
        }
        handleCloseModal();
    };

    // Eliminar producto
    const handleDelete = () => {
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        handleCloseModal();
    };

    // Determinar estado según cantidad
    const determinarEstado = (cantidad) => {
        if (cantidad > 10) return "Disponible";
        if (cantidad > 0) return "Pocas unidades";
        return "Agotado";
    };

    // Disminuir cantidad y actualizar estado
    const handleDecrease = (id) => {
        setProducts(products.map((product) =>
            product.id === id
                ? { ...product, cantidad: Math.max(0, product.cantidad - 1) }
                : product
        ));
    };

    return (
        <div className="inventario-container">
            <h1 className="inventario-title">Inventario</h1>
            <div className="Tabla-container">
                <button className="btn-agregar" onClick={() => handleShowModal("agregar")}>
                    <FontAwesomeIcon icon={faPlus}/> Agregar Producto
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Fecha Ingreso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.producto}</td>
                                <td>{product.cantidad}</td>
                                <td>{product.precio}</td>
                                <td>{product.descripcion}</td>
                                <td>
                                    <span className={`estado ${determinarEstado(product.cantidad).toLowerCase().replace(/\s+/g, '-')}`}>
                                        {determinarEstado(product.cantidad)}
                                    </span>
                                </td>
                                <td>{product.fechaIngreso}</td>
                                <td>
                                    <button className="btn-delete" onClick={() => handleShowModal("eliminar", product)}>
                                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                                    </button>
                                    <button className="btn-edit" onClick={() => handleShowModal("editar", product)}>
                                        <FontAwesomeIcon icon={faEdit} /> Editar
                                    </button>
                                    <button className="btn-decrease" onClick={() => handleDecrease(product.id)}>
                                        -1
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL DE ELIMINAR */}
            {modalType === "eliminar" && showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Confirmar Eliminación</h2>
                        {selectedProduct && (
                            <p>¿Estás seguro de que quieres eliminar <strong>{selectedProduct.producto}</strong> del inventario?</p>
                        )}
                        <div className="modal-buttons">
                            <button className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                            <button className="btn-confirm" onClick={handleDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE AGREGAR/EDITAR */}
            {(modalType === "agregar" || modalType === "editar") && showModal && (
                <div className="modal-overlay">
                    <div className="modal2">
                        <h2>{modalType === "editar" ? "Editar Producto" : "Agregar Producto"}</h2>
                        <form>
                            <label>Producto:</label>
                            <input type="text" name="producto" value={formData.producto} onChange={handleChange} required />

                            <label>Cantidad:</label>
                            <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />

                            <label>Precio:</label>
                            <input type="number" name="precio" value={formData.precio} onChange={handleChange} required />

                            <label>Descripción:</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />

                            <div className="modal-buttonss">
                                <button className="btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
                                <button className="btn-confirmar" onClick={handleSave}>
                                    {modalType === "editar" ? "Guardar Cambios" : "Agregar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventario;
