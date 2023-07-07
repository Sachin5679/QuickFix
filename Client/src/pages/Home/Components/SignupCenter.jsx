
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/SignupCenter.module.css'
import { useNavigate } from 'react-router-dom'


function SignupCenter(){
    let [user , setUser] = useState({
        name : '',
        email : '',
        hostel : 'bh1',
        room : '',
        pass : '',
        cpass : ''
    })

    let navigate = useNavigate()
    
    function handleChange(e){
        let {name , value} = e.target

        setUser({
            ...user,
            [name] : value
        })
    }

    function handleSignup(){
        navigate('/signup/verify')    
    }

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
            <button onClick={handleSignup} className={styles.signup}>Sign Up</button>
        </div>
    )
}

export default SignupCenter