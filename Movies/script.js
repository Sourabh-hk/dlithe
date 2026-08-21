// DOM references
const movieGrid = document.getElementById('movie-grid');
const statusMessage = document.getElementById('status-message');
const searchInput = document.getElementById('search');
const genreSelect = document.getElementById('genre');
const languageSelect = document.getElementById('language');
const ratingSelect = document.getElementById('rating');
const sortSelect = document.getElementById('sort');

const statCount = document.getElementById('stat-count');
const statAvg = document.getElementById('stat-avg');
const statHigh = document.getElementById('stat-high');
const statLatest = document.getElementById('stat-latest');

// Movie dataset
const rawMovies = [
  {
    title: "The Shawshank Redemption",
    genre: "Drama",
    rating: 9.3,
    year: 1994,
    language: "English"
  },
  {
    title: "Inception",
    genre: "Sci-Fi",
    rating: 8.8,
    year: 2010,
    language: "English"
  },
  {
    title: "Parasite",
    genre: "Thriller",
    rating: 8.5,
    year: 2019,
    language: "Korean"
  },
  {
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: 8.7,
    year: 2014,
    language: "English"
  },
  {
    title: "3 Idiots",
    genre: "Comedy",
    rating: 8.4,
    year: 2009,
    language: "Hindi"
  },
  {
    title: "Spirited Away",
    genre: "Animation",
    rating: 8.6,
    year: 2001,
    language: "Japanese"
  },
  {
    title: "The Dark Knight",
    genre: "Action",
    rating: 9.0,
    year: 2008,
    language: "English"
  },
  {
    title: "Whiplash",
    genre: "Drama",
    rating: 8.5,
    year: 2014,
    language: "English"
  },
  {
    title: "Dangal",
    genre: "Sports",
    rating: 8.3,
    year: 2016,
    language: "Hindi"
  },
  {
    title: "Your Name",
    genre: "Animation",
    rating: 8.4,
    year: 2016,
    language: "Japanese"
  },
  {
    title: "Drishyam",
    genre: "Mystery",
    rating: 8.2,
    year: 2015,
    language: "Hindi"
  },
  {
    title: "The Prestige",
    genre: "Mystery",
    rating: 8.5,
    year: 2006,
    language: "English"
  }
];

let movies = [];

// Movie data loading
// Simulate an API request with a Promise and setTimeout
function loadMovies() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 95% success rate
            const success = true;
            if (success) {
                resolve(rawMovies);
            } else {
                reject(new Error("Failed to load movies"));
            }
        }, 900);
    });
}

// Filter setup
function setupFilters(moviesData) {
    // Get unique genres and languages
    const genres = [...new Set(moviesData.map(m => m.genre))].sort();
    const languages = [...new Set(moviesData.map(m => m.language))].sort();

    // Populate Genre dropdown
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });

    // Populate Language dropdown
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        languageSelect.appendChild(option);
    });
}

// Filtering
function getFilteredMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreSelect.value;
    const selectedLanguage = languageSelect.value;
    const minRating = parseFloat(ratingSelect.value);

    return movies.filter(movie => {
        // Search filter (title, genre, or language)
        const matchesSearch =
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm) ||
            movie.language.toLowerCase().includes(searchTerm);

        // Dropdown filters
        const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
        const matchesLanguage = selectedLanguage === 'All' || movie.language === selectedLanguage;
        const matchesRating = movie.rating >= minRating;

        return matchesSearch && matchesGenre && matchesLanguage && matchesRating;
    });
}

// Sorting
function sortMovies(filteredMovies) {
    const sortValue = sortSelect.value;

    // Create a copy to avoid mutating the original array
    const sorted = [...filteredMovies];

    sorted.sort((a, b) => {
        switch (sortValue) {
            case 'rating-desc':
                return b.rating - a.rating;
            case 'rating-asc':
                return a.rating - b.rating;
            case 'year-desc':
                return b.year - a.year;
            case 'year-asc':
                return a.year - b.year;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'recommended':
            default:
                // Original order
                return 0;
        }
    });

    return sorted;
}

// Statistics
function updateStatistics(filteredMovies) {
    // Count
    statCount.textContent = filteredMovies.length;

    if (filteredMovies.length === 0) {
        statAvg.textContent = '-';
        statHigh.textContent = '-';
        statLatest.textContent = '-';
        return;
    }

    // Average Rating
    const totalRating = filteredMovies.reduce((sum, movie) => sum + movie.rating, 0);
    const avgRating = (totalRating / filteredMovies.length).toFixed(1);
    statAvg.textContent = avgRating;

    // Highest Rated
    const highestMovie = filteredMovies.reduce((prev, current) =>
        (current.rating > prev.rating) ? current : prev
    );
    statHigh.textContent = `${highestMovie.title} (${highestMovie.rating.toFixed(1)})`;

    // Latest Release
    const latestYear = Math.max(...filteredMovies.map(m => m.year));
    statLatest.textContent = latestYear;
}

// Rendering
function renderMovieCards(moviesToRender) {
    movieGrid.innerHTML = '';

    if (moviesToRender.length === 0) {
        movieGrid.classList.add('hidden');
        statusMessage.textContent = 'No movies found. Try changing your search or filters.';
        statusMessage.style.display = 'block';
        return;
    }

    movieGrid.classList.remove('hidden');
    statusMessage.style.display = 'none';

    moviesToRender.forEach(movie => {
        const firstLetter = movie.title.charAt(0).toUpperCase();

        // Generate a deterministic gradient color based on the title length
        const hue = (movie.title.length * 15) % 360;
        const gradient = `linear-gradient(135deg, hsl(${hue}, 20%, 30%) 0%, #111827 100%)`;

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="movie-poster" style="background: ${gradient}">
                <div class="movie-rating-badge">${movie.rating.toFixed(1)}</div>
                <div class="poster-letter">${firstLetter}</div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    ${movie.year} &middot; ${movie.language}
                </div>
                <div class="movie-genre">
                    <span class="genre-badge">${movie.genre}</span>
                </div>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}

function handleUpdates() {
    const filtered = getFilteredMovies();
    const sorted = sortMovies(filtered);
    updateStatistics(sorted);
    renderMovieCards(sorted);
}

// Event listeners
searchInput.addEventListener('input', handleUpdates);
genreSelect.addEventListener('change', handleUpdates);
languageSelect.addEventListener('change', handleUpdates);
ratingSelect.addEventListener('change', handleUpdates);
sortSelect.addEventListener('change', handleUpdates);

// Initial loading
function init() {
    statusMessage.textContent = 'Loading movies...';
    statusMessage.style.display = 'block';
    movieGrid.classList.add('hidden');

    loadMovies()
        .then(data => {
            movies = data;
            setupFilters(movies);
            handleUpdates();
        })
        .catch(error => {
            statusMessage.textContent = 'Could not load the movie collection. Please refresh and try again.';
            console.error(error);
        });
}

// Start application
init();
