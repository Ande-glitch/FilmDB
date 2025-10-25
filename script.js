let myKey = `d8d3022d`

let inputBtn = document.getElementById("inputBtn")
let inputSearch = document.getElementById("inputSearch")

let movieTitle = document.getElementById("movieTitle")
let movieImg = document.getElementById("movieImg")
let plot = document.getElementById("plot")
let country = document.getElementById("country")
let genre = document.getElementById("genre")
let released = document.getElementById("released")
let runtime = document.getElementById("runtime")
let director = document.getElementById("director")
let rated = document.getElementById("rated")
let boxOffice = document.getElementById("boxOffice")
let year = document.getElementById("year")

let images = document.querySelectorAll(".recom")
let mov1 = document.getElementById("mov1")
let mov2 = document.getElementById("mov2")
let mov3 = document.getElementById("mov3")

let num = null
let imdbId = null
let rightCode = "tt0120338"

let recomAPI = `https://www.omdbapi.com/?i=${imdbId}&apikey=${myKey}`

let movieElements = [mov1, mov2, mov3]
let moviePosters = []
let validPosters = []
let movieTitles = []

function checkPoster(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function validateMoviePosters() { // venter til at checkPoster function funker
  for (const url of moviePosters) {
    const isValid = await checkPoster(url);
    if (isValid) {
      validPosters.push(url);
    } else {
        console.log("no");
    }
  }
  moviePosters = validPosters;
}
let deadInt = 0
function refreshRec() {
  deadInt++
  if (moviePosters.length >= 3) {
    for (let i = 0; i < movieElements.length; i++) {
      movieElements[i].src = moviePosters[i];
      movieElements[i].alt = movieTitles[i]
    }
    return; // stop code
  }
  else if (deadInt >= 100){
    return;
  }

    document.getElementById("recom-images").style.display = "flex"

    num = Math.floor(Math.random() * 9999999)
    imdbId = "tt"+num.toString().padStart(7, "0")
    recomAPI = `https://www.omdbapi.com/?i=${imdbId}&apikey=${myKey}`

    console.log(imdbId);

    fetch(recomAPI)
    .then(response => response.json())
    .then(data => {
        if (data.Response == "False" || data.Poster == "N/A") {
            refreshRec() //retry
        }
        else if (data.Response == "True" && data.Poster != "N/A" && data.Genre){
          deadInt = 0
            let img = new Image()
            img.onload = () => {
                moviePosters.push(data.Poster)
                movieTitles.push(data.Title)
                refreshRec()
            }
            img.onerror = () => {
                refreshRec()
            }
            img.src = data.Poster
        }
    })
    .catch(err => {
        refreshRec()
    })

}

function movie() {
    for (let i = 0; i < movieElements.length; i++) {
        movieElements[i].src = ""
        movieTitles[i] = ""
    }
    moviePosters = []
    movieTitles = []
    let API = `https://www.omdbapi.com/?t=${inputSearch.value}&apikey=${myKey}`    
    const randomAPI = `https://www.omdbapi.com/?s=matrix&type=movie&page=2&apikey=${myKey}`

    fetch(API)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("container2").style.display = "flex"
        movieTitle.innerHTML = data.Title
        plot.innerHTML = data.Plot
        movieImg.src = data.Poster
        country.innerHTML = data.Country
        genre.innerHTML = data.Genre
        released.innerHTML = data.Released
        runtime.innerHTML = data.Runtime
        director.innerHTML = data.Director
        rated.innerHTML = `Imdb Rating: ` + data.imdbRating
        boxOffice.innerHTML = `Box office earnings: ` + data.BoxOffice
        year.innerHTML = `Year of release: ` + data.Year
        
        
        if (data.Title == "undefined") {
            document.getElementById("info").style.display = "none"
        }
    })

    refreshRec()
    images.forEach(image => {
        image.addEventListener("click", function() {
            inputSearch.value = image.alt
        })
    })
}



document.getElementById("inputSearch").addEventListener("keypress", function(event){
    if (event.key == "Enter") {
        document.getElementById("inputBtn").click()
    }
})