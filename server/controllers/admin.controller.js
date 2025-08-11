import { Order } from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getDashboardSummary = async (req, res) => {
    try {
        // Total de órdenes
        const totalOrders = await Order.countDocuments();

        // Total de ingresos (suma de todos los totales)
        const totalRevenueAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = totalRevenueAgg[0]?.total || 0;

        // Total de usuarios
        const totalUsers = await User.countDocuments();

        // Productos más vendidos
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    quantitySold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { quantitySold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    name: "$product.name",
                    quantitySold: 1
                }
            }
        ]);

        // Ventas por mes (últimos 6 meses)
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    total: { $sum: "$total" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": -1 } },
            { $limit: 6 },
            { $sort: { "_id": 1 } } // orden cronológico
        ]);

        res.json({
            totalOrders,
            totalRevenue,
            totalUsers,
            topProducts,
            monthlySales
        });

    } catch (error) {
        console.error("Error en el dashboard:", error);
        res.status(500).json({ message: "Error al generar el resumen" });
    }
};
