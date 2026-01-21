'use client';

import React from 'react';

export const PlayingChildrenAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 800 200"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground line */}
        <line
          x1="0"
          y1="180"
          x2="800"
          y2="180"
          stroke="#e7e5e4"
          strokeWidth="2"
        />

        {/* Ball - moving right */}
        <g style={{ animation: 'ballMove 4s ease-in-out infinite' }}>
          <circle
            cx="650"
            cy="165"
            r="12"
            fill="none"
            stroke="#78716c"
            strokeWidth="2.5"
          />
          <path
            d="M644 159 L650 165 L656 159 M644 171 L650 165 L656 171"
            stroke="#78716c"
            strokeWidth="1.5"
            fill="none"
          />
        </g>

        {/* Stick Figure 1 - Leading runner */}
        <g style={{ animation: 'runner1 4s ease-in-out infinite' }}>
          {/* Head */}
          <circle
            cx="520"
            cy="100"
            r="16"
            fill="none"
            stroke="#44403c"
            strokeWidth="2.5"
          />
          {/* Body */}
          <line
            x1="520"
            y1="116"
            x2="520"
            y2="150"
            stroke="#44403c"
            strokeWidth="2.5"
          />
          {/* Arms - running motion */}
          <g
            style={{
              animation: 'armSwing 0.3s ease-in-out infinite alternate',
            }}
          >
            <line
              x1="520"
              y1="125"
              x2="500"
              y2="140"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <line
              x1="520"
              y1="125"
              x2="540"
              y2="110"
              stroke="#44403c"
              strokeWidth="2.5"
            />
          </g>
          {/* Legs - running stride */}
          <g
            style={{
              animation: 'legSwing 0.3s ease-in-out infinite alternate',
            }}
          >
            <line
              x1="520"
              y1="150"
              x2="500"
              y2="178"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <line
              x1="520"
              y1="150"
              x2="540"
              y2="178"
              stroke="#44403c"
              strokeWidth="2.5"
            />
          </g>
        </g>

        {/* Stick Figure 2 - Middle runner */}
        <g style={{ animation: 'runner2 4s ease-in-out infinite' }}>
          {/* Head */}
          <circle
            cx="420"
            cy="95"
            r="16"
            fill="none"
            stroke="#44403c"
            strokeWidth="2.5"
          />
          {/* Body */}
          <line
            x1="420"
            y1="111"
            x2="420"
            y2="145"
            stroke="#44403c"
            strokeWidth="2.5"
          />
          {/* Arms */}
          <g
            style={{
              animation: 'armSwing 0.3s ease-in-out infinite alternate-reverse',
            }}
          >
            <line
              x1="420"
              y1="120"
              x2="400"
              y2="105"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <line
              x1="420"
              y1="120"
              x2="440"
              y2="135"
              stroke="#44403c"
              strokeWidth="2.5"
            />
          </g>
          {/* Legs */}
          <g
            style={{
              animation: 'legSwing 0.3s ease-in-out infinite alternate-reverse',
            }}
          >
            <line
              x1="420"
              y1="145"
              x2="435"
              y2="178"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <line
              x1="420"
              y1="145"
              x2="405"
              y2="178"
              stroke="#44403c"
              strokeWidth="2.5"
            />
          </g>
        </g>

        {/* Stick Figure 3 - Trailing runner */}
        <g style={{ animation: 'runner3 4s ease-in-out infinite' }}>
          {/* Head */}
          <circle
            cx="320"
            cy="98"
            r="16"
            fill="none"
            stroke="#44403c"
            strokeWidth="2.5"
          />
          {/* Body */}
          <line
            x1="320"
            y1="114"
            x2="320"
            y2="148"
            stroke="#44403c"
            strokeWidth="2.5"
          />
          {/* Arms */}
          <g
            style={{
              animation: 'armSwing 0.3s ease-in-out infinite alternate',
            }}
          >
            <line
              x1="320"
              y1="123"
              x2="300"
              y2="138"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <line
              x1="320"
              y1="123"
              x2="340"
              y2="108"
              stroke="#44403c"
              strokeWidth="2.5"
            />
          </g>
          {/* Legs */}
          <g
            style={{
              animation: 'legSwing 0.3s ease-in-out infinite alternate',
            }}
          >
            <line
              x1="320"
              y1="148"
              x2="302"
              y2="178"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <line
              x1="320"
              y1="148"
              x2="338"
              y2="178"
              stroke="#44403c"
              strokeWidth="2.5"
            />
          </g>
        </g>
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes ballMove {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(40px);
          }
        }

        @keyframes runner1 {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(15px) translateY(-8px);
          }
          50% {
            transform: translateX(30px) translateY(0);
          }
          75% {
            transform: translateX(15px) translateY(-8px);
          }
        }

        @keyframes runner2 {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(18px) translateY(-10px);
          }
          50% {
            transform: translateX(36px) translateY(0);
          }
          75% {
            transform: translateX(18px) translateY(-10px);
          }
        }

        @keyframes runner3 {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(20px) translateY(-6px);
          }
          50% {
            transform: translateX(40px) translateY(0);
          }
          75% {
            transform: translateX(20px) translateY(-6px);
          }
        }

        @keyframes armSwing {
          0% {
            transform: rotate(-15deg);
            transform-origin: center;
          }
          100% {
            transform: rotate(15deg);
            transform-origin: center;
          }
        }

        @keyframes legSwing {
          0% {
            transform: rotate(-20deg);
            transform-origin: center top;
          }
          100% {
            transform: rotate(20deg);
            transform-origin: center top;
          }
        }
      `}</style>
    </div>
  );
};
