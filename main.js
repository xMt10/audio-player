const prevButton = document.getElementById("prev");
const shuffleButton = document.getElementById("shuffle");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const repeatButton = document.getElementById("repeat");
const nextButton = document.getElementById("next");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const playlistButton = document.getElementById("playlist");
const playlistContainer = document.querySelector(".playlist-container");
const currentTimeRef = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");
const progressBar = document.getElementById("progress-bar");

let loop = true;

let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

const songsList = [
  {
    name: "Gel Gör Beni Aşk Neyledi",
    link: "audios/Gel Gör.mp3",
    artist: "Barış Akarsu",
    image: "pictures/gel.jpeg",
  },
  {
    name: "Dönence",
    link: "audios/Dönence.mp3",
    artist: "Barış Manço",
    image: "pictures/dönence.jpeg",
  },
  {
    name: "Sakarya Türküsü",
    link: "audios/Sakarya.mp3",
    artist: "Yücel Arzen",
    image: "pictures/sakarya.jpeg",
  },
  {
    name: "Gamzedeyim",
    link: "audios/Gamzedeyim.mp3",
    artist: "Barış Manço",
    image: "pictures/gamzedeyim.jpeg",
  },
  {
    name: "Masâr",
    link: "audios/Masar.mp3",
    artist: "Le Trio Joubran ",
    image: "pictures/masar.jpeg",
  },
];

//formatting time
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}.${second}`;
};

//assign the song
const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  //show time when metadata is loaded
  audio.onloadeddata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
  playlistContainer.classList.add("hide");
  playAudio();
};

//play the song
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    console.log("tekrar kapatıldı");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    console.log("tekrar açık");
  }
});

const nextSong = () => {
  //if it works normally, skip to the next
  if (loop) {
    if (index == songsList.length - 1) {
      //if at the end, go to top
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
    playAudio();
    repeatButton.classList.remove("active");
  } else {
    //find random number and play
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
    playAudio();
    repeatButton.classList.remove("active");
  }
};

const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

// if the song ends, go to the next
audio.onended = () => {
  nextSong();
};

//shuffle songs
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("karistirma kapali");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("karistirma acik");
  }
});

//play button
playButton.addEventListener("click", playAudio);

//next button
nextButton.addEventListener("click", nextSong);

//pause button
pauseButton.addEventListener("click", pauseAudio);

//previous button
prevButton.addEventListener("click", previousSong);

//Adjustment of progress bar

isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  //start progress bar
  let coordStart = progressBar.getBoundingClientRect().left;

  //mouse click point
  //false
  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;

  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  // assign time
  audio.currentTime = progress * audio.duration;

  //assign width to progress
  currentProgress.style.width = progress * 100 + "%";

  //play
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

/*
//repeat button
repeatButton.addEventListener("click", () => {
  setSong(index);
  playAudio();
});
*/

//Update progress by time
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

// create playlist

const initializePlaylist = () => {
  for (let i in songsList) {
    playlistSongs.innerHTML += `<li class="playlist"
      onclick="setSong(${i})">
      <div class="playlist-image-container"> 
        <img src="${songsList[i].image}"/>
      </div>
      <div class="playlist-song-details">
        <span id="playlist-song-name">
          ${songsList[i].name}
        </span>
        <span id="playlist-song-artist-album">
          ${songsList[i].artist}
        </span>
      </div>
      </li>`;
  }
};

console.log(playlistContainer);

//show song list
playlistButton.addEventListener("click", () => {
  playlistContainer.classList.remove("hide");
});
//close song list
closeButton.addEventListener("click", () => {
  playlistContainer.classList.add("hide");
});

window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlaylist();
};
