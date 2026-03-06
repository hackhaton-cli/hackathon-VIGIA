import { useNavigate } from "react-router";
import { ChevronRight, User } from "lucide-react";
import { Patient, getRiskLevel, conditionLabels } from "../data/patients";
import { RiskBadge } from "./RiskBadge";

interface PatientCardProps {
  patient: Patient;
  rank?: number;
}

export function PatientCard({ patient, rank }: PatientCardProps) {
  const navigate = useNavigate();
  const risk = getRiskLevel(patient);

  const borderColor =
    risk === "alto"
      ? "border-l-red-500"
      : risk === "medio"
        ? "border-l-amber-500"
        : "border-l-emerald-500";

  const mainConditions = patient.conditions.slice(0, 2).map((c) => conditionLabels[c]);
  if (patient.otherConditions.length > 0 && mainConditions.length < 2) {
    mainConditions.push(patient.otherConditions[0]);
  }

  return (
    <button
      onClick={() => navigate(`/paciente/${patient.id}`)}
      className={`w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${borderColor} p-4 flex items-center gap-3 active:scale-[0.98] transition-transform`}
    >
      {rank !== undefined && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-500">{rank}</span>
        </div>
      )}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
        <User className="w-5 h-5 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>
            {patient.name}
          </p>
          <RiskBadge level={risk} />
        </div>
        <p className="text-xs text-gray-500">{patient.age} anos</p>
        {mainConditions.length > 0 && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{mainConditions.join(" · ")}</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </button>
  );
}
