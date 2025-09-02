import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/inventario.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash, faBoxes } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";


const Inventario = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalType, setModalType] = useState("");
    const [formData, setFormData] = useState({
        producto: "",
        cantidad: "",
        descripcion: "",
    });
      const location = useLocation();
  const params = new URLSearchParams(location.search);
  const buscarId = params.get("buscar"); // 👈 capturar query param


    const permisosUsuario = JSON.parse(localStorage.getItem("permisos")) || [];
    const rol = localStorage.getItem("rol");
    const esAdmin = rol === "Administrador";
    useEffect(() => {
        fetchProducts();
    }, []);

useEffect(() => {
  if (buscarId && products.length > 0) {
    const productoEncontrado = products.find(p => p.id.toString() === buscarId);
    if (productoEncontrado) {
      // ✅ Aquí ya tienes el producto encontrado
      console.log("Producto encontrado en inventario:", productoEncontrado);

    }
  }
}, [buscarId, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/inventario");
            setProducts(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const handleShowModal = (type, product = null) => {
        setModalType(type);
        setSelectedProduct(product);
        setFormData(product || {
            producto: "",
            cantidad: "",
            descripcion: "",
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (modalType === "editar") {
                await axios.put(`http://localhost:5000/api/inventario/${selectedProduct.id}`, {
                    producto: formData.producto,
                    cantidad: formData.cantidad,
                    descripcion: formData.descripcion
                });
            } else {
                await axios.post("http://localhost:5000/api/inventario", {
                    producto: formData.producto,
                    cantidad: formData.cantidad,
                    descripcion: formData.descripcion,
                });
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar producto:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/inventario/${selectedProduct.id}`);
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const determinarEstado = (cantidad) => {
        const num = parseInt(cantidad, 10);
        if (num > 10) return "Disponible";
        if (num > 0) return "Pocas unidades";
        return "Agotado";
    };

    const handleDecrease = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/inventario/disminuir/${id}`);
            if (response.data && response.data.producto) {
                setProducts((prevProducts) =>
                    prevProducts.map((p) =>
                        p.id === id ? { ...p, cantidad: response.data.producto.cantidad } : p
                    )
                );
            } else {
                console.error("Respuesta inválida al disminuir:", response.data);
            }
        } catch (error) {
            console.error("Error al disminuir:", error);
        }
    };

    const handleIncrease = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/inventario/incrementar/${id}`);
            if (response.data && response.data.producto) {
                setProducts((prevProducts) =>
                    prevProducts.map((p) =>
                        p.id === id ? { ...p, cantidad: response.data.producto.cantidad } : p
                    )
                );
            } else {
                console.error("Respuesta inválida al incrementar:", response.data);
            }
        } catch (error) {
            console.error("Error al incrementar:", error);
        }
    };

    return (
        <div className="inventario-container">
            <div className="inventario-header">
                <h1>
                    <FontAwesomeIcon icon={faBoxes} className="inventario-icon" />
                    Inventario
                </h1>
                <hr />
            </div>

            <div className="Tabla-container">
     {(esAdmin || permisosUsuario.includes("agregar_producto")) && (
        <button className="btn-agregar" onClick={() => handleShowModal("agregar")}>
            <FontAwesomeIcon icon={faPlus} /> Agregar Producto
        </button>
    )}
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
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
                    <td>{product.descripcion}</td>
                    <td>
                        <span className={`estado ${determinarEstado(product.cantidad).toLowerCase().replace(/\s+/g, '-')}`}>
                            {determinarEstado(product.cantidad)}
                        </span>
                    </td>
                    <td>{new Date(product.fecha_ingreso).toLocaleDateString("es-MX")}</td>
                    <td>
                        <div className="inventario-acciones">
                              {(esAdmin || permisosUsuario.includes("eliminar_producto")) && (
                                <button className="btn-delete" onClick={() => handleShowModal("eliminar", product)}>
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar 
                                </button>
                            )}
                             {(esAdmin || permisosUsuario.includes("editar_producto")) && (
                                <button className="btn-edit" onClick={() => handleShowModal("editar", product)}>
                                    <FontAwesomeIcon icon={faEdit} /> Editar
                                </button>
                            )}
                              {(esAdmin || permisosUsuario.includes("disminuir_producto")) && (
                                <button className="btn-decrease" onClick={() => handleDecrease(product.id)}>-</button>
                            )}
                             {(esAdmin || permisosUsuario.includes("aumentar_producto")) && (
                                <button className="btn-increase" onClick={() => handleIncrease(product.id)}>+</button>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


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

           {(modalType === "agregar" || modalType === "editar") && showModal && (
    <div className="modal-overlay">
        <div className="modal2">
            <h2 className="modal-title">
                {modalType === "editar" ? "Editar Producto" : "Agregar Producto"}
            </h2>
            <form className="modal-form">
                <label>Producto:</label>
                <input
                    type="text"
                    name="producto"
                    value={formData.producto}
                    onChange={handleChange}
                    required
                />

                <label>Cantidad:</label>
                <input
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    required
                />

                <label>Descripción:</label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                />

                <div className="modal-buttons">
                    <button className="btn-cancelar" type="button" onClick={handleCloseModal}>
                        Cancelar
                    </button>
                    <button className="btn-confirmar" type="button" onClick={handleSave}>
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
