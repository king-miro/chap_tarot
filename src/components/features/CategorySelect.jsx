import React from 'react';

const CATEGORIES = [
  { id: 'love', label: '연애운', icon: '💘' },
  { id: 'career', label: '취업/진로', icon: '⚔️' },
  { id: 'money', label: '금전운', icon: '💰' },
  { id: 'friendship', label: '대인관계', icon: '🤝' },
  { id: 'health', label: '건강운', icon: '🧪' },
  { id: 'today', label: '오늘의 운세', icon: '✨' },
];

const CategorySelect = ({ onSelect }) => {
  return (
    <div className="category-container">
      <div className="grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="category-btn"
            onClick={() => onSelect(cat.id)}
          >
            <span className="icon">{cat.icon}</span>
            <span className="label">{cat.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .category-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
        }

        .category-btn {
          background-color: var(--color-bg);
          border: 4px solid var(--color-primary);
          color: #fff;
          font-family: var(--font-pixel);
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
        }

        .category-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px rgba(0,0,0,0.5);
          background-color: #3e1658;
          border-color: var(--color-glow);
        }

        .category-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px rgba(0,0,0,0.5);
        }

        .icon {
          font-size: 24px;
        }

        .label {
          font-size: 10px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default CategorySelect;
