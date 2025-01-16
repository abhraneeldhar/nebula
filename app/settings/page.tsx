"use client"
import styles from "./settings.module.css"
import { ArrowBigLeft, ArrowBigRight, ArrowRight, PaintBucket } from "lucide-react"
import { UserRound } from "lucide-react"

import { useRouter } from "next/navigation"
export default function Settings() {
    const router=useRouter()

    return (<>
        <div className={styles.main}>

            <div className={styles.tab}>
                <div className={styles.back} onClick={()=>{router.back()}}>
                    <ArrowBigLeft />
                </div>
                <div className={styles.settingsHeader}>Settings</div>
            </div>

            <div className={styles.optionsHolder}>

                <div className={styles.option} onClick={(e)=>{e.stopPropagation;
                    router.push("/settings/account")
                }}>
                    <div className={styles.optionleft}>
                        <div className={styles.optionHeader}>
                            <UserRound /> <h2>Account</h2>
                        </div>
                        <p>Configure your account</p>
                    </div>
                    <div className={styles.optionright}>
                        <ArrowRight/>
                    </div>
                </div>

                <div className={styles.option} onClick={(e)=>{e.stopPropagation;
                    router.push("/settings/display")
                }}>
                    <div className={styles.optionleft}>
                        <div className={styles.optionHeader}>
                            <PaintBucket/> <h2>Display</h2>
                        </div>
                        <p>Configure how nebula looks</p>
                    </div>
                    <div className={styles.optionright}>
                        <ArrowRight/>
                    </div>
                </div>

            </div>
        </div>
    </>)
}