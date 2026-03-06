import React, { createContext, useContext, useState, useEffect } from "react";
import { Patient, INITIAL_PATIENTS } from "../data/patients";

interface PatientsContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "createdAt">) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
}

const PatientsContext = createContext<PatientsContextType | null>(null);

export function PatientsProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem("sus_patients");
      if (stored) {
        const parsed: Patient[] = JSON.parse(stored);
        // Migrate old records that don't have medications field
        return parsed.map((p) => ({ medications: [], ...p }));
      }
      return INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem("sus_patients", JSON.stringify(patients));
  }, [patients]);

  const addPatient = (data: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const getPatient = (id: string) => patients.find((p) => p.id === id);

  return (
    <PatientsContext.Provider
      value={{ patients, addPatient, updatePatient, deletePatient, getPatient }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error("usePatients must be used within PatientsProvider");
  return ctx;
}