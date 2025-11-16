const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz2ZddMnS1wmLOxDojOBsnH25T9NPTlFl1C5f5tFleHmPexsDgeOkQQoJR5h1Jg8FiPLg/exec';

const IS_RANKING_PUBLIC = true;

const settingsDatabase = {
  "IIDX": {
    songs: [
      "IIDX 課題曲1",
      "IIDX 課題曲2"
    ],
    difficulties: [
      "NORMAL",
      "HYPER",
      "ANOTHER",
      "LEGGENDARIA"
    ]
  },
  "SDVX": {
    songs: [
      "SDVX 課題曲A",
      "SDVX 課題曲B"
    ],
    difficulties: [
      "NOVICE",
      "ADVANCED",
      "EXHAUST",
      "MAXIMUM",
      "VIVID"
    ]
  },
  "chunithm": {
    songs: [
      "チュウニズム 課題曲X",
      "チュウニズム 課題曲Y"
    ],
    difficulties: [
      "BASIC",
      "ADVANCED",
      "EXPERT",
      "MASTER",
      "ULTIMA"
    ]
  },
  "オンゲキ": {
    songs: [
      "オンゲキ 課題曲1",
      "オンゲキ 課題曲2"
    ],
    difficulties: [
      "BASIC",
      "ADVANCED",
      "EXPERT",
      "MASTER",
      "LUNATIC"
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const gameSelect = document.getElementById('gameSelect');
  const songSelect = document.getElementById('songSelect');
  const difficultySelect = document.getElementById('difficultySelect');
  const form = document.getElementById('scoreForm');
  const statusMessage = document.getElementById('statusMessage');
  const submitButton = document.getElementById('submitButton');
  const rankingContainer = document.getElementById('rankingContainer');

  gameSelect.addEventListener('change', () => {
    const selectedGame = gameSelect.value;
    
    songSelect.innerHTML = ''; 
    difficultySelect.innerHTML = '';

    if (selectedGame && settingsDatabase[selectedGame]) {
      const settings = settingsDatabase[selectedGame];
      
      songSelect.disabled = false;
      const placeholderSong = document.createElement('option');
      placeholderSong.value = "";
      placeholderSong.textContent = "-- 曲名を選んでください --";
      songSelect.appendChild(placeholderSong);
      
      settings.songs.forEach(songName => {
        const option = document.createElement('option');
        option.value = songName;
        option.textContent = songName;
        songSelect.appendChild(option);
      });
      
      difficultySelect.disabled = false;
      const placeholderDiff = document.createElement('option');
      placeholderDiff.value = "";
      placeholderDiff.textContent = "-- 難易度を選んでください --";
      difficultySelect.appendChild(placeholderDiff);

      settings.difficulties.forEach(diffName => {
        const option = document.createElement('option');
        option.value = diffName;
        option.textContent = diffName;
        difficultySelect.appendChild(option);
      });

    } else {
      songSelect.disabled = true;
      const placeholderSong = document.createElement('option');
      placeholderSong.value = "";
      placeholderSong.textContent = "-- まず機種を選んでください --";
      songSelect.appendChild(placeholderSong);

      difficultySelect.disabled = true;
      const placeholderDiff = document.createElement('option');
      placeholderDiff.value = "";
      placeholderDiff.textContent = "-- まず機種を選んでください --";
      difficultySelect.appendChild(placeholderDiff);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    statusMessage.textContent = '';
    
    const formData = {
      game: document.getElementById('gameSelect').value,
      song: document.getElementById('songSelect').value,
      difficulty: document.getElementById('difficultySelect').value,
      name: document.getElementById('nameInput').value,
      score: document.getElementById('scoreInput').value,
      comment: document.getElementById('commentInput').value
    };

    fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      mode: 'no-cors'
    })
    .then(response => {
      statusMessage.textContent = 'スコアを送信しました！最新のランキングを読み込みます...';
      statusMessage.style.color = 'green';
      form.reset(); 
      songSelect.innerHTML = '<option value="">-- まず機種を選んでください --</option>';
      songSelect.disabled = true;
      difficultySelect.innerHTML = '<option value="">-- まず機種を選んでください --</option>';
      difficultySelect.disabled = true;
      
      loadRankings(); 
    })
    .catch(error => {
      statusMessage.textContent = `ネットワークエラー: ${error.message}`;
      statusMessage.style.color = 'red';
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = '送信';
    });
  });

  function displayRankings(data) {
    rankingContainer.innerHTML = '';
    
    if (data.length === 0) {
      rankingContainer.innerHTML = '<p>まだスコアデータがありません。</p>';
      return;
    }

    const groupedByGame = data.reduce((acc, record) => {
      const game = record.game;
      if (!acc[game]) {
        acc[game] = [];
      }
      acc[game].push(record);
      return acc;
    }, {});

    for (const gameName of Object.keys(groupedByGame).sort()) {
      const gameSection = document.createElement('div');
      gameSection.className = 'game-ranking';
      
      const gameTitle = document.createElement('h3');
      gameTitle.textContent = gameName;
      gameSection.appendChild(gameTitle);

      const groupedBySong = groupedByGame[gameName].reduce((acc, record) => {
        const song = record.song;
        if (!acc[song]) {
          acc[song] = [];
        }
        acc[song].push(record);
        return acc;
      }, {});

      for (const songName of Object.keys(groupedBySong).sort()) {
        const songSection = document.createElement('div');
        songSection.className = 'song-ranking';
        
        const songTitle = document.createElement('h4');
        songTitle.textContent = songName;
        songSection.appendChild(songTitle);

        const groupedByDifficulty = groupedBySong[songName].reduce((acc, record) => {
          const difficulty = record.difficulty;
          if (!acc[difficulty]) {
            acc[difficulty] = [];
          }
          acc[difficulty].push(record);
          return acc;
        }, {});

        for (const difficultyName of Object.keys(groupedByDifficulty).sort()) {
          const difficultySection = document.createElement('div');
          difficultySection.className = 'difficulty-ranking';
          
          const difficultyTitle = document.createElement('h5');
          difficultyTitle.textContent = difficultyName;
          difficultySection.appendChild(difficultyTitle);
          
          const highestScores = new Map();
          
          for (const record of groupedByDifficulty[difficultyName]) {
            const name = record.name;
            if (!highestScores.has(name) || record.score > highestScores.get(name).score) {
              highestScores.set(name, record);
            }
          }
          
          const filteredRecords = Array.from(highestScores.values());
          
          const sortedRecords = filteredRecords.sort((a, b) => b.score - a.score);

          const list = document.createElement('ol');
          sortedRecords.forEach(record => {
            const item = document.createElement('li');
            const scoreText = document.createTextNode(record.name + ': ' + record.score);
            
            item.appendChild(scoreText);
            
            if (record.comment) {
              const commentDiv = document.createElement('div');
              commentDiv.className = 'comment-bubble';
              commentDiv.textContent = record.comment;
              item.appendChild(commentDiv);
            }
            
            list.appendChild(item);
          });
          
          difficultySection.appendChild(list);
          songSection.appendChild(difficultySection);
        }
        gameSection.appendChild(songSection);
      }
      rankingContainer.appendChild(gameSection);
    }
  }

  function loadRankings() {
    
    if (!IS_RANKING_PUBLIC) {
      rankingContainer.innerHTML = '<p>ランキング公開を停止しました！結果発表日をお待ちください。</p>';
      rankingContainer.style.color = '#333'; 
      return; 
    }

    rankingContainer.innerHTML = '<p>ランキングを読み込み中...</p>';
    rankingContainer.style.color = '#333';
    
    fetch(GAS_WEB_APP_URL) 
      .then(response => {
        if (!response.ok) {
          throw new Error('ネットワーク応答がありませんでした。');
        }
        return response.json();
      })
      .then(data => {
        if (data.result === 'error') {
          throw new Error('GAS側でエラーが発生: ' + data.message);
        }
        displayRankings(data);
      })
      .catch(error => {
        rankingContainer.innerHTML = '<p>ランキングの読み込みに失敗しました: ' + error.message + '</p>';
        rankingContainer.style.color = 'red';
      });
  }

  loadRankings();

});



