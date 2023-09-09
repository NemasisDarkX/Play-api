const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('play/', async (req, res) => { 
    const { keyword } = req.query;

    const searchOptions = {
        method: 'GET',
        url: 'https://youtube-media-downloader.p.rapidapi.com/v2/search/videos',
        params: {
            keyword: keyword
        },
        headers: {
            'X-RapidAPI-Key': '7d2d1e4dc9mshd85519bfab23070p10f9a4jsn2160653ac4aa',
            'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(searchOptions);
        const data = response.data;

        if (data && data.items && data.items.length > 0) {
            const firstVideo = data.items[0];
            const firstVideoId = firstVideo.id;

            const infoOptions = {
                method: 'GET',
                url: 'https://youtube-mp36.p.rapidapi.com/dl',
                params: { id: firstVideoId },
                headers: {
                    'X-RapidAPI-Key': '7d2d1e4dc9mshd85519bfab23070p10f9a4jsn2160653ac4aa',
                    'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
                }
            };

            try {
                const infoResponse = await axios.request(infoOptions);
                const capt = `Here is the requested audio file: ${infoResponse.data.title}`;

                res.json({ message: capt, audioUrl: infoResponse.data.link });
            } catch (infoError) {
                console.error(infoError);
                res.status(500).json({ message: 'An error occurred while fetching the YouTube MP3 download link.' });
            }
        } else {
            res.status(404).json({ message: 'No videos found.' });
        }
    } catch (searchError) {
        console.error(searchError);
        res.status(500).json({ message: 'An error occurred while searching for videos.' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
