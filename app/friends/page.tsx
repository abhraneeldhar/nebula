"use client"
import { ChangeEvent, useEffect, useState } from "react"
import { supabase } from "@/app/utils/supabase/client";
import styles from "./friends.module.css"

import { ChevronLeft } from "lucide-react";
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
import { FriendSearch } from "../utils/friendMechanics/friendSearch";
import { getUserDetails } from "../utils/getUserDetails";
import { fetchUserId } from "../utils/fetchUserId";
import { userDetailsType } from "../setupAccount/page";
import { useSession } from "next-auth/react";



export default function Friends() {
    const [searchedFriendsList, setSearchedFriendsList] = useState<any>();
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

    const [loadingSearchResults, setLoadingSearchResults] = useState(false);

    useEffect(() => {
        const test = async () => {

            const { data, error } = await supabase
                .from('friendRequest')
                .insert([
                    { senderId: "b642cf01-c9aa-4211-8296-58ef8afca5d5", receiverId: "b642cf01-c9aa-4211-8296-58ef8afca5d5", status: "pending", createdAt: Date.now() },
                ])
                .select()
            console.log("data>>>>", data);
            console.log("error>>>", error);
        };
        // test();
    }, [])

    function PendingStatus() {
        return (<>
            <Check className={styles.acceptActionIcon} />/<X className={styles.rejectActionIcon} />
        </>)
    }
    function AcceptedStatus() {
        return (<>
            <CircleCheck className={styles.accepIcon} /> <p>Accepted</p>
        </>)
    }
    function RejectedStatus() {
        return (<>
            <CircleX className={styles.rejIcon} /> <p>Rejected</p>
        </>)
    }

    const handleFriendSearch = async (searchParam: string) => {
        if (userId && searchParam != "" && searchParam != " ") {
            setLoadingSearchResults(true);
            const friendList = await FriendSearch(userId, searchParam);
            setSearchedFriendsList(friendList);
            setLoadingSearchResults(false);
        }
        else if (searchParam == "") {
            setSearchedFriendsList([])
        }

    }


    const SearchFriendCard = ({ name, username, imgUrl }: { name: string, username: string, imgUrl: string }) => {
        return (<>
            <div className={styles.personCard}>
                <div className={styles.profilePic}>
                    <Image src={imgUrl} alt="pfp" height={50} width={50} />
                    <div className={styles.nameHolder}>
                        <p className={styles.name}>{name}</p>
                        <p className={styles.username}>@{username}</p>
                    </div>
                </div>
                <div className={styles.action}>
                    <Button>Add</Button>
                    {/* <Button color="red">Remove</Button> */}
                </div>
            </div>

        </>)
    }

    return (<>
        <div className={styles.main}>
            <div className={styles.tab}>
                <ChevronLeft className={styles.backBtn} />
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
                        <div className={styles.friendCard}>
                            <div className={styles.friendProfilePic}>
                                <Image src="/testingImages/waltuhFlip.jpg" alt="pfp" height={150} width={150} />
                            </div>
                            <div className={styles.nameHolder}>
                                <p className={styles.name}>Abhraneel Dhar</p>
                                <p className={styles.username}>@abhraneeldhar</p>
                            </div>
                        </div>
                    </div>
                </Tabs.Content>



                <Tabs.Content value="requests" className={styles.reqContent}>
                    <Table.Root className={styles.reqTable}>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row>
                                <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                                <Table.Cell>bingusdingus</Table.Cell>
                                <Table.Cell className={styles.tableCell}><PendingStatus /></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>



                <Tabs.Content value="add">
                    <div className={styles.addContainer}>

                        <div className={styles.searchBar}>
                            <Input className={styles.searchInput} placeholder="username...." onChange={(e) => {
                                handleFriendSearch(e.target.value);
                            }} />
                        </div>

                        <div className={styles.searchedPeople}>
                            {searchedFriendsList && searchedFriendsList.map((friend: userDetailsType) => (
                                <SearchFriendCard key={friend.userId} name={friend.name} username={friend.userName} imgUrl={friend.imageUrl} />
                            ))}
                            {loadingSearchResults &&
                                <Spinner className={styles.spinner} />
                            }
                        </div>
                    </div>
                </Tabs.Content>
            </Tabs.Root>

        </div>
    </>)
}