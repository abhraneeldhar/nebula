"use client"
import {  ArrowLeft, Monitor, User } from "lucide-react";
import styles from "./settings.module.css"
import { useRouter } from "next/navigation";
import Image from "next/image";
import accountSettingsImage from "../../public/settingsImages/accountSettingImage.jpg"
import displaySettingsImage from "../../public/settingsImages/displaySettingImage.jpeg"


export default function Settings() {
    const router = useRouter();


    return (<>
        <div className={styles.main}>
            <ArrowLeft className={styles.back} onClick={() => router.push("/home")} />

            <div className={styles.managePref}>
                <h1>Customize Your Experience
                </h1>
                <p>Select a category to manage your preferences</p>
            </div>

            
            <div className={styles.cardHolder}>
                <div className={styles.card} onClick={() => router.push("/settings/account")}>
                    <div className={styles.cardHeader}>
                        <span>Personal</span>
                        <User />
                    </div>
                    <h1>Account</h1>
                    <Image src={accountSettingsImage} alt=""/>
                    <p>Customize Your Experience
                        Select a category to manage your preferences</p>
                </div>



                <div className={styles.card} onClick={() => router.push("/settings/display")}>
                    <div className={styles.cardHeader}>
                        <span>Appearance</span>
                        <Monitor />
                    </div>
                    <h1>Display</h1>
                    <Image src={displaySettingsImage} alt=""/>
                    <p>Customize your viewing experience</p>
                </div>
            </div>
        </div >
    </>)
}