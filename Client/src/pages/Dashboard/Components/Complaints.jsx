

import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/Complaints.module.css'
import Comp from './Comp'
import { compContext } from './Main'
import axios from 'axios'
import { toast } from 'react-toastify'
import ClipLoader from "react-spinners/ClipLoader";
import { userContext } from '../Dashboard'
import { useNavigate } from 'react-router-dom'

function Complaints(){
    let {compControl , setCompControl} = useContext(compContext)
    let [allComplaints , setAllComplaints] = useState([])
    let [finalComplaints , setFinalComplaints] = useState([])
    let [loading , setLoading] = useState(0)
    let userType = localStorage.getItem('type')
    let [popup , setPopup] = useState(null)

    let navigate = useNavigate()

    function handleType(e){
        let ele = e.target.closest('button')
        setCompControl({
            ...compControl,
            typ : ele.name
        })
    }

    function handleOrder(e){
        setCompControl({
            ...compControl,
            ord : e.target.value
        })
    }

    function handleNewBtn(){
        navigate('/new')
    }

    function handlePopup(com){
        setPopup(com)
    }

    function closePopup(){
        setPopup(null)
    }

    function getAllComplaints(){
        if (localStorage.getItem('token') == null)
            return
        setLoading(1)

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json'
        }

        axios.get(`https://quickfix-fuql.onrender.com/complaint/${compControl.typ}` , {headers})
            .then(function(res){
                setLoading(0)

                setAllComplaints(res.data)
            })
            .catch(function(err){
                setLoading(0)

                if (err.response.status == 401)
                    toast.error("Unauthorized")
            })
    }

    function filterComplaints(){
        let temp = []

        let cat = []
        if (compControl.carpentry) cat.push('carpentry')
        if (compControl.electrical) cat.push('electrical')
        if (compControl.plumbing) cat.push('plumbing')

        let hostel = []
        if (compControl.bh1) hostel.push('bh1')
        if (compControl.bh2) hostel.push('bh2')
        if (compControl.bh3) hostel.push('bh3')
        if (compControl.gh) hostel.push('gh')

        let state = []
        if (compControl.new) state.push('new')
        if (compControl.accepted) state.push('accepted')
        if (compControl.rejected) state.push('rejected')
        if (compControl.done) state.push('done')
        if (compControl.closed) state.push('closed')
        

        for (let i of allComplaints)
        {
            if (cat.includes(i.category) && hostel.includes(i.location) && state.includes(i.state))
                temp.push(i)
        }

        if (compControl.ord == 'newest')
        {
            temp.sort(function(a , b){
                return new Date(a.created) - new Date(b.created)
            })
        }

        else
        {
            temp.sort(function(a , b){
                return new Date(b.created) - new Date(a.created)
            })
        }
        
        setFinalComplaints(temp)
    }


    useEffect(function(){
        getAllComplaints()
    } , [])

    useEffect(function(){
        getAllComplaints()
    } , [compControl.typ])

    useEffect(function(){
        filterComplaints()
    } , [compControl])

    useEffect(function(){
        filterComplaints()
    } , [allComplaints])

    return (
        <div className={styles.container}>
            <div className={styles.type}>
                <button onClick={handleType} className={compControl.typ=='common' ? styles.active : ''} name='common'><span>Common Complaints</span></button>
                {userType=='student' && <button onClick={handleType} className={compControl.typ=='my' ? styles.active : ''} name='my'><span>My Complaints</span></button>}
                {userType=='admin' && <button onClick={handleType} className={compControl.typ=='personal' ? styles.active : ''} name='personal'><span>Individual Complaints</span></button>}
                
            </div>

            <div className={styles.btns}>
                {userType=='student' && <button onClick={handleNewBtn} className={styles.new}><img src="../public/new.png" alt="new" />New Complaint</button>}
                {userType=='admin' && <span></span>}
                <select onChange={handleOrder} value={compControl.ord} className={styles.sort} name="sort">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>


            {loading==1 ? 
                <div className={styles.loading}>
                    <ClipLoader color='#425FC6' loading={true} size={45}/>
                </div>
                :
                <div className={styles.compContainer}>
                    {finalComplaints.map(function(i){
                        return <Comp popFunc={handlePopup} key={i.id} data={i}/>
                    })}
                </div>
            }

            {popup!=null && 
            <div className={styles.pContainer}>
                <div onClick={closePopup} className={styles.background}></div>
                <div className={styles.popup}>
                    <div className={styles.details}>
                        <div className={styles.titleName}>
                            <h1 className={styles.title}>{popup.title}</h1>
                            <ul>
                                <li>{popup.name}</li>
                                <li>{popup.created}</li>
                            </ul>
                        </div>

                        <div className={styles.desc}>{popup.desc}</div>

                        <div className={styles.moreDetails}>
                            <div className={styles.group}>
                                <h2>Object</h2>
                                <h3>{popup.object}</h3>
                            </div>

                            <div className={styles.group}>
                                <h2>Location</h2>
                                <h3>{popup.location}</h3>
                            </div>

                            <div className={styles.group}>
                                <h2>Object Id</h2>
                                <h3>{popup.objectId}</h3>
                            </div>

                            <div className={styles.group}>
                                <h2>Type</h2>
                                <h3>{popup.type}</h3>
                            </div>

                            <div className={styles.group}>
                                <h2>Category</h2>
                                <h3>{popup.category}</h3>
                            </div>

                            <div className={styles.group}>
                                <h2>State</h2>
                                <h3>{popup.state}</h3>
                            </div>

                            {popup.reason!=null && 
                                <div className={styles.group}>
                                    <h2>Reject Reason</h2>
                                    <h3>{popup.reason}</h3>
                                </div>
                            }
                        </div>

                        <div className={styles.btns}>
                            {/* {Put buttons here} */}
                        </div>
                    </div>
                    <div className={styles.photo}>
                        {popup.imgLink == null && 
                            <img src="/comp.png" alt="Dummy Image" />
                        }

                        {popup.imgLink != null &&
                            <img src={popup.imgLink} alt={popup.imgName} />
                        }
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Complaints