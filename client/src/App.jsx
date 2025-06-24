import './App.css'
import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import ProfilePage from './ProfilePage.jsx'

const App = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/profile' element={<ProfilePage />}/>
    </Routes>
    )
}

export default App
