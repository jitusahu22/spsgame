import React, { useState, useEffect } from "react";
import "./App.css";
import rockImg from "./images/rock.png";
import paperImg from "./images/paper.png";
import scissorsImg from "./images/scissors.png";
import winSound from "./sounds/win.mp3";
import loseSound from "./sounds/lose.mp3";
import clickSound from "./sounds/click.mp3";

function App() {
  const [userScore, setUserScore] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [message, setMessage] = useState("Play your move");
  const [msgColor, setMsgColor] = useState("#352f44");

  const [userLast, setUserLast] = useState(null);
  const [compLast, setCompLast] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [userAnim, setUserAnim] = useState(false);
  const [compAnim, setCompAnim] = useState(false);
  const [choiceAnim, setChoiceAnim] = useState("");

  const choices = { rock: rockImg, paper: paperImg, scissors: scissorsImg };

  const genComputerChoice = () => {
    const options = ["rock", "paper", "scissors"];
    return options[Math.floor(Math.random() * 3)];
  };

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const drawGame = () => {
    setMessage("🤝 Game was draw, Play Again.");
    setMsgColor("#352f44");
  };

  const showWinner = (userWin, userChoice, compChoice) => {
    if (userWin) {
      setUserScore((prev) => prev + 1);
      setUserAnim(true);
      playSound(winSound);
      setMessage(`🎉 You Win! Your ${userChoice} beats ${compChoice}`);
      setMsgColor("green");
    } else {
      setCompScore((prev) => prev + 1);
      setCompAnim(true);
      playSound(loseSound);
      setMessage(`💻 You Lose! ${compChoice} beats your ${userChoice}`);
      setMsgColor("red");
    }
  };

  const playGame = (userChoice) => {
    if (gameOver) return;

    // Play click sound + animation
    playSound(clickSound);
    setChoiceAnim(userChoice);
    setTimeout(() => setChoiceAnim(""), 300);

    const compChoice = genComputerChoice();
    setUserLast(userChoice);
    setCompLast(compChoice);

    if (userChoice === compChoice) drawGame();
    else {
      let userWin = true;
      if (userChoice === "rock") userWin = compChoice === "paper" ? false : true;
      else if (userChoice === "paper") userWin = compChoice === "scissors" ? false : true;
      else userWin = compChoice === "rock" ? false : true;
      showWinner(userWin, userChoice, compChoice);
    }
  };

  useEffect(() => {
    if (userScore === 5 || compScore === 5) {
      setMessage(userScore === 5 ? "🏆 You are the Champion!" : "💻 Computer Wins the Match!");
      setMsgColor(userScore === 5 ? "green" : "red");
      setGameOver(true);
      setShowPopup(true);
    }
  }, [userScore, compScore]);

  useEffect(() => { if (userAnim) setTimeout(() => setUserAnim(false), 500); }, [userAnim]);
  useEffect(() => { if (compAnim) setTimeout(() => setCompAnim(false), 500); }, [compAnim]);

  const resetGame = () => {
    setUserScore(0);
    setCompScore(0);
    setMessage("Play your move");
    setMsgColor("#352f44");
    setUserLast(null);
    setCompLast(null);
    setGameOver(false);
    setShowPopup(false);
  };

  return (
    <div className="App">
      <h1>Rock Paper Scissors</h1>

      <div className="main-container">
        {/* User Score + Last Choice */}
        <div className="score-container">
          <div className={`score left ${userAnim ? "score-anim" : ""}`}>
            <p>{userScore}</p>
            <p>You</p>
          </div>
          {userLast && (
            <div className="last-choice-card">
              <h4>You chose</h4>
              <img src={choices[userLast]} alt="user last" />
            </div>
          )}
        </div>

        {/* Center Choices + Message */}
        <div className="center-content">
          <div className="choices">
            {Object.keys(choices).map((choice) => (
              <div
                key={choice}
                className={`choice ${gameOver ? "disabled" : ""} ${choiceAnim === choice ? "choice-anim" : ""}`}
                onClick={() => playGame(choice)}
              >
                <img src={choices[choice]} alt={choice} />
              </div>
            ))}
          </div>
          <div className="msg-container">
            <p id="msg" style={{ backgroundColor: msgColor }}>{message}</p>
          </div>
        </div>

        {/* Computer Score + Last Choice */}
        <div className="score-container">
          <div className={`score right ${compAnim ? "score-anim" : ""}`}>
            <p>{compScore}</p>
            <p>Computer</p>
          </div>
          {compLast && (
            <div className="last-choice-card">
              <h4>Computer chose</h4>
              <img src={choices[compLast]} alt="comp last" />
            </div>
          )}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>{message}</h2>
            <p><b>Final Score:</b> You {userScore} - {compScore} Computer</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
