
import { createContext, useEffect, useState } from 'react'
import Center from '../../Layouts/Center'
import Nav from '../../Layouts/Nav'
import Welcome from './Components/Welcome'
import LoginCenter from './Components/LoginCenter'
import styles from './Home.module.css'
import SignupCenter from './Components/SignupCenter'
import VerifyEmail from './Components/VerifyEmail'
import { useNavigate } from 'react-router-dom'


export let modeContext = createContext()


function Home(props) {
    let [mode, setMode] = useState(props.mode)
    
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

    return (
        <modeContext.Provider value={{mode , setMode}}>
            <div className={styles.home}>
                <Nav>
                    <div className={styles.container}>
                        <img className={styles.logo} src="logo.png" alt="Logo" onClick={handleLogoBtn}/>
                        <ul className={styles.btnList}>
                            {[1, 3].includes(mode) && <li><button onClick={handleLoginBtn}>Log In</button></li>}
                            {[1, 2 , 4].includes(mode) && <li><button onClick={handleSignupBtn}>Sign Up</button></li>}
                        </ul>
                    </div>
                </Nav>
                <Center>
                    {mode == 1 && <Welcome />}
                    {mode == 2 && <LoginCenter />}
                    {mode == 3 && <SignupCenter />}
                    {mode == 4 && <VerifyEmail />}
                </Center>
            </div>
        </modeContext.Provider>
    )
}

export default Home