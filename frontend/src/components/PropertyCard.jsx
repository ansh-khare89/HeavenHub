import { Link } from 'react-router-dom';
import { formatInr } from '../utils/money.js';

export function PropertyCard({ property, wishlisted, onToggleWishlist, showWishlist, compareSelected, onToggleCompare }) {
  const rating = property.averageRating != null ? Number(property.averageRating) : null;
  const cleaning = property.cleaningFee != null ? Number(property.cleaningFee) : 0;
  const platformPct = property.platformFeePercent != null ? Number(property.platformFeePercent) : 12;
  const amenityList = (property.amenities || '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
    .slice(0, 3);

  const idNum = Number(property.id) || 0;
  // Use locally downloaded images (1 to 6)
  const imageNumber = ((idNum * 7) % 6) + 1;
  const imageSrc = `/hotels/hotel-${imageNumber}.jpg`;

  return (
    <div className="group relative flex flex-col gap-3 transition">
      {/* Wishlist Button Overlay */}
      {showWishlist && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.();
          }}
          className="absolute right-3 top-3 z-10 p-1 transition active:scale-95"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className={`block h-7 w-7 transition-colors ${
              wishlisted ? 'fill-airbnb stroke-white' : 'fill-black/50 stroke-white'
            } stroke-[2px]`}
          >
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-6.94c-2.87 0-5.46 1.6-6.67 4.14a7.25 7.25 0 0 0-6.67-4.14c-3.87 0-7 3.1-7 6.94 0 7 7 12.27 14 17z" />
          </svg>
        </button>
      )}

      {/* Compare Button Overlay */}
      {onToggleCompare && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare();
          }}
          className={`absolute left-3 top-3 z-10 flex h-7 items-center rounded-full px-3 text-[11px] font-semibold transition ${
            compareSelected ? 'bg-gray-900 text-white' : 'bg-white/80 text-gray-900 hover:bg-white'
          }`}
        >
          {compareSelected ? '✓ Compare' : 'Compare'}
        </button>
      )}

      {/* Main Image Link */}
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
          <img
            src={imageSrc}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      {/* Content */}
      <Link to={`/property/${property.id}`} className="block">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="truncate font-medium text-gray-900">
              {property.city}{property.state ? `, ${property.state}` : ''}
            </h3>
            <p className="truncate text-sm text-gray-500">
              {property.propertyType || 'Stay'}
            </p>
            <p className="truncate text-sm text-gray-500">
              {property.bedrooms != null ? `${property.bedrooms} beds` : 'Studio'}
            </p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-semibold text-gray-900">{formatInr(property.pricePerNight)}</span>
              <span className="text-sm text-gray-900">night</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex shrink-0 items-center gap-1 text-sm text-gray-900">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="block h-3 w-3 fill-current">
              <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" />
            </svg>
            <span>{rating != null ? rating.toFixed(2) : 'New'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
