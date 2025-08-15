import { useEffect, useState } from "react";
import {
  getProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest
} from "../api/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    code: "",
    category: "",
    image: null
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await getProductsRequest();
      setProducts(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }

      if (editingId) {
        await updateProductRequest(editingId, formData);
      } else {
        await createProductRequest(formData);
      }

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        code: "",
        category: "",
        image: null
      });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await deleteProductRequest(id);
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      code: product.code,
      category: product.category,
      image: null
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      {/* Botón para abrir/cerrar formulario */}
      <button
        onClick={() => {
          setShowForm((prev) => !prev);
          setEditingId(null);
          setForm({
            name: "",
            description: "",
            price: "",
            stock: "",
            code: "",
            category: "",
            image: null
          });
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        {showForm ? "Cancelar" : "Agregar Producto"}
      </button>

      {/* Formulario condicional */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required className="border p-2 w-full" />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required className="border p-2 w-full" />
          <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} required className="border p-2 w-full" />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required className="border p-2 w-full" />
          <input type="text" name="code" placeholder="Código" value={form.code} onChange={handleChange} required className="border p-2 w-full" />
          <input type="text" name="category" placeholder="Categoría" value={form.category} onChange={handleChange} required className="border p-2 w-full" />
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="border p-2 w-full" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {editingId ? "Actualizar" : "Crear"} Producto
          </button>
        </form>
      )}

      {/* Lista de productos */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Lista de Productos</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Imagen</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Precio</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Código</th>
              <th className="p-2 border">Categoría</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="border p-2">
                  {p.image && <img src={p.image.startsWith("http") ? p.image : p.imageUrl} alt={p.name} className="h-16 mx-auto" />}
                </td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">${p.price}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">{p.code}</td>
                <td className="border p-2">{p.category}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                  <button onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
