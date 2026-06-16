import {Navigate} from 'react-router'
import {useAuthContext} from '../hook/useAuthContext.js'



export default function Protected() {
  const {user} = useAuthContext();
  
  if (!user) {
        return <Navigate to={"/register"} replace/>;
    }
    
}