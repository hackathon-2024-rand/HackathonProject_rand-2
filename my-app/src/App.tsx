import React, {useEffect} from 'react';
import logo from './logo.svg';
import treadmil from './images.jpg';
import './App.css';



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
