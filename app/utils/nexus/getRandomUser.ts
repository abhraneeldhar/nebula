import { supabase } from "../supabase/client";

export async function getRandomName() {
    const charecters = [
        "Walter White", "Jesse Pinkman", "Saul Goodman", "Gus Fring", "Hank Schrader",
        "Tony Stark", "Steve Rogers", "Thor", "Bruce Banner", "Natasha Romanoff", "Clint Barton", "Loki", "Thanos",
        "Bruce Wayne", "Clark Kent", "Diana Prince", "Barry Allen", "Arthur Curry", "Lex Luthor", "Joker", "Harley Quinn",
        "Jon Snow", "Daenerys Targaryen", "Arya Stark", "Tyrion Lannister", "Cersei Lannister", "Jaime Lannister", "Bran Stark", "The Night King",
        "Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Voldemort", "Severus Snape", "Draco Malfoy", "Sirius Black", "Hagrid",
        "Luke Skywalker", "Darth Vader", "Princess Leia", "Han Solo", "Obi-Wan Kenobi", "Yoda", "Boba Fett", "Emperor Palpatine", "Kylo Ren", "Rey", "Darth Maul",
        "Sherlock Holmes", "Dr. John Watson", "Moriarty", "Mycroft Holmes",
        "Rick Sanchez", "Morty Smith", "Summer Smith", "Beth Smith", "Jerry Smith",
        "Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake", "Itachi Uchiha", "Madara Uchiha", "Hinata Hyuga", "Jiraiya", "Orochimaru",
        "Monkey D. Luffy", "Roronoa Zoro", "Nami", "Sanji", "Usopp", "Trafalgar Law", "Shanks", "Blackbeard", "Kaido",
        "Goku", "Vegeta", "Frieza", "Piccolo", "Gohan", "Majin Buu", "Cell", "Trunks",
        "Batman", "Superman", "Wonder Woman", "The Flash", "Green Lantern", "Aquaman", "The Riddler", "Penguin",
        "Homer Simpson", "Marge Simpson", "Bart Simpson", "Lisa Simpson", "Mr. Burns", "Ned Flanders", "Moe Szyslak", "Mickey Mouse", "Donald Duck", "Goofy", "Minnie Mouse", "Pluto", "Shrek", "Donkey", "Fiona", "Lord Farquaad", "Puss in Boots",
        "Hiccup", "Toothless", "Astrid", "Po", "Master Shifu", "Tigress", "Tai Lung", "Oogway", "Winnie the Pooh", "Tigger", "Eeyore", "Piglet", "Christopher Robin",
        "SpongeBob SquarePants", "Patrick Star", "Squidward Tentacles", "Mr. Krabs", "Sandy Cheeks", "Plankton", "Gary the Snail",
        "Woody", "Buzz Lightyear", "Jessie", "Rex", "Hamm", "Lotso",
        "Elsa", "Anna", "Olaf", "Kristoff", "Sven",
        "Lightning McQueen", "Mater", "Doc Hudson", "Sally Carrera", "Chick Hicks",
        "Gru", "Minions", "Vector", "Dr. Nefario",
        "Eren Yeager", "Mikasa Ackerman", "Armin Arlert", "Levi Ackerman", "Erwin Smith", "Reiner Braun",
        "Eleven", "Mike Wheeler", "Dustin Henderson", "Lucas Sinclair", "Will Byers", "Jim Hopper", "Steve Harrington",
        "Neo", "Trinity", "Morpheus", "Agent Smith", "The Oracle",
        "Jack Sparrow", "Will Turner", "Elizabeth Swann", "Davy Jones", "Hector Barbossa",
        "James Bond", "M", "Q", "Vesper Lynd"]

    const randomName = charecters[Math.floor(Math.random() * charecters.length)];

    return(randomName);
}

export async function getRandomImage(){
    const { data: defaultProfilePics, error: e1 } = await supabase
        .storage
        .from('profilePics')
        .list('default')
    if (defaultProfilePics) {
        const randomPfp = defaultProfilePics[Math.floor(Math.random() * defaultProfilePics.length)]

        const { data: publicUrl } = supabase
            .storage
            .from('profilePics')
            .getPublicUrl(`default/${randomPfp.name}`)


        if(publicUrl){
            return publicUrl.publicUrl;
        }
        else{
            return null;
        }
}}