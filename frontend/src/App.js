import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppDashboard from "./pages/AppDashboard";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppDashboard />} />
          <Route path="/app/:plan" element={<AppDashboard />} />
          <Route path="/contratar/:plan" element={<Checkout />} />
          <Route path="/pagamento" element={<PaymentResult />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
