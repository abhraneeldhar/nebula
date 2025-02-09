"use client"

import styles from "./settings.module.css"
import Image from "next/image"
import pfp from "../../../public/pfp.jpeg"
import banner from "../../../public/banner.jpg"
import { Input } from "@/components/ui/input"

import { ArrowLeft, Camera, RotateCcw, Save } from "lucide-react"
import { appStore } from "@/app/store"
import { useSession } from "next-auth/react"
import { ChangeEvent, ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from "react"
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail"
import { Button } from "@radix-ui/themes"

import React from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { supabase } from "@/app/utils/supabase/client"
import { checkUsernameinDB } from "@/app/utils/checkUsernameinDB"
import { Flip, toast, ToastContainer } from "react-toastify"
import { updateUserDetails } from "@/app/utils/updateUserDetails"

import LoadingPage from "@/app/_components/loadingPage/page"


export default function AccountsPage() {

    const [showLoadingPage, setShowLoadingPage] = useState(false)
    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                setShowLoadingPage(true);
                console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res);
                console.log(res.userId);
                setShowLoadingPage(false);
            }
            fetchingUserDetails();
        }
    }, [session])



    const [avatar, setAvatar] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: "%", height: 0, width: 0, x: 0, y: 0 });

    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const imageRef = useRef(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);


    const onImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const image = event.currentTarget;

        setCrop(
            centerCrop(
                makeAspectCrop(
                    {
                        unit: "%",
                        width: 50,
                    },
                    1,
                    image.width,
                    image.height
                ),
                image.width,
                image.height
            )
        );
    };




    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e && e.target) {
                        setSelectedImage(e.target.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        }

    };

    // Crop and Save Image
    const handleCropComplete = (crop: Crop) => {
        if (!imageRef.current || !crop.width || !crop.height) return;

        const image = imageRef.current as HTMLImageElement;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const correctedPixelCrop: Crop = {
            x: crop.x * scaleX,
            y: crop.y * scaleY,
            unit: "px",
            width: crop.width * scaleX,
            height: crop.height * scaleY,
        };
        setCompletedCrop(correctedPixelCrop)
    };

    const saveCroppedImage = () => {
        if (!completedCrop || !imageRef.current || !canvasRef.current) return;

        const image = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            canvas.width = completedCrop.width ?? canvas.width;
            canvas.height = completedCrop.height ?? canvas.height;

            ctx.drawImage(
                image,
                completedCrop.x ?? 0,
                completedCrop.y ?? 0,
                completedCrop.width ?? canvas.width,
                completedCrop.height ?? canvas.height,
                0,
                0,
                completedCrop.width ?? canvas.width,
                completedCrop.height ?? canvas.height
            );

            const croppedImageUrl = canvas.toDataURL("image/png");
            setAvatar(croppedImageUrl);
            setSelectedImage(null);
        }
    };


    // resizing the thang
    const resizeImage = (imageSrc: string, targetSize: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.src = imageSrc;
            img.crossOrigin = "anonymous";

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) return reject(new Error("Canvas context not available"));

                const aspectRatio = img.width / img.height;
                let newWidth = targetSize;
                let newHeight = targetSize;

                if (aspectRatio > 1) {

                    newHeight = targetSize / aspectRatio;
                } else {
                    newWidth = targetSize * aspectRatio;
                }


                canvas.width = targetSize;
                canvas.height = targetSize;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, targetSize, targetSize);

                const offsetX = (targetSize - newWidth) / 2;
                const offsetY = (targetSize - newHeight) / 2;
                ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Image conversion failed"));
                    },
                    "image/jpeg",
                    0.8
                );
            };

            img.onerror = (error) => reject(error);
        });
    };




    // uplaod
    const uploadToSupabase = async (resizedBlob: Blob, fileName: string) => {
        const { data, error } = await supabase.storage
            .from("profilePics")
            .upload(`${userDetails?.userId}/profileImage${Date.now()}`, resizedBlob, {
                contentType: "image/jpeg",
                upsert: true,
            });

        if (error) {
            console.error("Upload error:", error);
            return null;
        }

        console.log("Uploaded successfully:", data);
        return data.path;
    };




    //   resize and upload
    const resizeAndUpload = async () => {
        try {
            const resizedBlob = await resizeImage(avatar as string, 256) as Blob
            const filePath = await uploadToSupabase(resizedBlob, "user_avatar_123");

            if (filePath) {
                console.log("Image uploaded to:", filePath);
                return (filePath)
            }
        } catch (error) {
            console.error("Error processing image:", error);
        }
    };


    //   apply changes
    const nameRef = useRef<HTMLInputElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const bioRef = useRef<HTMLTextAreaElement>(null)

    const [saveLoader, setSaveLoader] = useState(false)
    const applyChangesFunction = async () => {
        let publicUrl = userDetails?.imageUrl;
        const name = nameRef?.current?.value as string
        const username = usernameRef?.current?.value as string
        const bio = bioRef?.current?.value as string


        const isNameValid = (text: string): boolean => {
            return text.length > 30 || /[^a-zA-Z0-9_ ]/.test(text);
        };
        if (isNameValid(name)) {
            toast.error('Name should be within 30 charecters and alphanumeric', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            return
        }


        const isUsernameValid = (text: string): boolean => {
            return text.length > 20 || /[^a-zA-Z0-9_]/.test(text) || /\s/.test(text);
        };
        if (isUsernameValid(username)) {
            toast.error('Username should be within 20 charecters and alphanumeric without spaces', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            return
        }
        const usernameInDBCheck = await checkUsernameinDB(userDetails?.userId as string, username);
        if (usernameInDBCheck) {
            toast.error('Username is taken', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            return
        }

        const isBioValid = (bio: string) => {
            return (bio.length < 200);
        }

        if (!isBioValid(bio)) {
            toast.error('Bio should be within 200 charecters', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            return
        }


        if (avatar) {
            try {
                // Get all images in the folder
                const { data: oldfileList, error: listError } = await supabase.storage.from("profilePics").list(userDetails?.userId);
                if (listError) throw listError;

                // Upload the new file
                try {
                    const filePath = await resizeAndUpload();
                    // getting public url

                    const { data: newPublicUrl } = supabase
                        .storage
                        .from('profilePics')
                        .getPublicUrl(filePath as string)

                    publicUrl = newPublicUrl.publicUrl;

                }
                catch (error) {
                    console.log(error)
                }

                // Delete all existing files
                if (oldfileList && oldfileList.length > 0) {
                    const filesToDelete = oldfileList.map((file) => `${userDetails?.userId}/${file.name}`);
                    const { error: deleteError } = await supabase.storage.from("profilePics").remove(filesToDelete);
                    if (deleteError) throw deleteError;
                }

            } catch (error) {
                console.error("Error managing images:", error);
                return { success: false, message: error };
            }
        }


        // updating data to mongo
        await updateUserDetails(userDetails?.userId as string, name, username, bio, publicUrl as string)

        const newUserDetails = await getUserDetailsFromEmail(session?.user?.email as string);
        setUserDetails(newUserDetails);
    }

    return (<>
        <div className={styles.main}>
            {showLoadingPage &&
                <LoadingPage />
            }
            <div className={styles.tab}>
                <a href="/settings">
                    <div className={styles.tabNameDiv}>
                        <ArrowLeft />
                        <h1>Back to settings</h1>
                    </div>
                </a>
            </div>
            <div className={styles.mainContent}>
                <ToastContainer
                    position="bottom-center"
                    autoClose={1500}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Flip}
                />
                <div className={styles.photosSection}>
                    <Image className={styles.pfp} src={avatar || userDetails?.imageUrl || pfp} height={200} width={200} alt="" onClick={() => fileInputRef?.current?.click()} />
                    <Button onClick={() => fileInputRef?.current?.click()}><Camera/> Change Picture</Button>
                </div>
                <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />



                {selectedImage && (
                    <div className={styles.cropModal}>
                        <div className={styles.cropImageDiv}>
                            <ReactCrop
                                crop={crop as Crop} onChange={(newCrop) => {
                                    setCrop({
                                        // ...crop,
                                        ...newCrop,
                                    });
                                    console.log("crop: ", newCrop)
                                }}
                                onComplete={handleCropComplete}
                                aspect={1}>

                                <img
                                    ref={imageRef}
                                    src={selectedImage as string}
                                    alt="Crop preview"
                                    className={styles.cropImage}
                                    onLoad={onImageLoad} />

                            </ReactCrop>
                        </div>
                        <div className={styles.cropBtnSection}>
                            <button
                                onClick={saveCroppedImage}
                                className={styles.cropButton}>
                                Save Crop
                            </button>
                            <button className={styles.cancelBtn} onClick={() => setSelectedImage(null)}>Cancel</button>
                        </div>


                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                )}

                {/* Hidden Canvas for Cropping */}

                <div className={styles.detailsHolder}>
                    <div className={styles.detailCard}>
                        <h1>Name</h1>
                        <Input ref={nameRef} defaultValue={userDetails?.name} />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Username</h1>
                        <Input ref={usernameRef} defaultValue={userDetails?.userName} />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Bio</h1>
                        <textarea ref={bioRef} defaultValue={userDetails?.bio} />
                    </div>
                </div>
                <div className={styles.actionBtns}>
                    <Button className={styles.resetBtn} onClick={() => {
                        if (nameRef.current && usernameRef.current && bioRef.current && userDetails) {
                            nameRef.current.value = userDetails?.name
                            usernameRef.current.value = userDetails.userName
                            bioRef.current.value = userDetails.bio
                            setAvatar(null);
                        }
                    }}>
                        <RotateCcw /> Reset
                    </Button>
                    <Button loading={saveLoader} className={styles.saveBtn} onClick={async () => {
                        setSaveLoader(true);
                        await applyChangesFunction();
                        setSaveLoader(false);
                        toast.success('Updated profile', {
                            position: "top-center",
                            autoClose: 1500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark"
                        });
                    }}>
                        <Save /> Save
                    </Button>
                </div>

            </div>
        </div></>)
}