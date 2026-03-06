import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { PatientList } from "./pages/PatientList";
import { PatientForm } from "./pages/PatientForm";
import { PatientProfile } from "./pages/PatientProfile";
import { VisitPriority } from "./pages/VisitPriority";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "pacientes", Component: PatientList },
      { path: "paciente/:id", Component: PatientProfile },
      { path: "cadastro", Component: PatientForm },
      { path: "editar/:id", Component: PatientForm },
      { path: "prioridades", Component: VisitPriority },
    ],
  },
]);
