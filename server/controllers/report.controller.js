// controllers/report.controller.js
import { Order } from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getSalesReport = async (req, res) => {
  const { start, end } = req.query;

  try {
    const match = {};
    if (start && end) {
      match.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const orders = await Order.find(match);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Productos más vendidos
    const topProductsAgg = await Order.aggregate([
      { $match: match },
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

    // Ventas por categoría
    const salesByCategory = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo.category",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.quantity", "$productInfo.price"]
            }
          }
        }
      },
      {
        $project: {
          category: "$_id",
          totalSold: 1,
          totalRevenue: 1,
          _id: 0
        }
      }
    ]);

    // Única respuesta consolidada
    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topProducts: topProductsAgg,
      salesByCategory
    });

  } catch (error) {
    console.error("❌ Error en getSalesReport:", error.message);
    res.status(500).json({ message: error.message });
  }
};
