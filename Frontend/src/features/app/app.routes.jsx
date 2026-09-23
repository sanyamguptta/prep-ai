import { createBrowserRouter } from 'react-router';
import Register from '../auth/pages/Register';
import Login from '../auth/pages/Login';
import Protected from '../auth/components/Protected';

export const router = createBrowserRouter([
    // PROTECTED ROUTE
    {
        path: '/',
        element: <Protected> <h1> Home Page </h1> </Protected>
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