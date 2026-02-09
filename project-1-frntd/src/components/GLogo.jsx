import logo from '../assets/logo.png';

const GLogo = ({ className = '', size = 24 }) => {
    return (
        <div
            className={`g-logo-wrapper ${className}`}
            style={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <img
                src={logo}
                alt="Scriptor Logo"
                className="g-logo-img"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
};

export default GLogo;
