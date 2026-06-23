import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const Rating = ({ value, text, interactive, onRate, userRating }) => {
    const renderStar = (starValue) => {
        if (value >= starValue) return <FaStar style={{ color: '#ccff00' }} />
        if (value >= starValue - 0.5) return <FaStarHalfAlt style={{ color: '#ccff00' }} />
        return <FaRegStar style={{ color: '#7c8ca1' }} />
    }

    const starClasses = (starValue) =>
        `rating-star ${interactive ? 'rating-star-clickable' : ''} ${
            userRating >= starValue ? 'rating-star-selected' : ''
        }`

    return (
        <div className='rating'>
            {[1, 2, 3, 4, 5].map((starValue) => (
                <span
                    key={starValue}
                    className={starClasses(starValue)}
                    onClick={() => interactive && onRate?.(starValue)}
                    role={interactive ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                            onRate?.(starValue)
                        }
                    }}
                    aria-label={interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : undefined}
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                >
                    {renderStar(starValue)}
                </span>
            ))}
            <span className='rating-text'>{text && text}</span>
        </div>
    )
}

export default Rating
