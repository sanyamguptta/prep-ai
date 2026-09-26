import { createBrowserRouter } from 'react-router';
import Register from '../auth/pages/Register';
import Login from '../auth/pages/Login';
import Protected from '../auth/components/Protected';
import Home from './pages/Home';
import Interview from '../interview/pages/Interview';
import InterviewReport from '../interview/pages/InterviewReport';

export const router = createBrowserRouter([
    // PROTECTED ROOT / HOME ROUTE
    {
        path: '/',
        element: <Protected> <Home /> </Protected>
    },
    // INTERVIEW ROUTES (protected)
    {
        path: '/interview',
        element: <Protected> <Interview /></Protected>
    },
    {
        path: '/interview/report/:interviewId',
        element: <Protected> <InterviewReport /> </Protected>
    },
    // NORMAL ROUTES
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
])