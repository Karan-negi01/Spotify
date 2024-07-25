console.log("lets gooo")
let currentsong = new Audio();
let songs;

function formatTime(seconds) {
    // Check if seconds is undefined, null, or not a valid number
    if (typeof seconds !== 'number' || isNaN(seconds) || !isFinite(seconds)) {
        return '0:00'; // Default to "0:00" or any other appropriate default value
    }

    seconds = Math.round(seconds);
    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Format the time as "m:ss"
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}











async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}

const playMusic = (track, pause = false) => {
    //let audio= new Audio("/songs/" + track)
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}



async function main() {

    songs = await getsongs()
    playMusic(songs[0], true)


    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>  <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>karan</div>
                            </div>
                            <div class="playnow">
                                <span>PlayNow</span>
                                <img class="invert" src="play 2.svg">
                            </div>
                    
        
        </li>`;

    }

    //attach event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })


    //attach event listener to next,play,previous//
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play 2.svg"
        }
    })

    //listen for timeupdte event//
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    previous.addEventListener("click", () => {
        console.log("previous clicked")
        
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])
        }
    })

    //add an event listener to previous and next//
    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) > length) {

            playMusic(songs[index + 1])
        }
    })


    //add an event listener to range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("setting colume to", e.target.value)
        currentsong.volume=parseInt(e.target.value)/100
    })

}
//functoin

main()
