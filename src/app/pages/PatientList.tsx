import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { usePatients } from "../context/PatientsContext";
import { getRiskLevel, RiskLevel } from "../data/patients";
import { PatientCard } from "../components/PatientCard";

const filterOptions: { value: "todos" | RiskLevel; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "alto", label: "Alto" },
  { value: "medio", label: "Médio" },
  { value: "baixo", label: "Baixo" },
];

export function PatientList() {
  const { patients } = usePatients();
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get("filtro") as RiskLevel) || "todos";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | RiskLevel>(initialFilter);

  useEffect(() => {
    const f = searchParams.get("filtro") as RiskLevel;
    if (f) setFilter(f);
  }, [searchParams]);

  const filtered = patients
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "todos" || getRiskLevel(p) === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const order = { alto: 0, medio: 1, baixo: 2 };
      return order[getRiskLevel(a)] - order[getRiskLevel(b)];
    });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <h1 className="text-gray-900">Pacientes</h1>
        <p className="text-sm text-gray-500 mt-0.5">{patients.length} cadastrados</p>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou endereço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Filters */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1.5" />
          {filterOptions.map(({ value, label }) => {
            const active = filter === value;
            const colors = {
              todos: active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600",
              alto: active ? "bg-red-500 text-white" : "bg-red-50 text-red-600",
              medio: active ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-600",
              baixo: active ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600",
            };
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex-shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${colors[value]}`}
                style={{ fontWeight: active ? 600 : 400 }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-4 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 text-sm pt-10">
            Nenhum paciente encontrado
          </div>
        ) : (
          filtered.map((p) => <PatientCard key={p.id} patient={p} />)
        )}
      </div>
    </div>
  );
}
