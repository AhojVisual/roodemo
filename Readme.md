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

## 語法重點

*   inline-style 優先法則
*   dataset 取出來的值一律是「字串」
*   JavaScript 條件判斷的規則中，非空字串一律為true,所以if (cell.dataset.mine)中即使cell.dataset.mine= false, 還是會得到 true 結果。
*   藉由 document.getElementById 抓取 html 裡面的 id 來進行如: sizeButtons.addEventListener('click', (e) => 等點擊事件
*   該程式則是負責抓取所有class屬性值為.size-button > document.querySelectorAll('.size-button').forEach(button =>


## 地雷遊戲需要設定的邏輯功能

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