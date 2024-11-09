"use client"
import styles from "./bedrock.module.css";
import { ReactNode, useState } from "react";
import { appStore } from "../store";
import Image from "next/image";

import closeSVG from "../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

import coverImage from "./assetImages/coverimage.png"
import profilePic from "./assetImages/profilePic.jpg"

import WeathersTab from "./weathersTab/weatherstab";


export default function Bedrock() {
    const sidebarShow = appStore((state) => state.showSidebar)
    const toggleSidebar = appStore((state) => state.toggleSidebar)


    const Tab = ({ tabName }: { tabName: string }): ReactNode => {
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={sidebarShow ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => toggleSidebar()} />
                </div>
                <p>{tabName}</p>
            </div>
        </>)
    }


    return (<>
        <div className={styles.main}>
            <Tab tabName="Home" />

            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        <Image src={profilePic} alt="profilePic" />
                    </div>
                </div>
                
                <WeathersTab/>                                

            </div>
        </div>
    </>
    )
}