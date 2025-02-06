"use client"

import styles from "./settings.module.css"
import Image from "next/image"
import pfp from "../../../public/pfp.jpeg"
import banner from "../../../public/banner.jpg"
import { Input } from "@/components/ui/input"

import { ArrowLeft } from "lucide-react"
import { appStore } from "@/app/store"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail"


export default function AccountsPage() {

    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                // setShowLoadingPage(true);
                console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res)
                // console.log("fetched user details via email: ", res)
                setUserId(res.userId)
                // setShowLoadingPage(false);
            }
            fetchingUserDetails();
        }
    }, [session])



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
                        <Input defaultValue={userDetails?.name} />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Username</h1>
                        <Input defaultValue={userDetails?.userName} />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Bio</h1>
                        <textarea defaultValue={userDetails?.bio} />
                    </div>
                </div>



            </div>
        </div></>)
}