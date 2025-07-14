import React, { useState, useEffect } from 'react';
import bingoItems from './bingoItems'; // <-- Import the items from an external file

interface CarBingoProps {
  title?: string;
  subtitle?: string;
  gridSize?: number;
  customItems?: object[] | null;
  onItemFound?: (item: object, index: number) => void;
  onGameComplete?: (foundCount: number, totalCount: number) => void;
  showScore?: boolean;
  showResetButton?: boolean;
  className?: string;
  cellStyle?: React.CSSProperties;
  language?: 'sv' | 'en';
  

}
const CarBingo = ({
  title = "🚗 Bil Bingo 🚗",
  subtitle = "Hitta dessa föremål under bilresan!",
  gridSize = 6,
  customItems = null,
  onItemFound = null,
  onGameComplete = null,
  showScore = true,
  showResetButton = true,
  className = "",
  cellStyle = {},
  language = "sv"
}: CarBingoProps) => {
  // Use imported bingoItems instead of local defaultItems
  const items = customItems || bingoItems[language] || bingoItems.sv;
  const totalItems = gridSize * gridSize;
  const displayItems = items.slice(0, totalItems);

  const [markedCells, setMarkedCells] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [bingo, setBingo] = useState(false);

  const toggleCell = (index) => {
    const newMarkedCells = new Set(markedCells);

    if (newMarkedCells.has(index)) {
      newMarkedCells.delete(index);
    } else {
      newMarkedCells.add(index);

      // Show celebration animation
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 600);

      // Call callback if provided
      if (onItemFound) {
        onItemFound(displayItems[index], index);
      }
    }

    setMarkedCells(newMarkedCells);
  };

  const resetGame = () => {
    setMarkedCells(new Set());
    setBingo(false);
  };

  // Check for game completion
  useEffect(() => {
    if (markedCells.size === totalItems && onGameComplete) {
      setTimeout(() => {
        onGameComplete(markedCells.size, totalItems);
      }, 100);
    }
  }, [markedCells.size, totalItems, onGameComplete]);

  // Check for BINGO (6 in a row or column)
  useEffect(() => {
    const grid = Array.from({ length: gridSize }, (_, row) =>
      Array.from({ length: gridSize }, (_, col) =>
        markedCells.has(row * gridSize + col)
      )
    );

    let bingoFound = false;

    // Check rows
    for (let row = 0; row < gridSize; row++) {
      if (grid[row].every(Boolean)) {
        bingoFound = true;
        break;
      }
    }
    // Check columns
    if (!bingoFound) {
      for (let col = 0; col < gridSize; col++) {
        if (grid.every(row => row[col])) {
          bingoFound = true;
          break;
        }
      }
    }

    setBingo(bingoFound);
  }, [markedCells, gridSize]);

  const translations = {
    sv: {
      found: "Hittade",
      newGame: "Nytt spel",
      bingo: "BINGO!"
    },
    en: {
      found: "Found",
      newGame: "New Game",
      bingo: "BINGO!"
    }
  };

  const t = translations[language] || translations.sv;

  return (
    <div className={`car-bingo-container ${className}`}>
      {/* Google Fonts: Inter */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <style jsx>{`
        .car-bingo-container {
          font-family: 'Inter', sans-serif;
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .bingo-title {
          text-align: center;
          color: #2c3e50;
          font-size: 2.5em;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .bingo-subtitle {
          text-align: center;
          color: #7f8c8d;
          font-size: 1.2em;
          margin-bottom: 30px;
        }
        .bingo-grid {
          display: grid;
          grid-template-columns: repeat(${gridSize}, 1fr);
          gap: 8px;
          margin-bottom: 30px;
        }
        .bingo-cell {
          aspect-ratio: 1;
          border: 3px solid #3498db;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          position: relative;
          overflow: hidden;
        }
        .bingo-cell:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
        }
        .bingo-cell.marked {
          background: linear-gradient(145deg, #2ecc71, #27ae60);
          color: white;
          border-color: #27ae60;
          transform: scale(0.95);
        }
        .bingo-cell.marked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2em;
          font-weight: bold;
          color: white;
          z-index: 2;
        }
        .cell-content {
          text-align: center;
          font-size: 0.9em;
          font-weight: bold;
          padding: 5px;
          line-height: 1.2;
          color: #2c3e50;
          position: relative;
          z-index: 1;
        }
        .bingo-cell.marked .cell-content {
          opacity: 0.3;
        }
        .emoji {
          font-size: 1.5em;
          margin-bottom: 5px;
          display: block;
        }
        .reset-btn {
          display: block;
          margin: 20px auto 0;
          padding: 12px 30px;
          background: linear-gradient(145deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }
        .reset-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
        }
        .score {
          text-align: center;
          font-size: 1.3em;
          color: #2c3e50;
          margin-top: 20px;
          font-weight: bold;
        }
        .celebration {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3em;
          color: #f39c12;
          animation: celebrate 0.6s ease-in-out;
          pointer-events: none;
          z-index: 1000;
        }
        .bingo-notification {
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translate(-50%, 0);
          background: #27ae60;
          color: white;
          font-size: 2.5em;
          font-weight: bold;
          padding: 0.5em 1.5em;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(39, 174, 96, 0.3);
          z-index: 2000;
          animation: bingo-pop 0.7s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes celebrate {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); }
          50% { transform: translate(-50%, -50%) scale(1.2) rotate(180deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); }
        }
        @keyframes bingo-pop {
          0% { transform: translate(-50%, 0) scale(0.7); opacity: 0; }
          60% { transform: translate(-50%, 0) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
      `}</style>

      <h1 className="bingo-title">{title}</h1>
      <p className="bingo-subtitle">{subtitle}</p>

      <div className="bingo-grid">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className={`bingo-cell ${markedCells.has(index) ? 'marked' : ''}`}
            onClick={() => toggleCell(index)}
            style={cellStyle}
          >
            <div
              className="cell-content"
              style={{
                fontSize: item.text && item.text.length > 12 ? "0.75em"
                  : item.text && item.text.length > 8 ? "0.85em"
                  : undefined,
                wordBreak: "break-word",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 0,
                minWidth: 0,
              }}
            >
              {item.type === 'emoji' ? (
                <>
                  <span className="emoji">{item.content}</span>
                  <div>{item.text}</div>
                </>
              ) : (
                item.content
              )}
            </div>
          </div>
        ))}
      </div>

      {showScore && (
        <div className="score">
          {t.found}: {markedCells.size}/{totalItems}
        </div>
      )}

      {showResetButton && (
        <button className="reset-btn" onClick={resetGame}>
          🔄 {t.newGame}
        </button>
      )}

      {showCelebration && (
        <div className="celebration">🎉</div>
      )}

      {bingo && (
        <div className="bingo-notification">{t.bingo}</div>
      )}
    </div>
  );
};

export default CarBingo;