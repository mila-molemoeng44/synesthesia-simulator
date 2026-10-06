import logo from './logo.svg';
import './App.css';
import {useRef, useState, useEffect, use} from 'react';
import * as med from "meyda";
import {min, max, median} from "mathjs";


function App() {
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const m = require("mathjs");

  const [low, setLow] = useState(null);
  const [mid, setMid] = useState(null);
  const [high, setHigh] = useState(null);
  const [cent, setCent] = useState(null);
  const [spread, setSpread] = useState(null);
  const [freq, setFreq] = useState(null);
  const [isRec, setRec] = useState(true);
  const [time, setTime] = useState(null);
  const [root, setRoot] = useState(null);
  const [predictions, setPredictions] = useState(null);


  const start = async() =>{
    try{
      setRec(true);

      const stream = await navigator.mediaDevices.getUserMedia({audio: true});

      const audioContext = new(window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current= audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const bufferSize = 3000;

      const analyse = med.createMeydaAnalyzer({
        audioContext: audioContext,
        source : source,
        bufferSize: 512,
        featureExtractors: ["powerSpectrum", "spectralCentroid", "amplitudeSpectrum", "spectralSpread", "rms"],
        callback: (features) => {
          if(!features) return;

          const powerSpectrum = features.powerSpectrum; 
          
          const powerArray = Object.values(powerSpectrum);

          const lowBand= m.min(powerArray) * 1000000000000000;
          const midBand = m.median(powerArray) * 10000000;
          const highBand = m.max(powerArray) * 10000;

          setLow(lowBand);
          setMid(midBand);
          setHigh(highBand);

          const spectralCent = features.spectralCentroid * 10;
          const spectralSpread = features.spectralSpread * 10;

          setCent(spectralCent);
          setSpread(spectralSpread);
          
          const amp = features.amplitudeSpectrum;
          const sampleRate = audioContext.sampleRate;
          const domFreq =  amp.indexOf(m.max(...amp)) * (sampleRate/ bufferSize);

          setFreq(domFreq);
          const current = audioContext.currentTime / 10;
          setTime(current);

          const rms = features.rms * 100;
          setRoot(rms);

          console.log(current);  
          console.log(lowBand);
          console.log(midBand);
          console.log(highBand);
          console.log(spectralCent);
          console.log(spectralSpread);
          console.log(domFreq);
          console.log(rms);

        }
        
      })
      analyse.start();
      analyzerRef.current = analyse;
      setRec(false);

    }catch(error){
      console.log(error);
    }

  };
  const stop = () =>{
    setRec(true);
    if(analyzerRef.current){
      analyzerRef.current.stop();
      return
    }
    if(audioContextRef.current){
      audioContextRef.current.close();
      return;
    }
    setLow(0);
    setMid(0);
    setHigh(0);
    setCent(0);
    setSpread(0);
    setFreq(0);
    setTime(0);
    console.log(isRec);

  }

  useEffect(() => {
    const predict = async () => {
      try{
      const input = {
        dominant_frequency_hz:freq,
        amplitude: root,
        low_band_energy: low,
        mid_band_energy: mid,
        high_band_energy: high,
        spectral_centroid_hz: cent,
        spectral_spread_hz: spread,
        timestamp_seconds: time
      };
      const response = await fetch(`https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input)
      });
      const result = await response.json();
      const pred = result.prediction;
      setPredictions(pred);

      console.log("result:", result);
      console.log("type input:", typeof(input));
      console.log(freq);
    }catch(error){
      console.log(error);
    }
  };
 
  predict();
  })
  
  return (
    <div>
      <h1>Synesthesia Simulator</h1>

      {isRec ? (
        <button onClick={start}>Start Listening</button>
      ) : (
        <button onClick = {stop}>Stop Listening</button>
      )}
      <p>low : {low}</p>
      <p>mid: {mid}</p>
      <p>high: {high}</p>
      <p>cent: {cent}</p>
      <p>spread: {spread}</p>
      <p>freq: {freq}</p>
      <p>time: {time}</p>
      <p>ampl: {root}</p>
      <p> pred: {predictions}</p>

      {(() => {
        if(predictions === 0){
      return <div className= "warm-soft"></div>
    }
    if(predictions === 1){
      return <div className= "sharp-chaotic"></div>
    }
    if(predictions === 2){
      return <div className= "deep-calm"></div>
    }
    if(predictions === 3){
      return <div className= "airy-ethereal"></div>
    }
    if(predictions === 4){
      return <div className= "bright-energetic"></div>
    }

      }) ()}
     
    </div>
  );
}

export default App;
