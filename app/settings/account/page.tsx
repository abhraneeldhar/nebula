"use client"

import styles from "./settings.module.css"
import Image from "next/image"
import pfp from "../../../public/pfp.jpeg"
import banner from "../../../public/banner.jpg"
import { Input } from "@/components/ui/input"


export default function AccountsPage(){
    return(<>
    <div className={styles.main}>
        <div className={styles.tab}></div>
        <div className={styles.mainContent}>
            <div className={styles.photosSection}>
                <Image src={banner} alt=""/>
                <Image src={pfp} alt=""/>
            </div>

            <div className={styles.detailsHolder}>
                <div className={styles.detailCard}>
                    <h1>Name</h1>
                    <Input placeholder="meow"/>
                </div>
            </div>



        </div>
    </div></>)
}