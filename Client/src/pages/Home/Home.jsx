
import { createContext, useEffect, useState } from 'react'
import Center from '../../Layouts/Center'
import Nav from '../../Layouts/Nav'
import Welcome from './Components/Welcome'
import LoginCenter from './Components/LoginCenter'
import styles from './Home.module.css'
import SignupCenter from './Components/SignupCenter'
import VerifyEmail from './Components/VerifyEmail'
import { useNavigate } from 'react-router-dom'
import ForgotEnterEmail from './Components/ForgotEnterEmail'
import ForgotEnterOtp from './Components/ForgotEnterOtp'
import ForgotEnterPass from './Components/ForgotEnterPass'
import ForgotSuccess from './Components/ForgotSuccess'


export let modeContext = createContext()
export let forgotContext = createContext()

function Home(props) {
    let [mode, setMode] = useState(props.mode)

    let [forgot , setForgot] = useState({
        email : '',
        type : null,
        token : ''
    })

    useEffect(function(){
        setMode(props.mode)
    }, [props.mode])

    let navigate = useNavigate()

    function handleLoginBtn(){
        navigate('/login')
    }

    function handleSignupBtn(){
        navigate('/signup')
    }

    function handleLogoBtn(){
        navigate('/')
    }

    useEffect(function(){
        if(localStorage.getItem('token') != null)
        {
            let curTime = new Date()
            if (curTime >= localStorage.getItem('exp'))
                localStorage.clear()
    
            else
                navigate('/dashboard')
        }
    } , [])

    return (
        <modeContext.Provider value={{mode , setMode}}>
            <div className={styles.home}>
                <Nav>
                    <div className={styles.container}>
                        <img className={styles.logo} src="../public/logo.png" alt="Logo" onClick={handleLogoBtn}/>
                        <ul className={styles.btnList}>
                            {[1, 3 , 6 , 5].includes(mode) && <li><button onClick={handleLoginBtn}>Log In</button></li>}
                            {[1, 2 , 4].includes(mode) && <li><button onClick={handleSignupBtn}>Sign Up</button></li>}
                        </ul>
                    </div>
                </Nav>
                <Center>
                    {mode == 1 && <Welcome />}
                    {mode == 2 && <LoginCenter />}
                    {mode == 3 && <SignupCenter />}
                    {mode == 4 && <VerifyEmail />}
                    <forgotContext.Provider value={{forgot , setForgot}}>
                        {mode == 5 && <ForgotEnterEmail />}
                        {mode == 6 && <ForgotEnterOtp />}
                        {mode == 7 && <ForgotEnterPass />}
                        {mode == 8 && <ForgotSuccess />}
                    </forgotContext.Provider>
                </Center>
            </div>
        </modeContext.Provider>
    )
}

export default Home