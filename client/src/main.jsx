import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'  
import { NotificationsProvider } from "./context/NotificationsContext";
import { FavoritesProvider } from "./context/FavoritesContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <NotificationsProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </NotificationsProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
