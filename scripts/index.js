'use strict';

// Array de productos
let productos = [
    { id: 1, nombre: 'Auriculares Inalámbricos JBL Tune 510BT', descripcion: 'Auriculares inalámbricos con sonido JBL Pure Bass, hasta 40 horas de reproducción continua y carga rápida. Diseño cómodo y plegable.', precio: 79999, imagen: 'images/auriculares-inalambricos-jbl-tune-510bt.jpg', categoria: 'Auriculares', stock: 10 },
    { id: 2, nombre: 'Cámara Web Logitech C920 HD Pro', descripcion: 'Cámara web Full HD 1080p con enfoque automático, micrófono estéreo y montaje universal para mejorar todas tus videollamadas.', precio: 127799, imagen: 'images/camara-web-logitech-c920-hd-pro.jpg', categoria: 'Camaras', stock: 5 },
    { id: 3, nombre: 'Teclado Inalámbrico Logitech K380', descripcion: 'Teclado Bluetooth multi-dispositivo, compacto y compatible con distintos sistemas operativos. Perfecto para trabajar desde cualquier lugar.', precio: 48979, imagen: 'images/teclado-inalámbrico-logitech-k380.jpg', categoria: 'Teclados', stock: 8 },
    { id: 4, nombre: 'Cámara profesional Canon EOS 90D', descripcion: 'Cámara réflex digital con sensor APS-C de 32.5 megapíxeles, grabación 4K y enfoque automático de alta velocidad. Ideal para fotografía profesional.', precio: 2548999, imagen: 'images/camara-profesional-Canon-EOS-90D.jpg', categoria: 'Camaras', stock: 2 },
    { id: 5, nombre: 'Teclado mecánico Logitech G Pro X', descripcion: 'Teclado mecánico compacto y personalizable con interruptores intercambiables, ideal para jugadores profesionales.', precio: 251499, imagen: 'images/teclado-mecánico-Logitech-G-Pro-X.jpg', categoria: 'Teclados', stock: 17 },
    { id: 6, nombre: 'Auriculares inalámbricos Sony WH-1000XM5', descripcion: 'Auriculares de diadema con cancelación de ruido activa, sonido Hi-Res, y hasta 30 horas de batería para una experiencia de audio envolvente.', precio: 689999, imagen: 'images/auriculares-inalámbricos-Sony WH-1000XM5.jpg', categoria: 'Auriculares', stock: 4 },
    { id: 7, nombre: 'Teclado Razer Huntsman 60% Mini', descripcion: 'Teclado mecánico de 60%, compacto y con switches ópticos Razer, ideal para gamers y usuarios que buscan una experiencia de escritura rápida y precisa.', precio: 137449, imagen: 'images/teclado-Razer-Huntsman-Mini.jpg', categoria: 'Teclados', stock: 9 },
    { id: 8, nombre: 'Cámara compacta Sony Cyber-shot RX100 VII', descripcion: 'Cámara compacta con sensor de 1 pulgada y lente de 24-200mm, ideal para videografía y fotografía de alta calidad en un cuerpo pequeño.', precio: 2899499, imagen: 'images/camara-compacta-Sony-Cyber-shot-RX100-VII.jpg', categoria: 'Camaras', stock: 10 },
    { id: 9, nombre: 'Auriculares gaming HyperX Cloud II', descripcion: 'Auriculares con sonido envolvente 7.1 virtual, micrófono desmontable y diseño de diadema ajustable. Perfectos para gaming.', precio: 139299, imagen: 'images/auriculares-gaming-HyperX-Cloud-II.jpg', categoria: 'Auriculares', stock: 11 },
];

// Clase para manejar el carrito de compras
class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        const existe = this.productos.find(item => item.id === producto.id);
        if (existe) {
            if (existe.cantidad < producto.stock) {
                existe.cantidad++;
            } else {
                alert(`No hay más stock disponible para el producto: ${producto.nombre}`);
                return;
            }
        } else {
            if (producto.stock > 0) {
                this.productos.push({ ...producto, cantidad: 1 });
            } else {
                alert(`El producto: ${producto.nombre} no tiene stock disponible.`);
                return;
            }
        }

        // Reducir el stock
        const index = productos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
            productos[index].stock--;
        }

        this.actualizarCarrito();
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        this.productos = this.productos.filter(item => item.id !== id);
        this.actualizarCarrito();
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.productos = [];
        this.actualizarCarrito();
    }

    // Actualizar el carrito en la interfaz y guardar en localStorage
    actualizarCarrito() {
        const totalItems = this.productos.reduce((acc, item) => acc + item.cantidad, 0);
        const totalPrecio = this.productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        // Actualizar cantidad y total del carrito
        const carritoCantidad = document.querySelector('#carrito .cantidad');
        const carritoTotal = document.querySelector('#carrito .total');

        if (carritoCantidad && carritoTotal) {
            carritoCantidad.textContent = totalItems;
            carritoTotal.textContent = totalPrecio.toFixed(2);
        }

        // Guardar en el localStorage
        localStorage.setItem('carrito', JSON.stringify(this.productos));

        // Actualizar el total en el modal del carrito
        const montoTotalModal = document.getElementById('monto-total');
        if (montoTotalModal) {
            montoTotalModal.textContent = `Total: $${totalPrecio.toFixed(2)}`;
        }

        // Actualizar la lista de productos en el modal del carrito
        this.actualizarModalCarrito();
    }

    // Actualizar el modal con los productos actuales
    actualizarModalCarrito() {
        const contenidoCarrito = document.getElementById('contenido-carrito');
        contenidoCarrito.innerHTML = ''; // Limpiar el contenido antes de volver a cargarlo

        // Si el carrito está vacío...
        if (this.productos.length === 0) {
            const mensajeVacio = document.createElement('p');
            mensajeVacio.textContent = 'No hay ningún producto en el carrito.';
            contenidoCarrito.appendChild(mensajeVacio);
        } else {
            // Sino...
            this.productos.forEach(producto => {
                const itemCarrito = document.createElement('li');
                
                // Productos agregados al carrito
                const nombre = document.createElement('h2');
                nombre.textContent = producto.nombre;

                const precio = document.createElement('p');
                precio.textContent = `$${producto.precio}`;

                const cantidad = document.createElement('p');
                cantidad.textContent = `${producto.cantidad}`;

                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'X';
                botonEliminar.setAttribute('data-id', producto.id);
                botonEliminar.classList.add('eliminar-producto');

                itemCarrito.appendChild(nombre);
                itemCarrito.appendChild(precio);
                itemCarrito.appendChild(cantidad);
                itemCarrito.appendChild(botonEliminar);

                contenidoCarrito.appendChild(itemCarrito);

                // Agregar evento para eliminar el producto
                itemCarrito.querySelector('.eliminar-producto').addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    this.eliminarProducto(id);
                });
            });
        }
    }

}

// Inicializar carrito
const carrito = new Carrito();

// Mostrar el modal 
document.getElementById('ver-carrito').addEventListener('click', () => {
    const modal = document.getElementById('modal-carrito');
    modal.style.display = 'flex'; 
    carrito.actualizarCarrito(); 
});

// Cerrar el modal
document.getElementById('cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal-carrito').style.display = 'none';
});

// Vaciar el carrito
document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito.vaciarCarrito();
});

// Cargar productos
function cargarProductos(listaProductos = productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    listaProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto');

        const img = document.createElement('img');
        img.setAttribute('src', producto.imagen);
        img.setAttribute('alt', producto.nombre);
        card.appendChild(img);

        const nombre = document.createElement('h2');
        const nombreTexto = document.createTextNode(producto.nombre);
        nombre.appendChild(nombreTexto);
        card.appendChild(nombre);

        const descripcion = document.createElement('p');
        const descripcionTexto = document.createTextNode(producto.descripcion);
        descripcion.appendChild(descripcionTexto);
        card.appendChild(descripcion);

        const precio = document.createElement('p');
        const precioTexto = document.createTextNode(`$${producto.precio}`);
        const precioFuerte = document.createElement('strong');
        precioFuerte.appendChild(precioTexto);
        precio.appendChild(precioFuerte);
        card.appendChild(precio);

        const boton = document.createElement('button');
        const botonTexto = document.createTextNode('Agregar al carrito');
        boton.appendChild(botonTexto);
        boton.setAttribute('data-id', producto.id);
        card.appendChild(boton);

        // Agregar evento al botón de agregar al carrito
        boton.addEventListener('click', () => {
            carrito.agregarProducto(producto);
        });

        contenedor.appendChild(card);
    });
}

let productosFiltrados = productos; // Esta variable guarda la lista de productos filtrados
let ordenActual = true; // Esta variable guarda el orden actual

// Filtrar productos por categoría
document.getElementById('filtrar-por').addEventListener('change', (e) => {
    const categoria = e.target.value;
    if (categoria === 'todos') {
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    }

    // Aplicar el orden actual después de filtrar
    if (ordenActual === 'precio-ascendente') {
        ordenarPorPrecio(true);
    } else if (ordenActual === 'precio-descendente') {
        ordenarPorPrecio(false);
    } else {
        ordenarPorRelevancia();
    }
});

// Ordenar productos por...
document.getElementById('ordenar-por').addEventListener('change', (e) => {
    const orden = e.target.value;
    ordenActual = orden; // Actualizar a orden actual

    if (orden === 'precio-ascendente') {
        ordenarPorPrecio(true);
    } else if (orden === 'precio-descendente') {
        ordenarPorPrecio(false);
    } else if (orden === 'mas-relevante') {
        ordenarPorRelevancia();
    }
});

// Ordenar los productos por precio
function ordenarPorPrecio(ascendente = true) {
    productosFiltrados.sort((a, b) => (ascendente ? a.precio - b.precio : b.precio - a.precio));
    cargarProductos(productosFiltrados); // Cargar productos ordenados
}

// Ordenar los productos por mayor relevancia (se hace por orden de ID ascendente)
function ordenarPorRelevancia() {
    productosFiltrados.sort((a, b) => a.id - b.id);
    cargarProductos(productosFiltrados); // Cargar productos ordenados
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    carrito.actualizarCarrito();
});