import React, { useState } from 'react';
import { useTTS } from '../../hooks/useTTS';
import catSceneImage from '../../assets/images/cat_scene.png';

const ChatInterface = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // Local history for MVP
  const { playAudio, isPlaying } = useTTS();

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: text }];
    setMessages(newMessages);

    // Notify parent (for logging or future API)
    onSendMessage(text);

    setInput('');

    // Simulate Cat Response (Dummy)
    setTimeout(() => {
      const responses = [
        "별들이 그렇게 말하고 있군...",
        "흐음, 재미있는 질문이야.",
        "카드의 의지를 믿어보게.",
        "그건 시간이 해결해줄 걸세.",
        "자네의 직감이 답을 알고 있을 텐데?"
      ];

      const reactions = [
        { text: "흐음...", file: "ui/reaction_hmm.wav" },
        { text: "오호...", file: "ui/reaction_oho.wav" },
        { text: "하하...", file: "ui/reaction_haha.wav" },
        { text: "음...", file: "ui/reaction_um.wav" },
        { text: "호오...", file: "ui/reaction_hoo.wav" }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

      setMessages(prev => [...prev, { role: 'cat', text: randomResponse }]);

      // Play short reaction audio for effect using static file
      const audio = new Audio(`audio/${randomReaction.file}`);
      audio.volume = 0.5;
      audio.play().catch(e => console.warn("Reaction play failed", e));
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="chat-interface">
      <div className="chat-history">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.role === 'cat' && (
              <div className="avatar-frame">
                <img src={catSceneImage} className="avatar-img" alt="cat avatar" />
              </div>
            )}
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chips">
        <button className="chip" onClick={() => handleSend("어떻게 하면 좋을까요?")}>어떻게 할까요?</button>
        <button className="chip" onClick={() => handleSend("좀 더 자세히 알려주세요.")}>더 자세히?</button>
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="고양이에게 물어보세요..."
          className="chat-input"
        />
        <button type="submit" className="send-btn">➤</button>
      </form>

      <style>{`
        .chat-interface {
          width: 100%;
          height: 100%; /* Fill remaining space */
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
        }

        .chat-history {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
          background: rgba(0,0,0,0.2);
          border: 1px solid #333;
          border-radius: 8px;
        }

        .message {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 80%;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message.cat {
          align-self: flex-start;
        }

        .avatar-frame {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--color-primary);
          background-color: var(--color-bg);
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: pixelated;
          transform: scale(2.5);
          transform-origin: center 40%;
        }

        .bubble {
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
          word-break: break-all;
        }

        .message.user .bubble {
          background-color: var(--color-primary);
          color: #fff;
          border-bottom-right-radius: 2px;
        }

        .message.cat .bubble {
          background-color: #333;
          border: 1px solid var(--color-glow);
          color: #eee;
          border-bottom-left-radius: 2px;
        }

        .chips {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .chip {
          background-color: transparent;
          border: 2px solid var(--color-primary);
          color: var(--color-primary);
          border-radius: 16px;
          padding: 6px 12px;
          font-family: var(--font-pixel);
          font-size: 10px;
          cursor: pointer;
          white-space: nowrap;
        }

        .chip:hover {
          background-color: var(--color-primary);
          color: #fff;
        }

        .chat-form {
          display: flex;
          gap: 8px;
        }

        .chat-input {
          flex: 1;
          background-color: #222;
          border: 2px solid var(--color-glow);
          color: #fff;
          font-family: var(--font-pixel);
          font-size: 12px;
          padding: 12px;
          outline: none;
        }

        .send-btn {
          background-color: var(--color-secondary);
          border: 2px solid #fff;
          color: #000;
          font-family: var(--font-pixel);
          padding: 0 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
