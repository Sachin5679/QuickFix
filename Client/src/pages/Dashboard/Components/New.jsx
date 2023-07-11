
import { useContext, useEffect, useState } from 'react'
import styles from '../Styles/New.module.css'
import ClipLoader from "react-spinners/ClipLoader";
import { userContext } from '../Dashboard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

let commonElectricalObjects = [
    "water cooler"
]

let commonCarpentryObjects = [
    "bathroom door"
]

let commonPlumbingObjects = [
    'toilet seat',
    'flush',
    'tap',
    'urinal',
    'geaser',
    'shower',
    'basin'
]

let possibleObjectId = [
    "GroundFloor",
    "Floor1",
    "Floor2",
    "Floor3",
    "Toilet1",
    "Toilet2",
    "Toilet3",
    "Toilet4",
    "Toilet5",
    "Toilet6",
    "Toilet7",
    "Toilet8",
    "Toilet9",
    "Toilet10",
    "Toilet11",
    "Toilet12",
    "Toilet13",
    "Toilet14",
    "Toilet15",
    "Toilet16",
    "Toilet17",
    "Toilet18",
    "Toilet19",
    "Toilet20",
]

let personalElectrcalObjects = [
    "tubelight",
    "secondary light",
    "switch board",
    "fan",
    "fan regulator"
]

let personalCarpentryObjects = [
    "table",
    "chair",
    "bed",
    "door",
    "cupboard",
    "window",
    "curtain hanger"
]




function New(){

    let {user , setUser} = useContext(userContext)
    let navigate = useNavigate()

    let [regControl , setRegControl] = useState({
        cat : 'carpentry',
        obj : 'table',
        loc : 'bh1',
        objId : '1',
        title : '',
        desc : '',
        type : 'personal',
        pass : ''
    })


    let [objectList , setObjectList] = useState(null)
    
    let [enabled , setEnabled] = useState(0)
    let [loading , setLoading] = useState(0)


    function handleChange(e){
        let {name , value} = e.target

        setRegControl({
            ...regControl,
            [name] : value
        })
    }

    function enableSubmitBtn(){
        if (regControl.obj != null &&
            regControl.objId != '' &&
            regControl.title != '' &&
            regControl.desc != ''&&
            regControl.pass.length >=6)
            {
                setEnabled(1)
            }
        else
            setEnabled(0)
    }

    function handleSubmit(){
        let reqBody = {
            title : regControl.title,
            description : regControl.desc,
            category : regControl.cat,
            object : regControl.obj,
            password : regControl.pass
        }

        if (regControl.type == 'common')
        {
            reqBody = {
                ...reqBody,
                location : regControl.loc,
                objectId : regControl.objId
            }
        }

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json'
        }

        setLoading(1)

        axios.post(`https://quickfix-fuql.onrender.com/complaint/${regControl.type}` , reqBody , {headers})
            .then(function(res){
                setLoading(0)
                toast.success("Complaint Submitted Successfully")
                navigate('/dashboard')
            })
            .catch(function(err){
                setLoading(0)
                if (err.response.status == 401)
                    toast.error("Unauthorized")
                else if (err.response.status == 422)
                    toast.error("Invalid form details")
                else if (err.response.status == 409)
                    toast.error("Complaint for this object already exists")
                else
                    toast.error("Unexpected error occured")
            })
    }

    useEffect(function(){
        if (regControl.type=='common' && regControl.cat=='carpentry')  setObjectList(commonCarpentryObjects)
        else if (regControl.type=='common' && regControl.cat=='electrical')  setObjectList(commonElectricalObjects)
        else if (regControl.type=='common' && regControl.cat=='plumbing')  setObjectList(commonPlumbingObjects)
        else if (regControl.type=='personal' && regControl.cat=='carpentry')  setObjectList(personalCarpentryObjects)
        else if (regControl.type=='personal' && regControl.cat=='electrical')  setObjectList(personalElectrcalObjects)

    } , [regControl.cat , regControl.type])


    useEffect(function(){
        if (regControl.cat == 'plumbing')
        {
            setRegControl({
                ...regControl,
                cat : 'carpentry'
            })
        }
    } , [regControl.type])

    useEffect(function(){
        enableSubmitBtn()
    } , [regControl])

    useEffect(function(){
        if (user != null && regControl.type == 'personal')
        {
            setRegControl({
                ...regControl,
                loc : user.hostel,
                objId : user.room
            })
        }
    } , [regControl.type , user])

    return (
        <div className={styles.container}>
            {user==null ? <ClipLoader color='#425FC6' loading={true} size={45}/>
            :
            <>
                <h1 className={styles.heading}>Register Complaint</h1>
                <div className={styles.container2}>
                    <div className={styles.selectionContainer}>
                        <div className={styles.group}>
                            <label htmlFor="cat">Category</label>
                            <select onChange={handleChange} value={regControl.cat} name="cat" id="cat">
                                <option value="carpentry">Carpentry</option>
                                <option value="electrical">Electrical</option>
                                {regControl.type=='common' && <option value="plumbing">Plumbing</option>}
                            </select>
                        </div>
                        
                        <div className={styles.group}>
                            <label htmlFor="obj">Object</label>
                            <select onChange={handleChange} value={regControl.obj} name="obj" id="obj">
                                {objectList!=null && objectList.map(function(i){
                                    return <option key={i} value={i}>{toTitleCase(i)}</option>
                                })}
                            </select>
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="loc">Location</label>
                            <select disabled={regControl.type=='personal'} value={regControl.loc} onChange={handleChange}  name="loc" id="loc">
                                <option value="bh1">BH1</option>
                                <option value="bh2">BH2</option>
                                <option value="bh3">BH3</option>
                                <option value="gh">GH</option>
                            </select>
                        </div>
                        
                        
                        <div className={styles.group}>
                            <label htmlFor="room">Object Id</label>
                            {regControl.type=='personal'?
                            <input readOnly onChange={handleChange} value={regControl.objId} type="number" name="objId" id="room" />
                            :
                            <select onChange={handleChange} name='objId' id="room">
                                {possibleObjectId.map(function(i){
                                    return <option value={i}>{i}</option>
                                })}
                            </select>
                            }
                        </div>
                    </div>

                    <div className={styles.formContainer}>
                        <input onChange={handleChange} value={regControl.title} className={styles.title} name='title' type="text" placeholder="Title"/>
                        <textarea onChange={handleChange} value={regControl.desc} className={styles.desc} name="desc" rows="8" placeholder="Description"></textarea>
                        <div className={styles.type}>
                            <h2>Type</h2>
                            <div className={styles.personal}>
                                <input onChange={handleChange} checked={regControl.type=='personal'} type="radio" name="type" id="personal" value='personal' />
                                <label htmlFor="personal">Personal</label>
                            </div>
                            <div className={styles.common}>
                                <input onChange={handleChange} checked={regControl.type=='common'} type="radio" name="type" id="common" value='common' />
                                <label htmlFor="common">Common</label>
                            </div>
                        </div>
                        <input onChange={handleChange} value={regControl.pass} className={styles.pass} type="password" name="pass" id="pass" placeholder="Password"/>
                        <button onClick={handleSubmit} disabled={!enabled} className={styles.submit}>
                            {loading==1 ? <ClipLoader color='#425FC6' loading={true} size={25}/> : 'Submit'}
                        </button>
                    </div>

                    <div className={styles.imgContainer}>
                        <div className={styles.displayImg}>
                            <img src="/uimg.png" alt="Upload Image" />
                        </div>
                        <button>Upload Image</button>
                    </div>
                </div>
            </>
            }
        </div>
    )
}

export default New