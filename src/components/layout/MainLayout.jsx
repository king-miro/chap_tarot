import React from 'react';
import '../../styles/index.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-container">
      <div className="game-frame">
        <div className="scanlines"></div>
        <div className="content-area">
          {children}
        </div>
      </div>
      <style>{`
        .main-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          background-color: #000;
        }
        
        .game-frame {
          position: relative;
          width: min(100%, 177.77vh);
          max-width: 1400px; /* PC Extended Width */
          height: 100%;
          max-height: 850px;
          aspect-ratio: 16/9; /* Widescreen for PC */
          background-color: var(--color-bg);
          border: 4px solid var(--color-glow);
          box-shadow: 0 0 20px var(--color-primary);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .game-frame {
            max-width: 100%;
            height: 100%;
            border: none;
            aspect-ratio: auto;
          }
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 16px;
          position: relative;
          z-index: 100;
          overflow-y: auto; /* Allow scrolling for tall content */
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
