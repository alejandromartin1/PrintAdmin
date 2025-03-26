import React, { useState } from "react";
import "../styles/inventario.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button} from "react-bootstrap";

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


        // Abrir modal de confirmación
    const handleShowModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Eliminar producto confirmado
    const handleDelete = () => {
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        handleCloseModal();
    };

  // Función para determinar el estado basado en la cantidad
    const determinarEstado = (cantidad) => {
        if (cantidad > 10) return "Disponible";
        if (cantidad > 0) return "Pocas unidades";
        return "Agotado";
    };

  // Disminuir cantidad y actualizar estado
    const handleDecrease = (id) => {
        setProducts(
        products.map((product) =>
            product.id === id
            ? { ...product, cantidad: Math.max(0, product.cantidad - 1) }
            : product
        )
        );
    };

    return (
    <div className="inventario-container">
        <h1 className="inventario-title">Inventario</h1>
        <div className="Tabla-container">
            <button>Agregar Producto</button>
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
                    <span
                        className={`badge ${
                        determinarEstado(product.cantidad) === "Disponible"
                            ? "bg-success"
                            : determinarEstado(product.cantidad) === "Pocas unidades"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                    >
                        {determinarEstado(product.cantidad)}
                    </span>
                    </td>
                    <td>{product.fechaIngreso}</td>
                    <td>
                    <button onClick={() => handleShowModal(product)}>
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </button>
                    <button>
                        <FontAwesomeIcon icon={faEdit} /> Editar
                    </button>
                    <button variant="secondary" onClick={() => handleDecrease(product.id)}>
                        -1
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {selectedProduct && (
                    <p>¿Estás seguro de que quieres eliminar <strong>{selectedProduct.producto}</strong> del inventario?</p>
                )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Eliminar
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
    );
};

export default Inventario;