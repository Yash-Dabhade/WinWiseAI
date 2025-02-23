import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FileText,
  BarChart2,
  TrendingUp,
  Menu,
  X,
  Library,
} from "lucide-react";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard/generate",
      name: "Generate",
      icon: FileText,
    },
    {
      path: "/dashboard/predict",
      name: "Predict",
      icon: TrendingUp,
    },
    {
      path: "/dashboard/analyze",
      name: "Analyze",
      icon: BarChart2,
    },
    {
      path: "/dashboard/library",
      name: "Library",
      icon: Library,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-indigo-600 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <img src="/crown.png" alt="Logo" className="w-8 h-8" />

                <span className="text-xl font-bold">WinWise AI</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-indigo-800"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-indigo-800"
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && (
                <span className="ml-4 font-medium">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
