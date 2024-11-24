"use client"
import styles from "./setupAccount.module.css"
import Image from "next/image"
import image1 from "./assets/image1.jpeg"
import image2 from "./assets/image2.jpeg"
import image3 from "./assets/image3.jpeg"
import image4 from "./assets/image4.jpeg"
import image5 from "./assets/image5.jpeg"
import appLogo from "./assets/appLogo.png"
import pfp from "./assets/meow.jpg"

import { Input } from "@/components/ui/input"
import { Button } from "@radix-ui/themes"
import { X, User, AtSign } from "lucide-react"



export default function SetupAccount() {
    return (<>
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <h1>Connect with <b>NEBULA</b></h1>
                    <Image src={image1} alt="you got dogshit internet buddy" />
                    <Image src={image2} alt="you got dogshit internet buddy" />
                    <Image src={image3} alt="you got dogshit internet buddy" />
                    <Image src={image4} alt="you got dogshit internet buddy" />
                    <Image src={image5} alt="you got dogshit internet buddy" />
                </div>
                <div className={styles.configureContainer}>
                    <div className={styles.appLogo}>
                        <Image src={appLogo} alt="Nebula" />
                        X
                        <Image src={pfp} alt="pfp" />
                    </div>


                    <form onSubmit={(e) => {
                        e.preventDefault();
                        console.log("submitted");
                    }} className={styles.formContainer}>

                        <label htmlFor="name"><User />Name</label>
                        <input name="name" type="text" placeholder="name" />

                        <label htmlFor="username"><AtSign />Username</label>
                        <input name="username" type="text" placeholder="username" />

                        <Button type="submit">Configure</Button>
                    </form>

                </div>
            </div>
        </div></>)
}