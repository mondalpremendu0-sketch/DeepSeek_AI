import {Navigate} from 'react-router'
import {useAuthContext} from '../hook/useAuthContext.js'
import Loading from '../components/LoadingUi.jsx'



export default function Protected({children}) {
  const {user,loading} = useAuthContext({children});
  if (loading) {
    return <Loading />;
  }
  if (!user) {
        return <Navigate to={"/register"} replace/>;
    }
    return children;
      
      
}