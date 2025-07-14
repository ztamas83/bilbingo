import React, { useState, useEffect } from "react";
import bingoItems from "./bingoItems"; // <-- Import the items from an external file
import styles from "./CarBingo.module.css";

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
  language?: "sv" | "en";
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
  language = "sv",
}: CarBingoProps) => {
  // Use imported bingoItems instead of local defaultItems
  let items = customItems || bingoItems[language] || bingoItems.sv;
  if (typeof items === "string") {
    items = JSON.parse(items); // Ensure items is an array
  }
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
        if (grid.every((row) => row[col])) {
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
      bingo: "BINGO!",
    },
    en: {
      found: "Found",
      newGame: "New Game",
      bingo: "BINGO!",
    },
  };

  const t = translations[language] || translations.sv;

  return (
    <div className={`${styles["car-bingo-container"]} ${className || ""}`}>
      <h1 className={styles["bingo-title"]}>{title}</h1>
      <p className={styles["bingo-subtitle"]}>{subtitle}</p>

      <div className={styles["bingo-grid"]}>
        {displayItems.map((item, index) => (
          <div
            key={index}
            className={`${styles["bingo-cell"]} ${
              markedCells.has(index) ? styles["marked"] : ""
            }`}
            onClick={() => toggleCell(index)}
            style={cellStyle}
          >
            <div
              className={styles["cell-content"]}
              style={{
                fontSize:
                  item.text && item.text.length > 12
                    ? "0.75em"
                    : item.text && item.text.length > 8
                    ? "0.85em"
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
              {item.type === "emoji" ? (
                <>
                  <span className={styles["emoji"]}>{item.content}</span>
                  <div>{item.text}</div>
                </>
              ) : (
                item.text
              )}
            </div>
          </div>
        ))}
      </div>

      {showScore && (
        <div className={styles["score"]}>
          {t.found}: {markedCells.size}/{totalItems}
        </div>
      )}

      {showResetButton && (
        <button className={styles["reset-btn"]} onClick={resetGame}>
          🔄 {t.newGame}
        </button>
      )}

      {showCelebration && <div className={styles["celebration"]}>🎉</div>}

      {bingo && <div className={styles["bingo-notification"]}>{t.bingo}</div>}
    </div>
  );
};

export default CarBingo;
