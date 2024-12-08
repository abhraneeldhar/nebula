import styles from "./settings.module.css"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button, TextArea } from "@radix-ui/themes"


export default function Settings() {
    return (<>
        <div className={styles.main}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarOption}>Profile</div>
                <div className={styles.sidebarOption}>Display</div>
                <div className={styles.sidebarOption}>Account</div>
                <div className={`${styles.sidebarOption} ${styles.redOption}`}>Log Out</div>
                {/* <div className={styles.sidebarOption}>Sidebar Option</div> */}
            </div>
            <div className={styles.mainContent}>
                <div className={styles.profilePicture}>
                    <h1>Profile Picture</h1>
                    <div className={styles.picBox}>
                        <Image src={"/meow.jpg"} height={100} width={100} alt="userPic" />
                        <button className={styles.changePic}>Change Picture</button>
                        <button className={styles.removePic}>Remove Picture</button>
                    </div>
                </div>

                <div className={styles.profileDetails}>
                    <h1>Profile Name</h1>
                    <Input placeholder="your name" />
                    <h1>Username</h1>
                    <Input placeholder="username" />
                    <h1>About</h1>
                    <textarea placeholder="your bio" />
                </div>
                
            </div>
            <div className={styles.footer}>
                    <div className={styles.actionButtons}>
                        <Button className={styles.saveBtn}>Save</Button>
                        <Button className={styles.resetBtn}>Reset</Button>
                    </div>
                </div>

        </div>
    </>)
}