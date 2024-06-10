import React, { useState, useEffect } from "react";
import "./styles.css";

function PomodoroTimer() {
  const workDuration = 25 * 60; // 25 minutes in seconds
  const shortBreakDuration = 5 * 60; // 5 minutes in seconds
  const longBreakDuration = 15 * 60; // 15 minutes in seconds
  const sessionsBeforeLongBreak = 4;

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [timerOn, setTimerOn] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    let timer;
    if (timerOn && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const sound = new Audio("/sound.mp3");
      sound.play();

      if (isWorkSession) {
        setCompletedSessions((prevSessions) => prevSessions + 1);
        if ((completedSessions + 1) % sessionsBeforeLongBreak === 0) {
          setTimeLeft(longBreakDuration);
        } else {
          setTimeLeft(shortBreakDuration);
        }
      } else {
        setTimeLeft(workDuration);
      }

      setIsWorkSession(!isWorkSession);
    }

    return () => clearInterval(timer);
  }, [timerOn, timeLeft, isWorkSession, completedSessions]);

  const startTimer = () => {
    setTimerOn(true);
  };

  const pauseTimer = () => {
    setTimerOn(false);
  };

  const resetTimer = () => {
    setTimeLeft(workDuration);
    setTimerOn(false);
    setIsWorkSession(true);
    setCompletedSessions(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className={`pomodoro-timer ${darkMode ? "dark" : "light"}`}>
      <h1>Pomodoro Timer</h1>
      <div className="timer">{formatTime(timeLeft)}</div>
      <div className="controls">
        <button onClick={startTimer} disabled={timerOn}>
          Start
        </button>
        <button onClick={pauseTimer} disabled={!timerOn}>
          Pause
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div className="session-status">
        {isWorkSession ? "Work Session" : "Break Session"}
      </div>
      <div className="completed-sessions">
        Completed Sessions: {completedSessions}
      </div>
      <button onClick={toggleTheme}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <div className="task-manager">
        <h2>Tasks</h2>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask}>Add Task</button>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task} <button onClick={() => removeTask(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PomodoroTimer;
