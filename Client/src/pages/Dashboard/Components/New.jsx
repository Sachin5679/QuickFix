
import { useContext, useEffect, useRef, useState } from 'react'
import styles from '../Styles/New.module.css'
import ClipLoader from "react-spinners/ClipLoader";
import { userContext } from '../dashboard.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { domainContext } from '../../../App';

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

let commonElectricalObjects = [
    "water cooler",
    "geaser",
    "bathroom tubelight",
    "bathroom switchboard",
    "bathroom exhaut fan"
]

let commonCarpentryObjects = [
    "bathroom door"
]

let commonPlumbingObjects = [
    'toilet seat',
    'flush',
    'tap',
    'urinal',
    'shower',
    'basin'
]

let possibleObjectId = [
    "GroundFloor",
    "Floor 1",
    "Floor 2",
    "Floor 3",
    "Toilet 1",
    "Toilet 2",
    "Toilet 3",
    "Toilet 4",
    "Toilet 5",
    "Toilet 6",
    "Toilet 7",
    "Toilet 8",
    "Toilet 9",
    "Toilet 10",
    "Toilet 11",
    "Toilet 12",
    "Toilet 13",
    "Toilet 14",
    "Toilet 15",
    "Toilet 16",
    "Toilet 17",
    "Toilet 18",
    "Toilet 19",
    "Toilet 20",
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
    let {domain} = useContext(domainContext)
    let {user , setUser} = useContext(userContext)
    let navigate = useNavigate()
    let inputref = useRef()
    let [image , setImage] = useState(null)

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

        axios.post(`${domain}/complaint/${regControl.type}` , reqBody , {headers})
            .then(function(res){
                toast.success("Complaint Submitted Successfully")
                uploadImage(res.data.id)
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

    function uploadImage(id){
        if (image == null)
        {
            setLoading(0)
            navigate('/dashboard')
            return
        }

        let formData = new FormData()
        formData.append('file' , image)

        let headers = {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "multipart/form-data"
        }

        axios.post(`${domain}/image/${id}` , formData , {headers})
            .then(function(res){
                setLoading(0)
                toast.success("Image Uploaded")
                navigate('/dashboard')
            })
            .catch(function(err){
                setLoading(0)
                toast.error("Image upload failed")
            })
    }

    function handleClickUploadImage(){
        inputref.current.click()
    }

    function handleFileChange(e){
        if(e.target.files[0])
            setImage(e.target.files[0])
    }

    function modifyObjectList(){
        if (regControl.type=='common' && regControl.cat=='carpentry')  setObjectList(commonCarpentryObjects)
        else if (regControl.type=='common' && regControl.cat=='electrical')  setObjectList(commonElectricalObjects)
        else if (regControl.type=='common' && regControl.cat=='plumbing')  setObjectList(commonPlumbingObjects)
        else if (regControl.type=='personal' && regControl.cat=='carpentry')  setObjectList(personalCarpentryObjects)
        else if (regControl.type=='personal' && regControl.cat=='electrical')  setObjectList(personalElectrcalObjects)
    }

    function handleBack(){
        navigate("/dashboard")
    }

    useEffect(function(){
        if (loading==1)
            setEnabled(0)
        else
            enableSubmitBtn()
    } , [loading])

    useEffect(function(){
        if (objectList != null)
        {
            setRegControl({
                ...regControl,
                obj : objectList[0]
            })
        }
    } , [objectList])

    useEffect(function(){
        enableSubmitBtn()
    } , [regControl])

    useEffect(function(){
        if (user != null)
        {
            if (regControl.type=='personal'){
                setRegControl({
                    ...regControl,
                    loc : user.hostel,
                    objId : user.room
                })
            }
            else
            {
                setRegControl({
                    ...regControl,
                    loc : user.hostel,
                })
            }
            
        }
    } , [regControl.type , user])

    useEffect(function(){
        modifyObjectList()
    } , [regControl.cat , regControl.type])

    useEffect(function(){
        if (regControl.type == 'personal' && regControl.cat == 'plumbing')
        {
            setRegControl({
                ...regControl,
                cat : 'carpentry'
            })
        }

        if (regControl.type == 'common')
        {
            setRegControl({
                ...regControl,
                objId : possibleObjectId[0]
            })
        }
    } , [regControl.type])

    return (
        <div className={styles.container}>
            {user==null ? <ClipLoader color='#425FC6' loading={true} size={45}/>
            :
            <>
                <h1 className={styles.heading}>Register Complaint</h1>
                <button onClick={handleBack}>Back to complaints</button>
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
                            <select disabled={1} value={regControl.loc} onChange={handleChange}  name="loc" id="loc">
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
                                    return <option key={i} value={i}>{i}</option>
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
                        <div onClick={handleClickUploadImage} className={styles.displayImg}>
                            {image==null ? 
                            <img src="/uimg.png" alt="Upload Image" />
                            :
                            <img src={URL.createObjectURL(image)} alt="Upload Image" style={{width : '100%' , height : '100%'}} />
                            }
                        </div>
                        <input type="file" name="image" accept="image/*" onChange={handleFileChange} ref={inputref} style={{display : 'none'}}/>
                        <button onClick={handleClickUploadImage}>Upload Image</button>
                    </div>
                </div>
            </>
            }
        </div>
    )
}

export default New