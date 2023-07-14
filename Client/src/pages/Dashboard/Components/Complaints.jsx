

import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/Complaints.module.css'
import Comp from './Comp'
import Popup from './Popup'
import { compContext } from './Main'
import axios from 'axios'
import { toast } from 'react-toastify'
import ClipLoader from "react-spinners/ClipLoader";
import { userContext } from '../Dashboard'
import { useNavigate } from 'react-router-dom'
import { domainContext } from '../../../App'

function Complaints() {
    let {user} = useContext(userContext)
    let { domain } = useContext(domainContext)
    let { compControl, setCompControl } = useContext(compContext)
    let [allComplaints, setAllComplaints] = useState([])
    let [finalComplaints, setFinalComplaints] = useState([])
    let [loading, setLoading] = useState(0)
    let userType = localStorage.getItem('type')
    let [popup, setPopup] = useState(null)

    let navigate = useNavigate()

    function handleType(e) {
        let ele = e.target.closest('button')
        setCompControl({
            ...compControl,
            typ: ele.name
        })
    }

    function handleOrder(e) {
        setCompControl({
            ...compControl,
            ord: e.target.value
        })
    }

    function handleNewBtn() {
        navigate('/new')
    }

    function handlePopup(com) {
        setPopup(com)
    }

    function closePopup() {
        setPopup(null)
    }

    function getAllComplaints() {
        if (localStorage.getItem('token') == null)
            return
        setLoading(1)

        let headers = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }

        axios.get(`${domain}/complaint/${compControl.typ}`, { headers })
            .then(function (res) {
                setLoading(0)

                setAllComplaints(res.data)
            })
            .catch(function (err) {
                setLoading(0)

                if (err.response.status == 401)
                    toast.error("Unauthorized")
            })
    }

    function filterComplaints() {
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

        if (compControl.typ == 'my')
            hostel = ['bh1' , 'bh2'  , 'bh3' , 'gh']
        for (let i of allComplaints) {
            if (cat.includes(i.category) && hostel.includes(i.location) && state.includes(i.state))
                temp.push(i)
        }

        if (compControl.ord == 'oldest') {
            temp.sort(function (a, b) {
                return new Date(a.created) - new Date(b.created)
            })
        }

        else {
            temp.sort(function (a, b) {
                return new Date(b.created) - new Date(a.created)
            })
        }

        setFinalComplaints(temp)
    }

    useEffect(function () {
        getAllComplaints()
    }, [])

    useEffect(function () {
        getAllComplaints()
    }, [compControl.typ])

    useEffect(function () {
        filterComplaints()
    }, [compControl])

    useEffect(function () {
        filterComplaints()
    }, [allComplaints])

    useEffect(function () {
        if (user != null) {
            compControl.bh1 = false
            compControl.bh2 = false
            compControl.bh3 = false
            compControl.gh = false
            compControl[user.hostel] = true
            setCompControl(compControl)
        }
    }, [user])

    return (
        <div className={styles.container}>
            <div className={styles.type}>
                <button disabled={loading == 1} onClick={handleType} className={compControl.typ == 'common' ? styles.active : ''} name='common'><span>Common Complaints</span></button>
                {userType == 'student' && <button disabled={loading == 1} onClick={handleType} className={compControl.typ == 'my' ? styles.active : ''} name='my'><span>My Complaints</span></button>}
                {userType == 'admin' && <button disabled={loading == 1} onClick={handleType} className={compControl.typ == 'personal' ? styles.active : ''} name='personal'><span>Individual Complaints</span></button>}

            </div>

            <div className={styles.btns}>
                {userType == 'student' && <button onClick={handleNewBtn} className={styles.new}><img src="/new.png" alt="new" />New Complaint</button>}
                {userType == 'admin' && <span></span>}
                <select onChange={handleOrder} value={compControl.ord} className={styles.sort} name="sort">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>


            {loading == 1 ?
                <div className={styles.loading}>
                    <ClipLoader color='#425FC6' loading={true} size={45} />
                </div>
                :
                <div className={styles.compContainer}>
                    {finalComplaints.map(function (i) {
                        return <Comp popFunc={handlePopup} key={i.id} data={i} />
                    })}
                </div>
            }

            {popup != null &&
                <Popup
                    closePopup={closePopup}
                    popup={{ popup, setPopup }}
                    getAllComplaints={getAllComplaints} 
                />
            }
        </div>
    )
}

export default Complaints