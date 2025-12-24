// Load saved sequence or start empty
let seq = JSON.parse(localStorage.getItem("seq")) || [];

const input = document.getElementById("input");
const result = document.getElementById("result");

// Save to localStorage
function save() {
  localStorage.setItem("seq", JSON.stringify(seq));
}

// Add new value (R / W / etc.)
function add(val) {
  seq.push(val);
  save();
  render();
}

// Undo last input
function undo() {
  seq.pop();
  save();
  render();
}

// Clear all
function clearAll() {
  seq = [];
  save();
  render();
}

// Analyze probability
function analyze() {
  if (seq.length < 2) {
    return "Need more data";
  }

  let last = seq[seq.length - 1];
  let count = {};

  for (let i = 0; i < seq.length - 1; i++) {
    if (seq[i] === last) {
      let next = seq[i + 1];
      count[next] = (count[next] || 0) + 1;
    }
  }

  let best = null;
  let max = 0;

  for (let k in count) {
    if (count[k] > max) {
      max = count[k];
      best = k;
    }
  }

  return best ? `Suggested: ${best}` : "No clear pattern";
}

// Render UI
function render() {
  input.textContent = seq.join(" ");
  result.textContent = analyze();
}

// Initial render
render();
