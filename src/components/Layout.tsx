import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaHome, FaFileAlt, FaUsers, FaCog, FaBars, FaTimes } from 'react-icons/fa';

// サイドバーのナビゲーションアイテム
const navigationItems = [
  { name: "ダッシュボード", path: "/", icon: <FaHome /> },
  { name: "補助金一覧", path: "/subsidies", icon: <FaFileAlt /> },
  { name: "顧客管理", path: "/customers", icon: <FaUsers /> },
  { name: "設定", path: "/settings", icon: <FaCog /> },
];

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ログアウト処理
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
        <div className="p-4 flex justify-center items-center">
          <Link to="/">
            <img src="/GrantsDB_Demo/GrantsDB_logo.png" alt="GrantsDB Logo" className="h-12 rounded-lg"/>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)} // スマホ表示でリンククリック時にサイドバーを閉じる
              className={`flex items-center px-4 py-2 rounded-md text-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-[#EB455F] text-white"
                  : "hover:bg-[#BAD7E9] hover:text-[#2B3467]"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
    </>
  );

  return (
    <div className="relative md:flex h-full font-sans">
      {/* サイドバー (スマホ用オーバーレイ) */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-[#2B3467] text-white flex flex-col z-30 transform transition-transform duration-300 ease-in-out md:relative md:flex shadow-lg ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <SidebarContent />
      </aside>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between md:justify-end items-center">
            {/* ハンバーガーメニュー (スマホ表示用) */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-gray-700"
            >
                <FaBars size={24} />
            </button>
            <div>
                <span className="mr-2 sm:mr-4 text-gray-700 text-sm sm:text-base"><span className="hidden sm:inline">こんにちは、</span>{user?.name}さん</span>
                <button 
                    onClick={handleLogout}
                    className="bg-[#2B3467] text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:bg-opacity-80"
                >
                    ログアウト
                </button>
            </div>
        </header>
        
        {/* コンテンツエリア */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
