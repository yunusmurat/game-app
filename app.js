const { useState } = React;

function App() {
  const [step, setStep] = useState('setup'); // setup, game, levelEnd, final, gameOver
  const [numPlayers, setNumPlayers] = useState(2);
  const [names, setNames] = useState(['', '', '', '']);
  const [players, setPlayers] = useState([]);
  const [level, setLevel] = useState(1);
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [wheelResult, setWheelResult] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [finalists, setFinalists] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [eliminated, setEliminated] = useState([]);
  const [finalWord, setFinalWord] = useState('');
  const [finalGuess, setFinalGuess] = useState('');
  const [finalAttempts, setFinalAttempts] = useState(5);
  const [finalGuessed, setFinalGuessed] = useState([]);
  const [letterGuess, setLetterGuess] = useState('');

  const easyWords = ['elma', 'masa', 'kedi', 'araba', 'kalem'];
  const mediumWords = ['baharat', 'okyanus', 'gazeteci', 'akademi', 'alışveriş'];
  const hardWords = ['mükemmellik', 'sorumluluk', 'entelektüel', 'felsefe', 'imkansızlık'];
  const finalWords = ['cumhuriyet', 'istikbal', 'hürriyet', 'mücadele', 'miras'];

  // başlatma: oyuncu isimleri ile players dizisi oluşturulur
  const startGame = () => {
    const list = [];
    for (let i = 0; i < numPlayers; i++) {
      list.push({ name: names[i] || `Oyuncu ${i + 1}`, score: 0 });
    }
    setPlayers(list);
    setLevel(1);
    prepareLevel(1, list);
    setEliminated([]);
    setStep('game');
  };

  // seviyeye göre kelime seçimi ve başlangıç değerleri
  const prepareLevel = (lvl, playerList = players) => {
    const pools = [easyWords, mediumWords, hardWords];
    const pool = pools[lvl - 1] || hardWords;
    const newWord = pool[Math.floor(Math.random() * pool.length)].toLowerCase();
    setWord(newWord);
    setGuessed([]);
    setCurrentPlayer(0);
    setWheelResult(null);
    setRemainingAttempts(6);
    setPlayers([...playerList]);
    setFinalGuess('');
    setFinalGuessed([]);
    setFinalAttempts(5);
    setFinalWord('');
  };

  // çark çevrildiğinde rastgele puan belirlenir
  const spinWheel = () => {
    const values = [100,200,300,400,500,600,'iflas'];
    const result = values[Math.floor(Math.random() * values.length)];
    if (result === 'iflas') {
      const newPlayers = [...players];
      newPlayers[currentPlayer].score = 0;
      setPlayers(newPlayers);
      setWheelResult(result);
      setCurrentPlayer((currentPlayer + 1) % players.length);
    } else {
      setWheelResult(result);
    }
  };

  // harf tahmin etme
  const guessLetter = (letter) => {
    letter = letter.toLowerCase();
    if (!wheelResult || letter.length !== 1 || guessed.includes(letter)) return;
    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);
    const newPlayers = [...players];
    if (word.includes(letter)) {
      // doğru tahmin -> puan ekle
      const count = word.split('').filter(l => l === letter).length;
      if (typeof wheelResult === 'number') {
        newPlayers[currentPlayer].score += wheelResult * count;
      }
      setPlayers(newPlayers);
      // kelime tamamen bulundu mu?
      const allFound = word.split('').every(l => newGuessed.includes(l));
      if (allFound) {
        levelComplete();
        return;
      }
    } else {
      // yanlış tahmin -> kalan hak azalt
      setRemainingAttempts(remainingAttempts - 1);
      if (remainingAttempts - 1 <= 0) {
        levelComplete();
        return;
      }
    }
    nextPlayer();
  };

  // sonraki oyuncuya geçiş
  const nextPlayer = () => {
    setWheelResult(null);
    setCurrentPlayer((currentPlayer + 1) % players.length);
  };

  // seviye tamamlandığında çağrılır
  const levelComplete = () => {
    if (level < 3) {
      const survivors = players.filter(p => p.score > 0);
      setEliminated(players.filter(p => p.score <= 0));
      if (survivors.length > 0) setPlayers(survivors);
      setStep('levelEnd');
    } else {
      const maxScore = Math.max(...players.map(p => p.score));
      const finals = players.filter(p => p.score === maxScore);
      setFinalists(finals);
      setFinalWord(finalWords[Math.floor(Math.random() * finalWords.length)]);
      setFinalGuess('');
      setFinalAttempts(5);
      setFinalGuessed([]);
      setStep('final');
    }
  };

  // bir sonraki seviyeye geç
  const nextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    prepareLevel(newLevel);
    setEliminated([]);
    setStep('game');
  };

  // finalde kelimeyi doğru bilirse büyük ödül ekle
  const finishFinal = (success) => {
    if (success) {
      const bigPrize = 5000;
      const newPlayers = players.map(p => {
        if (finalists.find(f => f.name === p.name)) {
          return { ...p, score: p.score + bigPrize };
        }
        return p;
      });
      setPlayers(newPlayers);
      setShowConfetti(true);
    }
    setStep('gameOver');
  };

  // tahmin edilen kelime harflerini ekrana getirir
  const renderWord = () => {
    return word.split('').map((l, i) => (
      <span key={i}>{guessed.includes(l) ? l : '_'}</span>
    ));
  };

  if (step === 'setup') {
    return (
      <div className="container">
        <h2>Oyuncu Sayısı Seç</h2>
        <div>
          <label>
            <input type="radio" value={2} checked={numPlayers===2} onChange={()=>setNumPlayers(2)} /> 2
          </label>
          <label style={{marginLeft: '10px'}}>
            <input type="radio" value={4} checked={numPlayers===4} onChange={()=>setNumPlayers(4)} /> 4
          </label>
        </div>
        {Array.from({length: numPlayers}).map((_,i)=>(
          <div key={i}>
            <input
              placeholder={`Oyuncu ${i+1} adı`}
              value={names[i]}
              onChange={e=>{
                const arr=[...names]; arr[i]=e.target.value; setNames(arr);
              }}
            />
          </div>
        ))}
        <button onClick={startGame}>Başla</button>
      </div>
    );
  }

  if (step === 'levelEnd') {
    return (
      <div className="container">
        <h2>{level}. Seviye Bitti</h2>
        <div className="scoreboard">
          {players.map((p,i)=>(
            <div className="player" key={i}>
              <strong>{p.name}</strong><br/>
              Puan: {p.score}
            </div>
          ))}
        </div>
        {eliminated.length>0 && (
          <p>Elenen: {eliminated.map(e=>e.name).join(', ')}</p>
        )}
        <p>Kalan Oyuncular: {players.map(p=>p.name).join(', ')}</p>
        <button onClick={nextLevel}>Sonraki Seviyeye Geç</button>
      </div>
    );
  }

  if (step === 'final') {

    const guessFinal = () => {
      const letter = finalGuess.toLowerCase();
      if (letter.length !==1 || finalGuessed.includes(letter)) return;
      const list=[...finalGuessed, letter];
      setFinalGuessed(list);
      if (!finalWord.includes(letter)) {
        setFinalAttempts(finalAttempts -1);
        if (finalAttempts -1 <=0) finishFinal(false);
      } else {
        const solved = finalWord.split('').every(l=>list.includes(l));
        if (solved) finishFinal(true);
      }
      setFinalGuess('');
    };

    return (
      <div className="container">
        <h2>Final</h2>
        <p>Finalistler: {finalists.map(f=>f.name).join(', ')}</p>
        <div className="word">
          {finalWord.split('').map((l,i)=>(
            <span key={i}>{finalGuessed.includes(l) ? l : '_'}</span>
          ))}
        </div>
        <div className="controls">
          <input value={finalGuess} onChange={e=>setFinalGuess(e.target.value)} maxLength={1} />
          <button onClick={guessFinal}>Harf Tahmin Et</button>
          <p>Kalan Hak: {finalAttempts}</p>
        </div>
      </div>
    );
  }

  if (step === 'gameOver') {
    return (
      <div className="container">
        {showConfetti && <Confetti />}
        <h2>Oyun Bitti</h2>
        <div className="scoreboard">
          {players.map((p,i)=>(
            <div className="player" key={i}>
              <strong>{p.name}</strong><br/>Puan: {p.score}
            </div>
          ))}
        </div>
        <button onClick={()=>{setStep('setup'); setShowConfetti(false);}}>Yeniden Oyna</button>
      </div>
    );
  }

  // oyun ekranı

  const handleGuess = () => {
    guessLetter(letterGuess);
    setLetterGuess('');
  };

  return (
    <div className="container">
      <h2>{level}. Seviye</h2>
      <div className="scoreboard">
        {players.map((p,i)=>(
          <div className={`player ${i===currentPlayer?'current-player':''}`} key={i}>
            <strong>{p.name}</strong><br/>Puan: {p.score}
          </div>
        ))}
      </div>
      <div className="word">{renderWord()}</div>
      <p className="wheel-result">{wheelResult ? `Çark: ${wheelResult}` : ''}</p>
      <p>Kalan Hak: {remainingAttempts}</p>
      <div className="controls">
        <button onClick={spinWheel} disabled={wheelResult !== null}>Çevir</button>
        <input value={letterGuess} maxLength={1} onChange={e=>setLetterGuess(e.target.value)} />
        <button onClick={handleGuess} disabled={wheelResult===null}>Tahmin Et</button>
      </div>
    </div>
  );
}

function Confetti() {
  React.useEffect(() => {
    const confetti = document.querySelector('.confetti');
    if (!confetti) return;
    for (let i=0; i<100; i++) {
      const div = document.createElement('div');
      div.className = 'piece';
      div.style.left = Math.random()*100 + '%';
      div.style.backgroundColor = `hsl(${Math.random()*360}, 70%, 60%)`;
      div.style.animationDelay = Math.random()*3 + 's';
      confetti.appendChild(div);
    }
  }, []);
  return <div className="confetti"></div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
