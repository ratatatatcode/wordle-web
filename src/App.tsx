import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = "https://random-word-api.herokuapp.com/word?length=5";
  const [hiddenWord, setHiddenWord] = useState("");

  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch(API_URL);
      const wordLists = await response.json();
      const randomWord = wordLists[Math.floor(Math.random() * wordLists.length)];
      setHiddenWord(randomWord.toUpperCase());
    };

    fetchWord();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <h1 className="text-blue-500">WORDLE</h1>
      <h2>Hidden Word: {hiddenWord}</h2>
    </div>
  );
}

export default App;
