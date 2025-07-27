import './styles.css'
import Home from './pages/Home.jsx'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import ProfilePage from './pages/ProfilePage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import { useUser } from './contexts/UserContext';
import SignupForm from './components/SignupForm.jsx'
import InitialPage from './pages/InitialPage.jsx'
import LoginForm from './components/LoginForm.jsx'
import WithAuth from './components/WithAuth.jsx'
import PersonalityQuiz from './components/PersonalityQuiz.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import baseUrl from './utils/baseUrl.js'

const App = () => {
  const {user, setUser} = useUser();
  const ProtectedHome = WithAuth(Home);
  const ProtectedGroupsPage = WithAuth(GroupsPage);
  const ProtectedProfilePage = WithAuth(ProfilePage);
  const ProtectedPersonalityQuiz = WithAuth(PersonalityQuiz);
  const ProtectedCalendarPage = WithAuth(CalendarPage);

  useEffect(() => {
    fetch(`${baseUrl}/auth/me`, {credentials: "include"})
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data); 
        }
      });
  }, [setUser]);

  return (
    <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path='/home' element={<ProtectedHome />}/>
        <Route path='/groups' element={<ProtectedGroupsPage />}/>
        <Route path='/profile' element={<ProtectedProfilePage />}/>
        <Route path='/personalityQuiz' element={<ProtectedPersonalityQuiz />}/>
        <Route path='/calendar' element={<ProtectedCalendarPage />}/>
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
    </Routes>
    )
}

export default App
