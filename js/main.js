// main.js - interactions for Our Little Universe
document.getElementById('date').textContent = new Date().toLocaleDateString('id-ID', {day:'2-digit',month:'long',year:'numeric'});

const loading = document.getElementById('loading');
const bar = document.getElementById('bar');
const wrap = document.getElementById('wrap');
const stars = document.getElementById('stars');

// simulate loading
let p = 0;
const prog = setInterval(()=>{
  p += Math.random()*12;
  if(p>100) p=100;
  bar.style.width = p + '%';
  if(p >= 100){
    clearInterval(prog);
    setTimeout(()=> {
      loading.style.display = 'none';
      wrap.setAttribute('aria-hidden','false');
      showStars();
    }, 400);
  }
}, 220);

function showStars(){
  stars.classList.add('show');
  for(let i=0;i<60;i++){
    const s = document.createElement('div');
    s.className='star';
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.transform = `scale(${0.4 + Math.random()*1.2})`;
    s.style.opacity = 0.9*Math.random();
    stars.appendChild(s);
    const dur = 2000 + Math.random()*3000;
    s.animate([{transform:'translateY(0) scale(1)', opacity: s.style.opacity},{transform:'translateY(-120px) scale(0.6)', opacity:0}], {duration: dur, easing:'ease-out'});
    setTimeout(()=> s.remove(), 2800 + Math.random()*1000);
  }
}

// polaroid viewer
document.querySelectorAll('.polaroid').forEach(p => {
  p.addEventListener('click', ()=> {
    const img = p.querySelector('img');
    const cap = p.getAttribute('data-caption') || p.querySelector('.caption').textContent;
    document.getElementById('viewerImg').src = img.src;
    document.getElementById('viewerCaption').textContent = cap;
    document.getElementById('viewer').classList.add('show');
    document.getElementById('viewer').setAttribute('aria-hidden','false');
  });
});
document.getElementById('closeViewer').addEventListener('click', ()=> {
  document.getElementById('viewer').classList.remove('show');
  document.getElementById('viewer').setAttribute('aria-hidden','true');
});

// quiz logic
const options = document.querySelectorAll('#quiz .option');
let answered = false;
options.forEach(opt=>{
  opt.addEventListener('click', ()=>{
    if(answered) return;
    answered = true;
    const correct = opt.dataset.correct === 'true';
    if(correct){ opt.classList.add('correct'); document.getElementById('qhint').textContent = 'Bener! Kita emang selalu bareng.'; }
    else { opt.classList.add('wrong'); document.getElementById('qhint').textContent = 'Wkwk, itu memori lain nih.'; }
  });
});

// feed toothless game
let score = 0;
const scoreEl = document.getElementById('score');
document.getElementById('feedBtn').addEventListener('click', ()=> {
  score++;
  scoreEl.textContent = score;
  const p = document.createElement('div'); p.textContent='🐟';
  p.style.position='absolute'; p.style.left=(30 + Math.random()*40) + '%'; p.style.top='40%'; p.style.fontSize='22px';
  document.getElementById('toothlessBox').appendChild(p);
  p.animate([{transform:'translateY(0) scale(1)', opacity:1},{transform:'translateY(-80px) scale(1.2)', opacity:0}],{duration:900}).onfinish=()=>p.remove();
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type='sine';
    o.frequency.value = 880 + Math.random()*200;
    g.gain.value = 0.002;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
    setTimeout(()=>{o.stop(); ctx.close()},240);
  }catch(e){}
  if(score >= 10) unlockSpecial();
});
function unlockSpecial(){
  document.getElementById('giftCode').textContent = 'MEGA-ANNIV-2025';
  document.getElementById('giftModal').classList.add('show');
}
document.getElementById('closeGiftModal').addEventListener('click', ()=> document.getElementById('giftModal').classList.remove('show'));
document.getElementById('openGift').addEventListener('click', ()=> document.getElementById('giftModal').classList.add('show'));

// download HTML
document.getElementById('downloadBtn').addEventListener('click', ()=>{
  const html = '<!doctype html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'our-little-universe.html'; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

// audio controls
const bg = document.getElementById('bgMusic');
document.getElementById('playAudio').addEventListener('click', ()=>{
  bg.play().catch(()=>alert('Playback gagal — cek izin autoplay di browser.'));
});
document.getElementById('stopAudio').addEventListener('click', ()=>{ bg.pause(); bg.currentTime = 0; });

// close viewer/gift on Esc
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ document.getElementById('viewer').classList.remove('show'); document.getElementById('giftModal').classList.remove('show'); } });
