const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Search endpoint using MetMuseum API
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        error: 'Search query must be a non-empty string'
      });
    }

    // Step 1: Search for object IDs matching the query
    const searchResponse = await axios.get(`${MET_API_BASE}/search`, {
      params: {
        q: query.trim(),
        hasImages: true // Only include results with images
      },
      timeout: 5000
    });

    const objectIDs = searchResponse.data.objectIDs || [];
    
    // Step 2: Fetch details for each object
    const artworks = await Promise.all(
      objectIDs.map(async id => {
        try {
          const objectResponse = await axios.get(`${MET_API_BASE}/objects/${id}`, {
            timeout: 5000
          });
          
          const artwork = objectResponse.data;
          return {
            id: artwork.objectID,
            title: artwork.title || 'Untitled',
            artist: artwork.artistDisplayName || 'Unknown artist',
            date: artwork.objectDate || 'Unknown date',
            image: artwork.primaryImageSmall || artwork.primaryImage || null,
            department: artwork.department,
            culture: artwork.culture,
            medium: artwork.medium
          };
        } catch (error) {
          console.error(`Failed to fetch details for object ${id}:`, error.message);
          return null;
        }
      })
    );

    // Filter out any failed requests
    const validArtworks = artworks.filter(artwork => artwork !== null);

    res.json(validArtworks);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      error: 'Failed to search MetMuseum collection',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});






  // Add this new endpoint for artist search
app.post('/api/search/artist', async (req, res) => {
  try {
    const { artist } = req.body;

    if (!artist || typeof artist !== 'string' || artist.trim() === '') {
      return res.status(400).json({
        error: 'Artist name must be a non-empty string'
      });
    }

    // Search for objects by artist
    const searchResponse = await axios.get(`${MET_API_BASE}/search`, {
      params: {
        q: artist.trim(),
        hasImages: true,
        artistOrCulture: true // Focus on artist matches
      },
      timeout: 5000
    });

    // Get all object IDs (not just first 10)
    const objectIDs = searchResponse.data.objectIDs || [];
    
    // Fetch details for each artwork
    const artworks = await Promise.all(
      objectIDs.map(async id => {
        try {
          const objectResponse = await axios.get(`${MET_API_BASE}/objects/${id}`, {
            timeout: 5000
          });
          
          const artwork = objectResponse.data;
          return {
            id: artwork.objectID,
            title: artwork.title || 'Untitled',
            artist: artwork.artistDisplayName || 'Unknown artist',
            date: artwork.objectDate || 'Unknown date',
            image: artwork.primaryImageSmall || artwork.primaryImage || null,
            department: artwork.department,
            culture: artwork.culture,
            medium: artwork.medium
          };
        } catch (error) {
          console.error(`Failed to fetch artwork ${id}:`, error.message);
          return null;
        }
      })
    );

    // Filter out failed requests and return only artworks with images
    const validArtworks = artworks.filter(artwork => 
      artwork !== null && artwork.image !== null
    );

    res.json(validArtworks);
  } catch (error) {
    console.error('Artist search error:', error.message);
    res.status(500).json({
      error: 'Failed to search artist',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});






// Get artwork details endpoint
app.get('/api/artwork/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${MET_API_BASE}/objects/${id}`, {
      timeout: 5000
    });

    const artwork = response.data;
    
    res.json({
      id: artwork.objectID,
      title: artwork.title,
      artist: artwork.artistDisplayName,
      date: artwork.objectDate,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      department: artwork.department,
      culture: artwork.culture,
      description: artwork.creditLine,
      image: artwork.primaryImage || artwork.primaryImageSmall,
      additionalImages: artwork.additionalImages || []
    });
  } catch (error) {
    console.error('Artwork details error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch artwork details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});