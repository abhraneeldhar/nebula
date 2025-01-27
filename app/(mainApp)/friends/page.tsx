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
import { Button, Skeleton, Spinner } from "@radix-ui/themes";
import { X } from "lucide-react";
import { getUserDetails } from "@/app/utils/getUserDetails";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/app/utils/supabase/client";
import { updateFriendList } from "@/app/utils/friendMechanics/updateFriendList";



export default function FriendsPage() {
    const setShowLoadingPage = appStore((state) => state.setShowLoadingPage)
    const { toggleSidebar, open } = useSidebar();


    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                setShowLoadingPage(true);
                // console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res);
                setShowLoadingPage(false);
            }
            fetchingUserDetails();
        }
    }, [session])

    // getsdisplay notes
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


    const [showSkeleton, setShowSkeleton] = useState(false);

    // gets searched people
    const [searchedFriendsList, setSearchedFriendsList] = useState<userType[] | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFriendSearch = async (searchParam: string) => {
        if (userDetails && searchParam != "" && searchParam != " ") {
            setShowSkeleton(true);
            const friendList = await FriendSearch(userDetails.userId, searchParam);
            setSearchedFriendsList(friendList as userType[]);
            setShowSkeleton(false);
        }
        else {
            setSearchedFriendsList(null);
        }
    }

    // getting currentfriendlist
    const currentFriendList = appStore((state) => state.currentFriendList)
    const setCurrentFriendList = appStore((state) => state.setCurrentFriendList)
    useEffect(() => {
        if (userDetails && !currentFriendList) {
            const getFriends = async () => {
                setShowSkeleton(true);
                var tempFriendList: userType[] = []

                userDetails?.friendList.forEach((friendId) => {
                    const asyncFunc = async () => {
                        const newUserDetails = await getUserDetails(friendId);
                        tempFriendList.push(newUserDetails)
                    }
                    asyncFunc()
                })
                setCurrentFriendList(tempFriendList);
                setShowSkeleton(false)
            }
            getFriends();
        }

    }, [userDetails])


    const [friendPopoverOpen, setFriendPopoverOpen] = useState(false)
    const [friendDetailsPopover, setFriendDetailsPopover] = useState<userType | null>(null)
    const [friendPopoverAction, setFriendPopoverAction] = useState<"add" | "cancel" | "remove" | "accept/reject" | null>(null)

    useEffect(() => {
        if (friendPopoverOpen) {
            const getAction = async () => {
                // checking if already friends
                setFriendPopoverAction(null)
                if (friendDetailsPopover?.friendList.includes(userDetails?.userId as string)) {
                    console.log("action is remove")
                    setFriendPopoverAction("remove")
                    return 1;
                }

                // console.log("checking for outgoing")
                const { data: outgoing } = await supabase.from("friendRequest").select("*").eq("senderId", userDetails?.userId).eq("receiverId", friendDetailsPopover?.userId).eq("status", "pending");
                if (outgoing?.length) {
                    if (outgoing.length > 0) {
                        console.log("action is cancel")
                        setFriendPopoverAction("cancel");
                        return 1;
                    }
                }

                // console.log("checking for incoming")
                const { data: incoming, error } = await supabase.from("friendRequest").select("*").eq("senderId", friendDetailsPopover?.userId).eq("receiverId", userDetails?.userId).eq("status", "pending");
                if (incoming?.length) {
                    if (incoming.length > 0) {
                        console.log("action is accept/reject");
                        setFriendPopoverAction("accept/reject");
                        return 1;
                    }
                }

                if (!friendPopoverAction) {
                    console.log("action is add")
                    setFriendPopoverAction("add");
                }
            }
            getAction();
        }
    }, [friendPopoverOpen])

    return (<>
        <div className={styles.main}>
            <Dialog open={friendPopoverOpen} onOpenChange={(e) => {
                setFriendPopoverOpen(e);
                setFriendPopoverAction(null);
                setFriendDetailsPopover(null);

            }}>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogContent className="sm:max-w-[425px]">
                    <div className={styles.popoverMain}>
                        <div className={styles.popoverProfilePic}>
                            {friendDetailsPopover?.imageUrl &&
                                <Image unoptimized alt="" src={friendDetailsPopover.imageUrl} height={60} width={60} />
                            }
                        </div>
                        <div className={styles.popoverFriendDetails}>
                            <h2>{friendDetailsPopover?.name}</h2>
                            <h3>@{friendDetailsPopover?.userName}</h3>
                            <p>{friendDetailsPopover?.bio}</p>
                        </div>
                    </div>
                    <div className={styles.popoverFriendAction}>
                        {!friendPopoverAction && <>loading</>}
                        {friendPopoverAction == "add" &&
                            <Button className={styles.popoverAddAction} onClick={() => {
                                const addAction = async () => {
                                    const { data, error } = await supabase
                                        .from('friendRequest')
                                        .insert({ senderId: userDetails?.userId, receiverId: friendDetailsPopover?.userId, status: "pending", createdAt: Date.now() })
                                        .select()

                                    console.log(data);
                                    console.log(error);
                                    setFriendPopoverAction("cancel")
                                }
                                addAction();
                            }}>Add</Button>}
                        {friendPopoverAction == "remove" &&
                            <Button className={styles.popoverRemoveAction} onClick={() => {
                                const removeAction = async () => {
                                    // setAction(null)
                                    let newUserDetails = userDetails
                                    var index = newUserDetails?.friendList.indexOf(friendDetailsPopover?.userId as string) as number;
                                    if (index > -1) {
                                        console.log("removing at ", index)
                                        newUserDetails?.friendList.splice(index, 1);
                                    }
                                    const res1 = await updateFriendList(userDetails?.userId as string, newUserDetails as userType)
                                    console.log(res1)

                                    newUserDetails = friendDetailsPopover as userType
                                    index = newUserDetails?.friendList.indexOf(userDetails?.userId as string) as number;
                                    if (index > -1) {
                                        console.log("removing at ", index)
                                        newUserDetails?.friendList.splice(index, 1);
                                    }
                                    const res2 = await updateFriendList(friendDetailsPopover?.userId as string, newUserDetails as userType)
                                    console.log(res2);
                                    setFriendPopoverAction("add");
                                }
                                removeAction();
                            }}>
                                Remove
                            </Button>}
                        {friendPopoverAction=="cancel" && <Button onClick={()=>{
                            const cancelAction = async () => {
                                const res = await supabase
                                    .from('friendRequest')
                                    .delete()
                                    .eq("senderId", userDetails?.userId).eq("receiverId", friendDetailsPopover?.userId).eq("status", "pending")
                                setFriendPopoverAction("add");
                            }
                            cancelAction();

                        }}>Cancel</Button>

                        }

                    </div>
                </DialogContent>
            </Dialog>

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

                    {!searchedFriendsList && currentFriendList && !showSkeleton &&
                        (currentFriendList.map((friendDetails) => (
                            <div key={friendDetails.userId} className={styles.currentFriendsCard} onClick={(e) => {
                                setFriendPopoverOpen(true);
                                setFriendDetailsPopover(friendDetails);
                            }}>
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
                        <div key={friendDetails.userId} className={styles.currentFriendsCard} onClick={(e) => {
                            setFriendPopoverOpen(true);
                            setFriendDetailsPopover(friendDetails);
                        }}>
                            <Image className={styles.friendAvatar} src={friendDetails.imageUrl} alt="" height={60} width={60} />
                            <div className={styles.friendDetails}>
                                <h1 className={styles.friendName}>{friendDetails.name}</h1>
                                <p className={styles.friendUsername}>@{friendDetails.userName}</p>
                            </div>
                        </div>
                    ))}

                    {showSkeleton && (
                        <div className={styles.friendsListSkeletonContainer}>
                            <div className={styles.friendsListSkeleton}>
                                <Skeleton className={styles.friendsAvatarSkeleton} />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                            <div className={styles.friendsListSkeleton}>
                                <Skeleton className={styles.friendsAvatarSkeleton} />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                            <div className={styles.friendsListSkeleton}>
                                <Skeleton className={styles.friendsAvatarSkeleton} />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    </>)
}