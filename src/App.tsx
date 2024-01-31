import { FC, useEffect } from 'react';
import { getCookie } from './shared/utils/cookie';
import { useNavigate } from 'react-router-dom';
import Router from './shared/router';
import './index.scss';

interface IApp { }
const App: FC<IApp> = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const cookieUser = getCookie('user')

    if (cookieUser) {
      if (window.location.pathname.includes("login"))
        navigate("/home")
    } else {
      navigate("/login")
    }
  }, [])

  return (
    <div>
      <Router />
    </div>
  )
}

export default App
