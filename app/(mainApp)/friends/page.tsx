"use client"
import { act, ChangeEvent, useEffect, useRef, useState } from "react"
import { supabase } from "@/app/utils/supabase/client";
import styles from "./friends.module.css"

import { Car, ChevronLeft } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { Clock } from "lucide-react";
import { CircleX } from "lucide-react";
import { Check } from "lucide-react";
import { X } from "lucide-react";

import { Spinner } from "@radix-ui/themes";

import { Button, Tabs } from "@radix-ui/themes";
import { Table } from "@radix-ui/themes";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FriendSearch } from "../../utils/friendMechanics/friendSearch";
import { getUserDetails } from "../../utils/getUserDetails";
import { fetchUserId } from "../../utils/fetchUserId";
// import { userDetailsType } from "../../setupAccount/page";
import { useSession } from "next-auth/react";
import { updateFriendList } from "../../utils/friendMechanics/updateFriendList";
import { updateUserDetails } from "../../utils/updateUserDetails";
import { UUID } from "mongodb";
import { StartupSnapshot } from "v8";
import { DisplayNote, requestType, userType } from "../../utils/fileFormat";


import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import { useSidebar } from "@/components/ui/sidebar";

import { appStore } from "@/app/store";
import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail";

export default function Friends() {
    const { toggleSidebar, open } = useSidebar();
    const [searchedFriendsList, setSearchedFriendsList] = useState<any>();
    

    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res)
                console.log("fetched user details via email: ", res)
                setUserId(res.userId)
            }
            fetchingUserDetails();
        }
    }, [session])

    const [loadingSearchResults, setLoadingSearchResults] = useState(false);

    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)

    useEffect(() => {
        if (localCollectionOfNotesState == null && userDetails != null) {
            const asyncDisplayNotes = async () => {
                // console.log("fetching notes")
                const res= await getDisplayNotes(userDetails.userId)
                setlocalCollectionOfNotesState(res);
            }
            asyncDisplayNotes();
        }
    }, [userDetails])

    

    const handleFriendSearch = async (searchParam: string) => {
        if (userDetails && searchParam != "" && searchParam != " ") {
            setLoadingSearchResults(true);
            console.log("searchin for ",searchParam)
            const friendList = await FriendSearch(userDetails.userId, searchParam);
            console.log("friens searched result: ",friendList)
            setSearchedFriendsList(friendList);
            setLoadingSearchResults(false);
        }
        else if (searchParam == "") {
            setSearchedFriendsList([]);
            setLoadingSearchResults(false);
        }

    }


    const SearchFriendCard = ({ user }: { user: userType }) => {
        // const [action, setAction] = useState<"add" | "remove" | "cancel" | "accept/reject" | null>(null);
        var action:"add" | "remove" | "cancel" | "accept/reject" | null;
        action=null;
        const getAction = async () => {
            console.log("getting action");
            if (user.friendList.includes(userId as string)) {
                // setAction("remove");
                action="remove";
                // console.log("action is remove");
                return 1;
            }
            // console.log("checking for outgoing")
            const { data: outgoing } = await supabase.from("friendRequest").select("*").eq("senderId", userId).eq("receiverId", user.userId).eq("status", "pending");
            if (outgoing?.length) {
                if (outgoing.length > 0) {
                    action="cancel"
                    return 1;
                }
            }

            // console.log("checking for incoming")
            const { data: incoming, error } = await supabase.from("friendRequest").select("*").eq("senderId", user.userId).eq("receiverId", userId).eq("status", "pending");
            if (incoming?.length) {
                if (incoming.length > 0) {
                    action="accept/reject";
                    return 1;
                }
            }
        
            action="add";
            return 1;

        }
        
        getAction();

        const addAction = async () => {
            // setAction(null);
            const { data, error } = await supabase
                .from('friendRequest')
                .insert({ senderId: userId, receiverId: user.userId, status: "pending", createdAt: Date.now() })
                .select()

            console.log(data);
            console.log(error);
            // getAction();
            // setAction("cancel");
            action="cancel"
        }

        const cancelAction = async () => {
            // setAction(null);
            const res = await supabase
                .from('friendRequest')
                .delete()
                .eq("senderId", userId).eq("receiverId", user.userId).eq("status", "pending")
            // getAction();
            // setAction("add");
            action="add";
        }
        const removeAction = async () => {
            // setAction(null)
            let newUserDetails = userDetails
            var index = newUserDetails?.friendList.indexOf(user.userId) as number;
            if (index > -1) {
                console.log("removing at ", index)
                newUserDetails?.friendList.splice(index, 1);
            }
            const res1 = await updateFriendList(userId as string, newUserDetails as userType)
            console.log(res1)

            newUserDetails = user as userType
            index = newUserDetails?.friendList.indexOf(userId as string) as number;
            if (index > -1) {
                console.log("removing at ", index)
                newUserDetails?.friendList.splice(index, 1);
            }
            const res2 = await updateFriendList(user.userId as string, newUserDetails as userType)
            console.log(res2);
            // getAction();
            // setAction("add");
            action="add";
        }
        const acceptAction = async () => {
            // setAction(null)
            const { data, error } = await supabase
                .from('friendRequest')
                .update({ status: "accepted" })
                .eq("senderId", user.userId).eq("receiverId", userId).eq("status", "pending")
                .select();
            console.log(data)
            console.log(error)

            if (!userDetails?.friendList.includes(user.userId)) {
                console.log(user.userId, " not present in ", userDetails?.friendList)
                let updatedUserDetails = userDetails;
                updatedUserDetails?.friendList.push(user.userId)
                const res1 = await updateFriendList(userDetails?.userId as string, updatedUserDetails as userType);
                console.log("res1>>>> ", res1);
            }
            if (!user.friendList.includes(userId as string)) {
                console.log(userId, " not present in ", user.friendList);
                let updatedUserDetails = user;
                updatedUserDetails.friendList.push(userId as string);
                const res2 = await updateFriendList(user.userId, updatedUserDetails);
                console.log("res2>>>", res2);
            }
            // getAction();
            // setAction("remove");
            action="remove";
        }
        const rejectAction = async () => {
            // setAction(null);
            const { data, error } = await supabase
                .from('friendRequest')
                .update({ status: "rejected" })
                .eq("senderId", user.userId).eq("receiverId", userId).eq("status", "pending")
                .select();
            console.log(data)
            console.log(null)
            // getAction();
            // setAction("add");
            action="add";
        }

        return (<>
            <div className={styles.personCard}>
                <div className={styles.profilePic}>
                    <Image src={user.imageUrl} alt="pfp" height={50} width={50} />
                    <div className={styles.nameHolder}>
                        <p className={styles.name}>{user.name}</p>
                        <p className={styles.username}>@{user.userName}</p>
                    </div>
                </div>
                <div className={styles.action}>
                    {(action == null) && (<Spinner className={styles.friendCardSpinner} />)}
                    {(action == "add") && (<Button color="green" onClick={() => { addAction() }}>Add</Button>)}
                    {(action == "cancel") && (<Button color="red" onClick={() => { cancelAction() }}>Cancel</Button>)}
                    {(action == "remove") && (<Button color="red" onClick={() => { removeAction() }}>Remove</Button>)}
                    {(action == "accept/reject") && (<><Button color="green" onClick={() => { acceptAction() }}><CircleCheck /></Button><Button color="red" onClick={() => { rejectAction() }}><X /></Button></>)}
                </div>
            </div>

        </>)
    }

    const requestTab = useRef(null)
    const [incomingRequestsList, setIncomingRequestsList] = useState<any>();

    const getIncomingReq = async () => {

        if (userId) {

            const { data: incomingReqArray, error } = await supabase.from("friendRequest").select("*").eq("receiverId", userId).eq("status", "pending")
            // console.log(incomingReqArray);
            setIncomingRequestsList(incomingReqArray);
            console.log(error)
        }
    };

    useEffect(() => {

        getIncomingReq();
    }, [userId])



    const IncomingRequestPersonCard = ({ req }: { req: requestType }) => {
        const [action, setAction] = useState<"add" | "remove" | "cancel" | "accept/reject" | null>(null);
        const [reqUserDetails, setReqUserDetails] = useState<userType>()
        const [loadingDetails, setLoadingDetails] = useState(true)
        const [loadingActions, setloadingActions] = useState(false)

        useEffect(() => {
            const getReqUserDetails = async () => {
                setLoadingDetails(true);

                const newUserDetails = await getUserDetails(req.senderId);
                // console.log(newUserDetails)
                setReqUserDetails(newUserDetails);
                setLoadingDetails(false);

            }
            getReqUserDetails()
        }, [])


        const acceptAction = async () => {
            setloadingActions(true)
            const { data, error } = await supabase
                .from('friendRequest')
                .update({ status: "accepted" })
                .eq("senderId", req.senderId).eq("receiverId", userId).eq("status", "pending")
                .select();
            console.log(data)
            console.log(error)

            if (!userDetails?.friendList.includes(req.senderId)) {
                console.log(req.senderId, " not present in ", userDetails?.friendList)
                let updatedUserDetails = userDetails;
                updatedUserDetails?.friendList.push(req.senderId)
                const res1 = await updateFriendList(userDetails?.userId as string, updatedUserDetails as userType);
                console.log("res1>>>> ", res1);
            }
            if (!reqUserDetails?.friendList.includes(userId as string)) {
                console.log(userId, " not present in ", reqUserDetails?.friendList);
                let updatedUserDetails = reqUserDetails as userType;
                updatedUserDetails.friendList.push(userId as string);
                const res2 = await updateFriendList(req.senderId, updatedUserDetails);
                console.log("res2>>>", res2);
            }
            // setloadingActions(false);
            getIncomingReq();
        }
        const rejectAction = async () => {
            setloadingActions(true)
            const { data, error } = await supabase
                .from('friendRequest')
                .update({ status: "rejected" })
                .eq("senderId", req.senderId).eq("receiverId", userId).eq("status", "pending")
                .select();
            console.log(data)
            console.log(null)
            // setloadingActions(false)
            getIncomingReq();
        }


        return (<>{reqUserDetails && (

            <div className={styles.personCard}>
                <div className={styles.profilePic}>
                    <Image src={reqUserDetails?.imageUrl as string} alt="pfp" height={50} width={50} />
                    <div className={styles.nameHolder}>
                        <p className={styles.name}>{reqUserDetails?.name}</p>
                        <p className={styles.username}>@{reqUserDetails?.userName}</p>
                    </div>
                </div>
                <div className={styles.action}>
                    {loadingActions && <Spinner className={styles.friendCardSpinner} />}
                    {(!loadingActions && !loadingActions) && (<><Button color="green" onClick={() => { acceptAction() }}><CircleCheck /></Button><Button color="red" onClick={() => { rejectAction() }}><X /></Button></>)}
                </div>
            </div>
        )}
            {
                loadingDetails && <Spinner className={styles.spinner} />
            }
        </>)
    }

    const [friendList, setFriendList] = useState<any>([])
    useEffect(() => {

        const getFriends = async () => {
            var tempFriendList: userType[] = []
            if (userDetails) {
                userDetails?.friendList.forEach((friendId) => {
                    const asyncFunc = async () => {
                        console.log("getting deatil for ", friendId)
                        const newUserDetails = await getUserDetails(friendId);
                        tempFriendList.push(newUserDetails)
                    }
                    asyncFunc()
                })
            }
            setFriendList(tempFriendList)
        }
        getFriends();
    }, [userDetails])
    const FriendCard = ({ user }: { user: userType }) => {
        return (<>
            <div className={styles.friendCard}>
                <div className={styles.friendProfilePic}>
                    <Image unoptimized={true} src={user.imageUrl} alt="pfp" height={150} width={150} />
                </div>
                <div className={styles.nameHolder}>
                    <p className={styles.name}>{user.name}</p>
                    <p className={styles.username}>@{user.userName}</p>
                </div>
            </div>
        </>)
    }




    //display page down below
    return (<>
        <div className={styles.main}>
            <div className={styles.tab}>
                <div className={styles.sidebarBtn}>
                    <Image src={open ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar();
                    }
                    } />
                </div>
                <p>Friends</p>
            </div>
            <Tabs.Root defaultValue="add">
                <Tabs.List size="2" color="ruby" className={styles.tabsList}>
                    <Tabs.Trigger value="friends" className={styles.tabsTrigger}>Friends</Tabs.Trigger>
                    <Tabs.Trigger value="add" className={styles.tabsTrigger}>Add</Tabs.Trigger>
                    <Tabs.Trigger value="requests" className={styles.tabsTrigger}>Requests</Tabs.Trigger>
                </Tabs.List>


                <Tabs.Content value="friends" className={styles.tableContent}>
                    <div className={styles.friendCardHolder}>
                        {friendList && friendList.map((friend: userType) => (<FriendCard key={friend.userId} user={friend} />))}
                    </div>
                </Tabs.Content>


                <Tabs.Content value="add">
                    <div className={styles.addContainer}>

                        <div className={styles.searchBar}>
                            <Input className={styles.searchInput} placeholder="username...." onChange={(e) => {
                                // console.log(e.target.value);
                                handleFriendSearch(e.target.value);
                            }} />
                        </div>

                        <div className={styles.searchedPeople}>
                            {searchedFriendsList && searchedFriendsList.map((friend: userType) => (
                                <SearchFriendCard key={friend.userId} user={friend} />
                            ))}
                            {loadingSearchResults &&
                                <Spinner className={styles.spinner} />
                            }
                        </div>
                    </div>
                </Tabs.Content>


                <Tabs.Content value="requests" className={styles.reqContent}>
                    <div className={styles.requestCardHolder}>
                        {incomingRequestsList && incomingRequestsList.map((req: requestType) => (<IncomingRequestPersonCard key={req.id} req={req} />))}
                    </div>
                </Tabs.Content>

            </Tabs.Root>

        </div>
    </>)
}