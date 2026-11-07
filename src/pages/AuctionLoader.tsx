import React from "react";
import "./AuctionLoader.css";

interface AuctionLoaderProps {
  title?: string;
  message?: string;
}

const AuctionLoader: React.FC<AuctionLoaderProps> = ({
  title = "Auction",
  message = "Finding the best bids for your team...",
}) => {
  return (
    <div className="auction-loader">
      {/* Stadium glow */}
      <div className="stadium-glow glow-left" />
      <div className="stadium-glow glow-right" />

      {/* Stadium lights */}
      <div className="stadium-lights left">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="stadium-lights right">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      {/* Main content */}
      <div className="loader-content">
        <div className="auction-ring">
          {/* Animated rings */}
          <div className="ring ring-blue" />
          <div className="ring ring-gold" />

          {/* Gavel */}
          <div className="gavel">
            <div className="gavel-head">
              <div className="gavel-band" />
            </div>

            <div className="gavel-handle" />
          </div>

          {/* Cricket ball */}
          <div className="cricket-ball">
            <div className="ball-seam" />
          </div>
        </div>

        {/* Title */}
        <h1>
          {title} <span>Loading Next Player.....</span>
        </h1>

        {/* Message */}
        <p>{message}</p>

        {/* Loading dots */}
        <div className="loading-dots">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Stadium floor */}
      <div className="stadium-floor" />
    </div>
  );
};

export default AuctionLoader;