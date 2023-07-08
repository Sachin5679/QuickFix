
import { useState } from 'react'
import styles from '../Styles/LoginCenter.module.css'
import { useNavigate } from 'react-router-dom'

function LoginCenter(){
    let [user , setUser] = useState({
        type : 0,
        email : '',
        pass : ''
    })

    let navigate = useNavigate()

    function handleSelectUser(e){
        setUser({
            ...user,
            type : e.target.name
        })
    }

    function handleChange(e){
        let {name , value} = e.target

        setUser({
            ...user,
            [name] : value
        })
    }

    function handleForgotBtn(){
        navigate('/forgot')
    }

    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <button className={user.type==0 ? styles.active : ''} name='0' onClick={handleSelectUser}>Student</button>
                <button className={user.type==1 ? styles.active : ''} name='1' onClick={handleSelectUser}>Admin</button>
            </div>

            <input value={user.email} onChange={handleChange} type="email" name="email" id="login-email" placeholder="Email Address" className={styles.email}/>
            <input value={user.pass} onChange={handleChange} type="password" name="pass" id="login-password" placeholder="Password" className={styles.pass}/>

            <div className={styles.loginForgot}>
                <button className={styles.login}>Log In</button>
                <button onClick={handleForgotBtn} className={styles.forgot}>Forgot Password?</button>
            </div>
        </div>
    )
}

export default LoginCenter