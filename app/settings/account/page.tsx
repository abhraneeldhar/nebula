"use client"

import styles from "./settings.module.css"
import Image from "next/image"
import pfp from "../../../public/pfp.jpeg"
import banner from "../../../public/banner.jpg"
import { Input } from "@/components/ui/input"

import { ArrowLeft } from "lucide-react"


export default function AccountsPage() {
    return (<>
        <div className={styles.main}>
            <div className={styles.tab}>
                <a href="/settings">
                    <div className={styles.tabNameDiv}>
                        <ArrowLeft />
                        <h1>Back to settings</h1>
                    </div>
                </a>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.photosSection}>
                    <Image className={styles.banner} src={banner} alt="" />
                    <Image className={styles.pfp} src={pfp} alt="" />
                </div>

                <div className={styles.detailsHolder}>
                    <div className={styles.detailCard}>
                        <h1>Name</h1>
                        <Input placeholder="meow" />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Username</h1>
                        <Input placeholder="meow" />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Bio</h1>
                        <textarea placeholder="meoeoewmeow" />
                    </div>
                </div>



            </div>
        </div></>)
}