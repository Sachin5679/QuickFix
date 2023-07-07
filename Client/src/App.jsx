import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Home from './pages/home/home.jsx'

function App() {

    return (
        <>
            <img className='backgroundimg' src="bg2.png" alt="background" />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home mode={1}/>} />
                    <Route path='/login' element={<Home mode={2}/>} />
                    <Route path='/signup' element={<Home mode={3}/>} />
                    <Route path='/signup/verify' element={<Home mode={4}/>} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
