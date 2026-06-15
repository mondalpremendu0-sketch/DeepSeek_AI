import {useContext} from 'react';
import {AuthContext} from '../auth.context.jsx'
import {register, login, getProfile, logout } from '../services/api.service.js';

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  const {user, setUser, loading, setLoading} = context;
  
  const handleRegister = async ({firstname, lastname, email, password}) => {
    try {
      setLoading(true);
      const data = await register({firstname, lastname, email, password});
      setUser(data.user);
    } catch (err) {
      console.error('handleRegister Error:', err);
      
    }
     finally {
      setLoading(false)
    }
  }
  
}