import './styles.css'
import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import ProfilePage from './ProfilePage.jsx'
import GroupsPage from './GroupsPage.jsx'
import { useUser } from './contexts/UserContext';
import SignupForm from './SignupForm.jsx'
import LoginForm from './LoginForm.jsx'
import WithAuth from './WithAuth.jsx'

const App = () => {
  const { user, setUser } = useUser();
  const ProtectedHome = WithAuth(Home);

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data); 
        }
      });
  }, [setUser]);

  return (
    <Routes>
        <Route exact path='/' element={<ProtectedHome />}/>
        <Route path='/groups' element={<GroupsPage />}/>
        <Route path='/profile' element={<ProfilePage />}/>
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
    </Routes>
    )
}

export default App
