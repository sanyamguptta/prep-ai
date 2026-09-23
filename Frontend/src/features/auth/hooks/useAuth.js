// for managing states & api layer
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { register, login, logout, getMe } from '../services/auth.api';

export const useAuth = () => {

    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleRegister = async ({ username, email, password }) => {

        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        }
        catch(err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    const handleLogin =  async ({ email, password }) => {

        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        }
        catch(err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {

        setLoading(true);
        try {
            await logout();
            setUser(null);
        }
        catch(err) {
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
      // function for calling getMe api for for setting user state on 1st render
      const getAndSetUser = async () => {
        // calling getMe api
        const data = await getMe();
        // setting data into the user state
        setUser(data.user);
        // setting loading state as false again
        setLoading(false);
      };

      // this function only calls on 1st render
      getAndSetUser();
    }, []);




    return {
        user, 
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
    }

}

