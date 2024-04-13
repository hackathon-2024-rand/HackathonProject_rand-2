import React, {useEffect} from 'react';
import './App.css';

function getUserID() {
  // Key to store/retrieve the user ID
  const USER_ID_KEY = 'userId';

  // Try to retrieve the user ID from local storage
  let userId = localStorage.getItem(USER_ID_KEY);

  // Check if a user ID was found
  if (!userId) {
      // Generate a new unique user ID
      userId = generateUniqueId();

      // Store the new user ID in local storage
      localStorage.setItem(USER_ID_KEY, userId);
  }

  // Return the user ID
  return userId;
}

function generateUniqueId() {
  // Generate a pseudo-random unique identifier
  return 'uid_' + Math.random().toString(36).substr(2, 9);
}

interface ReadAlongProps {
  text: string;           // Specify that `text` should be a string
  interval?: number;      // Specify that `interval` is an optional number
}

const ReadAlong: React.FC<ReadAlongProps> = ({ text, interval = 1000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false); // State to control when read-along is finished
  const words = text.split(/\s+/);  // Split text into words by spaces

  useEffect(() => {
    if (words.length === 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setCurrentIndex(current => {
        if (current + 1 < words.length) {
          return current + 1;
        } else {
          clearInterval(timer); // Stop the timer when the last word is reached
          setIsFinished(true);  // Set finished state to true
          interval += 200;
          return current;
        }
      });
    }, interval);

    return () => clearInterval(timer);  // Clean up the interval on component unmount
  }, [words.length, interval]);

  if (isFinished) {
    return (<p></p>); // Render empty paragraph when finished
  } else {
    return (
      <p>
        {words.map((word, index) => (
          <span key={index} className={index === currentIndex ? 'Active-Text' : 'Static-Text'}>
            {word + ' '}
          </span>
        ))}
      </p>
    );
  }
};

function App() {
  useEffect(()=>{
    console.log("Hi");
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.text = "Welcome to the treadmill! Directly in front of you, you will find the safety clip. Please clip in onto your shirt now for your own safety. To the left of the clip, you will find the start button. To the right of the clip, you will find the stop button. Please find the metal grasps on the handles to your left and right. These will measure your heart rate. In front of the left heart rate sensor are the buttons for increasing and decreasing the incline. In front of the right heart rate sensor are the buttons for increasing and decreasing the speed. Please alert a member of staff if you have any issues. Have a good workout!";
    msg.voice = voices[1];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }, [])
  return (
    <div className="App">
      <div className="App-header">
        EZ Repz
      </div>
      <div className="App-body">
        This is all of our body information.
        Doesn't it look so cool?
      </div>
    </div>
  );
}

export default App;
