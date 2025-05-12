const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query')?.toLowerCase() || "";

    const movies = [
      { title: "Mulan", img: "../images/mulan.jpg" },
      { title: "Barbie", img: "../images/barbie.jpg" },
      { title: "Hitman", img: "../images/hitman.webp" },
      { title: "Joker 2", img: "../images/joker_2.jpeg" },
      { title: "Moana 2", img: "../images/moana_2.jpg" },
      { title: "Interstellar", img: "../images/interstellar.jpg" },
      { title: "Damsel", img: "../images/damsel.webp" },
      { title: "Uglies", img: "../images/uglies.jpg" },
      { title: "The Amazing Spider-Man", img: "../images/amazingspiderman.jpg" },
      { title: "Maleficent", img: "../images/maleficent.jpeg" },
    ];

    const actors = [
      { name: "Liu Yi Fei", img: "../images/liuyifei.webp", link: "actor-profile.html?actor=liuyifei" },
      { name: "Margot Robbie", img: "../images/margot.webp", link: "actor-profile.html?actor=margot" },
      { name: "Glen Powell", img: "../images/glen.webp", link: "actor-profile.html?actor=glen" },
      { name: "Joaquin Phoenix", img: "../images/joaquin.webp", link: "actor-profile.html?actor=joaquin" },
      { name: "Matthew McConaughey", img: "../images/matthew.webp", link: "actor-profile.html?actor=matthew" },
      { name: "Millie Bobby Brown", img: "../images/millie.webp", link: "actor-profile.html?actor=millie" },
    ];

    const resultsContainer = document.getElementById("results");
    const resultCount = document.getElementById("result-count");
    let count = 0;

    movies.forEach(movie => {
      if (movie.title.toLowerCase().includes(query)) {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
          <a href="../html/moviedesc.html?title=${encodeURIComponent(movie.title)}" class="text-decoration-none text-dark">
            <div class="card movie-card text-center">
              <img src="${movie.img}" class="card-img-top movie-img" alt="${movie.title}">
              <div class="card-body p-1"><h6 class="movie-title">${movie.title}</h6></div>
            </div>
          </a>
        `;
        resultsContainer.appendChild(col);
        count++;
      }
    });

    actors.forEach(actor => {
      if (actor.name.toLowerCase().includes(query)) {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
          <a href="${actor.link}" class="text-decoration-none">
            <div class="card movie-card text-center">
              <img src="${actor.img}" class="card-img-top movie-img" alt="${actor.name}">
              <div class="card-body p-1"><h6 class="movie-title">${actor.name}</h6></div>
            </div>
          </a>
        `;
        resultsContainer.appendChild(col);
        count++;
      }
    });

    resultCount.textContent = count > 0 ? `${count} result(s) found for "${query}"` : `No results found for "${query}".`;