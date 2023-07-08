
import styles from '../Styles/Filter.module.css'

function Filter(){
    return (
        <div className={styles.container}>
            <div className={styles.typ}>
                <h1>Category</h1>

                <div className={styles.options}>
                    <div className={styles.option}>
                        <input type="checkbox" name="caprpentry" id="caprpentry" />
                        <label htmlFor="caprpentry">Carpentry</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="electrical" id="electrical" />
                        <label htmlFor="electrical">Electrical</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="plumbing" id="plumbing" />
                        <label htmlFor="plumbing">plumbing</label>
                    </div>
                </div>
            </div>

            <div className={styles.typ}>
                <h1>Location</h1>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <input type="checkbox" name="bh1" id="bh1" />
                        <label htmlFor="bh1">Boys Hostel 1</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="bh2" id="bh2" />
                        <label htmlFor="bh2">Boys Hostel 2</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="bh3" id="bh3" />
                        <label htmlFor="bh3">Boys Hostel 3</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="gh" id="gh" />
                        <label htmlFor="gh">Girls Hostel</label>
                    </div>
                </div>
            </div>

            <div className={styles.typ}>
                <h1>State</h1>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <input type="checkbox" name="new" id="new" />
                        <label htmlFor="new">New</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="accepted" id="accepted" />
                        <label htmlFor="accepted">Accepted</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="rejected" id="rejected" />
                        <label htmlFor="rejected">Rejected</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="done" id="done" />
                        <label htmlFor="done">Done</label>
                    </div>

                    <div className={styles.option}>
                        <input type="checkbox" name="closed" id="closed" />
                        <label htmlFor="closed">Closed</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter