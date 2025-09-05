// JavaScript 程式碼將在此處撰寫

const game = document.getElementById('game');
const startButton = document.getElementById('start');
const sizeButtons = document.getElementById('size-buttons');
const endGameDiv = document.getElementById('end-game');
const restartButton = document.getElementById('restart');


let gridSize = 10; // 預設地圖大小
let mines = 10; // 預設地雷數量
let board = [];

let selectedSize = null;

sizeButtons.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-button')) {
        const size = e.target.dataset.size;
        selectedSize = size;

        // 移除所有按鈕的 active class
        document.querySelectorAll('.size-button').forEach(button => {
            button.classList.remove('active');
        });

        // 為點擊的按鈕添加 active class
        e.target.classList.add('active');

        // 根據選擇的大小設定 gridSize 和 mines
        if (size === 'small') {
            gridSize = 8;
            mines = 8;
        } else if (size === 'medium') {
            gridSize = 10;
            mines = 12;
        } else {
            gridSize = 12;
            mines = 16;
        }

        // 顯示開始按鈕
        startButton.style.display = 'block';
    }
});

//開始遊戲
startButton.addEventListener('click', () => {
    resetTimer();
    generateBoard();
    startTimer();
    game.style.display = 'grid'; // ✅ 按下開始才顯示，並套用 grid 設定
    startButton.style.display = 'none';
});

let firstClick;
function generateBoard() {
    firstClick = true;
    board = [];
    game.innerHTML = '';
    game.className = selectedSize; // 設定地圖大小的 class

    // 建立地雷分佈
    const minePositions = [];
    //重複隨機產生位置並填入地雷，假如有8顆地雷，就會產生8個不重複的位置
    while (minePositions.length < mines) {
        // 隨機產生位置(index)
        const position = Math.floor(Math.random() * gridSize * gridSize);
        // 檢查位置是否已有地雷存在，若不存在則加入
        if (!minePositions.includes(position)) {
            minePositions.push(position);
        }
    }

    // 建立遊戲盤面
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        //在 cell 上自訂一個「資料屬性」data-index
        cell.dataset.index = i;
        if (minePositions.includes(i)) {
            cell.dataset.mine = 'true';
        }
        //把新建的元素也就是cell放到 game（棋盤容器）裡
        game.appendChild(cell);


        // 左鍵點擊事件
        cell.addEventListener('click', () => {
            const index = parseInt(cell.dataset.index, 10);
            // ✅ 首次點擊安全保護
            if (firstClick) {
                firstClick = false;
                if (cell.dataset.mine === 'true') {
                    // 移除這個地雷
                    cell.dataset.mine = 'false';
                    //splice 的語法：array.splice(起始位置, 刪除數量)
                    minePositions.splice(minePositions.indexOf(index), 1);

                    // 放到新位置
                    let newPosition = Math.floor(Math.random() * gridSize * gridSize);
                    // 持續檢查新位置是否有地雷或是跟原本位置一樣
                    while (minePositions.includes(newPosition) || newPosition === index) {
                        newPosition = Math.floor(Math.random() * gridSize * gridSize);
                    }
                    minePositions.push(newPosition);
                    game.children[newPosition].dataset.mine = 'true';
                }
            }
            revealCell(cell);
        });

        // 右鍵點擊事件
        cell.addEventListener('contextmenu', (e) => {
            //阻止瀏覽器跳出右鍵選單
            e.preventDefault();
            flagCell(cell);
        });
    }

}

// 點擊某cell後，在class屬性加上revealed 代表已翻開
function revealCell(cell) {
    if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) {
        return;
    }
    cell.classList.add('revealed');
    //然後檢查該cell，也就是data-mine= true / false 有無地雷
    if (cell.dataset.mine === 'true') {
        cell.classList.add('mine');
        endGame(false);
        return;
    } 
    // 計算已經翻開的格子數
    const revealedCount = game.querySelectorAll('.cell.revealed').length;
    
    // 總格子數 - 地雷數 = 非地雷格子數
    if (revealedCount === gridSize * gridSize - mines) {
        endGame(true);
    }
    // 計算相鄰地雷數
    const index = parseInt(cell.dataset.index);
    const adjacentMines = countAdjacentMines(index);
    if (adjacentMines > 0) {
        cell.textContent = adjacentMines;
        cell.classList.add('number-' + adjacentMines); // 根據數字設定不同的 class
    }
}

// 右鍵標記地雷的可能位置
function flagCell(cell) {
    if (cell.classList.contains('revealed')) {
        return;
    }

    cell.classList.toggle('flagged');
}

let timerInterval;
let seconds = 0;

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    //秒數停下
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById('timer').textContent = formatTime(seconds);
}

function endGame(win) {
    stopTimer();
    endGameDiv.style.display = 'block';

    if (win) {
        document.querySelector('.end-message').innerHTML = '恭喜你贏了！';
    } else {
        document.querySelector('.end-message').innerHTML = '遊戲結束！';
    }

    // 禁用地圖大小按鈕
    document.querySelectorAll('.size-button').forEach(button => {
        button.disabled = true;
    });

    // 顯示所有地雷
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = game.children[i];
        if (cell.dataset.mine === 'true') {
            cell.classList.add('revealed');
            cell.classList.add('mine');
        }
        cell.replaceWith(cell.cloneNode(true)); // 移除事件
    }
}

//重新開始
restartButton.addEventListener('click', () => {
    endGameDiv.style.display = 'none';
    game.style.display = 'none';
    startButton.style.display = 'none';
    //時間歸零
    resetTimer();
    // 移除所有按鈕的 active class
    document.querySelectorAll('.size-button').forEach(button => {
        button.disabled = false;
        button.classList.remove('active');
    });
});

// 計算相鄰地雷數
function countAdjacentMines(index) {
    let count = 0;
    //計算 (x, y) 座標
    const x = index % gridSize; // 第幾欄
    const y = Math.floor(index / gridSize); // 第幾列

    //找出index周圍相鄰的8個格子
    for (let i = Math.max(0, x - 1); i <= Math.min(gridSize - 1, x + 1); i++) {
        for (let j = Math.max(0, y - 1); j <= Math.min(gridSize - 1, y + 1); j++) {
            //座標轉為 index
            const adjacentIndex = j * gridSize + i;
            if (adjacentIndex !== index && game.children[adjacentIndex].dataset.mine) {
                count++;
            }
        }
    }
    return count;
}

function formatTime(seconds){
    let minutes = Math.floor(seconds/60);
    let secs = seconds % 60;
    return (
        String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
    );
}