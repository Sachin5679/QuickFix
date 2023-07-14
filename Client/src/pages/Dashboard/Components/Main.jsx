
import { createContext, useContext, useState } from 'react'
import styles from '../Styles/Main.module.css'
import Complaints from './Complaints'
import Filter from './Filter'
import { userContext } from '../dashboard'

export let compContext = createContext()

function Main(){
    let {user} = useContext(userContext)
    let [compControl , setCompControl] = useState({
        carpentry : true,
        electrical : true,
        plumbing : true,
        bh1 : user.hostel=='bh1' ? true : false,
        bh2 : user.hostel=='bh2' ? true : false,
        bh3 : user.hostel=='bh3' ? true : false,
        gh : user.hostel=='gh' ? true : false,
        new : true,
        accepted : true,
        rejected : true,
        done : true,
        closed : false,
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