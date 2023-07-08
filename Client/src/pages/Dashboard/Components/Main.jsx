
import styles from '../Styles/Main.module.css'
import Complaints from './Complaints'
import Filter from './Filter'

function Main(){
    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <Filter/>
            </div>

            <div className={styles.complaints}>
                <Complaints/>
            </div>
        </div>
    )
}

export default Main