import { Star } from 'lucide-react';

const RatingStars = ({ rating, onChange, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating-stars">
      {stars.map((star) => (
        <Star
          key={star}
          size={24}
          onClick={() => !readOnly && onChange && onChange(star)}
          className={`star-icon ${star <= rating ? 'active' : ''} ${readOnly ? 'read-only' : ''}`}
        />
      ))}
    </div>
  );
};

export default RatingStars;
