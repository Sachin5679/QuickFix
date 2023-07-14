
import { useContext, useEffect } from 'react'
import styles from '../Styles/Filter.module.css'
import { compContext } from './Main'
import { userContext } from '../dashboard'

function Filter(){

    let {compControl , setCompControl} = useContext(compContext)
    let {user} = useContext(userContext)

    function handleChange(e){
        let {name} = e.target

        setCompControl({
            ...compControl,
            [name] : !compControl[name]
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.typ}>
                <h1>Category</h1>

                <div className={styles.options}>
                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.carpentry} type="checkbox" name="carpentry" id="carpentry" />
                        <label htmlFor="carpentry">Carpentry</label>
                    </div>

                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.electrical} type="checkbox" name="electrical" id="electrical" />
                        <label htmlFor="electrical">Electrical</label>
                    </div>

                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.plumbing} type="checkbox" name="plumbing" id="plumbing" />
                        <label htmlFor="plumbing">Plumbing</label>
                    </div>
                </div>
            </div>

            <div className={styles.typ}>
                <h1>Location</h1>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <input disabled={compControl.bh1==false} onChange={()=>null} checked={compControl.bh1} type="checkbox" name="bh1" id="bh1" />
                        <label htmlFor="bh1">BH 1</label>
                    </div>

                    <div className={styles.option}>
                        <input disabled={compControl.bh2==false} onChange={()=>null} checked={compControl.bh2} type="checkbox" name="bh2" id="bh2" />
                        <label htmlFor="bh2">BH 2</label>
                    </div>

                    <div className={styles.option}>
                        <input disabled={compControl.bh3==false} onChange={()=>null} checked={compControl.bh3} type="checkbox" name="bh3" id="bh3" />
                        <label htmlFor="bh3">BH 3</label>
                    </div>

                    <div className={styles.option}>
                        <input disabled={compControl.gh==false} onChange={()=>null} checked={compControl.gh} type="checkbox" name="gh" id="gh" />
                        <label htmlFor="gh">GH</label>
                    </div>
                </div>
            </div>

            <div className={styles.typ}>
                <h1>State</h1>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.new} type="checkbox" name="new" id="new" />
                        <label htmlFor="new">New</label>
                    </div>

                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.accepted} type="checkbox" name="accepted" id="accepted" />
                        <label htmlFor="accepted">Accepted</label>
                    </div>

                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.rejected} type="checkbox" name="rejected" id="rejected" />
                        <label htmlFor="rejected">Rejected</label>
                    </div>

                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.done} type="checkbox" name="done" id="done" />
                        <label htmlFor="done">Done</label>
                    </div>

                    <div className={styles.option}>
                        <input onChange={handleChange} checked={compControl.closed} type="checkbox" name="closed" id="closed" />
                        <label htmlFor="closed">Closed</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter