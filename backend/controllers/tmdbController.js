const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Debug log
console.log('TMDB Controller loaded, API_KEY present:', !!API_KEY);

// Get trending movies
exports.getTrendingMovies = async (req, res) => {
    try {
        console.log('Attempting to fetch trending movies...');
        console.log('Request URL:', `${BASE_URL}/trending/movie/week`);
        
        const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
            params: {
                api_key: API_KEY
            }
        });

        console.log('TMDB API Response status:', response.status);
        
        const movies = (response.data.results || [])
            .slice(0, 10)
            .map(movie => ({
                id: movie.id,
                title: movie.title,
                img: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'images/damsel.webp'
            }));

        res.json(movies);
    } catch (error) {
        console.error('Error fetching trending movies:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
};

// Get trending actors
exports.getTrendingActors = async (req, res) => {
    try {
        console.log('Attempting to fetch trending actors...');
        
        const response = await axios.get(`${BASE_URL}/trending/person/week`, {
            params: {
                api_key: API_KEY
            }
        });

        console.log('TMDB API Response status:', response.status);
        
        const actors = (response.data.results || [])
            .filter(p => p.known_for_department === "Acting")
            .filter(person => /^[a-zA-Z\s.'-]+$/.test(person.name))
            .slice(0, 6)
            .map(person => ({
                id: person.id,
                name: person.name,
                image: person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : "images/default-profile.webp",
                profile_path: person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : "images/default-profile.webp",
                popularity: person.popularity,
                known_for: person.known_for || []
            }));

        res.json(actors);
    } catch (error) {
        console.error('Error fetching trending actors:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch trending actors' });
    }
};

// Get popular movies
exports.getPopularMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        console.log('Fetching popular movies page:', page);

        const response = await axios.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                page: page
            }
        });

        const movies = (response.data.results || []).map(movie => ({
            id: movie.id,
            title: movie.title,
            img: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'images/damsel.webp'
        }));

        res.json({
            page: response.data.page,
            total_pages: response.data.total_pages,
            total_results: response.data.total_results,
            results: movies
        });
    } catch (error) {
        console.error('Error fetching popular movies:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
};

// Get movie details
exports.getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id;
        console.log('Fetching details for movie:', movieId);

        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: API_KEY,
                language: 'en-US'
            }
        });

        const movieDetails = {
            ...response.data,
            poster_path: response.data.poster_path ? `${IMAGE_BASE}${response.data.poster_path}` : 'images/default-movie.jpg'
        };

        res.json(movieDetails);
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
};

// Get movie credits (cast)
exports.getMovieCredits = async (req, res) => {
    try {
        const movieId = req.params.id;
        console.log('Fetching credits for movie:', movieId);

        const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
            params: {
                api_key: API_KEY
            }
        });

        // Process cast data
        let cast = response.data.cast
            .filter(actor => actor.profile_path && /^[a-zA-Z\s.'-]+$/.test(actor.name))
            .slice(0, 6)
            .map(actor => ({
                id: actor.id,
                name: actor.name,
                profile_path: `${IMAGE_BASE}${actor.profile_path}`,
                character: actor.character
            }));

        res.json({ cast });
    } catch (error) {
        console.error('Error fetching movie credits:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch movie credits' });
    }
};

// Get popular actors
exports.getPopularActors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        console.log('Fetching popular actors page:', page);

        const response = await axios.get(`${BASE_URL}/person/popular`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                page: page
            }
        });

        // Filter and process actors
        const actors = response.data.results
            .filter(person => /^[a-zA-Z\s.'-]+$/.test(person.name))
            .map(person => ({
                id: person.id,
                name: person.name || "Unknown",
                image: person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : "images/default-profile.webp",
                popularity: person.popularity,
                known_for: person.known_for?.map(work => ({
                    id: work.id,
                    title: work.title || work.name,
                    media_type: work.media_type
                })) || []
            }));

        res.json({
            page: response.data.page,
            total_pages: response.data.total_pages,
            total_results: response.data.total_results,
            results: actors
        });
    } catch (error) {
        console.error('Error fetching popular actors:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch popular actors' });
    }
};

// Get actor details
exports.getActorDetails = async (req, res) => {
    try {
        const actorId = req.params.id;
        console.log('Fetching details for actor:', actorId);

        const response = await axios.get(`${BASE_URL}/person/${actorId}`, {
            params: {
                api_key: API_KEY,
                language: 'en-US'
            }
        });

        const actorDetails = {
            ...response.data,
            profile_path: response.data.profile_path ? `${IMAGE_BASE}${response.data.profile_path}` : 'images/default-profile.webp'
        };

        res.json(actorDetails);
    } catch (error) {
        console.error('Error fetching actor details:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch actor details' });
    }
};

// Get actor filmography
exports.getActorFilmography = async (req, res) => {
    try {
        const actorId = req.params.id;
        console.log('Fetching filmography for actor:', actorId);

        const response = await axios.get(`${BASE_URL}/person/${actorId}/movie_credits`, {
            params: {
                api_key: API_KEY,
                language: 'en-US'
            }
        });

        // Process and filter movies
        const movies = response.data.cast
            .filter(movie => movie.poster_path) // only include movies with posters
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0)) // sort by popularity
            .slice(0, 10) // limit to top 10
            .map(movie => ({
                id: movie.id,
                title: movie.title,
                character: movie.character,
                popularity: movie.popularity,
                poster_path: `${IMAGE_BASE}${movie.poster_path}`,
                release_date: movie.release_date
            }));

        res.json({ cast: movies });
    } catch (error) {
        console.error('Error fetching actor filmography:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch actor filmography' });
    }
};
