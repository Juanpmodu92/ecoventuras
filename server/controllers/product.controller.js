import Product from "../models/product.model.js";

// Crear producto
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, code } = req.body;

        const existingProduct = await Product.findOne({ code });
        if (existingProduct) {
        return res.status(400).json({ message: "El producto ya existe." });
        }

        const newProduct = new Product({ name, description, price, stock, code });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, code } = req.body;

        const existingProduct = await Product.findOne({ code });
        if (existingProduct && existingProduct._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Ya existe un producto con este código asignado." });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, description, price, stock, code },
        { new: true, runValidators: true }
        );

        if (!updatedProduct)
        return res.status(404).json({ message: "Producto no encontrado" });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct)
        return res.status(404).json({ message: "Producto no encontrado" });

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableProducts = async (req, res) => {
    try {
        const products = await Product.find({}, "name stock codigo"); // solo muestra lo que el cliente necesita
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};