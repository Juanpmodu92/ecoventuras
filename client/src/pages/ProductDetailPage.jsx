// ProductDetailPage.jsx
import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Detalle del Producto {id}</h1>
    </div>
  );
}
