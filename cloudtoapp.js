import express from 'express';
import axios from 'axios';

const app = express();

app.get('/image', async (req, res) => {
  try {
    const imageUrl = 'https://foodsuraksha.s3.amazonaws.com/your-image.jpg';
    const response = await axios.get(imageUrl, { responseType: 'stream' });

    // Set correct content type for the image
    res.set('Content-Type', 'image/jpeg');
    response.data.pipe(res); // Stream image directly
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

app.listen(3000, () => console.log('cloud to app data app is working'));
