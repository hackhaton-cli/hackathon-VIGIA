import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, X, Check, Pill, Clock, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { usePatients } from "../context/PatientsContext";
import { Condition, conditionLabels, Patient, Medication } from "../data/patients";

const CONDITIONS: Condition[] = [
  "hipertensao",
  "diabetes",
  "avc",
  "doenca_cardiaca",
  "colesterol",
  "tabagismo",
  "obesidade",
];

const FREQUENCY_OPTIONS = [
  "1x ao dia",
  "2x ao dia",
  "3x ao dia",
  "4x ao dia",
  "A cada 8 horas",
  "A cada 12 horas",
  "Conforme necessário",
  "Uso semanal",
];

const FREQUENCY_DEFAULT_TIMES: Record<string, string[]> = {
  "1x ao dia": ["08:00"],
  "2x ao dia": ["08:00", "20:00"],
  "3x ao dia": ["08:00", "14:00", "20:00"],
  "4x ao dia": ["08:00", "12:00", "16:00", "20:00"],
  "A cada 8 horas": ["08:00", "16:00", "00:00"],
  "A cada 12 horas": ["08:00", "20:00"],
  "Conforme necessário": [],
  "Uso semanal": ["08:00"],
};

interface MedFormState {
  name: string;
  dose: string;
  frequency: string;
  times: string[];
  continuous: boolean;
  observation: string;
}

const emptyMedForm = (): MedFormState => ({
  name: "",
  dose: "",
  frequency: "1x ao dia",
  times: ["08:00"],
  continuous: true,
  observation: "",
});

export function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addPatient, updatePatient, getPatient } = usePatients();
  const editing = id ? getPatient(id) : undefined;

  const [name, setName] = useState(editing?.name ?? "");
  const [age, setAge] = useState(editing?.age?.toString() ?? "");
  const [sex, setSex] = useState<Patient["sex"]>(editing?.sex ?? "feminino");
  const [address, setAddress] = useState(editing?.address ?? "");
  const [phone, setPhone] = useState(editing?.phone ?? "");
  const [conditions, setConditions] = useState<Condition[]>(editing?.conditions ?? []);
  const [otherConditions, setOtherConditions] = useState<string[]>(editing?.otherConditions ?? []);
  const [medications, setMedications] = useState<Medication[]>(editing?.medications ?? []);
  const [newCondition, setNewCondition] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Medication sub-form state
  const [showMedForm, setShowMedForm] = useState(false);
  const [medForm, setMedForm] = useState<MedFormState>(emptyMedForm());
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medError, setMedError] = useState("");

  const toggleCondition = (c: Condition) => {
    setConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const addOtherCondition = () => {
    const trimmed = newCondition.trim();
    if (trimmed && !otherConditions.includes(trimmed)) {
      setOtherConditions((prev) => [...prev, trimmed]);
      setNewCondition("");
    }
  };

  const removeOtherCondition = (c: string) => {
    setOtherConditions((prev) => prev.filter((x) => x !== c));
  };

  // Medication handlers
  const handleFrequencyChange = (freq: string) => {
    setMedForm((prev) => ({
      ...prev,
      frequency: freq,
      times: FREQUENCY_DEFAULT_TIMES[freq] ?? ["08:00"],
    }));
  };

  const updateTime = (index: number, value: string) => {
    setMedForm((prev) => {
      const times = [...prev.times];
      times[index] = value;
      return { ...prev, times };
    });
  };

  const openAddMed = () => {
    setMedForm(emptyMedForm());
    setEditingMedId(null);
    setMedError("");
    setShowMedForm(true);
  };

  const openEditMed = (med: Medication) => {
    setMedForm({
      name: med.name,
      dose: med.dose,
      frequency: med.frequency,
      times: [...med.times],
      continuous: med.continuous,
      observation: med.observation ?? "",
    });
    setEditingMedId(med.id);
    setMedError("");
    setShowMedForm(true);
  };

  const cancelMedForm = () => {
    setShowMedForm(false);
    setEditingMedId(null);
    setMedError("");
  };

  const saveMedication = () => {
    if (!medForm.name.trim()) {
      setMedError("Nome do medicamento obrigatório");
      return;
    }
    if (!medForm.dose.trim()) {
      setMedError("Dosagem obrigatória");
      return;
    }
    const med: Medication = {
      id: editingMedId ?? Date.now().toString(),
      name: medForm.name.trim(),
      dose: medForm.dose.trim(),
      frequency: medForm.frequency,
      times: medForm.times.filter(Boolean),
      continuous: medForm.continuous,
      observation: medForm.observation.trim() || undefined,
    };
    if (editingMedId) {
      setMedications((prev) => prev.map((m) => (m.id === editingMedId ? med : m)));
    } else {
      setMedications((prev) => [...prev, med]);
    }
    setShowMedForm(false);
    setEditingMedId(null);
    setMedError("");
  };

  const removeMedication = (medId: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== medId));
    if (editingMedId === medId) setShowMedForm(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nome obrigatório";
    if (!age || isNaN(Number(age)) || Number(age) < 0 || Number(age) > 130)
      e.age = "Idade inválida";
    if (!address.trim()) e.address = "Endereço obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = {
      name: name.trim(),
      age: Number(age),
      sex,
      address: address.trim(),
      phone: phone.trim(),
      conditions,
      otherConditions,
      medications,
    };
    if (editing) {
      updatePatient({ ...editing, ...data });
    } else {
      addPatient(data);
    }
    setSaved(true);
    setTimeout(() => navigate("/pacientes"), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-gray-900">{editing ? "Editar Paciente" : "Novo Paciente"}</h1>
          <p className="text-xs text-gray-500">Preencha os dados abaixo</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Personal data */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>
            Dados Pessoais
          </h2>

          <div>
            <label className="text-xs text-gray-500">Nome completo *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria da Silva"
              className={`mt-1 w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border ${errors.name ? "border-red-300" : "border-transparent"}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Idade *</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 65"
                min={0}
                max={130}
                className={`mt-1 w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border ${errors.age ? "border-red-300" : "border-transparent"}`}
              />
              {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="text-xs text-gray-500">Sexo</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as Patient["sex"])}
                className="mt-1 w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-transparent"
              >
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Endereço *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Rua das Flores, 123 – Centro"
              className={`mt-1 w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border ${errors.address ? "border-red-300" : "border-transparent"}`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="text-xs text-gray-500">Telefone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: (38) 99999-9999"
              className="mt-1 w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-transparent"
            />
          </div>
        </div>

        {/* Health conditions */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <div>
            <h2 className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>
              Condições de Saúde
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Selecione as condições aplicáveis</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map((c) => {
              const selected = conditions.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCondition(c)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors border ${
                    selected
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-gray-50 border-gray-100 text-gray-600"
                  }`}
                >
                  <span className="text-xs flex-1" style={{ fontWeight: selected ? 600 : 400 }}>
                    {conditionLabels[c]}
                  </span>
                  {selected && <Check className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Other conditions */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-2">Outras condições</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addOtherCondition()}
                placeholder="Ex: Insuficiência renal"
                className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-transparent"
              />
              <button
                onClick={addOtherCondition}
                className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 active:bg-blue-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {otherConditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {otherConditions.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2.5 py-1 text-xs"
                  >
                    {c}
                    <button onClick={() => removeOtherCondition(c)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Medications ── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>
                Medicamentos
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {medications.length === 0
                  ? "Nenhum medicamento cadastrado"
                  : `${medications.length} medicamento${medications.length > 1 ? "s" : ""}`}
              </p>
            </div>
            {!showMedForm && (
              <button
                onClick={openAddMed}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-xl px-3 py-1.5 text-xs active:bg-blue-100 transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            )}
          </div>

          {/* Existing medications list */}
          {medications.length > 0 && (
            <div className="space-y-2">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className={`rounded-xl border p-3 flex items-start gap-3 ${
                    editingMedId === med.id ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-4 h-4 text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                      {med.name}{" "}
                      <span className="text-gray-500" style={{ fontWeight: 400 }}>
                        {med.dose}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{med.frequency}</p>
                    {med.times.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {med.times.map((t, i) => (
                          <span key={i} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {med.continuous && (
                      <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-2 py-0.5">
                        Uso contínuo
                      </span>
                    )}
                    {med.observation && (
                      <p className="text-xs text-amber-600 mt-1 italic">⚠ {med.observation}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditMed(med)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 active:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeMedication(med.id)}
                      className="w-7 h-7 rounded-lg bg-white border border-red-100 flex items-center justify-center text-red-400 active:bg-red-50 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inline add/edit form */}
          {showMedForm && (
            <div className="border border-blue-200 rounded-xl bg-blue-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700" style={{ fontWeight: 600 }}>
                  {editingMedId ? "Editar medicamento" : "Novo medicamento"}
                </p>
                <button onClick={cancelMedForm} className="text-gray-400 active:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {medError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {medError}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Nome do medicamento *</label>
                  <input
                    type="text"
                    value={medForm.name}
                    onChange={(e) => setMedForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: Losartana"
                    className="mt-1 w-full bg-white rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Dosagem *</label>
                  <input
                    type="text"
                    value={medForm.dose}
                    onChange={(e) => setMedForm((p) => ({ ...p, dose: e.target.value }))}
                    placeholder="Ex: 50mg"
                    className="mt-1 w-full bg-white rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Frequência</label>
                  <select
                    value={medForm.frequency}
                    onChange={(e) => handleFrequencyChange(e.target.value)}
                    className="mt-1 w-full bg-white rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200"
                  >
                    {FREQUENCY_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time slots */}
              {medForm.times.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500">Horários</label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {medForm.times.map((t, i) => (
                      <input
                        key={i}
                        type="time"
                        value={t}
                        onChange={(e) => updateTime(i, e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Continuous use toggle */}
              <button
                onClick={() => setMedForm((p) => ({ ...p, continuous: !p.continuous }))}
                className={`flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 border transition-colors ${
                  medForm.continuous
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                <div
                  className={`w-9 h-5 rounded-full flex items-center transition-colors ${
                    medForm.continuous ? "bg-emerald-500 justify-end" : "bg-gray-300 justify-start"
                  } px-0.5`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
                <span className="text-sm" style={{ fontWeight: medForm.continuous ? 600 : 400 }}>
                  Uso contínuo
                </span>
              </button>

              {/* Observation */}
              <div>
                <label className="text-xs text-gray-500">Observação (opcional)</label>
                <input
                  type="text"
                  value={medForm.observation}
                  onChange={(e) => setMedForm((p) => ({ ...p, observation: e.target.value }))}
                  placeholder="Ex: Tomar após a refeição"
                  className="mt-1 w-full bg-white rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={cancelMedForm}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm active:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveMedication}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm active:bg-blue-700 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  {editingMedId ? "Salvar edição" : "Adicionar"}
                </button>
              </div>
            </div>
          )}

          {/* Button to show form if hidden and no meds */}
          {!showMedForm && medications.length === 0 && (
            <button
              onClick={openAddMed}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex items-center justify-center gap-2 text-gray-400 text-sm active:border-blue-300 active:text-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar primeiro medicamento
            </button>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full rounded-2xl py-4 flex items-center justify-center gap-2 text-white transition-all ${
            saved ? "bg-emerald-500" : "bg-blue-600 active:bg-blue-700"
          }`}
          style={{ fontWeight: 600 }}
          disabled={saved}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" /> Paciente salvo!
            </>
          ) : (
            "Salvar paciente"
          )}
        </button>
      </div>
    </div>
  );
}
