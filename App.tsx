
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Returns from "./pages/Returns";
import Newsletter from "./pages/Newsletter";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Rewards from "./pages/Rewards";
import VIP from "./pages/VIP";
import EmailPreferences from "./pages/EmailPreferences";
import EmailAnalytics from "./pages/EmailAnalytics";







const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/vip" element={<VIP />} />
            <Route path="/email-preferences" element={<EmailPreferences />} />
            <Route path="/admin/email-analytics" element={<EmailAnalytics />} />





            <Route path="*" element={<NotFound />} />
          </Routes>

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
