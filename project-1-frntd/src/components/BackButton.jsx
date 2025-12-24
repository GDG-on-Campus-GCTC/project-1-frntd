import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button className="back-button" onClick={handleBack} aria-label="Back to Home">
            <div className="back-button-glow"></div>
            <svg
                className="back-button-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="back-button-text">Back</span>
        </button>
    );
};

export default BackButton;
