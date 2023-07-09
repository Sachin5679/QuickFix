
import styles from '../Styles/Comp.module.css'

function Comp(props){
    let color = null
    if (props.state == 'new')  color = '#D9D9D9'
    if (props.state == 'accepted')  color = '#425FC6'
    if (props.state == 'rejected')  color = '#C31919'
    if (props.state == 'done')  color = '#19C37D'
    if (props.state == 'closed') color = '#741369'

    let date = new Date(props.dte)
    let dateStr = ""

    let iDate = date.getDate()
    let iMonth = date.getMonth()
    let iYear = String(date.getFullYear())

    if (iDate < 10)  iDate = '0' + String(iDate)
    if (iMonth < 10)  iMonth = '0' + String(iMonth)
    
    dateStr = iDate + '-' + iMonth + '-' + iYear

    return(
        <div className={styles.comp}>
            <div style={{backgroundColor : color}} className={styles.state}></div>
            <div className={styles.titleDesc}>
                <h1 className={styles.title}>{props.title}</h1>
                <p className={styles.desc}>{props.desc}</p>
            </div>
            <div className={styles.dateName}>
                <p className={styles.date}>{dateStr}</p>
                <p className={styles.name}>{props.nme}</p>
            </div>
        </div>
    )
}

export default Comp