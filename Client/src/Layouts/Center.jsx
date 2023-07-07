import styles from './Styles/Center.module.css'

function Center(props){
    return (
        <section className={styles.center}>
            {props.children}
        </section>
    )
}

export default Center