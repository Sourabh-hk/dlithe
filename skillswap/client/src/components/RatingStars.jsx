import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  size = 16,
  interactive = false,
  onChange = () => {},
  showValue = false,
  count,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <div style={{ display: 'inline-flex', gap: '2px' }}>
        {[...Array(maxRating)].map((_, i) => {
          const starValue = i + 1;
          const isFilled = displayRating >= starValue;
          const isHalf = !isFilled && displayRating >= starValue - 0.5;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                color: isFilled || isHalf ? '#EAB308' : '#D1D5DB',
                lineHeight: 1,
              }}
              aria-label={`${starValue} stars`}
            >
              <Star
                size={size}
                fill={isFilled ? '#EAB308' : isHalf ? 'url(#half-star)' : 'none'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            color: 'var(--color-text)',
            marginLeft: '4px',
          }}
        >
          {Number(rating).toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
