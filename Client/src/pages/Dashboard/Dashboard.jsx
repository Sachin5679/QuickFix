import { useNavigate } from "react-router-dom"
import Nav from "../../Layouts/Nav"
import Main from "./Components/Main"
import styles from "./Dashboard.module.css"
import { useEffect } from "react"

function Dashboard() {

    let navigate = useNavigate()

    function handleLogoBtn(){

    }

    function handleProfileBtn(){

    }

    useEffect(function(){
        if (localStorage.getItem('token') == null)
            navigate('/')

        else
        {
            let curTime = new Date()
            if (curTime >= localStorage.getItem('exp'))
            {
                localStorage.clear()
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

            <Main />
        </>
    )
}

export default Dashboard