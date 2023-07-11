
import styles from '../Styles/Profile.module.css'

function Profile(){
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Manage Profile</h1>
            <div className={styles.box}>
                <div className={styles.hostelRoom}>
                    <select name={styles.hostel}>
                        <option value="bh1">BH1</option>
                        <option value="bh2">BH2</option>
                        <option value="bh3">BH3</option>
                    </select>
                    <input type="number" name="room" placeholder='Room'/>
                </div>
                <button className={styles.update}>Update</button>
                <button className={styles.logout}>Logout</button>
            </div>
        </div>
    )
}

export default Profile