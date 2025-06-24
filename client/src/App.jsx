import './styles.css'
import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import ProfilePage from './ProfilePage.jsx'
import GroupsPage from './GroupsPage.jsx'

const App = () => {
  return (
    <Routes>
        <Route exact path='/' element={<Home />}/>
        <Route path='/groups' element={<GroupsPage />}/>
        <Route path='/profile' element={<ProfilePage />}/>
    </Routes>
    )
}

export default App
