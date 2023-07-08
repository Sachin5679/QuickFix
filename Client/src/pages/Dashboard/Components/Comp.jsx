
import styles from '../Styles/Comp.module.css'

function Comp(){
    return(
        <div className={styles.comp}>
            <div className={styles.state}></div>
            <div className={styles.titleDesc}>
                <h1 className={styles.title}>Title</h1>
                <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, deserunt.</p>
            </div>
            <div className={styles.dateName}>
                <p className={styles.date}>Date</p>
                <p className={styles.name}>Name</p>
            </div>
        </div>
    )
}

export default Comp