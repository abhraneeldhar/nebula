"use client"
import Image from "next/image";
import styles from "./friends.module.css";


// import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { appStore } from "@/app/store";
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail";
import { Input } from "@/components/ui/input";

export default function FriendsPage() {
    const { toggleSidebar, open } = useSidebar();

    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();
    // const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res)
                console.log("fetched user details via email: ", res)
                // setUserId(res.userId)
            }
            fetchingUserDetails();
        }
    }, [session])

    return (<>
        <div className={styles.main}>
            <div className={styles.tab}>
                <div className={styles.sidebarBtn}>
                    <Image src={menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar();
                    }
                    } />
                </div>
                <p>Friends</p>
            </div>

            <div className={styles.mainContents}>

                <div className={styles.addContainer}>
                    <div className={styles.searchBar}>
                        <Input className={styles.searchInput} placeholder="username...." onChange={(e) => {

                        }} />
                    </div>
                </div>
                <div className={styles.currentFriends}>
                    <div className={styles.currentFriendsCard}>
                        <Image className={styles.friendAvatar} src="/testingImages/grizzy.jpg" alt="" height={60} width={60} />
                        <div className={styles.friendDetails}>
                            <h1 className={styles.friendName}>Abhraneel Dhar</h1>
                            <p className={styles.friendUsername}>@username</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}