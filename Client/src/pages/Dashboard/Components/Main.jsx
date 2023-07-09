
import { createContext, useState } from 'react'
import styles from '../Styles/Main.module.css'
import Complaints from './Complaints'
import Filter from './Filter'

export let compContext = createContext()

function Main(){
    let [compControl , setCompControl] = useState({
        carpentry : true,
        electrical : true,
        plumbing : true,
        bh1 : false,
        bh2 : false,
        bh3 : false,
        gh : false,
        new : true,
        accepted : true,
        rejected : true,
        done : true,
        closed : true,
        typ : 'common',
        ord : 'newest'
    })

    return (
        <compContext.Provider value={{compControl , setCompControl}}>
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Filter/>
                </div>

                <div className={styles.complaints}>
                    <Complaints/>
                </div>
            </div>
        </compContext.Provider>
    )
}

export default Main