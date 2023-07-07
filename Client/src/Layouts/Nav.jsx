
import styles from './Styles/Nav.module.css'

function Nav(props){
    return (
        <nav className={styles.nav}>
            {props.children}
        </nav>
    )
}

export default Nav