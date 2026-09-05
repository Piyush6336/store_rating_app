import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, label = 'Rating' }) {
  const [hovered, setHovered] = useState(0);
  const activeValue = hovered || Number(value) || 0;
  const isInteractive = Boolean(onChange);

  return (
    <div className={`star-rating ${isInteractive ? 'is-interactive' : ''}`} aria-label={`${label}: ${value || 0} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= activeValue ? 'is-active' : ''}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => isInteractive && setHovered(star)}
          onMouseLeave={() => isInteractive && setHovered(0)}
          disabled={!isInteractive}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          aria-pressed={Number(value) === star}
        >
          <Star size={18} fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
