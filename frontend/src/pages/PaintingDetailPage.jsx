
import { useEffect ,useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PaintingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
    
    // Restore scroll position after navigation
    setTimeout(() => {
      const savedPos = sessionStorage.getItem('artSearchScrollPos');
      if (savedPos) {
        window.scrollTo(0, parseInt(savedPos));
      }
    }, 0);
  };

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/artwork/${id}`);
        setPainting(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load painting details');
      } finally {
        setLoading(false);
      }
    };

    fetchPainting();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!painting) return <div>Painting not found</div>;

  return (
    
    <div className="painting-details">

      <button className="back-button" onClick={handleBackClick}>
        &larr; Back
      </button>
      
      <h1>{painting.title}</h1>
      <h2>By {painting.artist || 'Unknown artist'}</h2>
      
      {painting.image && (
        <img src={painting.image} alt={painting.title} className="main-image" />
      )}
      
      <div className="details">
        <p><strong>Date:</strong> {painting.date}</p>
        <p><strong>Medium:</strong> {painting.medium}</p>
        {painting.dimensions && <p><strong>Dimensions:</strong> {painting.dimensions}</p>}
        {painting.department && <p><strong>Department:</strong> {painting.department}</p>}
        {painting.culture && <p><strong>Culture:</strong> {painting.culture}</p>}
        {painting.description && <p><strong>Description:</strong> {painting.description}</p>}
      </div>
    </div>
  );
};

export default PaintingDetails;