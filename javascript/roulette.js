// Load roulette.css if not already loaded
const cssHref = '../stylesheet/roulette.css';
const linkExists = [...document.styleSheets].some(s => s.href && s.href.includes('roulette.css'));

if (!linkExists) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssHref;
  document.head.appendChild(link);
}

// Load the modal HTML
fetch('../html/roulette.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('roulette-modal-container').innerHTML = html;

    // Attach overlay event listeners here — immediately after HTML is injected
    const resultModalEl = document.getElementById("resultModal");
    const rouletteDimOverlay = document.getElementById("rouletteDimOverlay");

    resultModalEl.addEventListener("show.bs.modal", () => {
    if (rouletteDimOverlay) rouletteDimOverlay.style.display = "block";
    });

    resultModalEl.addEventListener("hidden.bs.modal", () => {
    if (rouletteDimOverlay) rouletteDimOverlay.style.display = "none";
    });

    const wheel = document.querySelector('.wheel');
    const spinBtn = document.querySelector('.spinBtn');
    const shuffleBtn = document.querySelector('.shuffleBtn');
    const segments = document.querySelectorAll('.wheel .number');
    const movieKeys = Object.keys(movieData);
    const segmentCount = segments.length; // Should be 8
    const movieCount = movieKeys.length;
    let currentRotation = 0;
    
    function generateRandomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 60%)`; // nice saturation and lightness
    }

    function shuffleMoviesAndUpdateWheel() {
      // 1. Shuffle the movieKeys array (Fisher-Yates shuffle algorithm)
      for (let i = movieKeys.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [movieKeys[i], movieKeys[j]] = [movieKeys[j], movieKeys[i]];
      }

      // 2. Update the text content and color of each segment
      segments.forEach((segment, index) => {
          const spanElement = segment.querySelector('span');
          if (spanElement && movieKeys[index]) {
              spanElement.textContent = movieKeys[index];
              segment.style.setProperty('--clr', generateRandomColor());
          } else if (segment) {
              segment.style.display = 'none'; // Hide extra segments if any
          }
      });
    }

    // Initial population of the wheel
    segments.forEach((segment, index) => {
      const spanElement = segment.querySelector('span');
      if (spanElement && movieKeys[index]) {
          spanElement.textContent = movieKeys[index];
      }
      segment.style.setProperty('--clr', generateRandomColor()); // Initial random colors
    });


    spinBtn.onclick = function () {
      const spinDegrees = Math.ceil(Math.random() * 3600);
      currentRotation += spinDegrees;

      wheel.style.transform = `rotate(${currentRotation}deg)`;

      const segmentAngle = 360 / segmentCount;
      const normalizedRotation = currentRotation % 360;
      const winningIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) % 360 / segmentAngle);
      const winningMovieName = segments[winningIndex].querySelector('span').textContent;

      setTimeout(() => {
          const movie = movieData[winningMovieName];
          if (movie) {
              document.getElementById("resultPoster").src = movie.poster;
              document.getElementById("resultTitle").textContent = winningMovieName;
              document.getElementById("resultInfo").textContent = movie.info;
              document.getElementById("resultDuration").textContent = movie.duration;

              const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
              resultModal.show();
          }
      }, 5100); // Wait until the spin animation ends
    };

    // Add event listener for the shuffle button
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shuffleMoviesAndUpdateWheel);
    }
});


  const movieData = {
    "Interstellar": {
      poster: "../images/interstellar.jpg",
      info: "Sci-Fi, Adventure • 2014",
      duration: "2h 49m"
    },
    "Barbie": {
      poster: "../images/barbie.jpg",
      info: "Fantasy, Comedy • 2023",
      duration: "1h 54m"  
    },
    "Mulan": {
      poster: "../images/mulan.jpg",
      info: "Action, Adventure • 2020",
      duration: "1h 55m"
    },
    "Moana 2": {
      poster: "../images/moana_2.jpg",
      info: "Action, Superhero • 2019",
      duration: "1h 55m"
    },
    "Begin Again": {
      poster: "../images/beginagain.jpg",
      info: "Fantasy, Action • 2016",
      duration: "1h 55m"
    },
    "La La Land": {
      poster: "../images/lalaland.jpg",
      info: "Musical, Romance • 2016",
      duration: "2h 8m"
    },
    "Flipped": {
      poster: "../images/flipped.jpg",
      info: "Romance, Drama • 2010",
      duration: "1h 30m"
    },
    "Hitman": {
      poster: "../images/hitman.webp",
      info: "Sci-Fi, Fantasy • 2009",
      duration: "1h 30m"
    },
    "Joker 2": {
      poster: "../images/joker_2.jpeg",
      info: "Thriller, Fantasy • 2009",
      duration: "1h 30m"
    },
    "Letters to Juliet": {
      poster: "../images/letterstojuliet.jpg",
      info: "Romance, Drama • 2009",
      duration: "1h 30m"
    },
    "The Age of Adaline": {
      poster: "../images/theageofadaline.jpg",
      info: "Romcance, Fantasy • 2009",
      duration: "1h 30m"
    },
    "The Hunger Games": {
      poster: "../images/thehungergames.jpg",
      info: "Sci-Fi, Fantasy • 2009",   
      duration: "1h 30m"
    },
    "Twisters": {
      poster: "../images/Twister.webp",
      info: "Science, Thriller • 2009",
      duration: "1h 30m"
    },
    "Uglies": {
      poster: "../images/uglies.jpg",
      info: "Sci-Fi, Fantasy • 2009",
      duration: "1h 30m"
    }
  };
  