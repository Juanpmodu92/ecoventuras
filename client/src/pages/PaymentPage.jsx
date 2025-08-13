
import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const SHIPPING_FREE_LIMIT = 50000; 
const SHIPPING_COST = 7000;        

const formatPrice = (n) =>
  (n || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" });

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart } = useCart();

  // Subtotal de TODO el carrito (en la pantalla de pago asumimos todo seleccionado)
  const subTotal = useMemo(
    () => cart.reduce((acc, it) => acc + (it.subtotal || 0), 0),
    [cart]
  );

  const shipping = subTotal >= SHIPPING_FREE_LIMIT || subTotal === 0 ? 0 : SHIPPING_COST;

  // Cupón simple (ejemplo): ECO10 => 10% desc
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null); // {code, discountPct}
  const discountPct = couponApplied?.discountPct ?? 0;
  const discountValue = Math.round((subTotal * discountPct) / 100);

  const totalToPay = Math.max(subTotal - discountValue, 0) + shipping;

  // Método de pago
  const [method, setMethod] = useState("");

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    if (code === "ECO10") {
      setCouponApplied({ code, discountPct: 10 });
    } else if (code === "ECO15") {
      setCouponApplied({ code, discountPct: 15 });
    } else {
      setCouponApplied(null);
      alert("Cupón inválido");
    }
  };

  const onContinue = () => {
    if (!method) {
      alert("Selecciona un método de pago");
      return;
    }

    navigate("/checkout/confirm", {
      state: { method, subTotal, shipping, discountPct, discountValue, totalToPay },
    });
  };

  return (
    <div className="bg-transparent min-h-screen p-6 flex flex-col md:flex-row gap-6">
      {/* Columna izquierda: métodos de pago */}
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Elige cómo pagar</h1>

        <Section title="Tarjetas">
          <PaymentRow
            checked={method === "credit_card"}
            onChange={() => setMethod("credit_card")}
            title="Nueva tarjeta de crédito"
            icon="💳"
          />
          <PaymentRow
            checked={method === "debit_card"}
            onChange={() => setMethod("debit_card")}
            title="Nueva tarjeta de débito"
            icon="💳"
          />
        </Section>

        <Section title="Otros medios de pago">
          <PaymentRow
            checked={method === "pse"}
            onChange={() => setMethod("pse")}
            title="Transferencia con PSE"
            icon="🏦"
          />
        </Section>

        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-5 py-2 rounded shadow"
          >
            Continuar
          </button>
        </div>
      </div>

      {/* Columna derecha: resumen */}
      <aside className="bg-white rounded-lg shadow p-4 w-full md:w-96 h-fit">
        <h2 className="font-bold mb-4">Resumen de compra</h2>

        <Row label={`Productos (${cart.length})`} value={formatPrice(subTotal)} />
        <Row
          label="Envío"
          value={shipping === 0 ? "Gratis" : formatPrice(shipping)}
          valueClass={shipping === 0 ? "text-green-600" : ""}
        />

        {/* Cupón */}
        <form onSubmit={applyCoupon} className="my-3">
          <label className="block text-sm text-gray-600 mb-1">Ingresa código de cupón</label>
          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              placeholder="ECO10, ECO15…"
            />
            <button className="border px-3 py-1 rounded hover:bg-gray-50">Aplicar</button>
          </div>
          {couponApplied && (
            <p className="text-sm text-green-700 mt-1">
              Cupón <b>{couponApplied.code}</b> aplicado: {discountPct}% de descuento
            </p>
          )}
        </form>

        {discountValue > 0 && (
          <Row
            label={`Descuento (${discountPct}%)`}
            value={`- ${formatPrice(discountValue)}`}
            valueClass="text-green-700"
          />
        )}

        <div className="border-t my-3" />

        <Row
          label={<span className="font-semibold text-lg">Pagas</span>}
          value={<span className="font-semibold text-lg">{formatPrice(totalToPay)}</span>}
        />
      </aside>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-lg shadow">
      <div className="px-4 py-2 border-b text-gray-700 font-medium">{title}</div>
      <div className="p-2 space-y-3">{children}</div>
    </section>
  );
}

function PaymentRow({ checked, onChange, title, icon }) {
  return (
    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-[#007BFF]"
      />
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{title}</span>
    </label>
  );
}

function Row({ label, value, valueClass = "" }) {
  return (
    <div className="flex justify-between items-center text-sm mb-2">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
