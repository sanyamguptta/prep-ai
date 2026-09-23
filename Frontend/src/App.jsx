import { RouterProvider } from "react-router";
import { router } from "./features/app/app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
// wrap state (AuthProvider undere complete application) -> for accessing all states anywhere in the application

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App
