import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  MapPin,
  Phone,
  Calendar,
  AlertTriangle,
  Activity,
  CheckCircle,
  Stethoscope,
  ClipboardList,
  Pill,
  Clock,
  RefreshCw,
} from "lucide-react";
import { usePatients } from "../context/PatientsContext";
import {
  getRiskLevel,
  calculateRiskScore,
  getRiskReasons,
  getRecommendations,
  conditionLabels,
} from "../data/patients";
import { RiskBadge } from "../components/RiskBadge";

const riskConfig = {
  alto: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    iconBg: "bg-red-100",
    Icon: AlertTriangle,
    iconColor: "text-red-500",
    label: "ALTO RISCO",
    bar: "bg-red-500",
    barWidth: "w-full",
  },
  medio: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    iconBg: "bg-amber-100",
    Icon: Activity,
    iconColor: "text-amber-500",
    label: "MÉDIO RISCO",
    bar: "bg-amber-500",
    barWidth: "w-2/3",
  },
  baixo: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    iconBg: "bg-emerald-100",
    Icon: CheckCircle,
    iconColor: "text-emerald-500",
    label: "BAIXO RISCO",
    bar: "bg-emerald-500",
    barWidth: "w-1/3",
  },
};

export function PatientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getPatient, deletePatient } = usePatients();
  const patient = getPatient(id!);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <p>Paciente não encontrado</p>
          <button
            onClick={() => navigate("/pacientes")}
            className="mt-3 text-blue-600 text-sm"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const risk = getRiskLevel(patient);
  const score = calculateRiskScore(patient);
  const reasons = getRiskReasons(patient);
  const recommendations = getRecommendations(patient);
  const rc = riskConfig[risk];
  const RiskIcon = rc.Icon;

  const handleDelete = () => {
    if (window.confirm(`Deseja remover ${patient.name} da lista?`)) {
      deletePatient(patient.id);
      navigate("/pacientes");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h1 className="text-gray-900">Perfil do Paciente</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/editar/${patient.id}`)}
            className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 active:bg-blue-100 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 active:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Patient header card */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>
                {patient.name}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {patient.age} anos •{" "}
                {patient.sex === "feminino"
                  ? "Feminina"
                  : patient.sex === "masculino"
                    ? "Masculino"
                    : "Outro"}
              </p>
              <div className="mt-2">
                <RiskBadge level={risk} size="md" />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-gray-50 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{patient.address}</span>
            </div>
            {patient.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.lastVisit && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>
                  Última visita:{" "}
                  {new Date(patient.lastVisit).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Risk score */}
        <div className={`rounded-2xl shadow-sm p-5 border ${rc.bg} ${rc.border}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl ${rc.iconBg} flex items-center justify-center`}>
              <RiskIcon className={`w-5 h-5 ${rc.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Score de risco</p>
              <p className={`text-sm ${rc.text}`} style={{ fontWeight: 700 }}>
                {rc.label}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className={`text-2xl ${rc.text}`} style={{ fontWeight: 700 }}>
                {score}
              </p>
              <p className="text-xs text-gray-400">pontos</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full bg-white/60 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full ${rc.bar} transition-all`}
              style={{ width: `${Math.min((score / 14) * 100, 100)}%` }}
            />
          </div>

          {reasons.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>
                Fatores identificados:
              </p>
              <ul className="space-y-1">
                {reasons.map((r, i) => (
                  <li key={i} className={`text-xs ${rc.text} flex items-center gap-1.5`}>
                    <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Conditions */}
        {(patient.conditions.length > 0 || patient.otherConditions.length > 0) && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
                Condições de Saúde
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.conditions.map((c) => (
                <span
                  key={c}
                  className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 text-xs"
                  style={{ fontWeight: 500 }}
                >
                  {conditionLabels[c]}
                </span>
              ))}
              {patient.otherConditions.map((c) => (
                <span
                  key={c}
                  className="bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-3 py-1 text-xs"
                  style={{ fontWeight: 500 }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medications */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-violet-500" />
              <h3 className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
                Medicamentos
              </h3>
            </div>
            <span className="text-xs bg-violet-50 text-violet-600 border border-violet-200 rounded-full px-2.5 py-0.5">
              {(patient.medications ?? []).length} item{(patient.medications ?? []).length !== 1 ? "s" : ""}
            </span>
          </div>

          {(patient.medications ?? []).length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">Nenhum medicamento registrado</p>
              <button
                onClick={() => navigate(`/editar/${patient.id}`)}
                className="mt-2 text-xs text-blue-500"
              >
                Adicionar medicamentos
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(patient.medications ?? []).map((med) => (
                <div key={med.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                          {med.name}
                        </p>
                        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2 py-0.5">
                          {med.dose}
                        </span>
                        {med.continuous && (
                          <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-2 py-0.5">
                            <RefreshCw className="w-2.5 h-2.5" /> Uso contínuo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{med.frequency}</p>
                      {med.times.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {med.times.map((t, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-700"
                              style={{ fontWeight: 500 }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {med.observation && (
                        <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {med.observation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
              Recomendações
            </h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs" style={{ fontWeight: 700 }}>
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Edit button */}
        <button
          onClick={() => navigate(`/editar/${patient.id}`)}
          className="w-full bg-blue-600 text-white rounded-2xl py-4 active:bg-blue-700 transition-colors"
          style={{ fontWeight: 600 }}
        >
          Editar Paciente
        </button>
      </div>
    </div>
  );
}