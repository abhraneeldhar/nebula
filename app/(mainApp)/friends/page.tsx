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
import { Button, Skeleton } from "@radix-ui/themes";
import { X } from "lucide-react";
import { getUserDetails } from "@/app/utils/getUserDetails";

export default function FriendsPage() {
    const { toggleSidebar, open } = useSidebar();

    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();

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



    const [searchedFriendsList, setSearchedFriendsList] = useState<userType[] | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFriendSearch = async (searchParam: string) => {
        if (userDetails && searchParam != "" && searchParam != " ") {
            console.log("searchin for ", searchParam)
            const friendList = await FriendSearch(userDetails.userId, searchParam);
            // console.log("friens searched result: ", friendList)
            setSearchedFriendsList(friendList as userType[]);
        }
        else {
            setSearchedFriendsList(null);
        }
    }

    const [currentFriends, setCurrentFriends] = useState<userType[] | null>(null)

    useEffect(() => {
        if (userDetails) {
            const getFriends = async () => {
                var tempFriendList: userType[] = []

                userDetails?.friendList.forEach((friendId) => {
                    const asyncFunc = async () => {
                        // console.log("getting deatil for ", friendId)
                        const newUserDetails = await getUserDetails(friendId);
                        tempFriendList.push(newUserDetails)
                    }
                    asyncFunc()
                })
                setCurrentFriends(tempFriendList);
                setSearchedFriendsList(null);
            }
            getFriends();
        }
    }, [userDetails])

    useEffect(() => {
        console.log("friendslsit: ", currentFriends)
    }, [currentFriends])

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
                        <Button className={styles.clearSearchBtn} onClick={() => {
                            if (inputRef.current) {
                                inputRef.current.value = ""
                            }
                            setSearchedFriendsList(null)
                        }
                        }><X /></Button>
                    </div>
                </div>


                <div className={styles.friendsContainer}>

                    {!searchedFriendsList && currentFriends &&
                        (currentFriends.map((friendDetails) => (
                            <div key={friendDetails.userId} className={styles.currentFriendsCard}>
                                <Image className={styles.friendAvatar} src={friendDetails.imageUrl} alt="" height={60} width={60} />
                                <div className={styles.friendDetails}>
                                    <h1 className={styles.friendName}>{friendDetails.name}</h1>
                                    <p className={styles.friendUsername}>@{friendDetails.userName}</p>
                                </div>
                            </div>
                        ))
                        )
                    }


                    {searchedFriendsList && searchedFriendsList.map((friendDetails: userType) => (
                        <div key={friendDetails.userId} className={styles.currentFriendsCard}>
                            <Image className={styles.friendAvatar} src={friendDetails.imageUrl} alt="" height={60} width={60} />
                            <div className={styles.friendDetails}>
                                <h1 className={styles.friendName}>{friendDetails.name}</h1>
                                <p className={styles.friendUsername}>@{friendDetails.userName}</p>
                            </div>
                        </div>
                    ))}

                    {/* {!searchedFriendsList && !currentFriends && (
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    )} */}

                </div>
            </div>
        </div>
    </>)
}