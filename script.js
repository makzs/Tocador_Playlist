/* Declaração das constantes */

/*IDs e classes */
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

/* Playlist */
const karmaPolice = {
    songName: 'Karma Police',
    artist: 'Radiohead',
    song: 'Karma_Police',
    disco: 'okComputer',
    liked: false
};
const HayloftII = {
    songName: 'Hayloft II',
    artist: 'Mother Mother',
    song: 'Hayloft_II',
    disco: 'hayloft',
    liked: false
};
const MasterOfPuppets = {
    songName: 'Master of Puppets',
    artist: 'Metalica',
    song: 'Master_of_Puppets',
    disco: 'puppets',
    liked: false
};

/* Fim das constantes */


/* Declaração das variáveis */

/* Variáveis auxiliares */
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

/* Manipulação da playlist */
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [karmaPolice, HayloftII,MasterOfPuppets];
let sortedPlaylist = [...originalPlaylist]; 
let index = 0;

/* Fim das variáveis */


/* Declaração das funções */


/* Função de iniciar a música */
function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

/* Função de pausar a música */
function pauseSong(){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    song.pause();
    isPlaying = false;
}

/* Função de verificar se a música esta pausada */
function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else{
        playSong();
    }
}

/* Função de desenhar o botão de like */
function likeButtonRender(){
    if(sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
    else{
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.classList.remove('button-active');
    }
}

/* Função de inicializar o layout da música indicada */
function initializeSong(){
    cover.src = `images/${sortedPlaylist[index].disco}.jpg`;
    song.src = `songs/${sortedPlaylist[index].song}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

/* Função de ir para música anterior */
function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;

    }
    else{
        index -= 1;
    }
    initializeSong();
    playSong();
}

/* Função de ir para próxima música */
function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;

    }
    else{
        index += 1;
    }
    initializeSong();
    playSong();
}

/* Função de atualizar o progresso da música */
function updateProgress(){
    const barwidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barwidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

/* Função de manipular o progresso da música */
function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width) * song.duration;
    song.currentTime = jumpToTime;
}

/* Função de embaralhar a playlist */
function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()*size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;

    }
}

/* função de leitura do botão de embaralhar */
function shuffleButtonClick(){
    if (isShuffled === false){
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else{
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

/* Função do botão de repetir música */
function repeatButtonClick(){
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else{
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

/* Função de pulo ou repetição de música automatico */
function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }
    else{
        playSong();
    }
}

/* Função de calculo do tempo da música */
function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return(`${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
}

/* Função de atualizar o tempo total da música */
function updateTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);
}

/* Função de interação do botão de like */
function likeButtonClick(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }
    else{
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

/* Fim das funções */

/* Eventos */

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClick);
repeatButton.addEventListener('click', repeatButtonClick);
likeButton.addEventListener('click', likeButtonClick);

/* Fim dos eventos */