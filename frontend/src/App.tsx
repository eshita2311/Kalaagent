import { useState } from "react";
import TopNavBar from "./components/TopNavBar";
import SearchTab from "./components/SearchTab";
import AuditTrailTab from "./components/AuditTrailTab";
import CheckoutTab from "./components/CheckoutTab";
import DashboardTab from "./components/DashboardTab";
import LoginTab from "./components/LoginTab";
import WishlistTab from "./components/WishlistTab";
import OrdersTab from "./components/OrdersTab";
import HelpDeskTab from "./components/HelpDeskTab";
import { AuthProvider, useAuth } from "./AuthContext";
import { LanguageProvider } from "./LanguageContext";
import type { Product, TabId } from "./types";

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("search");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleBuyNow(product: Product) {
    setSelectedProduct(product);
    if (!user) {
      setActiveTab("login");
      return;
    }
    setActiveTab("checkout");
  }

  function handleTabChange(tab: TabId) {
    if ((tab === "checkout" || tab === "wishlist" || tab === "orders" || tab === "help") && !user) {
      setActiveTab("login");
      return;
    }
    setActiveTab(tab);
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-8">
        {activeTab === "search" && <SearchTab onBuyNow={handleBuyNow} />}
        {activeTab === "audit" && <AuditTrailTab />}
        {activeTab === "checkout" && <CheckoutTab selectedProduct={selectedProduct} />}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "login" && <LoginTab onSuccess={handleTabChange} />}
        {activeTab === "wishlist" && <WishlistTab onBuyNow={handleBuyNow} />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "help" && <HelpDeskTab />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
