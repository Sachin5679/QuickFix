
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/ForgotEnterOtp.module.css'
import { forgotContext, modeContext } from '../Home'
import OTPInput from 'react-otp-input'
import axios from 'axios'
import { toast } from 'react-toastify'
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom'

function ForgotEnterOtp(){
    let [finalOtp , setFinalOtp] = useState('')
    let {mode , setMode} = useContext(modeContext)
    let {forgot , setForgot} =  useContext(forgotContext)
    let navigate = useNavigate()

    let [loading , setLoading] = useState(0)
    let [enabled , setEnabled] = useState(0)


    function enableSubmitBtn(){
        if (finalOtp.length==5)
            setEnabled(1)
        else
            setEnabled(0)
    }

    function handleSubmit(){
        let reqBody = {
            email : forgot.email,
            type : forgot.type,
            otp : finalOtp   
        }

        setLoading(1)

        axios.post('https://quickfix-fuql.onrender.com/password/verify-otp' , reqBody)
            .then(function(res){
                setLoading(0)

                setForgot({
                    ...forgot,
                    token : res.data.password_token
                })

                setMode(7)
            })
            .catch(function(err){
                setLoading(0)

                if (err.response.status == 404)
                    toast.error("OTP expired")
                
                else if (err.response.status == 406)
                    toast.error("Invalid OTP")
                
                else
                    toast.error("Unexpected error occured")
            })
    }

    useEffect(function(){
        if (loading == 0)
            enableSubmitBtn()
    } , [finalOtp])

    useEffect(function(){
        if (loading == 1)
            setEnabled(0)
        else
            enableSubmitBtn()
    } , [loading])

    useEffect(function(){
        if (forgot.email == '')
            setMode(5)
    } , [])

    return (
        <div className={styles.container}>
            <p>An OTP has been sent to your email</p>
            <div className={styles.otps}>
            <OTPInput
                value={finalOtp}
                onChange={setFinalOtp}
                numInputs={5}
                inputStyle={styles.inputStyle}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} />}
            />
            </div>
            <div className={styles.submitResend}>
                <button disabled={!enabled} onClick={handleSubmit} className={styles.submit}>
                    {loading==1 ? <ClipLoader color='#425FC6' loading={true} size={25}/> : 'Submit'}
                </button>
                <button className={styles.resend}>Resend</button>
            </div>
        </div>
    )
}

export default ForgotEnterOtp







