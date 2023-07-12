
import styles from '../Styles/VerifyEmail.module.css'
import { modeContext } from '../Home'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import axios from 'axios'
import { toast } from 'react-toastify'
import { domainContext } from '../../../App'

function VerifyEmail(){
    let {domain} = useContext(domainContext)
    let {mode , setMode} = useContext(modeContext)
    let [loading , setLoading] = useState(0)

    let navigate = useNavigate()
    let location = useLocation()
    let params = new URLSearchParams(location.search)
    let email = params.get('email')

    useEffect(function(){
        if (email == null)
            navigate('/')
    } , [])


    function handleLogin(){
        navigate('/login')    
    }

    function handleResend(){
        let reqBody = {
            email : email
        }

        setLoading(1)

        axios.post(`${domain}/verify` , reqBody)
            .then(function(res){
                setLoading(0)
                toast.success("Verification mail sent")
            })
            .catch(function(err){
                setLoading(0)
                if (err.response.status == 404)
                    toast.error("Account with this email not found")
                
                else if (err.response.status == 409)
                    toast.error("Email aready verified")

                else if (err.response.status == 422)
                    toast.error("Invalid form data")
            })
    }

    return (
        <div className={styles.container}>
            <p className={styles.message}>A mail has been sent to your email for Verification</p>
            <button onClick={handleLogin} className={styles.login}>Log In</button>
            { loading==1? 
                <BeatLoader color='#425FC6' loading={true} size={5} margin={7}/> : 
                <button onClick={handleResend} className={styles.resend}>Resend</button>
            }
        </div>
    )
}

export default VerifyEmail