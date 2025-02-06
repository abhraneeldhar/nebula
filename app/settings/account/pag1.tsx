"use client"
import styles from "./settings.module.css"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button, TextArea } from "@radix-ui/themes"
import { useEffect, useRef, useState } from "react"
import { getUserDetails } from "../../utils/getUserDetails"
import { fetchUserId } from "../../utils/fetchUserId"
import { useSession } from "next-auth/react"
// import { userDetailsType } from "../../setupAccount/page"
import { Spinner } from "@radix-ui/themes"
import { checkUsernameinDB } from "../../utils/checkUsernameinDB"
import { supabase } from "../../utils/supabase/client"
import { updateUserDetails } from "../../utils/updateUserDetails"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ArrowBigLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { userType } from "@/app/utils/fileFormat"


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
function isBioLong(bio: string) {
    return (bio.length > 50);
}

export default function Account() {
    const [pfpState, setPfpState] = useState("/meow.jpg");
    const [uploadPfp, setUploadPfp] = useState<File>();
    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)
    const [userDetails, setUserDetails] = useState<userType>()
    const [nameState, setNameState] = useState("");
    const [usernameState, setUsernameState] = useState("")
    const [bioState, setBioState] = useState("")


    const [nameAlert, setNameAlert] = useState(false)
    const [nameLengthAlert, setNameLengthAlert] = useState(false)
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [usernameLengthAlert, setUsernameLengthAlert] = useState(false)
    const [usernameSpaceAlert, setUsernameSpaceAlert] = useState(false)
    const [bioAlertState, setBioAlertState] = useState(false);

    const [formLoading, setFormLoading] = useState(false)
    const [usernameCheckAlert, setUsernameCheckAlert] = useState(false)

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

    useEffect(() => {
        // if (userDetails) {
        //     setPfpState(userDetails?.imageUrl)
        // }
        console.log("userdetails>>>> ", userDetails)
        setUsernameState(userDetails?.userName as string);
        setNameState(userDetails?.name || "")
        setUsernameState(userDetails?.userName || "")
        setBioState(userDetails?.bio || "")
        setPfpState(userDetails?.imageUrl as string)

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


    const imageInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const userNameInputRef = useRef<HTMLInputElement>(null);
    const bioInputRef = useRef<HTMLTextAreaElement>(null);


    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files[0])
            const file = e.target.files[0];
            const url = URL.createObjectURL(file)
            setPfpState(url)
            setUploadPfp(file)
        }
    }


    const updateProfile = async () => {
        toast.info("Updating Profile...", {
            position: "top-right",
            theme: "dark"
        })
        const res = await fetch(pfpState);
        const blob = await res.blob();
        const formPfp = new File([blob], "profileImage.jpg", { type: blob.type })
        const formName = nameState;
        const formUsername = usernameState;
        const formBio = bioState;

        const usernameCheck = await checkUsernameinDB(userDetails?.userId as string, formUsername);

        console.log("formName>>>", formName, "\nformusername>> ", formUsername, "\nformpfp>> ", formPfp, "\nusernamecheck>> ", usernameCheck);

        if (usernameCheck) {
            setUsernameCheckAlert(true);
        }
        else if (!usernameCheck && userDetails) {
            const saltValue = Date.now();

            const { data, error } = await supabase.storage.from("profilePics").upload(`${userDetails.userId}/profileImage${saltValue}`, formPfp, { upsert: true });

            const { data: imgUrl } = await supabase.storage.from("profilePics").getPublicUrl(`${userDetails.userId}/profileImage${saltValue}`);

            await updateUserDetails(userDetails.userId, formName, formUsername, formBio, imgUrl.publicUrl);

            console.log("updated profile")
            toast.success("Profile Updated !", {
                position: "top-right",
                theme: "dark"
            })
        }

    }

    const router=useRouter();

    return (<>
        <div className={styles.main}>
            <Spinner loading={!userDetails} className={styles.spinner} />

            <div className={styles.tab}>
                <div className={styles.back} onClick={()=>{router.push("/settings")}}>
                    <ArrowBigLeft />
                </div>
                <div className={styles.settingsHeader}>Account</div>
            </div>

            <div className={styles.mainContent}>
                <ToastContainer />

                <div className={styles.profilePicture}>
                    <h1>Profile Picture</h1>
                    <div className={styles.picBox}>
                        <input ref={imageInputRef} id="pfp" name="pfp" type="file" accept="image/*" className={styles.imageInput} onChange={handleImage} />

                        <Image unoptimized={true} src={pfpState || "./meow.jpg"} height={100} width={100} alt="userPic" />
                        <Button className={styles.changePic} onClick={() => {
                            imageInputRef.current?.click();
                        }}>Change Picture</Button>
                        <Button className={styles.removePic} onClick={() => {
                            setPfpState("./meow.jpg");
                        }}>Remove Picture</Button>
                    </div>
                </div>

                <div className={styles.profileDetails}>
                    <h1>Profile Name</h1>
                    <Input ref={nameInputRef} disabled={!userDetails} defaultValue={nameState} placeholder="your name" onChange={(e) => {
                        setNameState(e.target.value);
                        setNameAlert(isAlphaNumeric(e.target.value));
                        setNameLengthAlert(isNameLongOrShort(e.target.value));
                    }} />
                    {(nameAlert || nameLengthAlert) && (<p className={styles.alertP}>Your name should be between 1 and 20 letters long without special charecters</p>)}
                    <h1>Username</h1>
                    <Input ref={userNameInputRef} disabled={!userDetails} defaultValue={usernameState} placeholder="username" onChange={(e) => {
                        setUsernameState(e.target.value.toLowerCase());
                        setUsernameAlert(isAlphaNumeric(e.target.value));
                        setUsernameLengthAlert(isNameLongOrShort(e.target.value));
                        setUsernameSpaceAlert(e.target.value.includes(" "));
                        setUsernameCheckAlert(false);
                    }} />
                    {(usernameAlert || usernameLengthAlert || usernameSpaceAlert) && (<p className={styles.alertP}>Your username needs to be between 1 and 20 letters without spaces and special charecters</p>)}
                    {usernameCheckAlert && (<p className={styles.alertP}>Username is taken</p>)}
                    <h1>About</h1>
                    <textarea ref={bioInputRef} disabled={!userDetails} defaultValue={userDetails?.bio} placeholder="your bio" onChange={(e) => {
                        setBioAlertState(isBioLong(e.target.value));
                        setBioState(e.target.value);
                    }
                    } />
                    {(bioAlertState) && (<p className={styles.alertP}>Your bio needs to be under 50 charecters</p>)}
                </div>

            </div>
            <div className={styles.footer}>
                <div className={styles.actionButtons}>
                    <Button className={styles.saveBtn} disabled={nameAlert || usernameSpaceAlert || nameLengthAlert || usernameAlert || usernameLengthAlert || bioAlertState || !userDetails} onClick={() => {
                        updateProfile();
                    }}>Save</Button>

                    <Button className={styles.resetBtn} disabled={!userDetails} onClick={() => {
                        if (userDetails && nameInputRef.current && userNameInputRef.current && bioInputRef.current) {
                            setPfpState(userDetails?.imageUrl);
                            setNameState(userDetails?.name);
                            setUsernameState(userDetails?.userName);
                            setBioState(userDetails?.bio);
                            nameInputRef.current.value = userDetails.name;
                            userNameInputRef.current.value = userDetails.userName;
                            bioInputRef.current.value = userDetails.bio;

                        }
                    }}>Reset</Button>
                </div>
            </div>
        </div>
    </>)
}