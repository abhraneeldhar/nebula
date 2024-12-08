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
import { X, User, AtSign, Camera } from "lucide-react"
import { ChangeEvent, FormEvent, useEffect, useReducer, useRef, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getUserDetails } from "../utils/getUserDetails"
import { fetchUserId } from "../utils/fetchUserId"
import { useSession } from "next-auth/react"
import { checkUsernameinDB } from "../utils/checkUsernameinDB"
import { updateUserDetails } from "../utils/updateUserDetails"
import { supabase } from "../utils/supabase/client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
function isAlphaNumeric(str: string) {
    return !(/^[a-zA-Z0-9\s]*$/.test(str));
}
function isNameLongOrShort(str: string) {
    if (str.length > 20 || str.length <= 0) {
        return true
    }
    else {
        return false
    }
}
export type userDetailsType = {
    _id: string,
    userId: string,
    name: string,
    userName: string,
    email: string,
    bio:string,
    imageUrl: string,
    dateOfJoining: number
}

export default function SetupAccount() {
    const router=useRouter();

    const [nameState, setNameState] = useState("");
    const [usernameState, setUsernameState] = useState("")
    const [pfpState, setPfpState] = useState<string>("./meow.jpg")
    const [uploadPfp, setUploadPfp] = useState<File>()

    const [nameAlert, setNameAlert] = useState(false)
    const [nameLengthAlert, setNameLengthAlert] = useState(false)
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [usernameLengthAlert, setUsernameLengthAlert] = useState(false)
    const [usernameSpaceAlert, setUsernameSpaceAlert] = useState(false)

    const imageInputRef = useRef<HTMLInputElement>(null)

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files[0])
            const file = e.target.files[0];
            const url = URL.createObjectURL(file)
            setPfpState(url)
            setUploadPfp(file)
        }
    }

    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)
    const [userDetails, setUserDetails] = useState<userDetailsType>()

    useEffect(() => {
        if (!userId && session?.user?.email) {
            console.log("session>>>", session)
            const getUserId = async () => {
                console.log("fetching user Id");
                const newUserId = await fetchUserId(String(session?.user?.email))
                console.log("userId>>>>", newUserId);
                if (newUserId != userId) {
                    setUserId(newUserId)
                }
            }
            getUserId();
        }
    }, [, userId, session])

    useEffect(() => {
        if (userId) {
            const asyncGetUserDetails = async () => {
                const newUserDetails = await getUserDetails(userId);
                setUserDetails(newUserDetails);
            }
            asyncGetUserDetails();
        }
    }, [userId])

    useEffect(() => {
        // if (userDetails) {
        //     setPfpState(userDetails?.imageUrl)
        // }
        console.log("userdetails>>>> ", userDetails)
        // setUsernameState(userDetails?.userName as string);
        setNameState(userDetails?.name || "")
        setUsernameState(userDetails?.userName || "")

        const googleImageToFile = async () => {
            const res = await fetch(userDetails?.imageUrl as string);
            if (!res.ok) {
                googleImageToFile();
            }
            const blob = await res.blob();
            // const file= new File([blob],`profilePic.jpg`,{type: blob.type});
            // setPfpState(blob)
        }

    }, [userDetails])


    const [formLoading, setFormLoading] = useState(false)
    const [usernameCheckAlert,setUsernameCheckAlert]=useState(false)
    const configure = async () => {
        if (userDetails) {
            var formpfp = uploadPfp;
            if (!formpfp) {
                console.log("uplaodpfp is null")
                const res = await fetch(pfpState)
                const blob = await res.blob();
                formpfp = new File([blob], "profileImage.jpg", { type: blob.type })
            }
            const formName = nameState;
            const formUsername = usernameState.toLowerCase();

            setFormLoading(true);
            const usernameCheck = await checkUsernameinDB(userDetails?.userId as string, formUsername);
            setFormLoading(false);

            if (!usernameCheck) {
                console.log("formName>>>", formName, "\nformusername>> ", formUsername, "\nformpfp>> ", formpfp, "\nusernamecheck>> ", usernameCheck);

                setFormLoading(true);
                const saltValue=Date.now()
                const { data, error } = await supabase.storage.from("profilePics").upload(`${userDetails.userId}/profileImage${saltValue}`, formpfp, { upsert: true })
                // setFormLoading(false);
                console.log(data)
                console.log(error)

                // setFormLoading(true);
                const { data: imgUrl } = await supabase.storage.from("profilePics").getPublicUrl(`${userDetails.userId}/profileImage${saltValue}`);
                // setFormLoading(false);

                // setFormLoading(true);
                await updateUserDetails(userDetails.userId, formName, formUsername,"", imgUrl.publicUrl)
                setFormLoading(false);
                
                router.push("/home")
            }
            else {
                setUsernameCheckAlert(true);
                console.log("username already exists", formUsername)
            }
        }
    };

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
                        {/* <div className={styles.pfpHolder}> */}
                        <Image unoptimized={true} src={pfpState as string} height={100} width={100} alt="pfp" onClick={() => {
                            imageInputRef.current?.click();
                            console.log("img")
                        }} />
                        {/* </div> */}
                    </div>



                    <input defaultValue={pfpState as string} ref={imageInputRef} id="pfp" name="pfp" type="file" accept="image/*" className={styles.imageInput} onChange={handleImage} />

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        // console.log("submitted");
                        configure();
                    }} className={styles.formContainer}>

                        <div className={styles.cameraIconHolder}>
                            <Camera onClick={() => { imageInputRef.current?.click(); }} />
                        </div>
                        <label htmlFor="name"><User />Name</label>
                        <input disabled={formLoading} name="name" id="name" type="text" placeholder="name" defaultValue={nameState} onChange={(e) => {
                            setNameState(e.target.value);
                            setNameAlert(isAlphaNumeric(e.target.value));
                            setNameLengthAlert(isNameLongOrShort(e.target.value));
                        }} />

                        <label htmlFor="username"><AtSign />Username</label>
                        <input disabled={formLoading} name="username" id="username" type="text" placeholder="username" defaultValue={usernameState} onChange={(e) => {
                            setUsernameState(e.target.value);
                            setUsernameAlert(isAlphaNumeric(e.target.value));
                            setUsernameLengthAlert(isNameLongOrShort(e.target.value));
                            setUsernameSpaceAlert(e.target.value.includes(" "));
                        }} />

                        <Button loading={formLoading} disabled={nameAlert || usernameSpaceAlert || nameLengthAlert || usernameAlert || usernameLengthAlert || !userDetails} >Configure</Button>
                    </form>


                    {nameAlert && (<>
                        <Alert className={styles.alert} variant="destructive">
                            <AlertDescription>
                                Name can only contain alphanumeric charecters.
                            </AlertDescription>
                        </Alert>
                    </>)}
                    {nameLengthAlert && (<>
                        <Alert className={styles.alert} variant="destructive">
                            <AlertDescription>
                                Name can't be longer than 20 charecters.
                            </AlertDescription>
                        </Alert>
                    </>)}
                    {usernameAlert && (<>
                        <Alert className={styles.alert} variant="destructive">
                            <AlertDescription>
                                Username can only contain alphanumeric charecters.
                            </AlertDescription>
                        </Alert>
                    </>)}
                    {usernameLengthAlert && (<>
                        <Alert className={styles.alert} variant="destructive">
                            <AlertDescription>
                                Username can't be longer than 20 charecters.
                            </AlertDescription>
                        </Alert>
                    </>)}
                    {usernameSpaceAlert && (
                        <>
                            <Alert className={styles.alert} variant="destructive">
                                <AlertDescription>
                                    Username can't contain spaces.
                                </AlertDescription>
                            </Alert>
                        </>
                    )
                    }

                </div>
            </div>

            <AlertDialog open={usernameCheckAlert} onOpenChange={setUsernameCheckAlert}>
                <AlertDialogContent className={styles.alertBox}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>The username is already taken</AlertDialogTitle>
                        <AlertDialogDescription>
                            Think of a more creative and unique username
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div></>
        )
}