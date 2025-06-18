const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Get filtered movies
exports.getFilteredMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let genres = req.query.genres || '';
        const sort = req.query.sort || 'popularity.desc';
        let yearRange = req.query.yearRange || null;

        // If genres is an array, join it; if it's a string, use as is
        if (Array.isArray(genres)) {
            genres = genres.join(',');
        }

        let params = {
            api_key: API_KEY,
            language: 'en-US',
            page,
            sort_by: sort
        };
        // Use correct TMDB param name for vote count
        params['vote_count.gte'] = 100;

        if (genres && genres.length > 0) {
            params.with_genres = genres;
        }

        if (yearRange) {
            try {
                const { start, end } = JSON.parse(yearRange);
                params['primary_release_date.gte'] = `${start}-01-01`;
                params['primary_release_date.lte'] = `${end}-12-31`;
            } catch (e) {
                console.warn('Invalid yearRange param:', yearRange);
            }
        }

        console.log('TMDB Discover Params:', params);
        const response = await axios.get(`${BASE_URL}/discover/movie`, { params });

        const movies = (response.data.results || [])
            .filter(movie => movie.poster_path) // Only include movies with images
            .map(movie => ({
                id: movie.id,
                title: movie.title,
                img: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'images/default-movie.jpg',
                release_date: movie.release_date,
                vote_average: movie.vote_average
            }));

        res.json({
            page: response.data.page,
            total_pages: Math.min(response.data.total_pages, 500),
            total_results: response.data.total_results,
            results: movies
        });
    } catch (error) {
        console.error('Error fetching filtered movies:', error.message);
        if (error.response) {
            console.error('TMDB API Error Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch filtered movies' });
    }
};

// Get all available genres
exports.getGenres = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
            params: {
                api_key: API_KEY,
                language: 'en-US'
            }
        });
        res.json(response.data.genres);
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
};
