
import { Order } from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";

export const createOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Carrito vacío" });

    // Verificar stock de cada producto
    for (const item of cart.items) {
      const product = item.productId;
      if (!product) {
        return res.status(400).json({ message: "Producto no válido en el carrito" });
      }
      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto ${product.name}`,
        });
      }
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

    const newOrder = new Order({
      userId,
      items,
      total,
      estimatedDeliveryDate
    });

    // Descontar stock
    for (const item of cart.items) {
      const product = item.productId;
      product.stock -= item.quantity;
      await product.save();
    }

    // Crear la orden
    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
    });

    await order.save();

    // Vaciar carrito
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Orden confirmada exitosamente", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.productId", "name price description");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  const { status } = req.query;

  console.log("Estado recibido por query:", status);

  try {
    const query = {};
    if (status) query.status = status.trim().toLowerCase();

    const orders = await Order.find(query)
      .populate("userId", "firstName lastName documentType documentNumber email")
      .populate("items.productId", "name price description");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error en getAllOrders:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate("items.productId", "name price description");

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusValidos = ["pendiente", "confirmada", "enviada", "entregada", "cancelada"];

  if (!statusValidos.includes(status)) {
    return res.status(400).json({ message: "Estado no válido" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    res.status(200).json({ message: "Estado actualizado", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("userId", "firstName lastName documentType documentNumber email")
      .populate("items.productId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Verificación de permisos
    const isOwner = order.userId._id.equals(req.user.id);
    const isAdmin = req.user.rol === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para ver esta factura" });
    }

    const invoice = {
      cliente: {
        nombre: `${order.userId.firstName} ${order.userId.lastName}`,
        correo: order.userId.email,
        tipoDocumento: order.userId.documentType,
        numeroDocumento: order.userId.documentNumber
      },
      productos: order.items.map((item) => ({
        nombre: item.productId.name,
        precio: item.productId.price,
        cantidad: item.quantity,
        subtotal: item.productId.price * item.quantity,
      })),
      total: order.total,
      estado: order.status,
      fecha: order.createdAt,
    };

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "firstName lastName documentType documentNumber email")
      .populate("items.productId", "name price");

    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    const doc = new PDFDocument({ margin: 50 });
    const filePath = `factura-${order._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Marco visual general
    doc
      .rect(45, 45, 520, 700)
      .strokeColor("#dddddd")
      .lineWidth(1)
      .stroke();

    // Título
    doc.font("Helvetica-Bold").fontSize(18).text("Factura de compra", 50, 60, { align: "center" });
    doc.moveDown();

    // Datos del cliente
    doc.font("Helvetica").fontSize(12);
    doc.text(`Cliente: ${order.userId.firstName} ${order.userId.lastName}`);
    doc.text(`Documento: ${order.userId.documentType} ${order.userId.documentNumber}`);
    doc.text(`Correo: ${order.userId.email}`);
    doc.text(`Fecha: ${order.createdAt.toLocaleDateString()}`);
    
    // Estado con color
    const estadoColor = order.status === "enviada" ? "green" : "red";
    doc.fillColor(estadoColor).text(`Estado: ${order.status}`);
    doc.fillColor("black");
    doc.moveDown();

    // Encabezados de tabla
    doc.font("Helvetica-Bold").fontSize(12);
    const startY = doc.y;
    doc.text("Producto", 50, startY);
    doc.text("Precio", 250, startY);
    doc.text("Cantidad", 350, startY);
    doc.text("Subtotal", 450, startY);
    doc.moveDown();

    doc.font("Helvetica").fontSize(12);

    // Coordenadas columna
    const columnaProducto = 50;
    const columnaPrecio = 250;
    const columnaCantidad = 350;
    const columnaSubtotal = 450;

    // Filas + líneas
    order.items.forEach((item) => {
      const name = item.productId.name;
      const price = item.productId.price.toFixed(2);
      const qty = item.quantity;
      const subtotal = (qty * item.productId.price).toFixed(2);

      const y = doc.y;
      doc.text(name, columnaProducto, y);
      doc.text(`$${price}`, columnaPrecio, y);
      doc.text(qty.toString(), columnaCantidad, y);
      doc.text(`$${subtotal}`, columnaSubtotal, y);

      // Separador por fila
      doc
        .moveTo(50, doc.y + 2)
        .lineTo(550, doc.y + 2)
        .strokeColor("#e0e0e0")
        .stroke();

      doc.moveDown();
    });

    // Total
    doc
      .moveDown()
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("blue")
      .text(`Total: $${order.total.toFixed(2)}`, { align: "right" });

    // Firma y cierre
    doc.moveDown().moveDown();
    doc.font("Helvetica-Oblique").fontSize(10).fillColor("#555555");
    doc.text("Gracias por tu compra responsable", { align: "center" });
    doc.text("Ecoventuras - Compras con impacto", { align: "center" });
    doc.fillColor("black");

    // Finaliza
    doc.end();

    stream.on("finish", () => {
      res.download(filePath, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error("Error al generar la factura:", error);
    res.status(500).json({ message: "Hubo un problema al generar la factura." });
  }
};