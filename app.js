let seq = JSON.parse(localStorage.getItem("seq")||"[]");

const input=document.getElementById("input");
const result=document.getElementById("result");

function save(){localStorage.setItem("seq",JSON.stringify(seq))}

function analyze(){
  if(seq.length<2){result.textContent="Need more data";return}

  let sig={R:0,W:0};

  // frequency
  seq.forEach(x=>sig[x]+=1);

  // streaks
  for(let i=1;i<seq.length;i++){
    if(seq[i]===seq[i-1]) sig[seq[i]]+=1;
  }

  // recovery-aware logic (FIX)
  let diff=sig.R-sig.W;
  let recent=seq.slice(-8);
  let r=recent.filter(x=>x==="R").length;
  let w=recent.length-r;

  if(diff>0 && w>r) diff*=0.4;
  if(diff<0 && r>w) diff*=0.4;

  let pick=diff>0?"R":"W";

  result.textContent=`Suggest: ${pick} | R:${sig.R} W:${sig.W}`;
}

document.getElementById("R").onclick=()=>{seq.push("R");input.value+= "R";save();analyze()}
document.getElementById("W").onclick=()=>{seq.push("W");input.value+= "W";save();analyze()}

document.getElementById("undo").onclick=()=>{
  seq.pop();
  input.value=seq.join("");
  save();
  analyze();
}

document.getElementById("reset").onclick=()=>{
  seq=[];
  input.value="";
  save();
  result.textContent="";
}

document.getElementById("analyze").onclick=analyze;

input.value=seq.join("");
