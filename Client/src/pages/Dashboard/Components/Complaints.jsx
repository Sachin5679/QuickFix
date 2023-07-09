

import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/Complaints.module.css'
import Comp from './Comp'
import { compContext } from './Main'
import axios from 'axios'
import { toast } from 'react-toastify'

function Complaints(){
    let {compControl , setCompControl} = useContext(compContext)
    let [allComplaints , setAllComplaints] = useState([])
    let [finalComplaints , setFinalComplaints] = useState([])

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


    function getAllComplaints(){
        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json'
        }
        axios.get(`https://quickfix-fuql.onrender.com/complaint/${compControl.typ}` , {headers})
            .then(function(res){
                setAllComplaints(res.data)
            })
            .catch(function(err){
                console.log(err.response)
                if (err.response.status == 401)
                    toast.error("Unauthorized")
            })
    }

    useEffect(function(){
        getAllComplaints()
    } , [])

    useEffect(function(){
        getAllComplaints()
    } , [compControl])

    useEffect(function(){
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
        
        setFinalComplaints(temp)
        
    } , [allComplaints])

    return (
        <div className={styles.container}>
            <div className={styles.type}>
                <button onClick={handleType} className={compControl.typ=='common' ? styles.active : ''} name='common'><span>Common Complaints</span></button>
                <button onClick={handleType} className={compControl.typ=='my' ? styles.active : ''} name='my'><span>My Complaints</span></button>
            </div>

            <div className={styles.btns}>
                <button className={styles.new}><img src="../public/new.png" alt="new" />New Complaint</button>
                <select onChange={handleOrder} value={compControl.ord} className={styles.sort} name="sort">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            <div className={styles.compContainer}>
                {finalComplaints.map(function(i){
                    return <Comp 
                    key={i.id} 
                    title={i.title} 
                    desc={i.description} 
                    dte={i.created} 
                    nme={i.student.name}
                    state={i.state}
                    />
                })}
            </div>
        </div>
    )
}

export default Complaints