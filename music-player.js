const songs = [
    { title: "hisohkah - school rooftop", file: "music/hisohkah - school rooftop - hisohkah.mp3" },
    { title: "Instupendo - Six Forty Seven", file: "music/Instupendo - Six Forty Seven - Instupendo.mp3" },
  ];
  
  let currentSongIndex = 0;
  
  const playButton = document.getElementById('play-btn');
  const pauseButton = document.getElementById('pause-btn');
  const nextButton = document.getElementById('next-btn');
  const songTitle = document.getElementById('song-title');
  const audio = document.getElementById('audio');
  
  function loadSong(index) {
    audio.src = songs[index].file;
    songTitle.textContent = songs[index].title;
  }
  
  function playSong() {
    audio.play();
  }
  
  function pauseSong() {
    audio.pause();
  }
  
  function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
  }
  audio.addEventListener('ended', nextSong);
  playButton.addEventListener('click', playSong);
  pauseButton.addEventListener('click', pauseSong);
  nextButton.addEventListener('click', nextSong);
  
  loadSong(currentSongIndex);
  