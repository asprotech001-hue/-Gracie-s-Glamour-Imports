import AppRouter from "./router/AppRouter";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
      <CartDrawer />
    </CartProvider>
  );
}
