import { useMemo, useState } from 'react';

function randomHex() {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, '0')}`;
}

function createRound() {
  const swatches = Array.from({ length: 3 }, randomHex);
  const targetIndex = Math.floor(Math.random() * swatches.length);
  return { swatches, targetIndex };
}

function App() {
  const [{ swatches, targetIndex }, setRound] = useState(createRound);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);

  const hasGuessed = selectedIndex !== null;
  const isCorrect = selectedIndex === targetIndex;
  const targetHex = useMemo(() => swatches[targetIndex], [swatches, targetIndex]);
  const gameWon = score >= 20;

  function handleGuess(index) {
    if (hasGuessed || gameWon) return;
    if (index === targetIndex) {
      setScore((currentScore) => currentScore + 1);
    }
    setSelectedIndex(index);
  }

  function playAgain() {
    if (gameWon) {
      setScore(0);
      setRound(createRound());
      setSelectedIndex(null);
      return;
    }
    setRound(createRound());
    setSelectedIndex(null);
  }
  return (
    <main className="page">
      <h1>Color swatch guessing game</h1>
      <p className="prompt">Score: {score}</p>
      {!gameWon && <p className="prompt">Pick the swatch matching to win the game: {targetHex}</p>}
      {gameWon && <p className="prompt">🎉 You Win! 🎉</p>}

      <div className="swatches">
        {swatches.map((hex, index) => (
          <button
            className="swatch-button"
            key={`${hex}-${index}`}
            onClick={() => handleGuess(index)}
            aria-label={`Choose color ${index + 1}`}
            disabled={hasGuessed || gameWon}
          >
            <span className="swatch" style={{ backgroundColor: hex }} />
          </button>
        ))}
      </div>

      {hasGuessed && (
        <p className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </p>
      )}

      <button className="play-again" onClick={playAgain}>
        {gameWon ? 'Play Again (Reset)' : 'Play Again'}
      </button>
    </main>
  );
}

export default App;
