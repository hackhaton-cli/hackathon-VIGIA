import { useNavigate } from "react-router";
import { ClipboardList, ChevronRight, User } from "lucide-react";
import { usePatients } from "../context/PatientsContext";
import { getRiskLevel, conditionLabels } from "../data/patients";
import { RiskBadge } from "../components/RiskBadge";

const riskOrder = { alto: 0, medio: 1, baixo: 2 };
const riskBorderColor = {
  alto: "border-l-red-500",
  medio: "border-l-amber-500",
  baixo: "border-l-emerald-500",
};
const riskHeaderBg = {
  alto: "bg-red-600",
  medio: "bg-amber-500",
  baixo: "bg-emerald-600",
};

export function VisitPriority() {
  const navigate = useNavigate();
  const { patients } = usePatients();

  const sorted = [...patients].sort((a, b) => {
    const ra = getRiskLevel(a);
    const rb = getRiskLevel(b);
    if (riskOrder[ra] !== riskOrder[rb]) return riskOrder[ra] - riskOrder[rb];
    // Secondary: age descending
    return b.age - a.age;
  });

  const alto = sorted.filter((p) => getRiskLevel(p) === "alto");
  const medio = sorted.filter((p) => getRiskLevel(p) === "medio");
  const baixo = sorted.filter((p) => getRiskLevel(p) === "baixo");

  const sections = [
    { level: "alto" as const, label: "Alto Risco", patients: alto },
    { level: "medio" as const, label: "Médio Risco", patients: medio },
    { level: "baixo" as const, label: "Baixo Risco", patients: baixo },
  ].filter((s) => s.patients.length > 0);

  let globalRank = 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-gray-900">Prioridade de Visitas</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {patients.length} pacientes ordenados por risco
            </p>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 bg-red-50 border border-red-100 rounded-xl py-2 px-3 text-center">
            <p className="text-red-600 text-xs">Alto</p>
            <p className="text-red-700 text-lg" style={{ fontWeight: 700 }}>
              {alto.length}
            </p>
          </div>
          <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl py-2 px-3 text-center">
            <p className="text-amber-600 text-xs">Médio</p>
            <p className="text-amber-700 text-lg" style={{ fontWeight: 700 }}>
              {medio.length}
            </p>
          </div>
          <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl py-2 px-3 text-center">
            <p className="text-emerald-600 text-xs">Baixo</p>
            <p className="text-emerald-700 text-lg" style={{ fontWeight: 700 }}>
              {baixo.length}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {sections.map(({ level, label, patients: sectionPatients }) => (
          <div key={level}>
            {/* Section header */}
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-2 ${riskHeaderBg[level]}`}
            >
              <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                {label}
              </span>
              <span className="ml-auto bg-white/20 text-white rounded-full px-2 py-0.5 text-xs">
                {sectionPatients.length}
              </span>
            </div>

            {/* Patients */}
            <div className="space-y-2.5">
              {sectionPatients.map((patient) => {
                globalRank += 1;
                const rank = globalRank;
                const mainConditions = patient.conditions
                  .slice(0, 2)
                  .map((c) => conditionLabels[c]);

                return (
                  <button
                    key={patient.id}
                    onClick={() => navigate(`/paciente/${patient.id}`)}
                    className={`w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${riskBorderColor[level]} p-4 flex items-center gap-3 active:scale-[0.98] transition-transform`}
                  >
                    <span className="text-lg font-semibold text-gray-500 flex-shrink-0 w-8 text-center">
                      {rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between">
                        <p
                          className="text-sm text-gray-900 truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {patient.name}
                        </p>
                        <RiskBadge level={level} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{patient.age} anos</p>
                      {mainConditions.length > 0 && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {mainConditions.join(" + ")}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {patients.length === 0 && (
          <div className="text-center text-gray-400 text-sm pt-10">
            Nenhum paciente cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
