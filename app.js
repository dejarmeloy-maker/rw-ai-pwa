let seq = JSON.parse(localStorage.getItem("seq")) || [];

const input = document.getElementById("input");
const result = document.getElementById("result");

render();

function save() {
  localStorage.setItem("seq", JSON.stringify(seq));
}

function add(val) {
  seq.push(val);
  save();
  render();
}

function undo() {
  seq.pop();
  save();
  render();
}

function reset() {
  seq = [];
  save();
  render();
}

function render() {
  input.value = seq.join("");
  analyze();
}

function analyze() {
  if (seq.length < 3) {
    result.textContent = "Suggest: - | R:0 W:0";
    return;
  }

  let totalR = seq.filter(x => x === "R").length;
  let totalW = seq.filter(x => x === "W").length;

  // recent momentum
  let recent = seq.slice(-7);
  let recentR = recent.filter(x => x === "R").length;
  let recentW = recent.filter(x => x === "W").length;

  // streak detection
  let last = seq[seq.length - 1];
  let streak = 1;
  for (let i = seq.length - 2; i >= 0; i--) {
    if (seq[i] === last) streak++;
    else break;
  }

  let scoreR = 0;
  let scoreW = 0;

  // momentum (STRONG)
  scoreR += recentR * 3;
  scoreW += recentW * 3;

  // total (WEAK)
  scoreR += totalR * 0.5;
  scoreW += totalW * 0.5;

  // recovery breaker
  if (streak >= 3) {
    if (last === "R") scoreW += streak * 3;
    if (last === "W") scoreR += streak * 3;
  }

  let suggest = scoreR > scoreW ? "R" : "W";
  result.textContent = `Suggest: ${suggest} | R:${totalR} W:${totalW}`;
}
