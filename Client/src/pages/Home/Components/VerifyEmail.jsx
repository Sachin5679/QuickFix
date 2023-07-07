
import styles from '../Styles/VerifyEmail.module.css'
import { modeContext } from '../Home'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

function VerifyEmail(){
    let {mode , setMode} = useContext(modeContext)
    let navigate = useNavigate()

    function handleLogin(){
        navigate('/login')    
    }

    return (
        <div className={styles.container}>
            <p className={styles.message}>A mail has been sent to your email for Verification</p>
            <button onClick={handleLogin} className={styles.login}>Log In</button>
            <button className={styles.resend}>Resend</button>
        </div>
    )
}

export default VerifyEmail