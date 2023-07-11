import { useNavigate } from "react-router-dom"
import Nav from "../../Layouts/Nav"
import Main from "./Components/Main"
import styles from "./Dashboard.module.css"
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import New from "./Components/New"
import Profile from "./Components/Profile"

export let userContext = createContext()

function Dashboard(props) {

    let [mode , setMode] = useState(props.mode)

    let [user , setUser] = useState(null)

    useEffect(function(){
        setMode(props.mode)
    } , [props.mode])

    let navigate = useNavigate()

    function handleLogoBtn(){
        navigate('/')
    }

    function handleProfileBtn(){
        navigate('/profile')
    }

    function getUserDetails(){
        let tkn = localStorage.getItem('token')
        let typ = localStorage.getItem('type')

        if (tkn == null)
            return

        let headers = {
            'Authorization' : `Bearer ${tkn}`,
            'Content-Type' : 'application/json'
        }

        axios.get(`https://quickfix-fuql.onrender.com/${typ}/me` , {headers})
            .then(function(res){
                setUser(res.data)
            })
            .catch(function(err){
                if (err.response.status == 401)
                    toast.error("Unauthorized")
                else
                    toast.error("Unexpected error occured")
            })
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

            else
                getUserDetails()
        }
    } , [])

    return (
        <>
            <Nav>
                <div className={styles.container}>
                    <img className={styles.logo} src="../public/logo.png" alt="Logo" onClick={handleLogoBtn} />
                    {mode!=3 && <img className={styles.profile} src="../public/profile.png" alt="Profile" onClick={handleProfileBtn}/>}

                </div>
            </Nav>

            <userContext.Provider value={{user , setUser}}>
                {mode==1 && <Main/>}
                {mode==2 && <New/>}
                {mode==3 && <Profile/>}
            </userContext.Provider>
        </>
    )
}

export default Dashboard