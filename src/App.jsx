import { useState, useEffect } from 'react'
import MainLayout from './components/layout/MainLayout'
import CatScene from './components/layout/CatScene'
import { useTTS } from './hooks/useTTS'
import Onboarding from './components/features/Onboarding'
import CategorySelect from './components/features/CategorySelect'
import TarotTable from './components/features/TarotTable'
import ResultView from './components/features/ResultView'
import ChatInterface from './components/features/ChatInterface'
import StartScreen from './components/layout/StartScreen'
import BackgroundMusic from './components/common/BackgroundMusic'

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameState, setGameState] = useState({
    step: 'intro', // intro, category, shuffle, select, reading, chat
    nickname: '',
    category: '',
    selectedCards: []
  });

  const { prefetchAudio } = useTTS();

  // Pre-fetch result audio when entering selection phase
  useEffect(() => {
    if (gameState.step === 'select') {
      prefetchAudio("별들의 이야기를 들어보자냥...");
    }
  }, [gameState.step, prefetchAudio]);

  const handleStart = (name) => {
    // 1. Start Pre-fetching Nickname Audio (Default Snappy Style + NO CACHE)
    prefetchAudio({
      text: `${name}냥, 고민에 집중하라냥...`,
      skipCache: true
    });

    setGameState(prev => ({ ...prev, nickname: name, step: 'category' }));
  };

  const handleCategorySelect = (category) => {
    setGameState(prev => ({ ...prev, category, step: 'shuffle' }));
  };

  // Dynamic message override for Result view card meanings
  const [specialCatMessage, setSpecialCatMessage] = useState(null);

  const getCatMessage = () => {
    if (specialCatMessage) return specialCatMessage;

    switch (gameState.step) {
      case 'intro': return {
        text: "어서오게냥! 여행자여, 이름이 무엇이냥?",
        file: "ui/intro.wav"
      };
      case 'category': return {
        text: `${gameState.nickname}, 무엇이 고민이냥? 연애? 금전? 한번 골라보라냥!`,
        file: "ui/category_select.wav"
      };
      case 'shuffle': return {
        text: "좋아, 카드를 섞어보겠다냥... 마음을 담아서 집중하라냥!",
        file: "ui/shuffle.wav"
      };
      case 'select': return {
        text: "신중하게... 운명의 카드 4장을 골라보라냥!",
        file: "ui/select_card.wav"
      };
      case 'reading': return {
        text: "흐음... 어디 보자... 별들의 이야기를 들어보자냥...",
        file: "ui/reading_start.wav"
      };
      case 'chat': return {
        text: "결과에 대해 궁금한게 있다면 물어봐!",
        file: "ui/chat_intro.wav"
      };
      default: return "야옹...";
    }
  };

  const getLoadingText = () => {
    return "목소리 가다듬는 중...";
  };

  return (
    <>
      <BackgroundMusic />
      {!hasStarted ? (
        <StartScreen onStart={() => {
          setHasStarted(true);
          // Play intro immediately on user interaction to bypass autoplay policy
          const audio = new Audio('/audio/ui/intro.wav');
          audio.volume = 0.4;
          audio.play().catch(e => console.log("Manual intro play failed", e));
        }} />
      ) : (
        <MainLayout>
          <CatScene
            message={getCatMessage()}
            loadingText={getLoadingText()}
            // Skip checking the effect for 'intro' since we played it manually
            skipAudio={gameState.step === 'intro'}
          />

          <div className="game-content">
            {gameState.step === 'intro' && (
              <Onboarding onStart={handleStart} />
            )}

            {gameState.step === 'category' && (
              <CategorySelect onSelect={handleCategorySelect} />
            )}

            {(gameState.step === 'shuffle' || gameState.step === 'select') && (
              <TarotTable
                step={gameState.step}
                selectedCount={gameState.selectedCards.length}
                selectedCards={gameState.selectedCards} // Pass the array 
                onShuffleComplete={() => setGameState(prev => ({ ...prev, step: 'select' }))}
                onCardSelect={(cardId) => {
                  if (gameState.selectedCards.length < 4 && !gameState.selectedCards.includes(cardId)) {
                    const newSelected = [...gameState.selectedCards, cardId];
                    if (newSelected.length === 4) {
                      setTimeout(() => {
                        setGameState(prev => ({ ...prev, selectedCards: newSelected, step: 'reading' }));
                      }, 500);
                    } else {
                      setGameState(prev => ({ ...prev, selectedCards: newSelected }));
                    }
                  }
                }}
              />
            )}

            {gameState.step === 'reading' && (
              <ResultView
                selectedCards={gameState.selectedCards}
                onMessageChange={setSpecialCatMessage}
                onComplete={() => {
                  setSpecialCatMessage(null);
                  setGameState(prev => ({ ...prev, step: 'chat' }));
                }}
              />
            )}

            {gameState.step === 'chat' && (
              <ChatInterface
                onSendMessage={(msg) => console.log("User asked:", msg)}
              />
            )}
          </div>

          <style>{`
        .game-content {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 20px; 
          min-height: 0;
          position: relative;
          overflow-y: auto;
        }
      `}</style>
        </MainLayout>
      )}
    </>
  );
}

export default App
