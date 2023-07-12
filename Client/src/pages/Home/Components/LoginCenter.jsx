
import { useContext, useEffect, useState  } from 'react'
import styles from '../Styles/LoginCenter.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from 'react-toastify';
import { domainContext } from '../../../App';

function LoginCenter() {
    let {domain} = useContext(domainContext)
    let [user, setUser] = useState({
        type: 0,
        email: '',
        pass: ''
    })

    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    let [enabled, setEnabled] = useState(0)

    function handleSelectUser(e) {
        setUser({
            ...user,
            type: e.target.name
        })
    }

    function handleChange(e) {
        let { name, value } = e.target

        setUser({
            ...user,
            [name]: value
        })
    }

    function handleForgotBtn() {
        navigate('/forgot')
    }

    function handleLoginBtn() {
        let reqBody = {
            email: user.email,
            password: user.pass,
            type: user.type == 0 ? 'student' : 'admin'
        }

        setLoading(true)

        axios.post(`${domain}/login`, reqBody)
            .then(function (res) {
                setLoading(false)

                localStorage.setItem('token', res.data.access_token)
                let expTime = new Date()
                expTime.setMinutes(expTime.getMinutes() + Number(res.data.exp))
                localStorage.setItem('exp', expTime)
                localStorage.setItem('type', reqBody.type)

                
                navigate('/dashboard')
            })
            .catch(function (err) {
                setLoading(false)

                if (err.response.status == 403)
                    toast.error("Invalid Credentials")
                
                if (err.response.status == 401)
                {
                    toast.error("Email is not verified")
                    navigate(`/signup/verify?email=${user.email}`)
                }
            })
    }

    function enableLoginBtn(){
        if (user.email.endsWith('@iiitm.ac.in') && user.pass.length >= 6)
            setEnabled(1)
        else
            setEnabled(0)
    }
    
    useEffect(function () {
        if (loading == false)
            enableLoginBtn()
    }, [user])

    useEffect(function(){
        if (loading == true)
            setEnabled(0)
        else
            enableLoginBtn()
    } , [loading])



    return (
        <>
            <div className={styles.container}>
                <div className={styles.user}>
                    <button className={user.type == 0 ? styles.active : ''} name='0' onClick={handleSelectUser}>Student</button>
                    <button className={user.type == 1 ? styles.active : ''} name='1' onClick={handleSelectUser}>Admin</button>
                </div>

                <input value={user.email} onChange={handleChange} type="email" name="email" id="login-email" placeholder="Email Address" className={styles.email} />
                <input value={user.pass} onChange={handleChange} type="password" name="pass" id="login-password" placeholder="Password" className={styles.pass} />

                <div className={styles.loginForgot}>

                    <button onClick={handleLoginBtn} disabled={!enabled} className={styles.login}>
                        { loading ? <ClipLoader color='#425FC6' loading={true} size={25}/> : 'Log in'}
                    </button>

                    <button onClick={handleForgotBtn} className={styles.forgot}>Forgot Password?</button>
                </div>
            </div>
        </>
    )
}

export default LoginCenter