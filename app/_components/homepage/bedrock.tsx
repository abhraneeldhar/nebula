"use client"
import styles from "./bedrock.module.css";
import { useEffect, useState } from "react";
import { appStore } from "../../store";
import Image from "next/image";

import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

import coverImage from ".././assetImages/coverimage.png"
import profilePic from ".././assetImages/profilePic.jpg"

import WeathersTab from "../weathersTab/weatherstab";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";

import { Note, Folder, DisplayNote, requestType, sharedNoteType } from "../../utils/fileFormat";


import rightArrow from "../../../public/arrowright.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchUserId } from "@/app/utils/fetchUserId";
import { getDisplayName } from "next/dist/shared/lib/utils";
import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import NewNoteBtn from "../newNoteBtn/newNoteBtn";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, Spinner } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";
// import { supabase } from "@/app/utils/supabase/client";


import { getUserDetails } from "@/app/utils/getUserDetails";
import { userDetailsType } from "@/app/setupAccount/page";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Popover } from "@radix-ui/themes";
import { CircleCheck, Inbox, Users, X } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/app/utils/supabase/client";
import { updateFriendList } from "@/app/utils/friendMechanics/updateFriendList";
import { getIncomingNotes } from "@/app/utils/shareMechanics/getIncomingNotes";
import { v4 as uuidv4 } from "uuid";
import { postNote } from "@/app/utils/postNote";
import { deleteSharedNote } from "@/app/utils/shareMechanics/deleteSharedNote";

export default function Bedrock() {
    const router = useRouter();

    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)

    const [loadingDisplayNotes, setLoadingDisplayNotes] = useState(true);

    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)
    const [userDetails, setUserDetails] = useState<userDetailsType>()
    useEffect(() => {
        if (!userId && session?.user?.email) {
            const getUserId = async () => {
                const newUserId = await fetchUserId(String(session?.user?.email))
                if (newUserId != userId) {
                    setUserId(newUserId)

                }
            }
            getUserId();
        }
    }, [userId, session])


    useEffect(() => {
        if (userId) {
            const asyncGetUserDetails = async () => {
                const newUserDetails = await getUserDetails(userId);
                setUserDetails(newUserDetails);

            }
            asyncGetUserDetails();
        }
    }, [userId])

    const [refreshCollectionOfNotes, setRefreshCollectionOfNotes] = useState(false)


    useEffect(() => {
        if (localCollectionOfNotesState == null && userId != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setLoadingDisplayNotes(true);
                setlocalCollectionOfNotesState(await getDisplayNotes(userId));
                setLoadingDisplayNotes(false);
            }
            asyncDisplayNotes();
        }
    }, [localCollectionOfNotesState, userId])

    useEffect(() => {
        if (userId != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setLoadingDisplayNotes(true);
                setlocalCollectionOfNotesState(await getDisplayNotes(userId));
                setLoadingDisplayNotes(false);
            }
            asyncDisplayNotes();
        }

    }, [, refreshCollectionOfNotes])



    const Tab = ({ tabName }: { tabName: string }) => {
        const { toggleSidebar, open } = useSidebar();
        const [reqOpen, setReqOpen] = useState(false);
        const [inboxOpen, setInboxOpen] = useState(false);
        const [incomingRequestsList, setIncomingRequestsList] = useState<any>();
        const [incomingNotesList, setIncomingNotesList] = useState<any>();
        const [loadingDetails, setLoadingDetails] = useState(false)
        const getIncomingReq = async () => {

            if (userId) {
                setLoadingDetails(true);
                const { data: incomingReqArray, error } = await supabase.from("friendRequest").select("*").eq("receiverId", userId).eq("status", "pending")
                // console.log(incomingReqArray);
                setLoadingDetails(false)
                if (incomingReqArray != incomingRequestsList) {
                    setIncomingRequestsList(incomingReqArray);
                }
                console.log(error);
            }
        };

        useEffect(() => {

            getIncomingReq();
            console.log("getitng incoming reqs")
        }, [userId])
        useEffect(() => {
            if (reqOpen && userId) {
                getIncomingReq();
                console.log("getitng incoming reqs");
            }
        }, [reqOpen])

        const IncomingRequestPersonCard = ({ req }: { req: requestType }) => {
            // const [action, setAction] = useState<"add" | "remove" | "cancel" | "accept/reject" | null>(null);
            const [reqUserDetails, setReqUserDetails] = useState<userDetailsType>()
            const [loadingDetails, setLoadingDetails] = useState(false)
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
                    const res1 = await updateFriendList(userDetails?.userId as string, updatedUserDetails as userDetailsType);
                    console.log("res1>>>> ", res1);
                }
                if (!reqUserDetails?.friendList.includes(userId as string)) {
                    console.log(userId, " not present in ", reqUserDetails?.friendList);
                    let updatedUserDetails = reqUserDetails as userDetailsType;
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


            return (<>{(reqUserDetails) && (
                <div className={styles.reqPersonCard}>
                    <div className={styles.reqProfilePic}>
                        <Image src={reqUserDetails?.imageUrl as string} alt="pfp" height={50} width={50} unoptimized={true} />
                        <div className={styles.reqNameHolder}>
                            <p className={styles.reqName}>{reqUserDetails?.name}</p>
                            <p className={styles.reqUsername}>@{reqUserDetails?.userName}</p>
                        </div>
                    </div>
                    <div className={styles.reqAction}>
                        {loadingActions && <Spinner className={styles.friendCardSpinner} />}
                        {(incomingRequestsList && !loadingActions) && (<><Button color="green" onClick={() => { acceptAction() }} ><CircleCheck /></Button><Button color="red" onClick={() => { rejectAction() }}><X /></Button></>)}
                    </div>
                </div>
            )}
                {loadingDetails && (<Spinner className={styles.friendCardSpinner} />)}
            </>)
        }

        const getInbox = async () => {
            setLoadingDetails(true);
            const res = await getIncomingNotes(userId as string);
            if (res != incomingNotesList) {
                setIncomingNotesList(res);
            }
            setLoadingDetails(false);
        }
        useEffect(() => {
            if (userId) {
                console.log("getting inbox")
                getInbox();
            }
        }
            , [userId])
        useEffect(() => {
            if (userId && inboxOpen == true) {
                console.log("getting inbox")
                getInbox();
            }
        }, [userId, inboxOpen])

        useEffect(() => {
            console.log(incomingNotesList)
        }, [incomingNotesList])

        const InboxCard = ({ sharedNoteData }: { sharedNoteData: sharedNoteType }) => {
            const [senderDetails, setSenderDetails] = useState<userDetailsType>()
            const [loadingActions, setLoadingActions] = useState(false);

            useEffect(() => {
                const getDetails = async () => {
                    setLoadingActions(true);
                    const newUserDetails = await getUserDetails(sharedNoteData.senderId);
                    if (senderDetails != newUserDetails) {
                        setSenderDetails(newUserDetails);
                    }
                    console.log("senderid>>>>", senderDetails)
                    setLoadingActions(false);
                }
                getDetails();

            }, [sharedNoteData])

            const acceptNote = async () => {
                setLoadingActions(true);
                if (userId) {
                    var JackRyan = sharedNoteData.sharedNote;
                    JackRyan.id = uuidv4();
                    JackRyan.createdAt = Date.now();
                    JackRyan.owner = userId;
                    JackRyan.lastModifiedAt=Date.now();
                    await postNote(JackRyan);
                    await deleteSharedNote(sharedNoteData.id)
                    getInbox();
                    const displayNotes= await getDisplayNotes(userId);
                    setlocalCollectionOfNotesState(displayNotes);
                }
                setLoadingActions(false);
            }
            const rejectNote=async()=>{
                setLoadingActions(true);
                await deleteSharedNote(sharedNoteData.id);
                getInbox();
                setLoadingActions(false);
            }



            return (<>
                <div className={styles.inboxCard}>
                    <div className={styles.inboxCardDetails}>
                        <div className={styles.noteName}>
                            <p>{sharedNoteData.sharedNote.title}</p>
                        </div>
                        <div className={styles.senderName}>
                            <p>sent by {senderDetails?.name}</p>
                        </div>
                    </div>
                    <div className={styles.reqAction}>
                        {loadingActions && <Spinner className={styles.friendCardSpinner} />}
                        {(incomingRequestsList && !loadingActions) && (<><Button color="green" onClick={() => { acceptNote()}} ><CircleCheck /></Button><Button color="red" onClick={() => { rejectNote() }}><X /></Button></>)}
                    </div>
                </div>
            </>)
        }


        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={open ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar();
                    }
                    } />
                </div>
                <p>{tabName}</p>
                <div className={styles.reqPopoverContainer}>
                    <Popover.Root open={reqOpen} onOpenChange={setReqOpen}>
                        <Popover.Trigger>
                            <div className={styles.reqTriggerContainer}>
                                <Users />{(incomingRequestsList && incomingRequestsList.length > 0) && <div className={styles.reqBadge}>{incomingRequestsList.length}</div>}
                            </div>
                        </Popover.Trigger>
                        <Popover.Content className={styles.friendRequestsPopover}>
                            {incomingRequestsList && incomingRequestsList.map((req: requestType) => (<IncomingRequestPersonCard key={req.id} req={req} />))}
                            {(incomingRequestsList && incomingRequestsList.length == 0) && (<>
                                <div className={styles.noReq}>No requests for now....</div>
                            </>)}
                            {loadingDetails && (<Spinner className={styles.reqSpinner} />)}
                        </Popover.Content>
                    </Popover.Root>


                    <Popover.Root open={inboxOpen} onOpenChange={setInboxOpen}>
                        <Popover.Trigger>
                            <div className={styles.reqTriggerContainer}>
                                <Inbox />{(incomingNotesList && incomingNotesList.length > 0) && <div className={styles.reqBadge}>{incomingNotesList.length}</div>}
                            </div>
                        </Popover.Trigger>
                        <Popover.Content className={styles.friendRequestsPopover}>
                            {incomingNotesList && incomingNotesList.map((sharedNote: sharedNoteType) => (<InboxCard key={sharedNote.sharedNote.id} sharedNoteData={sharedNote} />))}
                            {(incomingNotesList && incomingNotesList.length == 0) && (<>
                                <div className={styles.noReq}>Your inbox is empty</div>
                            </>)}
                            {loadingDetails && (<Spinner className={styles.reqSpinner} />)}
                        </Popover.Content>
                    </Popover.Root>
                </div>
            </div>
        </>)
    }



    return (<>
        <Tab tabName="Home" />


        <div className={styles.main}>
            <NewNoteBtn />
            <ToastContainer />
            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        <Image src={userDetails?.imageUrl || profilePic} unoptimized={true} priority={true} width={100} height={100} alt="profilePic" />
                    </div>
                </div>

                {/* <WeathersTab /> */}

                <div className={styles.notesAndOthersContainer}>
                    <div className={styles.notesSection} onClick={() => {
                        router.push("/allnotes")
                        console.log("opens notes page");
                    }}>
                        <h2>Open Notes<Image src={rightArrow} alt=">" className={styles.rightArrow} /></h2>
                        <div className={styles.notesContainer}>
                            {loadingDisplayNotes && !localCollectionOfNotesState && (<>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}>
                                </Skeleton>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                            </>)}

                            {localCollectionOfNotesState && localCollectionOfNotesState.length == 0 && (
                                <p> no recent notes</p>
                            )}
                            {(localCollectionOfNotesState) && (localCollectionOfNotesState.length > 0) && localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt).slice(0, 3)?.map((note) => (

                                <div className={styles.noteCard} key={note.id} onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Note card clicked");
                                    router.push(`/editor/${note.id}`);
                                }}>
                                    <h3>{note.title}</h3>
                                    <div className={styles.noteSnippet}>{note.snippet}
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </div >
    </>
    )
}