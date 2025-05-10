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
  "ray": {
    name: "Ray Winstone",
    image: "../images/ray.webp",
    bio: "Raymond Andrew Winstone (born February 19, 1957) is an English television, stage, film, and voice-over actor with a career spanning five decades. Having worked with many prominent directors, including Martin Scorsese and Steven Spielberg, he is perhaps best known for his tough guy roles (usually delivered in his distinctive London accent), beginning with that of Carlin in the 1979 film Scum, and Will Scarlet in the cult TV adventure series Robin of Sherwood.",
    born: " <strong>Born:</strong> February 19, 1957 · Hackney, London, England, UK",
    filmography: [
      { title: "Damsel", poster: "../images/damsel.webp" },
    ]
  },

  "angela": {
    name: "Angela Basett",
    image: "../images/angela.webp",
    bio: "Angela Evelyn Bassett (born August 16, 1958) is an American actress. Known for her work in film and television since the 1980s, she has received various accolades, including a Primetime Emmy Award and two Golden Globe Awards, as well as nominations for two Academy Awards. In 2023, Time magazine named her one of the 100 most influential people in the world, and she received an Academy Honorary Award.",
    born: " <strong>Born:</strong> August 16, 1958 · New York City, New York, USA",
    filmography: [
      { title: "Damsel", poster: "../images/damsel.webp" },
    ]
  },

  "brooke": {
    name: "Brooke Carter",
    image: "../images/brooke.webp",
    bio: "Brooke Carter is known for Damsel (2024), The Peripheral (2022) and The Alienist (2018).",
    born: " <strong>Born:</strong> May 31, 2010 · Coventry, England, United Kingdom",
    filmography: [
      { title: "Damsel", poster: "../images/damsel.webp" },
    ]
  },
  "nick": {
    name: "Nick Robinson",
    image: "../images/nick.webp",
    bio: "Nicholas John , Nick Robinson (born March 22, 1995) is an American actor. As a child, he appeared in stage productions of A Christmas Carol and Mame (both in 2008), following which he starred in the television sitcom Melissa & Joey (2010–2015). He went on play a supporting role in the highly successful science fiction film Jurassic World (2015) and took on lead roles in several teen dramas, including The Kings of Summer (2013), The 5th Wave (2016), and Everything, Everything (2017). In 2018, Robinson starred as the titular protagonist Simon Spier in the romantic comedy-drama film Love, Simon.",
    born: " <strong>Born:</strong> March 22, 1995 · Seattle, Washington, USA",
    filmography: [
      { title: "Damsel", poster: "../images/damsel.webp" },
    ]
  },
  "robin": {
    name: "Robin Wright",
    image: "../images/robin.webp",
    bio: "Robin Gayle Wright (born April 8, 1966) is an American actress. She is best known for her roles as Jenny Curran in Forrest Gump, as Buttercup in The Princess Bride, and as Mary Surratt in The Conspirator. She has also been credited as Robin Wright Penn.",
    born: " <strong>Born:</strong> April 8, 1966 · Dallas, Texas, USA",
    filmography: [
      { title: "Damsel", poster: "../images/damsel.webp" },
    ]
  },
  "constance": {
    name: "Costance Wu",
    image: "../images/constance.webp",
    bio: " Constance Tianming Wu (born March 22, 1982) is an American actress. She began her career in the theater, before her breakthrough role as Jessica Huang in the ABC comedy series Fresh Off the Boat. In 2017, Wu was named one of TIME magazine's 100 People Who Help Shape the World.",
    born: " <strong>Born:</strong> March 22, 1982 · Richmond, Virginia, USA",
    filmography: [
      { title: "Crazy Rich Asian", poster: "../images/crazyrichasians.jpg" },
    ]
  },
    "blake": {
      name: "Blake Lively",
      image: "../images/blake.webp",
      bio: " Blake Ellender Lively (born August 25, 1987) is an American actress, model, and director. Born in Los Angeles, Lively is the daughter of actor Ernie Lively, and made her professional debut in his directorial project Sandman (1998). She starred as Bridget Vreeland in The Sisterhood of the Traveling Pants (2005) alongside its sequel The Sisterhood of the Traveling Pants 2 (2008) to commercial success. She appeared opposite Justin Long in the comedy Accepted (2006), and gained recognition for portraying Serena van der Woodsen in the CW drama television series Gossip Girl (2007–2012).",
      born: " <strong>Born:</strong> August 25, 1987 · Los Angeles, California, USA",
      filmography: [
        { title: "The Age of Adaline", poster: "../images/theageofadaline.jpg" },
      ]
  },
  "benedict": {
    name: "Benedict Cumberbatch",
    image: "../images/benedict.webp",
    bio: " Blake Ellender Lively (born August 25, 1987) is an American actress, model, and director. Born in Los Angeles, Lively is the daughter of actor Ernie Lively, and made her professional debut in his directorial project Sandman (1998). She starred as Bridget Vreeland in The Sisterhood of the Traveling Pants (2005) alongside its sequel The Sisterhood of the Traveling Pants 2 (2008) to commercial success. She appeared opposite Justin Long in the comedy Accepted (2006), and gained recognition for portraying Serena van der Woodsen in the CW drama television series Gossip Girl (2007–2012).",
    born: " <strong>Born:</strong> August 25, 1987 · Los Angeles, California, USA",
    filmography: [
      { title: "Doctor Strange", poster: "../images/doctorstrange.jpg" },
    ]
},
"chiwetel": {
  name: "Chiwetel Ejiofor",
  image: "../images/chiwetel.webp",
  bio: " Chiwetel Umeadi Ejiofor CBE (/ˈtʃuːətɛlˈɛdʒioʊfɔːr/ CHOO-ə-tel EJ-ee-oh-for; born 10 July 1977) is a British actor. He is the recipient of various accolades, including a British Academy Film Award and a Laurence Olivier Award, in addition to nominations for an Academy Award, two Primetime Emmy Awards, and five Golden Globe Awards. In 2008, he was appointed Officer of the Order of the British Empire (OBE), and in 2015, he was appointed Commander (CBE) for his services to the arts.",
  born: " <strong>Born:</strong>July 10, 1977 · Forest Gate, London, England, UK",
  filmography: [
    { title: "Doctor Strange", poster: "../images/doctorstrange.jpg" },
  ]
},
"rachel": {
  name: "Rachel McAdams",
  image: "../images/rachel.webp",
  bio: " Rachel Anne McAdams (born November 17, 1978) is a Canadian actress. After graduating from a theatre degree program at York University in 2001, she worked in Canadian television and film productions, such as the drama film Perfect Pie (2002), for which she received a Genie Award nomination, the comedy film My Name Is Tanino (2002), and the comedy series Slings & Arrows (2003–2005), for which she won a Gemini Award.",
  born: " <strong>Born:</strong> November 17, 1978 · London, Ontario, Canada",
  filmography: [
    { title: "Doctor Strange", poster: "../images/doctorstrange.jpg" },
  ]
},
"wong": {
  name: "Benedict Wong",
  image: "../images/wong.webp",
  bio: " Benedict Wong (born 3 July 1971) is a British actor. He began his career on stage before starring in the film Dirty Pretty Things (2003), which earned him a British Independent Film Award nomination, and the BBC sitcom 15 Storeys High (2002–2004). Roles followed this in the films On a Clear Day (2005), Sunshine, Grow Your Own (both 2007), Moon (2009), and the CBBC series Spirit Warriors (2010).",
  born: " <strong>Born:</strong> June 3, 1971 · Eccles, Salford, Greater Manchester, England, UK",
  filmography: [
    { title: "Doctor Strange", poster: "../images/doctorstrange.jpg" },
  ]
},
"mads": {
  name: "Mads Mikkelson",
  image: "../images/mads.webp",
  bio: " Mads Dittmann Mikkelsen (Danish: [ˈmæsˈme̝kl̩sn̩]; born 22 November 1965) is a Danish actor. He rose to fame in Denmark as an actor for his roles such as Tonny in the first two films of the Pusher film trilogy (1996, 2004), Detective Sergeant Allan Fischer in the television series Rejseholdet (2000–2004), Niels in Open Hearts (2002), Svend in The Green Butchers (2003), Ivan in Adam's Apples (2005), and Jacob Petersen in After the Wedding (2006).",
  born: " <strong>Born:</strong> June 3, 1971 · Østerbro, Copenhagen, Denmark",
  filmography: [
    { title: "Doctor Strange", poster: "../images/doctorstrange.jpg" },
  ]
},
"tilda": {
  name: "Tilda Swinton",
  image: "../images/tilda.webp",
  bio: " Tilda Swinton (born Katherine Matilda Swinton; November 5, 1960) is an award-winning British actress of Scottish descent, known for her versatile roles in independent films and blockbusters. She is a recipient various accolades throughout her long career, including an Academy Award and two BAFTA Awards, in addition to being nominated for three Golden Globe Awards and five Screen Actors Guild Awards.",
  born: " <strong>Born:</strong> November 5, 1960  · London, England, UK",
  filmography: [
    { title: "Doctor Strange", poster: "../images/doctorstrange.jpg" },
  ]
},
"ryan": {
  name: "Ryan Gosling",
  image: "../images/ryan.webp",
  bio: " Ryan Thomas Gosling (born November 12, 1980) is a Canadian actor. Prominent in independent film, he has also worked in blockbuster films of varying genres, and has accrued a worldwide box office gross of over 1.9 billion USD. He has received various accolades, including a Golden Globe Award, and nominations for two Academy Awards and a BAFTA Award.\n\nBorn and raised in Canada, he rose to prominence at age 13 for being a child star on the Disney Channel's The Mickey Mouse Club (1993–1995), and went on to appear in other family entertainment programs, including Are You Afraid of the Dark? (1995) and Goosebumps (1996). His first film role was as a Jewish neo-Nazi in The Believer (2001), and he went on to star in several independent films, including Murder by Numbers (2002), The Slaughter Rule (2002), and The United States of Leland (2003).",
  born: " <strong>Born:</strong> November 12, 1980 · London, Ontario, Canada",
  filmography: [
    { title: "Barbie", poster: "../images/barbie.jpg" },
    { title: "La La Land", poster: "../images/lalaland.jpg" },
  ]
},
"emma": {
  name: "Emma Stone",
  image: "../images/emma.webp",
  bio: " Emily Jean Emma Stone (born November 6, 1988) is an American actress and producer. Her accolades include two Academy Awards, two British Academy Film Awards, and two Golden Globe Awards. In 2017, she was the world's highest-paid actress and was named by Time magazine as one of the 100 most influential people in the world.",
  born: " <strong>Born:</strong> November 6, 1988 · Scottsdale, Arizona, USA",
  filmography: [
    { title: "La La Land", poster: "../images/lalaland.jpg" },
  ]
},
"john": {
  name: "John Legend",
  image: "../images/john.webp",
  bio: "John Legend is an American singer, songwriter, musician, actor, and producer. He was born John Roger Stephens on December 28, 1978 in Springfield, Ohio. As of 2017, he has won ten Grammy Awards, one Golden Globe Award, and one Academy Award. He is married to model Chrissy Teigen, and they have a daughter - Luna Simone Stephens - born in 2016. The couple's second child is due in 2018.",
  born: " <strong>Born:</strong> December 28, 1978 · Springfield, Ohio, USA",
  filmography: [
    { title: "La La Land", poster: "../images/lalaland.jpg" },
  ]
},
"rosemarie": {
  name: "Rosiemaire DeWitt",
  image: "../images/rosemarie.webp",
  bio: "Rosemarie Braddock DeWitt (born October 26, 1971) is an American actress. DeWitt played Emily Lehman in the Fox television series Standoff (2006–07), co-starring with her future husband Ron Livingston, as well as Charmaine Craine on United States of Tara. She also was the title character in 2008's Rachel Getting Married, garnering several awards and nominations for best supporting actress. She starred in the horror/thriller Poltergeist (2015), a remake of the 1982 film of the same name",
  born: " <strong>Born:</strong> October 26, 1971 · Flushing, Queens, New York City, New York, USA",
  filmography: [
    { title: "La La Land", poster: "../images/lalaland.jpg" },
  ]
},
"jk": {
  name: "J.K. Simmons",
  image: "../images/jk.webp",
  bio: "Jonathan Kimble Simmons (born January 9, 1955) is an American actor. He has been cited as one of the greatest contemporary character actors, and has appeared in over 200 film and television roles since his debut in 1986. He is an Academy Award, BAFTA Award, Golden Globe Award, Screen Actors Guild Award, and Critics Choice Award winner, among other accolades.",
  born: " <strong>Born:</strong> January 9, 1955 ·Detroit, Michigan, USA",
  filmography: [
    { title: "La La Land", poster: "../images/lalaland.jpg" },
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
