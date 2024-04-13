import React, {useEffect} from 'react';
import './App.css';
import { useState } from 'react';
import imageToAdd from "./logo.png";
import { createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://hutlkszqjimqkjbkchsg.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dGxrc3pxamltcWtqYmtjaHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMjk3NTI2NSwiZXhwIjoyMDI4NTUxMjY1fQ.F3Td4ApsS9FCLcvwYDHPI4DTsEtA9iTRQeIbJikBnWw';
const supabase = createClient(supabaseUrl, supabaseKey);

let finish: boolean = false;
function getUserID() {
  // Key to store/retrieve the user ID
  const USER_ID_KEY = 'userId';

  // Try to retrieve the user ID from local storage
  let userId = Number(localStorage.getItem(USER_ID_KEY));

  // Check if a user ID was found
  if (!userId) {
      // Generate a new unique user ID
      userId = generateUniqueId();

      // Store the new user ID in local storage
      localStorage.setItem(USER_ID_KEY, String(userId));
  }

  // Return the user ID
  return userId;
}

function generateUniqueId() {
  // Generate a pseudo-random unique identifier
  return Math.floor(Math.random() * 100000000);;
}

interface ReadAlongProps {
  text: string;           // Specify that `text` should be a string
  baseInterval?: number;
  onComplete: () => void;
}

const ReadAlong: React.FC<ReadAlongProps> = ({ text, baseInterval = 1000, onComplete }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || []; // Split text into sentences
  const words = sentences[currentSentenceIndex]?.split(/\s+/) || [];

  useEffect(() => {
    if (sentences.length === 0) {
      setIsFinished(true);
      return;
    }

    const handleWordRead = () => {
      if (currentWordIndex + 1 < words.length) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else if (currentSentenceIndex + 1 < sentences.length) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setCurrentWordIndex(0);
      } else {
        setIsFinished(true);
      }
    };

    const currentWord = words[currentWordIndex];
    const containsPunctuation = /[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(currentWord);
    const interval = containsPunctuation ? baseInterval + 300 : baseInterval;

    const timer = setTimeout(handleWordRead, interval);

    return () => clearTimeout(timer);
  }, [currentSentenceIndex, currentWordIndex, words, sentences, baseInterval, onComplete]);

  if (isFinished) {
    onComplete(); 
    return <p></p>;
  } else {
    return (
      <p>
        {words.map((word, index) => (
          <span key={index} className={index === currentWordIndex ? 'Active-Text' : 'Static-Text'}>
            {word + ' '}
          </span>
        ))}
      </p>
    );
  }
  return (<p>ERROR</p>);
};


async function updateColumn(tableName: string, columnToUpdate: any, conditionColumn: string, conditionValue: any)
{
    const  response1  = await supabase
       .from(tableName)
       .select(columnToUpdate)
       .eq(conditionColumn, conditionValue)
       .single();

    const result = response1.data ?? []; 
    const currentValue = result[columnToUpdate]; 
    const newValue = !currentValue; 

    console.log(currentValue);
    console.log(newValue);

    await supabase
        .from(tableName)
        .update({[columnToUpdate] : newValue})
        .eq(conditionColumn, conditionValue); 
}
async function insertNewUser(usID: number, initialWeight: number)
{
        await supabase
            .from('Users')
            .insert([{userID: usID, currWeight: initialWeight}]);
}


async function getMachAvailability(workOut: string)
{
    const [response1, response2] = await Promise.all([
    supabase
        .from('Machine')
        .select('')
        .eq('muscleWorked', workOut), 
    supabase
        .from('Machine')
        .select('isEmpty')
        .eq('muscleWorked', workOut)
        .eq('isEmpty', 'FALSE')
    ]);

  const data1 = response1.data ?? [];
  const data2 = response2.data ?? []; 

    const countTotal= data1.length; 
    const count = data2.length; 

    return count; 
    //console.log('Total available machines for ' + workOut + ' is: ', count);
    //console.log('Total percent availability: ', (count/countTotal)100, '%'); 
};




function App() {
  const [isFinished, setIsFinished] = useState(false);
  let userID: number = getUserID();
  let treadmills: any = getMachAvailability("cardio");
  console.log(userID);
  insertNewUser(userID, 135);
  updateColumn("Machine", "isEmpty", "urlLink", "rand/17");
  let texts: string = "Welcome to The University of Arkansas gym, also known as the UREC. You have indicated that you would like to work on legs today. Currently there are 5 treadmills open. To access the treadmills, walk 50 feet and turn to your left.";
  useEffect(()=>{
    console.log("Hi");
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.text = texts;
    msg.voice = voices[1];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }, [])
  const handleCompletion = () => {
    setIsFinished(true);  // Update state to show buttons
  };
  return (
    <div className="App">
      <div className="App-header">
       <img src={imageToAdd} alt="Image" className="App-logo"/>
        EZ Repz
      </div>
      <div className="App-body"> 
        <ReadAlong text={texts} baseInterval={250} onComplete={handleCompletion}/>
      </div>
    </div>
  );
}

export default App;
