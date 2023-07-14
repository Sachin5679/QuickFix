
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/Popup.module.css'
import axios from 'axios'
import { domainContext } from '../../../App'
import { toast } from 'react-toastify'
import { userContext } from '../dashboard'

function Popup(props) {
    let {popup , setPopup} = props.popup
    let getAllComplaints = props.getAllComplaints

    let {domain} = useContext(domainContext)
    let {user} = useContext(userContext)
    let userType = localStorage.getItem('type')
    let [popupLoading , setPopupLoading] = useState(0)
    let [rejectPopup , setRejectPopup] = useState(null)
    
    function handleDeleteBtn(){
        console.log("lul")
        setPopupLoading(1)

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json'
        }

        axios.delete(`${domain}/complaint/${popup.id}` , {headers})
            .then(function(res){
                setPopupLoading(0)
                toast.success("Complaint Deleted")
                setPopup(null)
                getAllComplaints()
            })
            .catch(function(err){
                setPopupLoading(0)
                toast.error("Could not delete")
            })
    }

    function handleDoneBtn(){
        setPopupLoading(1)

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }

        axios.patch(`${domain}/done/${popup.id}` , {} ,  {headers})
            .then(function(res){
                setPopupLoading(0)
                toast.success("Complaint marked done")
                setPopup(null)
                getAllComplaints()
            })
            .catch(function(err){
                setPopupLoading(0)
                toast.error("Could not mark done")
            })
    }

    function handleAcceptBtn(){
        setPopupLoading(1)

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }

        axios.patch(`${domain}/accept/${popup.id}` , {} ,  {headers})
            .then(function(res){
                setPopupLoading(0)
                toast.success("Complaint accepted")
                setPopup(null)
                getAllComplaints()
            })
            .catch(function(err){
                setPopupLoading(0)
                toast.error("Could not accept complaint")
            })
    }

    function handleCloseBtn(){
        setPopupLoading(1)

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }

        axios.patch(`${domain}/close/${popup.id}` , {} ,  {headers})
            .then(function(res){
                setPopupLoading(0)
                toast.success("Complaint closed")
                setPopup(null)
                getAllComplaints()
            })
            .catch(function(err){
                setPopupLoading(0)
                toast.error("Could not close complaint")
            })
    }

    function handleCloseRpopup(){
        setRejectPopup(null)
    }

    function handleRpopupChange(e){
        setRejectPopup({
            reason : e.target.value
        })
    }

    function handleRejectBtn(){
        setRejectPopup({
            reason : ''
        })
    }

    function handleReject(){
        setPopupLoading(1)

        let reqBody = {
            reason : rejectPopup.reason
        }

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }

        axios.patch(`${domain}/reject/${popup.id}` , reqBody ,  {headers})
            .then(function(res){
                setPopupLoading(0)
                setRejectPopup(null)
                toast.success("Complaint rejected")
                setPopup(null)
                getAllComplaints()
            })
            .catch(function(err){
                setPopupLoading(0)
                toast.error("Could not reject complaint")
            })
    }

    return (
        <div className={styles.pContainer}>
            <div onClick={props.closePopup} className={styles.background}></div>
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

                        {popup.type=='Common' ?
                            <div className={styles.group}>
                                <h2>Location</h2>
                                <h3>{popup.location} , {popup.objectId}</h3>
                            </div>
                            :
                            <div className={styles.group}>
                                <h2>Location</h2>
                                <h3>{popup.location} , Room {popup.objectId}</h3>
                            </div>
                        }

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

                        {popup.reason != null &&
                            <div className={styles.group}>
                                <h2>Reject Reason</h2>
                                <h3>{popup.reason}</h3>
                            </div>
                        }
                    </div>

                    <div className={styles.btns}>
                        {popup.userId==user.id && userType == 'student' && popup.state == 'New' && <button onClick={handleDeleteBtn} disabled={popupLoading == 1} className={styles.delete}><img src="/delete.png" alt="Delete" />Delete</button>}
                        {userType == 'student' && popup.state == 'Accepted' && <button onClick={handleDoneBtn} disabled={popupLoading == 1} className={styles.done}><img src="/done.png" alt="Done" />Done</button>}
                        {userType == 'admin' && popup.state == 'New' && <button onClick={handleRejectBtn} disabled={popupLoading == 1} className={styles.reject}><img src="/reject.png" alt="Reject" />Reject</button>}
                        {userType == 'admin' && popup.state == 'New' && <button onClick={handleAcceptBtn} disabled={popupLoading == 1} className={styles.accept}><img src="/accept.png" alt="Accept" />Accept</button>}
                        {userType == 'admin' && popup.state == 'Done' && <button onClick={handleCloseBtn} disabled={popupLoading == 1} className={styles.close}><img src="/done.png" alt="Close" />Close</button>}
                    </div>

                    {rejectPopup != null &&
                        <div className={styles.rejectPopup}>
                            <div onClick={handleCloseRpopup} className={styles.background2}></div>
                            <div className={styles.box}>
                                <textarea onChange={handleRpopupChange} value={rejectPopup.reason} placeholder='Reason'></textarea>
                                <button onClick={handleReject} disabled={popupLoading == 1} className={styles.reject2}><img src="/reject.png" alt="Reject" />Reject</button>
                            </div>
                        </div>
                    }
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
        </div>
    )
}


export default Popup