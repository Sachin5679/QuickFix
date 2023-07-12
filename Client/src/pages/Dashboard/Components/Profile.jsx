
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/Profile.module.css'
import { userContext } from '../Dashboard'
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { domainContext } from '../../../App';

function Profile(){
    let {domain} = useContext(domainContext)
    let userType = localStorage.getItem('type')
    let {user , setUser , getUserDetails} = useContext(userContext)
    let [detail , setDetail] = useState(null)

    let [enabled , setEnabled] = useState(0)
    let [loading , setLoading] = useState(0)

    let navigate = useNavigate()

    useEffect(function(){
        if (user != null){
            setDetail({
                hostel : user.hostel,
                room : user.room
            })
        }
    } , [user])


    function handleChange(e){
        let {name , value} = e.target
        setDetail({
            ...detail , 
            [name] : value
        })
    }

    function enableUpdateBtn(){
        if (detail.room >=1 && detail.room <=400 && !(detail.room==user.room && detail.hostel==user.hostel))
            setEnabled(1)
        else
            setEnabled(0)
    }

    function handleUpdateBtn(){
        let reqBody = {
            name : null,
            hostel : detail.hostel,
            room : detail.room
        }

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json'
        }

        setLoading(1)

        axios.put(`${domain}/student/me` , reqBody , {headers})
            .then(function(res){
                setLoading(0)
                getUserDetails()
                toast.success("Profile Updated")
            })
            .catch(function(err){
                setLoading(0)
                if (err.response.status == 401)
                    toast.error("Unauthorized")
                else
                    toast.error("Unexpected error occured")
            })
    }

    function handleLogoutBtn(){
        localStorage.clear()
        navigate('/')
    }

    useEffect(function(){
        if (detail!=null)
            enableUpdateBtn()
    } , [detail])

    useEffect(function(){
        if (loading == 1)
            setEnabled(0)
        else if (detail != null)
            enableUpdateBtn()
    } , [loading])



    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Manage Profile</h1>

            {detail==null? 
            <div className={styles.loading}>
                <ClipLoader color='#425FC6' loading={true} size={45}/>
            </div>
            :
            <div className={styles.box}>
                {userType=='student' &&
                    <>
                        <div className={styles.hostelRoom}>
                            <select value={detail.hostel} onChange={handleChange} name="hostel">
                                <option value="bh1">BH1</option>
                                <option value="bh2">BH2</option>
                                <option value="bh3">BH3</option>
                            </select>
                            <input value={detail.room} onChange={handleChange} type="number" name="room" placeholder='Room'/>
                        </div>
                        <button disabled={!enabled} onClick={handleUpdateBtn} className={styles.update}>
                            {loading==1 ? <ClipLoader color='#425FC6' loading={true} size={25}/> : 'Update'}
                        </button>
                    </>
                }
                <button onClick={handleLogoutBtn} className={styles.logout}>Logout</button>
            </div>
            }
        </div>
    )
}

export default Profile