import { useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Users, ClipboardList, PlusCircle } from "lucide-react";

const tabs = [
  { path: "/", label: "Início", Icon: LayoutDashboard },
  { path: "/pacientes", label: "Pacientes", Icon: Users },
  { path: "/prioridades", label: "Visitas", Icon: ClipboardList },
  { path: "/cadastro", label: "Cadastrar", Icon: PlusCircle },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ path, label, Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                active ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
              <span className="text-[10px]" style={{ fontWeight: active ? 600 : 400 }}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 h-0.5 w-8 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
