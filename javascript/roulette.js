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
    const segments = document.querySelectorAll('.wheel .number');
    const segmentCount = segments.length;
    let currentRotation = 0;

    spinBtn.onclick = function () {
      const spinDegrees = Math.ceil(Math.random() * 3600);
      currentRotation += spinDegrees;

      wheel.style.transform = `rotate(${currentRotation}deg)`;

      const segmentAngle = 360 / segmentCount;
      const normalizedRotation = currentRotation % 360;
      const winningIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) % 360 / segmentAngle);
      const winningSegment = segments[winningIndex];
      const movieName = winningSegment.querySelector('span').textContent;

      setTimeout(() => {
        const movie = movieData[movieName];
        if (movie) {
            document.getElementById("resultPoster").src = movie.poster;
            document.getElementById("resultTitle").textContent = movieName;
            document.getElementById("resultInfo").textContent = movie.info;

            const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
            resultModal.show();
        }
      }, 5100); // Wait until the spin animation ends
    };
  });


  const movieData = {
    "Interstellar": {
      poster: "../images/interstellar.jpg",
      info: "Sci-Fi, Adventure • 2014"
    },
    "Barbie": {
      poster: "../images/barbie.jpg",
      info: "Fantasy, Comedy • 2023"
    },
    "Mulan": {
      poster: "../images/mulan.jpg",
      info: "Action, Adventure • 2020"
    },
    "Moana 2": {
      poster: "../images/moana_2.jpg",
      info: "Action, Superhero • 2019"
    },
    "Begin Again": {
      poster: "../images/beginagain.jpg",
      info: "Fantasy, Action • 2016"
    },
    "La La Land": {
      poster: "../images/lalaland.jpg",
      info: "Musical, Romance • 2016"
    },
    "Flipped": {
      poster: "../images/flipped.jpg",
      info: "Romance, Drama • 2010"
    },
    "Hitman": {
      poster: "../images/hitman.webp",
      info: "Sci-Fi, Fantasy • 2009"
    }
  };
  
