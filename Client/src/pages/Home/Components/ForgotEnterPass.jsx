
import { useContext, useState } from 'react'
import styles from '../Styles/ForgotEnterPass.module.css'
import { modeContext } from '../Home'

function ForgotEnterPass(){

    let [form , setForm] = useState({
        pass : '',
        cpass : ''
    })

    let {mode , setMode} = useContext(modeContext)

    function handleChange(e){
        let {name , value} = e.target
        setForm({
            ...form,
            [name] : value
        })
    }

    function handleSubmit(){
        setMode(8)
    }

    return (
        <div className={styles.container}>
            <input onChange={handleChange} className={styles.pass} value={form.pass} type="password" name="pass" placeholder="Password"/>
            <input onChange={handleChange} className={styles.cpass} value={form.cpass} type="password" name="cpass" placeholder="Confirm Password"/>
            <button onClick={handleSubmit} className={styles.submit}>Submit</button>
        </div>
    )
}

export default ForgotEnterPass