
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/ForgotEnterPass.module.css'
import { forgotContext, modeContext } from '../Home'
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotEnterPass(){

    let [form , setForm] = useState({
        pass : '',
        cpass : ''
    })
    let {mode , setMode} = useContext(modeContext)
    let {forgot , setForgot} = useContext(forgotContext)

    let [loading , setLoading] = useState(0)
    let [enabled , setEnabled] = useState(0)

    function handleChange(e){
        let {name , value} = e.target
        setForm({
            ...form,
            [name] : value
        })
    }

    function handleSubmit(){
        let reqBody = {
            newPassword : form.pass,
            token : forgot.token
        }

        setLoading(1)

        axios.post('https://quickfix-fuql.onrender.com/password' , reqBody)
            .then(function(res){
                setLoading(0)

                toast.success("Password has been changed")
                setMode(8)
            })
            .catch(function(err){
                setLoading(0)

                if (err.response.status == 404)
                    toast.error("Account not found")
                else
                    toast.error("Unexpected error occured")
            })
    }

    function enableSubmitBtn(){
        if (form.pass.length >=6 && form.pass == form.cpass)
            setEnabled(1)
        else
            setEnabled(0)
    }

    useEffect(function(){
        if (loading == 0)
            enableSubmitBtn()
    } , [form])

    useEffect(function(){
        if (loading == 1)
            setEnabled(0)
        else
            enableSubmitBtn()
    } , [loading])

    useEffect(function(){
        if (forgot.token == '')
            setMode(6)
    })

    return (
        <div className={styles.container}>
            <input onChange={handleChange} className={styles.pass} value={form.pass} type="password" name="pass" placeholder="Password"/>
            <input onChange={handleChange} className={styles.cpass} value={form.cpass} type="password" name="cpass" placeholder="Confirm Password"/>
            <button disabled={!enabled} onClick={handleSubmit} className={styles.submit}>
                {loading==1 ? <ClipLoader color='#425FC6' loading={true} size={25}/> : 'Submit'}
            </button>
        </div>
    )
}

export default ForgotEnterPass