import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { languageNames, type Language } from "../i18n";
import type { TabId } from "../types";

interface TopNavBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

function navTabClass(isActive: boolean) {
  return isActive
    ? "nav-tab text-primary border-b-2 border-primary pb-1 font-title-md text-title-md hover:text-primary transition-colors opacity-80 duration-150"
    : "nav-tab text-on-surface-variant font-title-md text-title-md hover:text-primary transition-colors";
}

export default function TopNavBar({ activeTab, onTabChange }: TopNavBarProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-surface flex justify-between items-center w-full px-margin-desktop h-16 max-w-container-max mx-auto z-50 sticky top-0 border-b border-outline-variant">
      <div className="flex items-center gap-6">
        <span className="font-headline-lg text-headline-lg text-primary font-bold">KalaAgent</span>
        <div className="hidden lg:flex gap-5">
          <button className={navTabClass(activeTab === "search")} onClick={() => onTabChange("search")}>
            {t("nav.search")}
          </button>
          <button className={navTabClass(activeTab === "audit")} onClick={() => onTabChange("audit")}>
            {t("nav.audit")}
          </button>
          <button className={navTabClass(activeTab === "dashboard")} onClick={() => onTabChange("dashboard")}>
            {t("nav.dashboard")}
          </button>
          {user && (
            <>
              <button className={navTabClass(activeTab === "wishlist")} onClick={() => onTabChange("wishlist")}>
                {t("nav.wishlist")}
              </button>
              <button className={navTabClass(activeTab === "orders")} onClick={() => onTabChange("orders")}>
                {t("nav.orders")}
              </button>
              <button className={navTabClass(activeTab === "help")} onClick={() => onTabChange("help")}>
                {t("nav.help")}
              </button>
            </>
          )}
          <button className={navTabClass(activeTab === "checkout")} onClick={() => onTabChange("checkout")}>
            {t("nav.checkout")}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="text-sm border border-outline-variant rounded px-2 py-1.5 bg-surface text-on-surface-variant outline-none cursor-pointer"
          aria-label="Select language"
        >
          {(Object.keys(languageNames) as Language[]).map((code) => (
            <option key={code} value={code}>
              {languageNames[code]}
            </option>
          ))}
        </select>
        {user ? (
          <>
            <span className="text-sm text-on-surface-variant hidden sm:inline">
              {t("nav.hi")}, {user.name.split(" ")[0]}
            </span>
            <button className="text-sm text-error font-medium hover:underline" onClick={logout}>
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <button
            className="bg-primary-container text-on-primary-container px-4 py-2 rounded font-title-md text-body-md font-bold hover:opacity-90 transition-opacity"
            onClick={() => onTabChange("login")}
          >
            {t("nav.login")}
          </button>
        )}
      </div>
    </header>
  );
}
