import { useNavigate } from "react-router";
import { AlertTriangle, Activity, CheckCircle, Users, ArrowRight } from "lucide-react";
import { usePatients } from "../context/PatientsContext";
import { getRiskLevel } from "../data/patients";
import { PatientCard } from "../components/PatientCard";

export function Dashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();

  const alto = patients.filter((p) => getRiskLevel(p) === "alto");
  const medio = patients.filter((p) => getRiskLevel(p) === "medio");
  const baixo = patients.filter((p) => getRiskLevel(p) === "baixo");

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const priorityList = [
    ...alto,
    ...medio,
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-12 pb-8 rounded-b-3xl">
        <p className="text-blue-200 text-sm capitalize">{today}</p>
        <h1 className="text-white mt-1" style={{ fontWeight: 700 }}>
          Bom dia, Agente! 👋
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          {patients.length} pacientes cadastrados
        </p>
      </div>

      <div className="px-4 -mt-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/pacientes?filtro=alto")}
            className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-1 border border-red-100 active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-xl text-red-600" style={{ fontWeight: 700 }}>
              {alto.length}
            </span>
            <span className="text-[10px] text-gray-500 text-center leading-tight">Alto Risco</span>
          </button>

          <button
            onClick={() => navigate("/pacientes?filtro=medio")}
            className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-1 border border-amber-100 active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xl text-amber-600" style={{ fontWeight: 700 }}>
              {medio.length}
            </span>
            <span className="text-[10px] text-gray-500 text-center leading-tight">Médio Risco</span>
          </button>

          <button
            onClick={() => navigate("/pacientes?filtro=baixo")}
            className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-1 border border-emerald-100 active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-xl text-emerald-600" style={{ fontWeight: 700 }}>
              {baixo.length}
            </span>
            <span className="text-[10px] text-gray-500 text-center leading-tight">Baixo Risco</span>
          </button>
        </div>

        {/* Total card */}
        <div className="bg-blue-600 rounded-2xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs">Total de pacientes</p>
              <p className="text-white" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
                {patients.length} cadastrados
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/pacientes")}
            className="bg-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1 text-white text-xs active:bg-white/30 transition-colors"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Priority visits today */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-800">Prioridade de visitas</h2>
            <button
              onClick={() => navigate("/prioridades")}
              className="text-blue-600 text-sm flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {priorityList.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm shadow-sm">
              Nenhum paciente de prioridade
            </div>
          ) : (
            <div className="space-y-2.5">
              {priorityList.map((p, i) => (
                <PatientCard key={p.id} patient={p} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
