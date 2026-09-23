// for redirection based on if the state has user data or null currently
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';

const Protected = ({ children }) => {

    const { loading, user } = useAuth();
    
    // if loading is already true then, showing loading ui
    if(loading) {
        return (
            <main>
                <h1> loading... </h1>
            </main>
        )
    }

    // if user is not rendered -> user state is null -> navigate to login page
    if(!user) {
        return <Navigate to={'/login'} />
    }

    return children;
}

export default Protected;

