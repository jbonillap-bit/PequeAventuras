const stories = [
  {
    title: 'Croco el cocodrilo', icon: '🐊', video: 'videos/croco.mp4',
    questions: [
      { text: '¿Cómo se llamaba el personaje del cuento?', type: 'choice', emoji:'🐊', options: ['Marcelo', 'Croco'], correct: 1 },
      { text: '¿De qué color era el personaje principal?', type: 'choice', emoji:'🎨', options: ['Rojo', 'Verde'], correct: 1 },
      { text: '¿Qué fue lo que más te gustó?', type: 'text', emoji:'✏️' },
      { text: '¿Cómo se sintió el personaje al final?', type: 'choice', emoji:'😊', options: ['Feliz', 'Aburrido'], correct: 0 }
    ]
  },
  {
    title: 'El sol saltarín de Alba y Mateo', icon: '🐰', video: 'videos/alba-mateo.mp4',
    questions: [
      { text: '¿Qué buscaba Alba por la tarde?', type: 'choice', emoji:'🥕', options: ['Brócoli', 'Zanahoria'], correct: 1 },
      { text: '¿Qué fue lo que más te gustó?', type: 'text', emoji:'✏️' },
      { text: '¿Cómo se llama el amigo de la conejita?', type: 'choice', emoji:'👦', options: ['Mateo', 'Lucas'], correct: 0 },
      { text: '¿Cómo se sintió la conejita al final?', type: 'text', emoji:'💛' }
    ]
  }
];

const games = {
  colors: {
    title: 'Aprendo colores', emoji:'🎨',
    questions: [
      { question:'¿Cuál es el color rojo?', options:[{label:'Rojo', value:'🔴'},{label:'Azul', value:'🔵'},{label:'Verde', value:'🟢'}], correct:0 },
      { question:'¿Cuál es el color amarillo?', options:[{label:'Morado', value:'🟣'},{label:'Amarillo', value:'🟡'},{label:'Negro', value:'⚫'}], correct:1 },
      { question:'¿Cuál es el color verde?', options:[{label:'Verde', value:'🟢'},{label:'Rojo', value:'🔴'},{label:'Azul', value:'🔵'}], correct:0 }
    ]
  },
  bear: {
    title: '¿Dónde está el oso?', emoji:'🐻',
    questions: [
      { question:'Toca el oso', options:[{label:'León', value:'🦁'},{label:'Oso', value:'🐻'},{label:'Mono', value:'🐵'}], correct:1 },
      { question:'Otra vez: ¿dónde está el oso?', options:[{label:'Oso', value:'🐻'},{label:'Gato', value:'🐱'},{label:'Perro', value:'🐶'}], correct:0 }
    ]
  },
  letterA: {
    title: 'Animales que empiezan con A', emoji:'🔤',
    questions: [
      { question:'Selecciona el animal que empieza con A', options:[{label:'Abeja', value:'🐝'},{label:'Perro', value:'🐶'},{label:'Gato', value:'🐱'}], correct:0 },
      { question:'Selecciona otro animal que empieza con A', options:[{label:'Vaca', value:'🐮'},{label:'Araña', value:'🕷️'},{label:'Conejo', value:'🐰'}], correct:1 }
    ]
  }
};

let storyIndex = 0, questionIndex = 0, selectedAnswer = null;
let scores = stories.map(() => ({correct:0,total:0,texts:[]}));
let currentGame = null, gameIndex = 0, gameScore = 0;
const $ = id => document.getElementById(id);
const screens = ['screenHome','screenIntro','screenVideo','screenQuestion','screenFeedback','screenStoryEnd','screenFinal','screenGamesMenu','screenGame','screenGameFeedback'];
function hideAll(){ screens.forEach(id=>$(id)?.classList.add('hidden')); }
function playSound(id){ const a=$(id); if(a){ a.currentTime=0; a.play().catch(()=>{}); } }
function goHome(){ try{$('storyVideo').pause();}catch(e){} hideAll(); $('screenHome').classList.remove('hidden'); }
function openStories(){ hideAll(); $('screenIntro').classList.remove('hidden'); }
function openGamesMenu(){ hideAll(); $('screenGamesMenu').classList.remove('hidden'); }

function startApp(){ storyIndex=0; questionIndex=0; scores = stories.map(() => ({correct:0,total:0,texts:[]})); showVideo(); }
function showVideo() {
    hideAll();

    const s = stories[storyIndex];

    $('storyIcon').textContent = s.icon;
    $('storyTitle').textContent = s.title;
    $('storyCount').textContent = `Cuento ${storyIndex + 1} de ${stories.length}`;

    const video = $('storyVideo');

    // Detener el video actual
    video.pause();

    // Quitar cualquier source anterior
    video.removeAttribute("src");

    // Asignar el nuevo video
    video.src = s.video;

    // Recargar el reproductor
    video.load();

    // Reiniciar al inicio
    video.currentTime = 0;

    $('screenVideo').classList.remove('hidden');
}
function restartVideo() {
    const video = $('storyVideo');
    video.currentTime = 0;
    video.play().catch(() => {});
}
function showQuestion(){
  // Detener video al iniciar preguntas
  const video = $('storyVideo');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  hideAll();
  selectedAnswer = null;

  const s = stories[storyIndex], q = s.questions[questionIndex];

  $('progressText').textContent = `Pregunta ${questionIndex+1} de ${s.questions.length}`;
  $('barFill').style.width = `${((questionIndex+1)/s.questions.length)*100}%`;
  $('questionText').textContent = q.text;
  $('questionEmoji').textContent = q.emoji || '❓';
  $('answers').innerHTML = '';

  $('btnCheck').classList.toggle('hidden', q.type === 'text');
  $('btnContinueText').classList.toggle('hidden', q.type !== 'text');

  if(q.type === 'choice'){
    q.options.forEach((op,i)=>{
      const label = document.createElement('label');
      label.className = 'answer-option';
      label.innerHTML = `<input type="radio" name="answer" value="${i}"><span>${String.fromCharCode(97+i)}) ${op}</span>`;
      label.onclick = ()=>{
        selectedAnswer = i;
        document.querySelectorAll('.answer-option').forEach(x=>x.classList.remove('selected'));
        label.classList.add('selected');
      };
      $('answers').appendChild(label);
    });
  } else {
    const txt = document.createElement('textarea');
    txt.className = 'text-answer';
    txt.id = 'textResponse';
    txt.placeholder = 'Escribe tu respuesta aquí...';
    $('answers').appendChild(txt);
  }

  $('screenQuestion').classList.remove('hidden');
}
function checkAnswer(){ const q=stories[storyIndex].questions[questionIndex]; if(selectedAnswer===null){ alert('Elige una respuesta.'); return; } if(q.type==='choice') scores[storyIndex].total++; if(selectedAnswer===q.correct){ scores[storyIndex].correct++; showFeedback(true); } else showFeedback(false); }
function continueFromText(){ const val=($('textResponse')?.value || '').trim(); scores[storyIndex].texts.push({question:stories[storyIndex].questions[questionIndex].text, answer:val}); nextStep(); }
function showFeedback(ok){ hideAll(); if(ok){ $('feedbackEmoji').textContent='🎉😊'; $('feedbackTitle').textContent='¡FELICIDADES!'; $('feedbackText').textContent='¡Muy bien! Respondiste correctamente.'; $('btnNext').classList.remove('hidden'); $('btnRetry').classList.add('hidden'); playSound('soundCorrect'); confetti(); } else { $('feedbackEmoji').textContent='😢'; $('feedbackTitle').textContent='Incorrecto'; $('feedbackText').textContent='Ups... esa no es la respuesta. Inténtalo otra vez.'; $('btnNext').classList.add('hidden'); $('btnRetry').classList.remove('hidden'); playSound('soundWrong'); } $('screenFeedback').classList.remove('hidden'); }
function retryQuestion(){ showQuestion(); }
function nextStep(){ questionIndex++; if(questionIndex < stories[storyIndex].questions.length) showQuestion(); else endStory(); }
function endStory(){ hideAll(); const sc=scores[storyIndex]; $('storyScore').textContent=`Terminaste ${stories[storyIndex].title}. Respuestas correctas: ${sc.correct} de ${sc.total}.`; document.querySelector('#screenStoryEnd .btn').textContent = storyIndex < stories.length-1 ? 'Ir al siguiente cuento' : 'Ver resultado final'; playSound('soundClap'); confetti(); $('screenStoryEnd').classList.remove('hidden'); }
function nextStory(){ storyIndex++; if(storyIndex < stories.length){ questionIndex=0; showVideo(); } else showFinal(); }
function showFinal(){ hideAll(); let totalC=0,totalT=0; $('finalResults').innerHTML=''; stories.forEach((s,i)=>{ totalC+=scores[i].correct; totalT+=scores[i].total; const row=document.createElement('div'); row.className='result-row'; row.innerHTML=`<strong>${s.icon} ${s.title}</strong><span>${scores[i].correct}/${scores[i].total}</span>`; $('finalResults').appendChild(row); }); const row=document.createElement('div'); row.className='result-row'; row.innerHTML=`<strong>⭐ Total</strong><span>${totalC}/${totalT}</span>`; $('finalResults').appendChild(row); playSound('soundClap'); confetti(); $('screenFinal').classList.remove('hidden'); }

function startGame(name){ currentGame=name; gameIndex=0; gameScore=0; showGameQuestion(); }
function showGameQuestion(){ hideAll(); const g=games[currentGame], q=g.questions[gameIndex]; $('gameProgress').textContent=`Pregunta ${gameIndex+1} de ${g.questions.length}`; $('gameEmoji').textContent=g.emoji; $('gameTitle').textContent=g.title; $('gameQuestion').textContent=q.question; $('gameAnswers').innerHTML=''; q.options.forEach((op,i)=>{ const btn=document.createElement('button'); btn.className='animal-option'; btn.innerHTML=`<span>${op.value}</span>`; btn.setAttribute('aria-label', op.label); btn.onclick=()=>checkGameAnswer(i); $('gameAnswers').appendChild(btn); }); $('screenGame').classList.remove('hidden'); }
function checkGameAnswer(i){ const q=games[currentGame].questions[gameIndex]; hideAll(); if(i===q.correct){ gameScore++; $('gameFeedbackEmoji').textContent='🎉😊'; $('gameFeedbackTitle').textContent='¡FELICIDADES!'; $('gameFeedbackText').textContent='¡Muy bien!'; $('gameNextBtn').classList.remove('hidden'); $('gameRetryBtn').classList.add('hidden'); playSound('soundCorrect'); confetti(); } else { $('gameFeedbackEmoji').textContent='😢'; $('gameFeedbackTitle').textContent='Incorrecto'; $('gameFeedbackText').textContent='Ups... inténtalo otra vez.'; $('gameNextBtn').classList.add('hidden'); $('gameRetryBtn').classList.remove('hidden'); playSound('soundWrong'); } $('screenGameFeedback').classList.remove('hidden'); }
function retryGameQuestion(){ showGameQuestion(); }
function nextGameQuestion(){ gameIndex++; if(gameIndex < games[currentGame].questions.length){ showGameQuestion(); } else { hideAll(); $('gameFeedbackEmoji').textContent='🏆'; $('gameFeedbackTitle').textContent='¡Juego terminado!'; $('gameFeedbackText').textContent=`Lograste ${gameScore} de ${games[currentGame].questions.length}.`; $('gameNextBtn').textContent='Volver a juegos'; $('gameNextBtn').onclick=()=>{ $('gameNextBtn').textContent='Siguiente'; $('gameNextBtn').onclick=nextGameQuestion; openGamesMenu(); }; $('gameRetryBtn').classList.add('hidden'); playSound('soundClap'); confetti(); $('screenGameFeedback').classList.remove('hidden'); } }

function confetti(){ const items=['🎉','⭐','🌈','✨','🎊','💛']; for(let i=0;i<35;i++){ const e=document.createElement('div'); e.className='confetti'; e.textContent=items[Math.floor(Math.random()*items.length)]; e.style.left=Math.random()*100+'vw'; e.style.animationDelay=(Math.random()*0.5)+'s'; document.body.appendChild(e); setTimeout(()=>e.remove(),1900); } }
