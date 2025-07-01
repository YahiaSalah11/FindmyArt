const ArtsyPaintList = ({ paints, onPaintingClick }) => {
  if (!paints || paints.length === 0) {
    return <div className="no-results">No Artsy results found</div>;
  }

  return (
    <div className="paint-list">
      {paints.map(paint => (
        <div 
          key={paint.id} 
          className="paint-item"
          onClick={() => onPaintingClick(paint.id, true)}
        >
          {paint.thumbnail && (
            <img 
              src={paint.thumbnail} 
              alt={paint.title}
              className="thumbnail"
            />
          )}
          <h3>{paint.title}</h3>
          <p>By {paint.artist_name || 'Unknown artist'}</p>
        </div>
      ))}
    </div>
  );
};

export default ArtsyPaintList;