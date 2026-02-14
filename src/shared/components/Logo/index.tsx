import { FC } from "react";

interface ILogo {
    className?: string;
}

const Logo: FC<ILogo> = ({ className }) => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Ícone abstrato de "P" + Gráfico/Moeda */}
            <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="200" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00d2ff" />
                    <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.5" />
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <g filter="url(#glow)">
                <path
                    d="M20 10C20 4.47715 24.4772 0 30 0H45C53.2843 0 60 6.71573 60 15V15C60 23.2843 53.2843 30 45 30H30V50C30 55.5228 25.5228 60 20 60V60C14.4772 60 10 55.5228 10 50V20C10 14.4772 14.4772 10 20 10Z"
                    fill="url(#logo-gradient)"
                />
                <circle cx="45" cy="15" r="5" fill="white" fillOpacity="0.8" />
            </g>

            {/* Texto do Logo */}
            <text
                x="75"
                y="35"
                fill="white"
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: '22px',
                    letterSpacing: '-0.5px'
                }}
            >
                PERSON
            </text>
            <text
                x="75"
                y="52"
                fill="#94a3b8"
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}
            >
                Assistant
            </text>
        </svg>
    );
};

export default Logo;
