
import styles from '../Styles/Comp.module.css'

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function Comp(props) {
    let data = props.data

    let color = null
    if (data.state == 'new') color = '#D9D9D9'
    if (data.state == 'accepted') color = '#425FC6'
    if (data.state == 'rejected') color = '#C31919'
    if (data.state == 'done') color = '#19C37D'
    if (data.state == 'closed') color = '#741369'

    let date = new Date(data.created)
    let dateStr = ""

    let iDate = date.getDate()
    let iMonth = date.getMonth() + 1
    let iYear = String(date.getFullYear())
    let iHour = date.getHours()
    let iMinute = date.getMinutes()

    if (iDate < 10) iDate = '0' + String(iDate)
    if (iMonth < 10) iMonth = '0' + String(iMonth)
    if (iHour < 10) iHour = '0' + String(iHour)
    if (iMinute < 10) iMinute = '0' + String(iMinute)

    dateStr = iHour + ':' + iMinute + ' | ' + iDate + '-' + iMonth + '-' + iYear

    function handleClick() {
        let popupData = {
            id : data.id,
            userId : data.student.id,
            created: dateStr,
            title: toTitleCase(data.title),
            name : toTitleCase(data.student.name),
            desc : capitalizeFirstLetter(data.description),
            object : capitalizeFirstLetter(data.object),
            location : data.location.toUpperCase(),
            objectId : data.objectId,
            category : capitalizeFirstLetter(data.category),
            type : capitalizeFirstLetter(data.type),
            imgName : data.image==null ? null : data.image.name,
            imgLink : data.image==null ? null : data.image.url,
            state : capitalizeFirstLetter(data.state),
            reason : data.rejectReason==null ? null : capitalizeFirstLetter(data.rejectReason.reason)
        }
        props.popFunc(popupData)
    }

    return (
        <>
            <div onClick={handleClick} className={styles.comp}>
                <div style={{ backgroundColor: color }} className={styles.state}></div>
                <div className={styles.titleDesc}>
                    <h1 className={styles.title}>{toTitleCase(data.title)}</h1>
                    <p className={styles.desc}>{capitalizeFirstLetter(data.description)}</p>
                </div>
                <div className={styles.dateName}>
                    <p className={styles.date}>{dateStr}</p>
                    <p className={styles.name}>{data.student.name}</p>
                </div>
            </div>
        </>
    )
}

export default Comp