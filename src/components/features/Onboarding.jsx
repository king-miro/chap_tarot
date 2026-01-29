import React, { useState } from 'react';

const Onboarding = ({ onStart }) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim().length > 0 && nickname.length <= 5) {
      onStart(nickname);
    }
  };

  return (
    <div className="onboarding-container">
      <h2 className="title">이름을 알려주세요</h2>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={5}
          placeholder="최대 5글자"
          className="pixel-input"
          autoFocus
        />
        <button type="submit" className="start-btn" disabled={!nickname.trim()}>
          시작하기
        </button>
      </form>

      <style>{`
        .onboarding-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 24px;
        }

        .title {
          color: var(--color-secondary);
          text-shadow: 2px 2px #000;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .input-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 240px;
        }

        .pixel-input {
          background-color: #222;
          border: 4px solid var(--color-glow);
          color: #fff;
          font-family: var(--font-pixel);
          padding: 12px;
          font-size: 16px;
          text-align: center;
          outline: none;
        }

        .pixel-input:focus {
          border-color: var(--color-secondary);
        }

        .start-btn {
          background-color: var(--color-primary);
          border: 4px solid #fff;
          color: #fff;
          font-family: var(--font-pixel);
          padding: 12px;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.1s;
        }

        .start-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background-color: #ba68c8;
        }

        .start-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: #555;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
