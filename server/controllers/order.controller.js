
import {Order} from "../models/order.model.js";
import Cart  from "../models/cart.model.js";
import Product from "../models/product.model.js";

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

  console.log("Estado recibido por query:", status); // 👈 Esto imprime lo recibido

  try {
    const query = {};
    if (status) query.status = status.trim().toLowerCase();

    const orders = await Order.find(query)
      .populate("userId", "username email")
      .populate("items.productId", "name price description");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error en getAllOrders:", error); // para mayor depuración
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