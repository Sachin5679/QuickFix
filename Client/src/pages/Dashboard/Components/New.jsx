
import styles from '../Styles/New.module.css'

function New(){
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Register Complaint</h1>
            <div className={styles.container2}>
                <div className={styles.selectionContainer}>
                    <div className={styles.group}>
                        <label htmlFor="cat">Category</label>
                        <select name="category" id="cat">
                            <option value="carpentry">Carpentry</option>
                            <option value="electrical">Electrical</option>
                            <option value="plumbing">Plumbing</option>
                        </select>
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="obj">Object</label>
                        <select name="object" id="obj">
                            {/* Make a list */}
                        </select>
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="loc">Location</label>
                        <select name="location" id="loc">
                            <option value="bh1">BH1</option>
                            <option value="bh2">BH2</option>
                            <option value="bh3">BH3</option>
                            <option value="gh">GH</option>
                        </select>
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="room">Room</label>
                        <input type="number" name="room" id="room" />
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <input className={styles.title} type="text" placeholder="Title"/>
                    <textarea className={styles.desc} name="desc" rows="8" placeholder="Description"></textarea>
                    <div className={styles.type}>
                        <h2>Type</h2>
                        <div className={styles.personal}>
                            <input type="radio" name="type" id="personal" />
                            <label htmlFor="personal">Personal</label>
                        </div>
                        <div className={styles.common}>
                            <input type="radio" name="type" id="common" />
                            <label htmlFor="common">Common</label>
                        </div>
                    </div>
                    <input className={styles.pass} type="password" name="password" id="pass" placeholder="Password"/>
                    <button className={styles.submit} >Submit</button>
                </div>

                <div className={styles.imgContainer}>
                    <div className={styles.displayImg}>
                        <img src="/uimg.png" alt="Upload Image" />
                    </div>
                    <button>Upload Image</button>
                </div>
            </div>
        </div>
    )
}

export default New