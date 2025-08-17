import { Order } from "../models/order.model.js";
import Product from "../models/product.model.js";

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

    // Obtener órdenes
    const orders = await Order.find(match);

    // Métricas generales
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    // Conteo de pedidos por estado
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Productos más vendidos (TOP 5 con revenue)
    const topProductsAgg = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product._id",
          name: { $first: "$product.name" },
          price: { $first: "$product.price" },
          quantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$product.price"] }
          }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 }
    ]);

    // TODOS los productos vendidos (con revenue)
    const allProductsAgg = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product._id",
          name: { $first: "$product.name" },
          price: { $first: "$product.price" },
          quantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$product.price"] }
          }
        }
      },
      { $sort: { quantitySold: -1 } }
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
            $sum: { $multiply: ["$items.quantity", "$productInfo.price"] }
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

    // Respuesta final
    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topProducts: topProductsAgg,
      allProducts: allProductsAgg,
      salesByCategory
    });

  } catch (error) {
    console.error("❌ Error en getSalesReport:", error.message);
    res.status(500).json({ message: error.message });
  }
};
