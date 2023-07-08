
import { useContext, useState } from 'react'
import styles from '../Styles/ForgotEnterEmail.module.css'
import { useNavigate } from 'react-router-dom'
import { modeContext } from '../Home'

function ForgotEnterEmail(){
    let [form , setForm] = useState({
        type : 0,
        email : ''
    })

    let {mode , setMode} = useContext(modeContext)

    let navigate = useNavigate()

    function handleSelectUser(e){
        setForm({
            ...form,
            type : e.target.name
        })
    }

    function handleChange(e){
        setForm({
            ...form,
            email : e.target.value
        })
    }

    function handleLoginBtn(){
        navigate('/login')
    }
    
    function handleSendOtp(){
        setMode(6)
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <button onClick={handleSelectUser} className={form.type==0 ? styles.active : ''} name='0'>Student</button>
                <button onClick={handleSelectUser} className={form.type==1 ? styles.active : ''} name='1'>Admin</button>
            </div>

            <input value={form.email} onChange={handleChange} className={styles.email} type="text" name="email" id="email" placeholder='Email'/>

            <div className={styles.sendLogin}>
                <button onClick={handleSendOtp} className={styles.send}>Send OTP</button>
                <button onClick={handleLoginBtn} className={styles.login}>Log in</button>
            </div>
        </div>
    )
}

export default ForgotEnterEmail