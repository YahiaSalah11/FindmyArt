const LocalPaintList = ({ paints, onPaintingClick }) => {
  if (!paints || paints.length === 0) {
    return <div className="no-results">No local paintings found</div>;
  }

  return (
    <div className="paint-list">
      {paints.map(paint => (
        <div 
          key={paint.id} 
          className="paint-item"
          onClick={() => onPaintingClick(paint.id)}
        >
          <h3>{paint.painting_name}</h3>
          <p>By {paint.artist_name}</p>
          <p>Style: {paint.painting_style}</p>
        </div>
      ))}
    </div>
  );
};

export default LocalPaintList;