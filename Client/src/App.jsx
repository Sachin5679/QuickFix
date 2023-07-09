import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Home from './pages/Home/Home.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {

    return (
        <>
            <img className='backgroundimg' src="../public/bg2.png" alt="background" />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home mode={1}/>} />
                    <Route path='/login' element={<Home mode={2}/>} />
                    <Route path='/signup' element={<Home mode={3}/>} />
                    <Route path='/signup/verify' element={<Home mode={4}/>} />
                    <Route path='/forgot' element={<Home mode={7}/>} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}

export default App
