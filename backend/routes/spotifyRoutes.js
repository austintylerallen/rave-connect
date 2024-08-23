// backend/routes/spotifyRoutes.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/token', async (req, res) => {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
        params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            params
        );

        const accessToken = tokenResponse.data.access_token;
        res.json({ accessToken });
    } catch (err) {
        console.error('Error fetching Spotify token:', err.response.data);
        res.status(500).json({ message: 'Failed to fetch Spotify token' });
    }
});

module.exports = router;
