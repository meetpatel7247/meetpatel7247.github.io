import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingDetails } from '../../store/bookingSlice';
import withFadeIn from '../../hoc/withFadeIn';
import styles from './EventCard.module.css';

/**
 * EventCard Component
 * 
 * Renders a single event preview with an image, title, date, location, and price.
 * Clicking the card routes the user to the EventDetails page.
 * Clicking "Book Ticket" triggers the Redux booking flow and forwards to checkout.
 * 
 * @param {Object} event - The full event data object
 */
const EventCard = ({ event, isGrid = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [imgErrored, setImgErrored] = useState(false);

    const seed = encodeURIComponent(event?._id || event?.title || event?.location || 'event');
    const seededFallback = `https://picsum.photos/seed/${seed}/800/450`;
    const imageSrc = !imgErrored && event?.image ? event.image : seededFallback;

    /**
     * Prevents the click from bubbling to the parent card, checks auth,
     * seeds the Redux store with the target event, and pushes the booking route.
     */
    const handleBook = (e) => {
        e.stopPropagation();
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        dispatch(setBookingDetails({
            event,
            quantity: 1,
            totalPrice: event.price,
            discountAmount: 0
        }));

        navigate('/booking');
    };

    return (
        <div
            className={`premium-card ${styles.cardWrapper}`}
            data-layout={isGrid ? "grid" : "carousel"}
            onClick={() => navigate(`/event/${event._id}`)}
        >
            <div className={styles.imgContainer}>
                <motion.img
                    src={imageSrc}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                        // Avoid infinite onError loops; switch to deterministic per-event fallback.
                        setImgErrored(true);
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, var(--bg-card), transparent)',
                    opacity: 0.6
                }} />
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.date}>
                    {new Date(event.date).toLocaleDateString()}
                </div>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.location}>
                    {event.location}
                </p>
                <div style={{ marginTop: 'auto' }}>
                    <div className={styles.price}>
                        ${event.price}
                    </div>
                    <button
                        className={`premium-button ${styles.bookBtn}`}
                        onClick={handleBook}
                    >
                        Book Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};
export default withFadeIn(EventCard);