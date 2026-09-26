import { createBrowserRouter } from 'react-router';
import Register from '../auth/pages/Register';
import Login from '../auth/pages/Login';
import Protected from '../auth/components/Protected';
import Home from '../interview/pages/Home';
import InterviewReport from '../interview/pages/InterviewReport';

export const router = createBrowserRouter([
    // PROTECTED ROUTE
    {
        path: '/',
        element: <Protected> <h1> Home Page </h1> </Protected>
    },
    // INTERVIEW ROUTES (protected)
    {
        path: '/interview',
        element: <Protected><Home/></Protected>
    },
    {
        path: '/interview/report/:interviewId',
        element: <Protected><InterviewReport /></Protected>
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