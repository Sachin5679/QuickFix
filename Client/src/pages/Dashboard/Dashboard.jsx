import { useNavigate } from "react-router-dom"
import Nav from "../../Layouts/Nav"
import Main from "./Components/Main"
import styles from "./Dashboard.module.css"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

function Dashboard(props) {

    let [mode , setMode] = useState(props.mode)

    useEffect(function(){
        setMode(props.mode)
    } , [props.mode])

    let navigate = useNavigate()

    function handleLogoBtn(){
        navigate('/')
    }

    function handleProfileBtn(){

    }

    useEffect(function(){
        if (localStorage.getItem('token') == null)
        {
            toast.error("Session expired")
            navigate('/')
        }

        else
        {
            let curTime = new Date()
            if (curTime >= localStorage.getItem('exp'))
            {
                localStorage.clear()
                toast.error("Session expired")
                navigate('/')
            }
        }
    } , [])

    return (
        <>
            <Nav>
                <div className={styles.container}>
                    <img className={styles.logo} src="../public/logo.png" alt="Logo" onClick={handleLogoBtn} />
                    <img className={styles.profile} src="../public/profile.png" alt="Profile" onClick={handleProfileBtn}/>
                </div>
            </Nav>

            {mode==1 && <Main/>}
        </>
    )
}

export default Dashboard