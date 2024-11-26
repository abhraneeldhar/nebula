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
import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import { getUserDetails } from "../utils/getUserDetails"
import { fetchUserId } from "../utils/fetchUserId"
import { useSession } from "next-auth/react"

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
type userDetailsType={
    _id: string,
    userId: string,
    name: string,
    userName:string,
    email: string,
    imageUrl: string,
    dateOfJoining: number
  }

export default function SetupAccount() {
    const [nameState, setNameState] = useState("");
    const [usernameState, setUsernameState] = useState("")
    const [pfpState, setPfpState] = useState<string>()


    const [nameAlert, setNameAlert] = useState(false)
    const [nameLengthAlert, setNameLengthAlert] = useState(false)
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [usernameLengthAlert, setUsernameLengthAlert] = useState(false)

    const imageInputRef = useRef<HTMLInputElement>(null)

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files[0])
            const file = e.target.files[0];
            const url = URL.createObjectURL(file)
            setPfpState(url)
        }
    }

    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)
    const [userDetails,setUserDetails]= useState<userDetailsType>()

    useEffect(() => {
        if (!userId && session?.user?.email) {
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
    }, [,userId, session])

    useEffect(()=>{
        if(userId){
            const asyncGetUserDetails= async()=>{
                const newUserDetails=await getUserDetails(userId);
                setUserDetails(newUserDetails);
            }
            asyncGetUserDetails();
        }
    },[userId])

    useEffect(()=>{
        console.log("userdetails>>>> ",userDetails)
    },[userDetails])

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
                        <Image unoptimized={true} src={userDetails?.imageUrl || pfp} height={0} width={0} alt="pfp" onClick={() => {
                            imageInputRef.current?.click();
                            console.log("img")
                        }} />
                        {/* </div> */}
                    </div>



                    <input ref={imageInputRef} id="pfp" name="pfp" type="file" accept="image/*" className={styles.imageInput} onChange={handleImage} />

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        console.log("submitted");
                    }} className={styles.formContainer}>

                        <div className={styles.cameraIconHolder}>
                            <Camera onClick={() => { imageInputRef.current?.click(); }} />
                        </div>
                        <label htmlFor="name"><User />Name</label>
                        <input name="name" id="name" type="text" placeholder="name" defaultValue={userDetails?.name} onChange={(e) => {
                            setNameState(e.target.value);
                            setNameAlert(isAlphaNumeric(e.target.value));
                            setNameLengthAlert(isNameLongOrShort(e.target.value));
                        }} />

                        <label htmlFor="username"><AtSign />Username</label>
                        <input name="username" id="username" type="text" placeholder="username" defaultValue={userDetails?.userName} onChange={(e) => {
                            setUsernameState(e.target.value);
                            setUsernameAlert(isAlphaNumeric(e.target.value));
                            setUsernameLengthAlert(isNameLongOrShort(e.target.value));
                        }} />

                        <Button disabled={nameAlert || nameLengthAlert || usernameAlert || usernameLengthAlert}>Configure</Button>
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


                </div>
            </div>
        </div></>)
}