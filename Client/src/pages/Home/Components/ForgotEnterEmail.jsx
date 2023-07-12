
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/ForgotEnterEmail.module.css'
import { useNavigate } from 'react-router-dom'
import { forgotContext, modeContext } from '../Home'
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { toast } from 'react-toastify';
import { domainContext } from '../../../App';

function ForgotEnterEmail(){
    let {domain} = useContext(domainContext)
    let [form , setForm] = useState({
        type : 0,
        email : ''
    })

    let [enabled , setEnabled] = useState(0)
    let [loading , setLoading] = useState(0)

    let {mode , setMode} = useContext(modeContext)
    let {forgot , setForgot} = useContext(forgotContext)

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
        let reqBody = {
            email : form.email,
            type : form.type==0 ? 'student' : 'admin'
        }

        setForgot({
            ...forgot,
            email : form.email,
            type : reqBody.type
        })

        setLoading(1)
        
        axios.post(`${domain}/password/send-otp` , reqBody)
            .then(function(res){
                setLoading(0)

                toast.success("Otp sent")
                setForgot({
                    ...forgot,
                    email : form.email,
                    type : form.type==0 ? 'student' : 'admin'
                })
                setMode(6)
            })
            .catch(function(err){
                setLoading(0)

                if (err.response.status == 404)
                    toast.error("Account with this email not found")
                else
                    toast.error("Unexpected error occured")
            })
    }

    function enableSendBtn(){
        if ([0,1,'0','1'].includes(form.type) && form.email.endsWith('@iiitm.ac.in'))
            setEnabled(1)
        else
            setEnabled(0)
    }

    useEffect(function(){
        if (loading == 0)
            enableSendBtn()
    } , [form])

    useEffect(function(){
        if (loading == 1)
            setEnabled(0)
        else
            enableSendBtn()
    } , [loading])
    
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <button onClick={handleSelectUser} className={form.type==0 ? styles.active : ''} name='0'>Student</button>
                <button onClick={handleSelectUser} className={form.type==1 ? styles.active : ''} name='1'>Admin</button>
            </div>

            <input value={form.email} onChange={handleChange} className={styles.email} type="text" name="email" id="email" placeholder='Email'/>

            <div className={styles.sendLogin}>
                <button disabled={!enabled} onClick={handleSendOtp} className={styles.send}>
                    {loading==1? <ClipLoader color='#425FC6' loading={true} size={25}/> : 'Send OTP'} </button>
                <button onClick={handleLoginBtn} className={styles.login}>Log in</button>
            </div>
        </div>
    )
}

export default ForgotEnterEmail