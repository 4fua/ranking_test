const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwMdqGxDiclieFVx3OU9beJ2GdxY4xwcSDSBshAnR5K1iz8hGpHR5qJqlbSO8mQ4iHgZg/exec';

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
  "ongeki": {
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

  gameSelect.addEventListener('change', () => {
    const selectedGame = gameSelect.value;
    
    songSelect.innerHTML = ''; 
    difficultySelect.innerHTML = '';

    const placeholderSong = document.createElement('option');
    placeholderSong.value = "";
    placeholderSong.textContent = "-- まず機種を選んでください --";
    songSelect.appendChild(placeholderSong);
    songSelect.disabled = true;

    const placeholderDiff = document.createElement('option');
    placeholderDiff.value = "";
    placeholderDiff.textContent = "-- まず機種を選んでください --";
    difficultySelect.appendChild(placeholderDiff);
    difficultySelect.disabled = true;

    if (selectedGame && settingsDatabase[selectedGame]) {
      const settings = settingsDatabase[selectedGame];
      
      songSelect.disabled = false;
      placeholderSong.textContent = "-- 曲名を選んでください --";
      settings.songs.forEach(songName => {
        const option = document.createElement('option');
        option.value = songName;
        option.textContent = songName;
        songSelect.appendChild(option);
      });
      
      difficultySelect.disabled = false;
      placeholderDiff.textContent = "-- 難易度を選んでください --";
      settings.difficulties.forEach(diffName => {
        const option = document.createElement('option');
        option.value = diffName;
        option.textContent = diffName;
        difficultySelect.appendChild(option);
      });
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
      statusMessage.textContent = 'スコアを送信しました！';
      statusMessage.style.color = 'green';
      form.reset(); 
      songSelect.innerHTML = '<option value="">-- まず機種を選んでください --</option>';
      songSelect.disabled = true;
      difficultySelect.innerHTML = '<option value="">-- まず機種を選んでください --</option>';
      difficultySelect.disabled = true;
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
});
