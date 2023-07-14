import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Home from './pages/Home/Home.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { createContext, useState } from 'react';

export let domainContext = createContext()

function App() {
    let domain = "https://quickfix-fuql.onrender.com"
    // let domain = "http://192.168.69.167:8000"
    // let domain = "http://192.168.75.119:8000"

    return (
        <domainContext.Provider value={{domain}}>
            <img className='backgroundimg' src="/bg2.png" alt="background" />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home mode={1}/>} />
                    <Route path='/login' element={<Home mode={2}/>} />
                    <Route path='/signup' element={<Home mode={3}/>} />
                    <Route path='/signup/verify' element={<Home mode={4}/>} />
                    <Route path='/forgot' element={<Home mode={5}/>} />
                    <Route path='/dashboard' element={<Dashboard mode={1}/>} />
                    <Route path='/new' element={<Dashboard mode={2}/>} />
                    <Route path='/profile' element={<Dashboard mode={3}/>} />
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
        </domainContext.Provider>
    )
}

export default App
