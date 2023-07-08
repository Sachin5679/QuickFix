
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/ForgotEnterOtp.module.css'
import { modeContext } from '../Home'

function ForgotEnterOtp(){
    let [finalOtp , setFinalOtp] = useState('')

    let {mode , setMode} = useContext(modeContext)

    let [otp , setOtp] = useState({
        otp1 : '',
        otp2 : '',
        otp3 : '',
        otp4 : '',
        otp5 : ''
    })

    useEffect(function(){
        if (finalOtp.length < 5){
            let current = 'otp' + String(finalOtp.length + 1)
            let currentOtpBox = document.getElementsByName(current)[0]
            currentOtpBox.focus()
        }
    } , [finalOtp])

    useEffect(function(){
        setFinalOtp(otp.otp1 + otp.otp2 + otp.otp3 + otp.otp4 + otp.otp5)
    } , [otp])

    function handleChange(e){
        let {name , value} = e.target
        if (value > 9)
            return
        setOtp({
            ...otp,
            [name] : value
        })
    }

    function handleSubmit(){
        setMode(7)
    }


    return (
        <div className={styles.container}>
            <p>An OTP has been sent to your email</p>
            <div className={styles.otps}>
                <input disabled={finalOtp.length<0} readOnly={finalOtp.length>1} name='otp1' value={otp.otp1} onChange={handleChange} type="number" className={styles.otp}/>
                <input disabled={finalOtp.length<1} readOnly={finalOtp.length>2} name='otp2' value={otp.otp2} onChange={handleChange} type="number" className={styles.otp}/>
                <input disabled={finalOtp.length<2} readOnly={finalOtp.length>3} name='otp3' value={otp.otp3} onChange={handleChange} type="number" className={styles.otp}/>
                <input disabled={finalOtp.length<3} readOnly={finalOtp.length>4} name='otp4' value={otp.otp4} onChange={handleChange} type="number" className={styles.otp}/>
                <input disabled={finalOtp.length<4} readOnly={finalOtp.length>5} name='otp5' value={otp.otp5} onChange={handleChange} type="number" className={styles.otp}/>
            </div>
            <div className={styles.submitResend}>
                <button disabled={finalOtp.length==5? 0 : 1} onClick={handleSubmit} className={styles.submit}>Submit</button>
                <button className={styles.resend}>Resend</button>
            </div>
        </div>
    )
}

export default ForgotEnterOtp