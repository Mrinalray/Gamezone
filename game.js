const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const sx = document.getElementById("sx");
const so = document.getElementById("so");
const turnBadge = document.getElementById("turnBadge");

let board = [];
let current = "X";
let lock = false;
let vsBot = false;
let scoreX = 0, scoreO = 0;
let players = { X: "Player 1", O: "Player 2" };

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function buildBoard(){
  board = Array(9).fill(null);
  boardEl.innerHTML = "";
  for(let i=0;i<9;i++){
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => cellClick(i);
    boardEl.appendChild(cell);
  }
  updateTurn();
}

function updateTurn(){
  turnBadge.textContent = `Turn: ${players[current]} (${current})`;
}

function cellClick(i){
  if(lock || board[i]) return;
  place(i, current);
  const win = checkWin();
  if(win){ highlight(win); endRound(current); return; }
  if(board.every(Boolean)){ statusEl.textContent="Draw!"; lock=true; return; }
  current = current==="X"?"O":"X";
  updateTurn();
  if(vsBot && current==="O") setTimeout(botMove,400);
}

function place(i, mark){
  board[i] = mark;
  const span = document.createElement("span");
  span.className = `mark ${mark}`;
  span.textContent = mark;
  boardEl.children[i].appendChild(span);
}

function checkWin(){
  return wins.find(l =>
    board[l[0]] && board[l[0]]===board[l[1]] && board[l[1]]===board[l[2]]
  );
}

function highlight(line){
  line.forEach(i => boardEl.children[i].classList.add("win"));
}

function endRound(mark){
  lock = true;
  if(mark==="X"){ sx.textContent=++scoreX; }
  else{ so.textContent=++scoreO; }
  statusEl.textContent = `${players[mark]} Wins!`;
}

function botMove(){
  const empty = board.map((v,i)=>v?null:i).filter(i=>i!==null);
  const pick = empty[Math.floor(Math.random()*empty.length)];
  place(pick,"O");
  const win = checkWin();
  if(win){ highlight(win); endRound("O"); return; }
  if(board.every(Boolean)){ statusEl.textContent="Draw!"; lock=true; return; }
  current="X"; updateTurn();
}

document.getElementById("startBtn").onclick = () => start(false);
document.getElementById("botBtn").onclick = () => start(true);

function start(bot){
  vsBot = bot;
  players.X = document.getElementById("p1Input").value || "Player 1";
  players.O = bot ? "Bot" : (document.getElementById("p2Input").value || "Player 2");
  current="X";
  lock=false;
  statusEl.textContent = `${players.X} starts`;
  buildBoard();
}

buildBoard();
