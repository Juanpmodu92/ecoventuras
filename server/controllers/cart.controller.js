import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { Order } from "../models/order.model.js";

export const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Validar stock antes de crear carrito
            if (quantity > product.stock) {
                return res.status(400).json({ message: `Lo sentimos solo contamos con ${product.stock} unidades disponibles de este producto` });
            }

            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });

        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

            if (itemIndex > -1) {
                const newQuantity = cart.items[itemIndex].quantity + quantity;

                if (newQuantity > product.stock) {
                    return res.status(400).json({ message: `Lo sentimos solo contamos con ${product.stock} unidades disponibles de este producto` });
                }

                cart.items[itemIndex].quantity = newQuantity;
            } else {
                if (quantity > product.stock) {
                    return res.status(400).json({ message: `Lo sentimos solo contamos con ${product.stock} unidades disponibles de este producto` });
                }

                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId", "name stock price");

        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        // Calculamos subtotales y el total general
        const itemsWithSubtotal = cart.items.map(item => {
            const product = item.productId;
            const quantity = item.quantity;
            const price = product.price;
            const subtotal = quantity * price;

            return {
                productId: product._id,
                name: product.name,
                price,
                quantity,
                stock: product.stock,
                subtotal
            };
        });

        const total = itemsWithSubtotal.reduce((acc, item) => acc + item.subtotal, 0);

        res.status(200).json({
            items: itemsWithSubtotal,
            total
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        if (quantity < 1) {
            return res.status(400).json({ message: "La cantidad mínima es 1 unidad." });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        if (quantity > product.stock) {
            return res.status(400).json({ message: `Lo sentimos solo contamos con ${product.stock} unidades disponibles de este producto.` });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const item = cart.items.find(item => item.productId.equals(productId));
        if (!item) return res.status(404).json({ message: "Producto no está en el carrito" });

        item.quantity = quantity;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.items = cart.items.filter(item => !item.productId.equals(productId));
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        res.status(200).json({ message: "Carrito vaciado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkoutCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." });
        }

        let total = 0;

        // Validación de stock
        for (const item of cart.items) {
            const product = item.productId;
            if (!product) continue;

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Stock insuficiente para el producto "${product.name}". Solo hay ${product.stock} unidades.`
                });
            }

            total += product.price * item.quantity;
        }

        // Descontar stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Guardar orden
        const order = new Order({
            userId,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity
            })),
            total
        });

        await order.save();

        // Vaciar carrito
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Compra completada y orden generada.", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
