
import { useContext } from 'react'
import styles from '../Styles/ForgotSuccess.module.css'
import { modeContext } from '../Home'
import { useNavigate } from 'react-router-dom'

function ForgotSuccess(){

    let {mode , setMode} = useContext(modeContext)
    let navigate = useNavigate()

    function handleLoginBtn(){
        navigate('/login')    
    }

    return (
        <div className={styles.container}>
            <p>Password Reset Successfully</p>
            <button onClick={handleLoginBtn}>Log In</button>
        </div>
    )
}

export default ForgotSuccess