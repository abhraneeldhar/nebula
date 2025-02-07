"use server"
import { ArrowBigLeft, ArrowLeft, Monitor, PersonStanding, User } from "lucide-react";
import styles from "./settings.module.css"

export default async function Settings() {

    return (<>
        <div className={styles.main}>

            <a href="/home">
                <ArrowLeft className={styles.back} />
            </a>


            <div className={styles.managePref}>
                <h1>Customize Your Experience
                </h1>
                <p>Select a category to manage your preferences</p>
            </div>



            <div className={styles.cardHolder}>
                <a href="/settings/account">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span>Personal</span>
                            <User />
                        </div>
                        <h1>Account</h1>
                        <p>Customize Your Experience
                            Select a category to manage your preferences</p>
                    </div>
                </a>
            

            <a href="/settings/display">
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span>Appearance</span>
                        <Monitor />
                    </div>
                    <h1>Display</h1>
                    <p>Customize your viewing experience</p>
                </div>
            </a>

        </div>
    </div >
    </>)
}