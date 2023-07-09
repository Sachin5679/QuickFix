

import { useState } from 'react'
import styles from '../Styles/Complaints.module.css'
import Comp from './Comp'

function Complaints(){
    let [type , setType] = useState(0)

    function handleType(e){
        let ele = e.target.closest('button')
        setType(ele.name)
    }

    return (
        <div className={styles.container}>
            <div className={styles.type}>
                <button onClick={handleType} className={type==0 ? styles.active : ''} name='0'><span>Common Complaints</span></button>
                <button onClick={handleType} className={type==1 ? styles.active : ''} name='1'><span>My Complaints</span></button>
            </div>

            <div className={styles.btns}>
                <button className={styles.new}><img src="../public/new.png" alt="new" />New Complaint</button>
                <select className={styles.sort} name="sort">
                    <option value="newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                </select>
            </div>

            <div className={styles.compContainer}>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
                <Comp/>
            </div>
        </div>
    )
}

export default Complaints