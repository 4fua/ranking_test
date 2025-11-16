// ==========================================================
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwMdqGxDiclieFVx3OU9beJ2GdxY4xwcSDSBshAnR5K1iz8hGpHR5qJqlbSO8mQ4iHgZg/exec';
// ==========================================================

const songDatabase = {
  "A": [
    "機種A - 課題曲1aa",
    "機種A - 課題曲2",
    "機種A - 課題曲3"
  ],
  "B": [
    "機種B - 課題曲ALPHA",
    "機種B - 課題曲BETA"
  ],
  "C": [
    "機種C - チャレンジ曲X",
    "機種C - チャレンジ曲Y"
  ],
  "D": [
    "機種D - 課題曲(難)" 
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const gameSelect = document.getElementById('gameSelect');
  const songSelect = document.getElementById('songSelect');
  const form = document.getElementById('scoreForm');
  const statusMessage = document.getElementById('statusMessage');
  const submitButton = document.getElementById('submitButton');

  // (gameSelect.addEventListener の部分は変更なし)
  gameSelect.addEventListener('change', () => {
    const selectedGame = gameSelect.value;
    
    // 曲選択プルダウンを一旦リセット
    songSelect.innerHTML = ''; // 中身を空にする

    if (selectedGame && songDatabase[selectedGame]) {
      // 機種に対応する曲リストが存在する場合
      songSelect.disabled = false;
      
      // プレースホルダーを追加
      const placeholder = document.createElement('option');
      placeholder.value = "";
      placeholder.textContent = "-- 曲名を選んでください --";
      songSelect.appendChild(placeholder);
      
      // 曲データベースから曲を<option>として追加
      songDatabase[selectedGame].forEach(songName => {
        const option = document.createElement('option');
        option.value = songName;
        option.textContent = songName;
        songSelect.appendChild(option);
      });
      
    } else {
      // 機種が選ばれていない、または曲リストが存在しない場合
      const placeholder = document.createElement('option');
      placeholder.value = "";
      placeholder.textContent = "-- まず機種を選んでください --";
      songSelect.appendChild(placeholder);
      songSelect.disabled = true;
    }
  });


  // 2. フォームが送信された時の処理 (★ここを修正★)
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // フォームの既定の送信動作をキャンセル

    // ボタンとフォームを無効化
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    statusMessage.textContent = '';
    
    // 送信するデータをオブジェクトとしてまとめる
    const formData = {
      game: document.getElementById('gameSelect').value,
      song: document.getElementById('songSelect').value,
      name: document.getElementById('nameInput').value,
      score: document.getElementById('scoreInput').value,
    };

    // fetch API を使ってGASにデータをPOST送信
    fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      mode: 'no-cors' // ★★★ これを追加 ★★★
    })
    .then(response => {
      // mode: 'no-cors' の場合、レスポンスの中身は確認できないが、
      // リクエストが「送信された」こと（ネットワークエラー以外）は保証される。
      statusMessage.textContent = 'スコアを送信しました！'; // メッセージを成功時のものに変更
      statusMessage.style.color = 'green';
      form.reset(); // フォームをリセット
      // フォームリセット後にプルダウンも初期状態に戻す
      songSelect.innerHTML = '<option value="">-- まず機種を選んでください --</option>';
      songSelect.disabled = true;
    })
    .catch(error => {
      // mode: 'no-cors' でも、ネットワーク接続自体が切れている場合などはcatchに入る
      statusMessage.textContent = `ネットワークエラー: ${error.message}`;
      statusMessage.style.color = 'red';
    })
    .finally(() => {
      // 成功・失敗どちらでもボタンを元に戻す
      submitButton.disabled = false;
      submitButton.textContent = '送信';
    });
  });
});

