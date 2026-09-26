import { RouterProvider } from "react-router";
import { router } from "./features/app/app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";
// wrap state (AuthProvider undere complete application) -> for accessing all states anywhere in the application

function App() {

  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App
