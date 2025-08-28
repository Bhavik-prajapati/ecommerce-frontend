import { Star, StarHalf, Star as StarOutline } from "lucide-react";

const StarRating = ({ rating }) => {
  const numericRating = Number(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full Stars */}
      {Array(fullStars).fill(0).map((_, i) => (
        <Star key={`full-${i}`} className="text-yellow-500" size={20} />
      ))}

      {/* Half Star */}
      {hasHalfStar && <StarHalf className="text-yellow-500" size={20} />}

      {/* Empty Stars */}
      {Array(emptyStars).fill(0).map((_, i) => (
        <StarOutline key={`empty-${i}`} className="text-gray-300" size={20} />
      ))}

      {/* Numeric rating */}
      {/* <span className="ml-2 text-gray-600 text-sm">({numericRating.toFixed(2)})</span> */}
    </div>
  );
};

export default StarRating;
