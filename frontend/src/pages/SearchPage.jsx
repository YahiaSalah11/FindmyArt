import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('painting'); // 'painting' or 'artist'
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();




    // Load saved results when component mounts
  useEffect(() => {
    const savedResults = sessionStorage.getItem('artSearchResults');
    const savedQuery = sessionStorage.getItem('artSearchQuery');
    const savedType = sessionStorage.getItem('artSearchType');
    
    if (savedResults) {
      setSearchResults(JSON.parse(savedResults));
    }
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
    if (savedType) {
      setSearchType(savedType);
    }
  }, []);




  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);


    try {
      const endpoint = searchType === 'artist' 
        ? '/api/search/artist' 
        : '/api/search';
      
      const response = await axios.post(endpoint, { 
        [searchType === 'artist' ? 'artist' : 'query']: query 
      });

      setSearchResults(response.data);


      // Save to session storage
      sessionStorage.setItem('artSearchResults', JSON.stringify(response.data));
      sessionStorage.setItem('artSearchQuery', query);
      sessionStorage.setItem('artSearchType', searchType);
      


    } catch (error) {
      setError(error.response?.data?.error || `Failed to search ${searchType === 'artist' ? 'artist' : 'paintings'}`);
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handlePaintingClick = (paintingId) => {
    // Save current scroll position
    sessionStorage.setItem('artSearchScrollPos', window.scrollY);
    navigate(`/painting/${paintingId}`);
  };

  return (
    <div className="search-page">
      <h1>Art Search</h1>
      
      {/* Search type toggle */}
      <div className="search-type-toggle">
        <button
          className={searchType === 'painting' ? 'active' : ''}
          onClick={() => setSearchType('painting')}
        >
          Search Paintings
        </button>
        <button
          className={searchType === 'artist' ? 'active' : ''}
          onClick={() => setSearchType('artist')}
        >
          Search Artists
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchType === 'artist' 
            ? 'Enter artist name...' 
            : 'Search for paintings...'}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
          className="search-input"
        />
        <button 
          onClick={() => handleSearch(searchQuery)}
          className="search-button"
        >
          Search
        </button>
      </div>

      {isLoading && <div className="loading">
        {searchType === 'artist' 
          ? 'Finding artworks by artist...' 
          : 'Searching paintings...'}
      </div>}
      
      {error && <div className="error">{error}</div>}

      {/* Results display */}
      <div className="results-container">
        {searchType === 'artist' ? (
          // Artist search results - grid of images
          <div className="artist-results-grid">
            {searchResults.map(artwork => (
              <div key={artwork.id} className="artist-artwork">
                <img 
                  src={artwork.image} 
                  alt={`${artwork.title} by ${artwork.artist}`}
                  onClick={() => handlePaintingClick(artwork.id)}
                />
                <div className="artwork-info">
                  <p className="artwork-title">{artwork.title}</p>
                  <p className="artwork-date">{artwork.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Painting search results - cards with details
          <div className="painting-results-grid">
            {searchResults.map(painting => (
              <div 
                key={painting.id} 
                className="painting-card"
                onClick={() => handlePaintingClick(painting.id)}
              >
                {painting.image && (
                  <img 
                    src={painting.image} 
                    alt={painting.title}
                    className="painting-thumbnail"
                  />
                )}
                <div className="painting-info">
                  <h3>{painting.title}</h3>
                  <p>{painting.artist || 'Unknown artist'}</p>
                  <p>{painting.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;