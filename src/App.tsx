import { useEffect, useRef, useState, type RefObject } from "react";
import "./App.css";

function App() {
  const apiURL = "https://random-word-api.herokuapp.com/word?length=5";
  // Set default for testing if the API is not working.
  const [hiddenWord, setHiddenWord] = useState("");
  const rowToCheckRef: RefObject<number> = useRef(0);
  const [currentAnswer, setCurrentAnswer] = useState<string[]>([]);

  // Update: Game State - win/lose. (Button to start or restart the game.)
  const [gameState, setGameState] = useState("idle");
  // const [currentStatus, setCurrentStatus] = useState<string[]>([]);

  const [boxes, setBoxes] = useState<string[][]>([
    ["empty", "empty", "empty", "empty", "empty", "open"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
  ]);

  useEffect(() => {
    try {
      const fetchWord = async () => {
        const response = await fetch(apiURL);
        const wordLists = await response.json();
        const randomWord = wordLists[Math.floor(Math.random() * wordLists.length)];
        setHiddenWord(randomWord.toUpperCase());
      };

      fetchWord();
    } catch (err) {
      console.log(`Fetch error: ${err}`);
    }
  }, []);

  const checkAnswer = () => {
    const newBoxes = [...boxes];
    const updateRow = [...newBoxes[rowToCheckRef.current]];

    // Fix: Uncaught TypeError: newBoxes[nextRowToCheck] is not iterable
    let nextRowToCheck =
      rowToCheckRef.current < 5 ? rowToCheckRef.current + 1 : rowToCheckRef.current;
    const updateSecondRow = [...newBoxes[nextRowToCheck]];
    console.log(`Current: ${rowToCheckRef.current} | Next: ${nextRowToCheck}`);

    let correctLetterCount = 0;
    let tryCount = 0;

    if (tryCount <= 5) {
      boxes[rowToCheckRef.current]
        .filter((w) => w !== "open" && w !== "checked" && w !== "unchecked")
        .forEach((_, idx) => {
          if (hiddenWord[idx] === currentAnswer[idx]) {
            updateRow[idx] = "correct";
            correctLetterCount++;
          } else if (hiddenWord.includes(currentAnswer[idx])) {
            updateRow[idx] = "misplaced";
          } else {
            updateRow[idx] = "incorrect";
          }

          tryCount++;
        });
    }

    if (correctLetterCount === 5 && tryCount <= 5) {
      setGameState("win");
    }

    if (gameState !== "win") {
      updateRow[5] = "checked";
      newBoxes[rowToCheckRef.current] = updateRow;
      updateSecondRow[5] = "open";
      newBoxes[nextRowToCheck] = updateSecondRow;
      correctLetterCount = 0;

      rowToCheckRef.current++;
      setCurrentAnswer([]);
      setBoxes(newBoxes);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-blue-500">WORDLE</h1>
        <h2>Hidden Word: {hiddenWord}</h2>
      </div>
      <div className="flex flex-col gap-[4px]">
        {boxes.map((_, idx) => (
          <div className="flex gap-[4px]" key={idx}>
            {boxes[idx]
              .filter((w) => w !== "open" && w !== "checked" && w !== "unchecked")
              .map((_, checkerIdx) => (
                <input
                  maxLength={1}
                  key={checkerIdx}
                  className={`h-[50px] w-[50px] p-2 text-center text-2xl ${
                    boxes[idx][checkerIdx] === "misplaced"
                      ? "bg-[#f3c237]"
                      : boxes[idx][checkerIdx] === "correct"
                        ? "bg-[#79b851]"
                        : ""
                  }`}
                  disabled={boxes[idx][5] === "unchecked" || boxes[idx][5] === "checked"}
                  onChange={(e) => {
                    /* const newCurrentAnswer = [...currentAnswer];
                    newCurrentAnswer[idx] = e.target.value;
                    setCurrentAnswer(newCurrentAnswer); */
                    setCurrentAnswer((prev) => [...prev, e.target.value]);
                  }}
                />
              ))}
          </div>
        ))}
      </div>
      {gameState === "win" && <h2>YOU WIN!</h2>}
      <button className="mt-[10px]" onClick={checkAnswer}>
        Enter
      </button>
    </div>
  );
}

export default App;
