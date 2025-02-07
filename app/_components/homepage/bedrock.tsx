"use client"
import styles from "./bedrock.module.css";
import { useEffect, useState } from "react";
import { appStore } from "../../store";
import Image from "next/image";


import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

import coverImage from ".././assetImages/coverimage.png"

import { useSidebar } from "@/components/ui/sidebar";

import { DisplayNote, sharedNoteType, userType } from "../../utils/fileFormat";


import rightArrow from "../../../public/arrowright.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import NewNoteBtn from "../newNoteBtn/newNoteBtn";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";


import { getUserDetails } from "@/app/utils/getUserDetails";

import "react-toastify/dist/ReactToastify.css";
import { Popover } from "@radix-ui/themes";
import { CircleCheck, Inbox, Users, X } from "lucide-react";
import { supabase } from "@/app/utils/supabase/client";
import { updateFriendList } from "@/app/utils/friendMechanics/updateFriendList";
import { getIncomingNotes } from "@/app/utils/shareMechanics/getIncomingNotes";
import { v4 as uuidv4 } from "uuid";
import { postNote } from "@/app/utils/postNote";
import { deleteSharedNote } from "@/app/utils/shareMechanics/deleteSharedNote";
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail";
import EditorComponent from "../editor/editorComponent";

export default function Bedrock() {
    const router = useRouter();
    const setShowLoadingPage = appStore((state) => state.setShowLoadingPage)


    // only the dsiplay notes
    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)

    const [loadingDisplayNotes, setLoadingDisplayNotes] = useState(true);


    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                setShowLoadingPage(true);
                console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res)
                // console.log("fetched user details via email: ", res)
                setUserId(res.userId)
                setShowLoadingPage(false);
            }
            fetchingUserDetails();
        }
    }, [session])


    // fetches display notes
    useEffect(() => {
        if (localCollectionOfNotesState == null && userDetails != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setLoadingDisplayNotes(true);
                setlocalCollectionOfNotesState((await getDisplayNotes(userDetails.userId)));
                setLoadingDisplayNotes(false);
            }
            asyncDisplayNotes();
        }
    }, [localCollectionOfNotesState, userDetails])



    // getting currentfriendlist
    const currentFriendList = appStore((state) => state.currentFriendList)
    const setCurrentFriendList = appStore((state) => state.setCurrentFriendList)
    useEffect(() => {
        if (userDetails && !currentFriendList) {
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
                setCurrentFriendList(tempFriendList);
            }
            getFriends();
        }
    }, [userDetails])



    // getting incoming requests
    const [incomingRequestsList, setIncomingRequestsList] = useState<userType[]>();
    const [reqOpen, setReqOpen] = useState(false);
    useEffect(() => {
        const getIncomingReq = async () => {
            if (userDetails) {
                console.log("getting incoming friend  requests")
                const { data: incomingReqArray, error } = await supabase.from("friendRequest").select("*").eq("receiverId", userDetails.userId).eq("status", "pending")

                if (incomingReqArray) {
                    const incomingReqDetails: userType[] = []
                    incomingReqArray.forEach(async (oneReq) => {
                        incomingReqDetails.push(await getUserDetails(oneReq.senderId))
                    })
                    setIncomingRequestsList(incomingReqDetails);
                }
            }
        };
        getIncomingReq();

    }, [userDetails])


    //getting incoming shared notes

    const [inboxOpen, setInboxOpen] = useState(false);
    const [incomingNotesList, setIncomingNotesList] = useState<any>();
    useEffect(()=>{
        if(userDetails){
            const getInbox = async () => {
                console.log("getting incoming notes")
                const res = await getIncomingNotes(userDetails.userId as string);
                if (res != incomingNotesList) {
                    setIncomingNotesList(res);
                }
            }
            getInbox();

        }
    },[userDetails])
    
    
    useEffect(() => {
        console.log(incomingNotesList)
    }, [incomingNotesList])


    // tab component
    const Tab = ({ tabName }: { tabName: string }) => {
        const { toggleSidebar, open } = useSidebar();

        const IncomingRequestPersonCard = ({ reqUserDetails }: { reqUserDetails: userType }) => {
            const [reqResolved, setReqResolved] = useState<false | "accepted" | "rejected">(false);

            const acceptAction = async () => {
                setReqResolved("accepted");
                if (!userDetails?.friendList.includes(reqUserDetails.userId)) {
                    console.log(reqUserDetails.userId, " not present in ", userDetails?.friendList)
                    let updatedUserDetails = userDetails;
                    updatedUserDetails?.friendList.push(reqUserDetails.userId)
                    const res1 = await updateFriendList(userDetails?.userId as string, updatedUserDetails as userType);
                    console.log("res1>>>> ", res1);
                }
                if (!reqUserDetails?.friendList.includes(userDetails?.userId as string)) {
                    console.log(userDetails?.userId, " not present in ", reqUserDetails?.friendList);
                    let updatedUserDetails = reqUserDetails as userType;
                    updatedUserDetails.friendList.push(userDetails?.userId as string);
                    const res2 = await updateFriendList(reqUserDetails.userId, updatedUserDetails);
                    console.log("res2>>>", res2);
                }

                let newCurrentFriendsList = currentFriendList;
                newCurrentFriendsList?.push(reqUserDetails);
                setCurrentFriendList(newCurrentFriendsList);

                const response = await supabase
                    .from('friendRequest')
                    .delete()
                    .eq("senderId", reqUserDetails.userId).eq("receiverId", userDetails?.userId).eq("status", "pending")

            }

            const rejectAction = async () => {
                setReqResolved("rejected");
                const response = await supabase
                    .from('friendRequest')
                    .delete()
                    .eq("senderId", reqUserDetails.userId).eq("receiverId", userDetails?.userId).eq("status", "pending")

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
                        {!reqResolved && (<>
                            <Button color="green" onClick={() => { acceptAction() }} ><CircleCheck /></Button><Button color="red" onClick={() => { rejectAction() }}><X /></Button></>)
                        }
                        {reqResolved && (<>{reqResolved}</>)}
                    </div>
                </div>
            )}
            </>)
        }



        const InboxCard = ({ sharedNoteData }: { sharedNoteData: sharedNoteType }) => {
            const [senderDetails, setSenderDetails] = useState<userType | null>()
            const [reqResolved,setReqResolved]=useState<false|"accepted"|"rejected">(false)

            useEffect(() => {
                const getDetails = async () => {
                    const newUserDetails = await getUserDetails(sharedNoteData.senderId);
                    setSenderDetails(newUserDetails);
                }
                getDetails();

            }, [sharedNoteData])

            const acceptNote = async () => {
                if (userDetails) {
                    setReqResolved("accepted");
                    var JackRyan = sharedNoteData.sharedNote;
                    JackRyan._id=uuidv4();
                    JackRyan.id = uuidv4();
                    JackRyan.createdAt = Date.now();
                    JackRyan.owner = userDetails.userId;
                    JackRyan.lastModifiedAt = Date.now();
                    await postNote(JSON.stringify(JackRyan));
                    await deleteSharedNote(sharedNoteData.id)
                    const displayNotes = await getDisplayNotes(userDetails.userId);
                    console.log("new display notes: ",displayNotes)
                    setlocalCollectionOfNotesState(displayNotes);
                }
            }
            const rejectNote = async () => {
                setReqResolved("rejected");
                await deleteSharedNote(sharedNoteData.id);
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
                        {!reqResolved &&(<>
                            <Button color="green" onClick={() => { acceptNote() }} ><CircleCheck /></Button><Button color="red" onClick={() => { rejectNote() }}><X /></Button>
                        
                        </>)}
                        {reqResolved && (reqResolved)}
                    </div>
                </div>
            </>)
        }


        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={menuSVG} alt="X" onClick={() => {
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
                            {incomingRequestsList && incomingRequestsList.map((req: userType) => (<IncomingRequestPersonCard key={req._id} reqUserDetails={req} />))}
                            {(incomingRequestsList && incomingRequestsList.length == 0) && (<>
                                <div className={styles.noReq}>No requests for now....</div>
                            </>)}
                            {/* {loadingDetails && (<Spinner className={styles.reqSpinner} />)} */}
                        </Popover.Content>
                    </Popover.Root>


                    <Popover.Root open={inboxOpen} onOpenChange={setInboxOpen}>
                        <Popover.Trigger>
                            <div className={styles.reqTriggerContainer}>
                                <Inbox />{(incomingNotesList && incomingNotesList.length > 0) && <div className={styles.reqBadge}>{incomingNotesList.length}</div>}
                            </div>
                        </Popover.Trigger>
                        <Popover.Content className={styles.friendRequestsPopover}>
                            {incomingNotesList && incomingNotesList.map((sharedNote: sharedNoteType) => (<InboxCard key={incomingNotesList.indexOf(sharedNote)} sharedNoteData={sharedNote} />))}
                            {(incomingNotesList && incomingNotesList.length == 0) && (<>
                                <div className={styles.noReq}>Your inbox is empty</div>
                            </>)}
                            {/* {loadingDetails && (<Spinner className={styles.reqSpinner} />)} */}
                        </Popover.Content>
                    </Popover.Root>
                </div>
            </div>
        </>)
    }


    // trynna pre build the editor
    const [prebuildEditor,setPrebuildEditor]=useState(true);
    useEffect(()=>{
        setPrebuildEditor(false);
    },[])



    return (<>
        <Tab tabName="Home" />

        {prebuildEditor && <EditorComponent id="abcd"/>}

        <div className={styles.main}>
            <NewNoteBtn />
            

            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        {userDetails &&
                            <Image src={userDetails?.imageUrl} unoptimized={true} priority={true} width={100} height={100} alt="" />
                        }
                    </div>
                </div>

                <div className={styles.notesAndOthersContainer}>
                    <div className={styles.notesSection} onClick={() => {
                        router.push("/allnotes")
                        console.log("opens notes page");
                    }}>
                        <h2>All Documents<Image src={rightArrow} alt=">" className={styles.rightArrow} /></h2>
                        <div className={styles.notesContainer}>
                            {loadingDisplayNotes && !localCollectionOfNotesState && (<>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}>
                                </Skeleton>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                            </>)}

                            {localCollectionOfNotesState && localCollectionOfNotesState.length == 0 && (
                                <p>No Documents</p>
                            )}
                            {(localCollectionOfNotesState) && (localCollectionOfNotesState.length > 0) && localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt).slice(0, 3)?.map((note) => (

                                <div className={styles.noteCard} key={note.id} onClick={(e) => {
                                    e.stopPropagation();
                                    // console.log("Note card clicked");
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