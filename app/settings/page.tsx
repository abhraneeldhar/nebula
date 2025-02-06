"use server"
import { ArrowBigLeft, ArrowLeft, Monitor, PersonStanding, User } from "lucide-react";
import styles from "./settings.module.css"

export default async function Settings() {

    return (<>
        <div className={styles.main}>

            <ArrowLeft className={styles.back} />


            <div className={styles.managePref}>
                <h1>Customize Your Experience
                </h1>
                <p>Select a category to manage your preferences</p>
            </div>

            <div className={styles.cardHolder}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span>Personal</span>
                        <User />
                    </div>
                    <h1>Account</h1>
                    <p>Customize Your Experience
                        Select a category to manage your preferences</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span>Appearance</span>
                        <Monitor />
                    </div>
                    <h1>Display</h1>
                    <p>Customize your viewing experience</p>
                </div>
            </div>


        </div>
    </>)
}