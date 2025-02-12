import styles from "./tweetCard.module.css"

export interface tweetType {
    name: string,
    username: string,
    tweetContent: string,
    link:string,
}

export default function TweetCard({ tweet }: { tweet: tweetType }) {
    return (
        <a href={tweet.link} target="_blank">
        <div className={styles.tweetCard}>
            <h1>{tweet.name}</h1>
            <p>@{tweet.username}</p>
            <div className={styles.tweetContent}>
                <p>
                    {tweet.tweetContent}
                </p>
            </div>
        </div>
        </a>
    )

}