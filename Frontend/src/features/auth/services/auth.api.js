// file for interacting with backend api
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    // for interacting with cookies
    withCredentials: true,
})

// function for interating the backend register api
export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password,
        });
        return response.data;
    }
    catch(err) {
        console.log(err);
    }
}


// function for interating the backend login api
export async function login({ email, password }) {

    try {
        const response = await api.post('/api/auth/login', {
            email, 
            password,
        })
        console.log(response.data);
        return response.data;
    }
    catch(err) {
        console.log(err);
        throw err
    }
}

export async function logout() {
    
    try {
        const response = await api.get('/api/auth/logout');
        return response.data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function getMe() {
    const response = await api.get('/api/auth/get-me');
    return response.data;
}
