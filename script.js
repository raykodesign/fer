document.addEventListener('DOMContentLoaded', () => {
    
    // --- NUEVO EFECTO MOUSE: CORAZONES Y BRILLITOS ---
    let throttle = false;
    document.addEventListener('mousemove', (e) => {
        if(throttle) return;
        throttle = true;
        setTimeout(() => throttle = false, 50);

        const magicEl = document.createElement('div');
        magicEl.classList.add('magic-heart');
        const shapes = ['❤️', '💖', '✨', '🌸', '💕'];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        
        magicEl.innerHTML = randomShape;
        magicEl.style.left = (e.pageX + 10) + 'px';
        magicEl.style.top = (e.pageY + 10) + 'px';
        
        document.body.appendChild(magicEl);
        setTimeout(() => { magicEl.remove(); }, 1000);
    });

    // --- LOGICA DE INGRESO Y MUSICA ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    
    // Variables de Musica
    const audioPlayer = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');

    // --- LISTA DE CANCIONES ---
    // AQUÍ ESTÁ EL CAMBIO:
    const songs = [
        {
            title: "Te Pense, Te Soñe y Te Encontre",  // Cambia el Título aquí
            artist: "Balada",             // Cambia el Artista aquí
            src: "audio/Te Pense, Te Soñe y Te Encontre.mp3" // <--- PON AQUÍ EL NOMBRE EXACTO DE TU ARCHIVO
        },
        // Si quieres agregar otra canción de la carpeta audio, copia y pega esto:
        /*
        {
            title: "Segunda Canción",
            artist: "Otro Artista",
            src: "audio/otra_cancion.mp3"
        }
        */
    ];

    let currentSongIndex = 0;

    // Funciones del reproductor
    function loadSong(index) {
        if (!songs.length) return;
        const song = songs[index];
        songTitle.innerText = song.title;
        songArtist.innerText = song.artist;
        audioPlayer.src = song.src;
    }

    window.togglePlay = function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            if(vinyl) vinyl.classList.add('spinning');
        } else {
            audioPlayer.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            if(vinyl) vinyl.classList.remove('spinning');
        }
    };

    window.nextSong = function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        setTimeout(() => window.togglePlay(), 300);
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        if(vinyl) vinyl.classList.add('spinning');
    };

    window.prevSong = function() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        setTimeout(() => window.togglePlay(), 300);
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        if(vinyl) vinyl.classList.add('spinning');
    };

    if(audioPlayer) {
        audioPlayer.addEventListener('timeupdate', (e) => {
            const { duration, currentTime } = e.srcElement;
            const progressPercent = (currentTime / duration) * 100;
            if(progressBar) progressBar.style.width = `${progressPercent}%`;
        });
    }

    if(progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audioPlayer.duration;
            audioPlayer.currentTime = (clickX / width) * duration;
        });
    }

    // Cargar primera cancion
    loadSong(currentSongIndex);

    // --- EVENTO BOTON INGRESAR ---
    enterBtn.addEventListener('click', () => {
        enterScreen.style.opacity = '0';
        mainLayout.style.display = 'flex';
        
        // Intentar reproducir musica
        audioPlayer.volume = 0.5;
        audioPlayer.play().then(() => {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            if(vinyl) vinyl.classList.add('spinning');
        }).catch(e => console.log("Audio play blocked:", e));

        setTimeout(() => {
            enterScreen.style.display = 'none'; 
            mainLayout.classList.remove('hidden-layout'); 
            initTypewriter();
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "Mis sueños más grandes se hacen pequeños cuando conozco lo que Dios quiere hacer conmigo.";
    function initTypewriter() {
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 60);
            }
        }
        type();
    }

    // --- MODALES (POP-UPS) ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            if(modalId === 'modal-gallery') setTimeout(updateGallery3D, 100);
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    };

    // --- GALERÍA 3D ---
    const galleryImages = [
        "https://xatimg.com/image/BigAHuCKj4Dg.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryImages.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            card.innerHTML = `<img src="${src}" alt="Img ${i}">`;
            card.onclick = () => { galleryIndex = i; updateGallery3D(); };
            carouselTrack.appendChild(card);
        });
    }

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('.card-3d-gold');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        if(!container) return;
        
        const centerX = container.offsetWidth / 2;
        const cardWidth = 220 + 40; 
        const offset = centerX - (galleryIndex * cardWidth) - (220/2);

        carouselTrack.style.transform = `translateX(${offset}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    window.addEventListener('resize', updateGallery3D);
});

