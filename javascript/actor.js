// actor.js
const actors = {
  "liuyifei": {
    name: "Liu Yi Fei",
    image: "../images/liuyifei.webp",
    bio: "Crystal Liu, better known by her stage name Liu Yifei, is a Chinese-American actress, singer, and model. She has appeared multiple times on Forbes' China Celebrity 100 list and was named one of the New Four Dan actresses of China in 2009. She is widely known as in China.",
    born: "<strong>Born:</strong> August 25, 1987, Wuhan, China",
    filmography:[
      { title: "Mulan", poster: "../images/mulan.jpg" }, 
      { title: "Meet Yourself", poster: "../images/meetyourself.webp"},
      { title: "Once Upon A Time", poster: "../images/onceuponatime.webp"}
    ]
  },
  "margot": {
    name: "Margot Robbie",
    image: "../images/margot.webp",
    bio: "Margot Elise Robbie (/ˈmɑːrɡoʊ ˈrɒbi/ MAR-goh ROB-ee; born 2 July 1990) is an Australian actress and producer. Her work includes blockbusters and independent films, and her accolades include nominations for three Academy Awards, four Golden Globe Awards, and six BAFTA Awards. Time named her one of the 100 most influential people in the world in 2017, and Forbes named her the world's highest-paid actress in 2023.",
    born: "<strong>Born:</strong> July 2, 1990 · Dalby, Queensland, Australia",
    filmography: [
      { title: "Barbie", poster: "../images/barbie.jpg" },
      { title: "Birds of Prey", poster: "../images/birdsofprey.webp"},
      { title: "The Suicide Squad", poster: "../images/thesuicidesquad.webp"}
    ]
  },
  "glen": {
    name: "Glen Powell",
    image: "../images/glen.webp",
    bio: "Glen Thomas Powell Jr. (born October 21, 1988) is an American actor. He began his career with minor roles on television and in films such as Spy Kids 3-D: Game Over (2003) and Fast Food Nation (2006). Powell acted in the action film The Expendables 3 (2014), the comedy-horror series Scream Queens (2015–2016), the teen comedy Everybody Wants Some!! (2016), the historical romance The Guernsey Literary and Potato Peel Pie Society (2018), and the romantic comedy Set It Up (2018). He also portrayed astronaut John Glenn in Hidden Figures (2016) and aviator Tom Hudner in Devotion (2022).",
    born: "<strong>Born:</strong> October 21, 1988 · Austin, Texas, USA",
    filmography: [
      { title: "Hitman", poster: "../images/hitman.webp" },
      { title: "Anyone But You", poster: "../images/anyonebutyou.webp"},
      { title: "Twister", poster: "../images/twister.webp"}
    ]
  },
  "joaquin": {
    name: "Joaquin Phoenix",
    image: "../images/joaquin.webp",
    bio: "Joaquin Rafael Phoenix (/hwɑːˈkiːn/ whah-KEEN; né Bottom; born October 28, 1974) is an American actor. Known for his roles as dark, unconventional and eccentric characters, particularly in period dramas, he has received various accolades, including an Academy Award, a British Academy Film Award, a Grammy Award, and two Golden Globe Awards. In 2020, The New York Times named him one of the greatest actors of the 21st century.",
    born: " <strong>Born:</strong> October 28, 1974 · San Juan, Puerto Rico",
    filmography: [
      { title: "Joker 2", poster: "../images/joker_2.jpeg" },
      { title: "Her", poster: "../images/her.webp"},
      { title: "Walk The Line", poster: "../images/walktheline.webp"}
    ]
  },
  "matthew": {
    name: "Matthew McConaughey",
    image: "../images/matthew.webp",
    bio: "Matthew David McConaughey (born November 4, 1969) is an American actor. He first gained notice for his supporting performance in the coming-of-age comedy Dazed and Confused (1993), which was considered by many to be his breakout role. After a number of supporting roles in films including Angels in the Outfield (1994) and Texas Chainsaw Massacre: The Next Generation (1994), his breakthrough performance as a leading man came in the legal drama A Time to Kill (1996). He followed this with leading performances in the science fiction film Contact (1997), the historical drama Amistad (1997), the comedy-drama The Newton Boys (1998), the satire EDtv (1999), the war film U-571 (2000), and the psychological thriller Frailty (2001).",
    born: "<strong>Born:</strong> November 4, 1969 · Uvalde, Texas, USA",
    filmography: [
      { title: "Interstellar", poster: "../images/interstellar.jpg" },
      { title: "Dallas Buyers Club", poster: "../images/dallasbuyersclub.webp"},
      { title: "The Lincoln Lawyer", poster: "../images/thelincolnlawyer.webp"}
    ]
  },
  "millie": {
    name: "Millie Bobby Brown",
    image: "../images/millie.webp",
    bio: "Millie Bonnie Brown Bongiovi (née Brown; born 19 February 2004), a British actress, is professionally known as Millie Bobby Brown. She gained recognition for playing Eleven in the Netflix science fiction series Stranger Things (2016–present), for which she received nominations for two Primetime Emmy Awards. Brown has starred in the monster film Godzilla: King of the Monsters (2019) and its sequel Godzilla vs. Kong (2021). She also starred in and produced the Netflix films Enola Holmes (2020), Enola Holmes 2 (2022), and Damsel (2024).",
    born: "<strong>Born:</strong> February 19, 2004 · Málaga, Andalucía, Spain",
    filmography: [
      { title: "Damsel", poster: "../images/damsel.webp" },
      { title: "Godzilla Vs Kong", poster:"../images/godzillavskong.webp"},
      { title: "Enola Holmes", poster: "../images/enolaholmes.webp"}
    ]
  },
  "joey": {
    name: "Joey King",
    image: "../images/joey.webp",
    bio: "Millie BonJoey Lynn King (born July 30, 1999) is an American actress. She first gained recognition for portraying Ramona Quimby in the comedy film Ramona and Beezus (2010) and has since gained wider recognition for her lead role in The Kissing Booth (2018) and its two sequels. King received critical acclaim for her starring role in the crime drama series The Act (2019), for which she was nominated for both a Primetime Emmy Award and a Golden Globe Award. In 2022 she played the titular role of The Princess in Disney's The Princess (movie).nie Brown Bongiovi (née Brown; born 19 February 2004), a British actress, is professionally known as Millie Bobby Brown. She gained recognition for playing Eleven in the Netflix science fiction series Stranger Things (2016–present), for which she received nominations for two Primetime Emmy Awards. Brown has starred in the monster film Godzilla: King of the Monsters (2019) and its sequel Godzilla vs. Kong (2021). She also starred in and produced the Netflix films Enola Holmes (2020), Enola Holmes 2 (2022), and Damsel (2024).",
    born: "<strong>Born:</strong>July 30 · Los Angeles, California, USA",
    filmography: [
      { title: "Uglies", poster: "../images/uglies.jpg" }
    ]
  },
  "andrew": {
    name: "Andrew Garfield",
    image: "../images/andrew.webp",
    bio: "Andrew Russell Garfield (born 20 August 1983) is an English and American actor. He came to international attention in 2010 with the supporting role of Eduardo Saverin in the drama The Social Network. He gained wider recognition for playing Spider-Man in the superhero films The Amazing Spider-Man (2012), The Amazing Spider-Man 2 (2014), and later in Spider-Man: No Way Home (2021).",
    born: "<strong>Born:</strong> August 20, 1983 · Los Angeles, California, USA",
    filmography: [
      { title: "The Amazing Spider Man", poster: "../images/amazingspiderman.jpg" }
    ]
  },
  "angelina": {
    name: "Angelina Jolie",
    image: "../images/angelina.webp",
    bio: "Angelina Jolie (/dʒoʊˈliː/ joh-LEE; born Angelina Jolie Voight, /ˈvɔɪt/; June 4, 1975) is an American actress, filmmaker, and humanitarian. The recipient of numerous accolades, including an Academy Award, a Tony Award and three Golden Globe Awards, she has been named Hollywood's highest-paid actress multiple times.",
    born: " <strong>Born:</strong> June 4, 1975 · Los Angeles, California, USA",
    filmography: [
      { title: "Maleficent", poster: "../images/maleficent.jpeg" },
    ]
  },
  "jennifer": {
    name: "Jennifer Lawrence",
    image: "../images/jennifer.webp",
    bio: "Jennifer Shrader Lawrence is an American actress. The world's highest-paid actress in 2015 and 2016, her films have grossed over $6 billion worldwide to date. She appeared in Time's 100 most influential people in the world list in 2013 and the Forbes Celebrity 100 list from 2013 to 2016.",
    born: " <strong>Born:</strong> August 15, 1990 · Louisville, Kentucky, USA",
    filmography: [
      { title: "The Hunger Game", poster: "../images/thehungergames.jpg" },
    ]
  },
};

const urlParams = new URLSearchParams(window.location.search);
const actorKey = urlParams.get("actor");
const actor = actors[actorKey];


if (actor) {
  document.getElementById("actor-img").src = actor.image;
  document.getElementById("actor-img").alt = actor.name;
  document.getElementById("actor-name").textContent = actor.name;
  document.getElementById("actor-bio").textContent = actor.bio;

  // This is where we use innerHTML to render the HTML in 'born'
  document.getElementById("actor-born").innerHTML = actor.born;

  const filmList = document.getElementById("actor-films");

  actor.filmography.forEach(film => {
    const li = document.createElement("li");
    li.classList.add("movie-card", "d-inline-block", "me-3", "text-center");

    const img = document.createElement("img");
    img.src = film.poster;
    img.alt = film.title;
    img.classList.add("movie-img");

    const title = document.createElement("div");
    title.textContent = film.title;
    title.classList.add("movie-title");

    li.appendChild(img);
    li.appendChild(title);
    filmList.appendChild(li);
  });
} else {
  document.querySelector("body").innerHTML = "<h2 class='text-center mt-5 text-light'>Actor not found</h2>";
}
