"use client"

import { Button } from "@radix-ui/themes";
import styles from "./skibidy.module.css"
import { Input } from "@/components/ui/input";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { Box, Circle, CircleCheckBig, Square, SquareCheck } from "lucide-react";

export default function Skibidy() {
    const [selectedFriends,setSelectedFriends]=useState<string []>([])



    const handleSelection=(userId:string)=>{
        if(!selectedFriends.includes(userId)){
            setSelectedFriends([...selectedFriends,userId])
        }
        else{
            setSelectedFriends(selectedFriends.filter((id)=>{
                if(id!=userId){
                    return true
                }
                else{
                    return false
                }
            }))
        }

    }

    useEffect(()=>{
        console.log(selectedFriends)
    },[selectedFriends])
    return (<>
    <div className={styles.main}>
        <Dialog  defaultOpen={true}>
            <DialogContent className={styles.shareDialogContent}>
                <DialogHeader>
                    <DialogTitle>Share</DialogTitle>
                    <DialogDescription>
                        Share your note with friends
                    </DialogDescription>
                </DialogHeader>
                <Input id="name" className={styles.shareInput} placeholder="search for friends.." />
                <div className={styles.searchResultContainer}>
                        <div className={styles.reqPersonCard} key={1} onClick={()=>{handleSelection("1")}} >
                            <div className={styles.reqProfilePic}>
                                <Image src="/meow.jpg" alt="pfp" height={50} width={50} unoptimized={true} />
                                <div className={styles.reqNameHolder}>
                                    <p className={styles.reqName}>Abhraneel Dhar</p>
                                    <p className={styles.reqUsername}>@abhraneeldhar</p>
                                </div>
                            </div>
                            <div>
                                {selectedFriends.includes("1")?<CircleCheckBig/>:<Circle/>}
                            </div>
                        </div>
                        <div className={styles.reqPersonCard} key={2}onClick={()=>{handleSelection("2")}} >
                            <div className={styles.reqProfilePic}>
                                <Image src="/meow.jpg" alt="pfp" height={50} width={50} unoptimized={true} />
                                <div className={styles.reqNameHolder}>
                                    <p className={styles.reqName}>Abhraneel Dhar</p>
                                    <p className={styles.reqUsername}>@abhraneeldhar</p>
                                </div>
                            </div>
                            <div>
                                {selectedFriends.includes("2")?<CircleCheckBig/>:<Circle/>}
                            </div>
                        </div>
                        <div className={styles.reqPersonCard} key={3} onClick={()=>{handleSelection("3")}}>
                            <div className={styles.reqProfilePic}>
                                <Image src="/meow.jpg" alt="pfp" height={50} width={50} unoptimized={true} />
                                <div className={styles.reqNameHolder}>
                                    <p className={styles.reqName}>Abhraneel Dhar</p>
                                    <p className={styles.reqUsername}>@abhraneeldhar</p>
                                </div>
                            </div>
                            <div>
                                {selectedFriends.includes("3")?<CircleCheckBig/>:<Circle/>}
                            </div>
                        </div>
                        <div className={styles.reqPersonCard} key={4} onClick={()=>{handleSelection("4")}}>
                            <div className={styles.reqProfilePic}>
                                <Image src="/meow.jpg" alt="pfp" height={50} width={50} unoptimized={true} />
                                <div className={styles.reqNameHolder}>
                                    <p className={styles.reqName}>Abhraneel Dhar</p>
                                    <p className={styles.reqUsername}>@abhraneeldhar</p>
                                </div>
                            </div>
                            <div>
                                {selectedFriends.includes("4")?<CircleCheckBig/>:<Circle/>}
                            </div>
                        </div>
                </div>

                <div className={styles.actionButtonContainer}>
                    <Button className={styles.closeDialogBtn}>Close</Button>
                    <Button className={styles.shareDialogBtn}>Share</Button>
                </div>
            </DialogContent>
        </Dialog>
        </div>
    </>)
}