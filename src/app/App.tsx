import { RouterProvider } from "react-router";
import { router } from "./routes";
import { PatientsProvider } from "./context/PatientsContext";

export default function App() {
  return (
    <PatientsProvider>
      <RouterProvider router={router} />
    </PatientsProvider>
  );
}
