"use client"
import Image from "next/image";
import styles from "./friends.module.css";


// import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { appStore } from "@/app/store";
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail";
import { Input } from "@/components/ui/input";
import { DisplayNote, userType } from "@/app/utils/fileFormat";
import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import { FriendSearch } from "@/app/utils/friendMechanics/friendSearch";
import { Button } from "@radix-ui/themes";
import { X } from "lucide-react";

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

    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)

    useEffect(() => {
        if (localCollectionOfNotesState == null && userDetails != null) {
            const asyncDisplayNotes = async () => {
                const res = await getDisplayNotes(userDetails.userId)
                setlocalCollectionOfNotesState(res);
            }
            asyncDisplayNotes();
        }
    }, [userDetails])



    const [searchedFriendsList, setSearchedFriendsList] = useState<any>();
    const inputRef=useRef<HTMLInputElement>(null);
    const handleFriendSearch = async (searchParam: string) => {
        if (userDetails && searchParam != "" && searchParam != " ") {
            console.log("searchin for ", searchParam)
            const friendList = await FriendSearch(userDetails.userId, searchParam);
            // console.log("friens searched result: ", friendList)
            setSearchedFriendsList(friendList);
        }
        else {
            setSearchedFriendsList(null);
        }

    }

    return (<>
        <div className={styles.main}>
            <div className={styles.tab}>
                <div className={styles.sidebarBtn}>
                    <Image src={menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar();
                    }} />
                </div>
                <p>Friends</p>
            </div>

            <div className={styles.mainContents}>
                <div className={styles.addContainer}>
                    <div className={styles.searchBar}>
                        <Input ref={inputRef} className={styles.searchInput} placeholder="username...." onChange={(e) => {
                            handleFriendSearch(e.target.value);
                        }} />
                        <Button className={styles.clearSearchBtn} onClick={()=>{
                            if(inputRef.current){
                                inputRef.current.value=""
                            }
                            setSearchedFriendsList(null)}
                            }><X/></Button>
                    </div>
                </div>


                <div className={styles.friendsContainer}>

                    {searchedFriendsList && searchedFriendsList.map((friendDetails: userType) => (
                        <div key={friendDetails.userId} className={styles.currentFriendsCard}>
                            <Image className={styles.friendAvatar} src={friendDetails.imageUrl} alt="" height={60} width={60} />
                            <div className={styles.friendDetails}>
                                <h1 className={styles.friendName}>{friendDetails.name}</h1>
                                <p className={styles.friendUsername}>@{friendDetails.userName}</p>
                            </div>
                        </div>
                    ))}


                    {!searchedFriendsList &&
                        (<>
                            <div className={styles.currentFriendsCard}>
                                <Image className={styles.friendAvatar} src="/testingImages/grizzy.jpg" alt="" height={60} width={60} />
                                <div className={styles.friendDetails}>
                                    <h1 className={styles.friendName}>Abhraneel Dhar</h1>
                                    <p className={styles.friendUsername}>@username</p>
                                </div>
                            </div>
                            <div className={styles.currentFriendsCard}>
                                <Image className={styles.friendAvatar} src="/testingImages/grizzy.jpg" alt="" height={60} width={60} />
                                <div className={styles.friendDetails}>
                                    <h1 className={styles.friendName}>Abhraneel Dhar</h1>
                                    <p className={styles.friendUsername}>@username</p>
                                </div>
                            </div>
                            <div className={styles.currentFriendsCard}>
                                <Image className={styles.friendAvatar} src="/testingImages/grizzy.jpg" alt="" height={60} width={60} />
                                <div className={styles.friendDetails}>
                                    <h1 className={styles.friendName}>Abhraneel Dhar</h1>
                                    <p className={styles.friendUsername}>@username</p>
                                </div>
                            </div></>)
                    }
                </div>
            </div>
        </div>
    </>)
}