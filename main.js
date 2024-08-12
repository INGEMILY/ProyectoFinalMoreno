class Producto {
    constructor(nombre, precio, atributos, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.atributos = atributos;
        this.imagen = imagen;
        this.cantidad = 0;
    }
}

class Categoria {
    constructor(nombre, productos) {
        this.nombre = nombre;
        this.productos = productos;
    }

    listarProductos() {
        return this.productos.map((producto, index) => 
            `${index + 1}. ${producto.nombre} - $${formatearPrecio(producto.precio)} (${producto.atributos.join(', ')})`
        ).join('\n');
    }
}

const carrito = [];
const categorias = [
    new Categoria('Ropa', [
        new Producto('Camisa', 20000, ['Color: Azul', 'Talla: M'], 'images/camisa.jpg'),
        new Producto('Pantalón', 30000, ['Color: Negro', 'Talla: 32'], 'images/pantalon.jpg'),
        new Producto('Zapatos', 50000, ['Color: Marrón', 'Talla: 42'], 'images/zapatos.jpg'),
    ]),
    new Categoria('Hogar', [
        new Producto('Mesa', 100000, ['Material: Madera', 'Dimensiones: 120x60cm'], 'images/mesa.jpg'),
        new Producto('Silla', 50000, ['Material: Plástico', 'Color: Blanco'], 'images/silla.jpg'),
        new Producto('Lámpara', 30000, ['Material: Metal', 'Color: Negro'], 'images/lampara.jpg'),
    ]),
    new Categoria('Tecnología', [
        new Producto('Teclado', 25000, ['Marca: Logitech'], 'images/teclado.jpg'),
        new Producto('Mouse', 15000, ['Marca: Razer'], 'images/mouse.jpg'),
        new Producto('Pantalla', 150000, ['Marca: Samsung'], 'images/pantalla.jpg'),
    ]),
    new Categoria('Belleza', [
        new Producto('Perfume', 75000, ['Marca: Chanel'], 'images/perfume.jpg'),
        new Producto('Crema', 25000, ['Marca: Nivea'], 'images/crema.jpg'),
        new Producto('Maquillaje', 40000, ['Marca: Maybelline'], 'images/maquillaje.jpg'),
    ])
];

function formatearPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function verMenuPrincipal() {
    $('#output').html(`
        <h2>++ BIENVENIDO A LA TIENDA MALL-ALL ++</h2>
        <button onclick="mostrarMenuCategorias()">Comprar Producto</button>
        <button onclick="verCarrito()">Ver Carrito</button>
        <button onclick="salir()">Salir</button>
    `);
}

function mostrarMenuCategorias() {
    const opcionesCategorias = categorias.map((categoria, index) => 
        `<button onclick="productoSeleccionar(${index})">${categoria.nombre}</button>`
    ).join('<br>');

    $('#output').html(`
        <h2>++ CATEGORÍAS DISPONIBLES ++</h2>
        ${opcionesCategorias}
    `);
}

function productoSeleccionar(index) {
    const categoriaSeleccionada = categorias[index];
    const productosCategoria = categoriaSeleccionada.productos.map((producto, i) => 
        `<div class="producto">
           <img src="${producto.imagen}" alt="${producto.nombre}">
           <button onclick="comprarProducto(${index}, ${i})">${producto.nombre} - $${formatearPrecio(producto.precio)} (${producto.atributos.join(', ')})</button>
         </div>`
    ).join('<br>');

    $('#output').html(`
        <h2>+++ PRODUCTOS DISPONIBLES EN ${categoriaSeleccionada.nombre.toUpperCase()} +++</h2>
        ${productosCategoria}
    `);
}

function comprarProducto(categoriaIndex, productoIndex) {
    const producto = categorias[categoriaIndex].productos[productoIndex];
    $('#output').html(`
        <h2>Comprar ${producto.nombre}</h2>
        <label>¿Cuántas unidades deseas comprar?</label>
        <input type="number" id="cantidad" min="1">
        <button onclick="confirmarCompra(${categoriaIndex}, ${productoIndex})">Confirmar</button>
        <button onclick="verMenuPrincipal()">Cancelar</button>
    `);
}

function confirmarCompra(categoriaIndex, productoIndex) {
    const producto = categorias[categoriaIndex].productos[productoIndex];
    const cantidad = parseInt($('#cantidad').val());

    if (cantidad > 0) {
        const productoEnCarrito = carrito.find(item => item.nombre === producto.nombre);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        $('#output').html(`
            <h2>Producto añadido al carrito</h2>
            <button onclick="mostrarMenuCategorias()">Comprar más</button>
            <button onclick="verMenuPrincipal()">Ir al menú principal</button>
        `);
    } else {
        $('#output').html(`
            <h2>Cantidad no válida</h2>
            <button onclick="comprarProducto(${categoriaIndex}, ${productoIndex})">Intentar de nuevo</button>
        `);
    }
}

function verCarrito() {
    if (carrito.length === 0) {
        $('#output').html(`
            <h2>El carrito está vacío.</h2>
            <button onclick="verMenuPrincipal()">Ir al menú principal</button>
        `);
        return;
    }

    const listaProductosCarrito = carrito.map((producto, index) => 
        `<div class="producto">
           <img src="${producto.imagen}" alt="${producto.nombre}">
           ${index + 1}. ${producto.nombre} - $${formatearPrecio(producto.precio)} (${producto.atributos.join(', ')}) - Cantidad: ${producto.cantidad}
         </div>`
    ).join('<br>');

    let totalCarrito = carrito.reduce((sumaTotal, producto) => sumaTotal + (producto.precio * producto.cantidad), 0);

    $('#output').html(`
        <h2>+++ CARRITO DE COMPRAS +++</h2>
        ${listaProductosCarrito}
        <p>Total: $${formatearPrecio(totalCarrito)}</p>
        <label>¿Tienes un código de descuento?</label>
        <input type="checkbox" id="codigoDescuento">
        <button onclick="confirmarCompraFinal(${totalCarrito})">Proceder con el pago</button>
        <button onclick="verMenuPrincipal()">Seguir comprando</button>
    `);
}

function confirmarCompraFinal(totalCarrito) {
    const tieneCodigoDescuento = $('#codigoDescuento').prop('checked');
    totalCarrito = tieneCodigoDescuento ? totalCarrito * 0.9 : totalCarrito;

    $('#output').html(`
        <h2>Compra finalizada</h2>
        <p>Total: $${formatearPrecio(totalCarrito)}</p>
        <button onclick="finalizarCompra()">Finalizar</button>
    `);
}

function finalizarCompra() {
    carrito.length = 0;
    $('#output').html(`
        <h2>Gracias por tu compra. Vuelve pronto.</h2>
        <button onclick="verMenuPrincipal()">Ir al menú principal</button>
    `);
}

function salir() {
    $('#output').html(`
        <h2>¡Nos vemos pronto amig@! Gracias por tu visita</h2>
    `);
}

$(document).ready(verMenuPrincipal);
