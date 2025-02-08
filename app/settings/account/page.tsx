"use client"

import styles from "./settings.module.css"
import Image from "next/image"
import pfp from "../../../public/pfp.jpeg"
import banner from "../../../public/banner.jpg"
import { Input } from "@/components/ui/input"

import { ArrowLeft, RotateCcw, Save } from "lucide-react"
import { appStore } from "@/app/store"
import { useSession } from "next-auth/react"
import { ChangeEvent, ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from "react"
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail"
import { Button } from "@radix-ui/themes"

import React from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";



export default function AccountsPage() {

    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    const { data: session } = useSession();

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res);
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
                        width: 50, // 50% width, adjust as needed
                    },
                    1,
                    // Aspect ratio 1:1 (square)
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
        setCompletedCrop(crop);
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



    return (<>
        <div className={styles.main}>
            <div className={styles.tab}>
                <a href="/settings">
                    <div className={styles.tabNameDiv}>
                        <ArrowLeft />
                        <h1>Back to settings</h1>
                    </div>
                </a>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.photosSection}>
                    <Image className={styles.banner} src={banner} alt="" />
                    <Image className={styles.pfp} src={avatar || userDetails?.imageUrl || pfp} height={200} width={200} alt="" onClick={() => fileInputRef?.current?.click()} />
                    <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />

                </div>


                {selectedImage && (
                    <div className={styles.cropModal}>
                        <div className={styles.cropImageDiv}>
                            <ReactCrop
                                crop={crop as Crop} onChange={(newCrop) => {
                                    setCrop({
                                        ...crop,
                                        ...newCrop,
                                    });
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
                        <Input defaultValue={userDetails?.name} />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Username</h1>
                        <Input defaultValue={userDetails?.userName} />
                    </div>
                    <div className={styles.detailCard}>
                        <h1>Bio</h1>
                        <textarea defaultValue={userDetails?.bio} />
                    </div>
                </div>
                <div className={styles.actionBtns}>
                    <Button className={styles.resetBtn}>
                        <RotateCcw /> Reset
                    </Button>
                    <Button className={styles.saveBtn}>
                        <Save /> Save
                    </Button>
                </div>



            </div>
        </div></>)
}