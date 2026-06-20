import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const Rating = ({ value, text, interactive, onRate, userRating }) => {
    const renderStar = (starValue) => {
        if (value >= starValue) return <FaStar />
        if (value >= starValue - 0.5) return <FaStarHalfAlt />
        return <FaRegStar />
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
                >
                    {renderStar(starValue)}
                </span>
            ))}
            <span className="rating-text">{text && text}</span>
        </div>
    )
}

export default Rating