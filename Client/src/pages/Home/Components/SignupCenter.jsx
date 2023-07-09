
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/SignupCenter.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from 'react-toastify';


function SignupCenter(){
    let [user , setUser] = useState({
        name : '',
        email : '',
        hostel : 'bh1',
        room : '',
        pass : '',
        cpass : ''
    })

    let [enabled , setEnabled] = useState(0)
    let [loading , setLoading] = useState(0)

    let navigate = useNavigate()
    
    function handleChange(e){
        let {name , value} = e.target

        setUser({
            ...user,
            [name] : value
        })
    }

    function handleSignup(){
        let reqBody = {
            name : user.name,
            email: user.email,
            hostel : user.hostel,
            room : user.room,
            password: user.pass
        }

        setLoading(1)

        axios.post('https://quickfix-fuql.onrender.com/student' , reqBody)
            .then(function(res){
                setLoading(0)
                navigate(`/signup/verify?email=${user.email}`)
            })
            .catch(function(err){
                setLoading(0)

                if (err.response.status == 422)
                    toast.error("Invalid form data")
                
                else if (err.response.status == 409)
                    toast.error("Account with this email already exists")
                
                else
                    toast.error("Unexpected error occured")
            })
    }

    function enableSignupBtn(){
        if (
            user.name != '' &&
            user.email.endsWith('@iiitm.ac.in') &&
            user.room >= 1 &&
            user.room <= 400 &&
            user.pass.length >=6 &&
            user.pass == user.cpass
            )
            {
                setEnabled(1)
            }
        else    
            setEnabled(0)
    }

    useEffect(function(){
        enableSignupBtn()
    } , [user])

    useEffect(function(){
        if (loading == true)
            setEnabled(0)
        else
            enableSignupBtn()
    } , [loading])


    return (
        <div className={styles.container}>
            <input onChange={handleChange} className={styles.name} value={user.name} type="text" name="name" id="signup-name" placeholder='Name'/>
            <input onChange={handleChange} className={styles.email} value={user.email} type="text" name="email" id="signup-email" placeholder='Email'/>
            <div className={styles.location}>
                <select onChange={handleChange} className={styles.hostel} value={user.hostel} name="hostel" id="hostel">
                    <option value="bh1">BH1</option>
                    <option value="bh2">BH2</option>
                    <option value="bh3">BH3</option>
                    <option value="gh">GH</option>
                </select>
                <input onChange={handleChange} className={styles.room} value={user.room} type="number" name="room" id="room" placeholder='Room'/>
            </div>
            <input onChange={handleChange} className={styles.pass} value={user.pass} type="password" name="pass" id="pass" placeholder='Password'/>
            <input onChange={handleChange} className={styles.cpass} value={user.cpass} type="password" name="cpass" id="cpass" placeholder='Confirm Password'/>

            <button disabled={!enabled} onClick={handleSignup} className={styles.signup}>
                { loading ? <ClipLoader color='#425FC6' loading={true} size={25}/> : 'Sign Up'}
            </button>
        </div>
    )
}

export default SignupCenter