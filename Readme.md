# 踩地雷遊戲

## 簡介

這是一個使用 HTML、CSS 和 JavaScript 製作的網頁版踩地雷遊戲。

## 功能特色

* 三種難度選擇
  *  初級：9x9 網格，10 個地雷
  *  中級：16x16 網格，40 個地雷
  *  高級：24x24 網格，99 個地雷

* 經典踩地雷玩法
  *  左鍵點擊格子
  *  右鍵點擊標記/取消標記

* 遊戲資訊顯示
  *  計時器:紀錄遊戲進行時間
  *  剩餘地雷數:顯示尚未標記的地雷數量

* 首次點擊安全機制: 確保第一次點擊不會點到地雷
* 遊戲結束提示: 明確告知玩家遊戲勝利或失敗
* 重新開始功能: 開始新的一局

## 使用技術

*   HTML：負責遊戲的基本結構和內容，例如建立網格、顯示按鈕和文字等。
*   CSS：負責遊戲的樣式和視覺呈現，例如設定網格顏色、按鈕樣式和文字排版等。
*   JavaScript：負責遊戲的邏輯、互動和動態效果，例如生成地雷、處理點擊事件、判斷勝負和運作計時器等。

## 檔案結構

*   `Readme.md`：專案說明文件
*   `index.html`：HTML 檔案
*   `css/minesweeper.css`：CSS 檔案
*   `js/minesweeper.js`：JavaScript 檔案

## 語法重點整理

1. DOM 取得與操作
    * document.getElementById('id')：取得指定 id 的元素。
    * document.querySelector('.class') / document.querySelectorAll('.class')：取得指定 class 的單一或全部元素。
    * element.addEventListener('click', function)：監聽點擊事件，常用於按鈕或格子互動。
  
2. 資料屬性與 dataset
    * element.dataset.xxx：取得或設定自訂 data 屬性（如 data-mine、data-index）。
    * 注意：dataset 取出的值一律是「字串」。
  
3. 條件判斷與型別
    * if (cell.dataset.mine)：非空字串在 JS 條件判斷中為 true。
    * if (cell.dataset.mine === 'true')：精確比對字串內容。
  
4. 迴圈與陣列操作
    * forEach：遍歷陣列或 NodeList，例如 document.querySelectorAll('.size-button').forEach(...)。
    * for (let i = 0; i < arr.length; i++)：基本 for 迴圈。
  
5. 事件處理
    * element.addEventListener('contextmenu', function(e){ e.preventDefault(); ... })：右鍵事件，常用於插旗。
    * e.target：取得觸發事件的元素。
  
6. 動態建立元素
    * 動態建立元素達到互動效果
    * cell.classList.add('revealed'); 寫法，揭示在class屬性加上revealed，表示已被翻開的格子。
    * game.style.display = 'grid'; 地雷board的出現與隱藏。 
    * document.createElement('div')：建立新元素。
    * .innerHTML: 前端內容文字改變。
    * parent.appendChild(child)：將新元素加入父層。

7. class 操作
    * element.classList.add('className') / element.classList.remove('className')：新增或移除 class。
    * element.classList.contains('className')：判斷是否有某個 class。
  
8. 計時器
    * setInterval(function, 1000)：每秒執行一次，用於計時。
    * clearInterval(timer)：停止計時。

9. 隨機數與地雷生成
    * Math.random()：產生 0~1 之間的隨機數。
    * Math.floor(Math.random() * n)：產生 0~n-1 的整數。

10. 勝負判斷與遊戲邏輯
    * if (revealedCount === gridSize * gridSize - mines)：判斷是否勝利。
    * endGame(true/false)：結束遊戲並顯示結果。


## 邏輯功能

1. 地圖與地雷生成 (function generateBoard())

   * 建立一個 gridSize × gridSize 的棋盤。

   * 隨機在棋盤上放置指定數量的地雷，確保位置不重複。

   * 每個格子以 <div> 建立，並加上 data-index 與 data-mine 屬性來記錄狀態。

2. 安全機制（首次點擊保護，在 cell.addEventListener('click', ...) 裡處理）

   * 第一次點擊時檢查是否踩到地雷。

   * 如果踩到，立即把該位置的地雷移走，並隨機放到其他安全位置。

   * 確保第一次點擊永遠不會觸雷。

3. 計算相鄰地雷數 (function countAdjacentMines(index))

   * 將一維索引 index 轉換成 (x, y) 座標。

   * 檢查該格子周圍 8 個方向是否有地雷，累計數量。

   * 回傳地雷數，用於顯示在格子上。

4. 已點擊標記（function revealCell(cell) 裡延伸邏輯）

   * if (cell.dataset.mine === 'true')判斷玩家是否點擊到地雷，如若是，則輸。

   * const revealedCount > 計算翻開格子的數量，如果達到總格子數(除地雷格子之外) 
     > (revealedCount === gridSize * gridSize - mines)即玩家贏這場遊戲。

5. 旗幟標記功能 (function flagCell(cell))

   * 右鍵點擊格子 → 插上旗幟（加上 flagged class）。

   * 再次右鍵 → 移除旗幟。

   * 插旗格子不可被翻開。

6. 遊戲勝利條件（在 function revealCell(cell) 中檢查）

   * 每次翻開新格子時，統計已翻開格子數。

   * 當「已翻開的格子數 = 總格子數 - 地雷數」時，玩家獲勝。

   * 呼叫 endGame(true) 顯示「恭喜你贏了！」。

7. 遊戲失敗條件（在 function revealCell(cell) 中觸發）

   * 當翻開的格子是地雷 (cell.dataset.mine === 'true')，立即結束遊戲。

   * 呼叫 endGame(false) 顯示「遊戲結束」。

   * 並翻開所有地雷。

8. 時間與計分系統 (startTimer(), stopTimer(), resetTimer())

   * startTimer() → 遊戲開始後啟動秒數計算，每秒更新顯示。

   * stopTimer() → 遊戲結束時停止。

   * resetTimer() → 重新開始時計時歸零。

9. 重新開始與難度選擇 (restartButton.addEventListener('click', ...) + sizeButtons.addEventListener('click', ...))

   * sizeButtons → 讓玩家選擇小、中、大不同難度，決定 gridSize 與 mines。

   * restartButton → 重新開始遊戲，重置棋盤、計時器與 UI 狀態。

## 總結：

* 地雷遊戲的核心邏輯不只是「隨機放地雷 + 翻格子」，還需要 安全機制、自動計算鄰近地雷數、插旗標記、勝負判斷、計時與難度選擇 等功能，這些組合起來才構成一個完整的 Minesweeper。