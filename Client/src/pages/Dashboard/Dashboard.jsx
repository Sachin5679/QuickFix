import Nav from "../../Layouts/Nav"
import Main from "./Components/Main"
import styles from "./Dashboard.module.css"

function Dashboard() {

    function handleLogoBtn(){

    }

    function handleProfileBtn(){

    }

    return (
        <>
            <Nav>
                <div className={styles.container}>
                    <img className={styles.logo} src="logo.png" alt="Logo" onClick={handleLogoBtn} />
                    <img className={styles.profile} src="profile.png" alt="Profile" onClick={handleProfileBtn}/>
                </div>
            </Nav>

            <Main />
        </>
    )
}

export default Dashboard