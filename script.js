const questions = [
  {
    question: "Quelle année marque la chute de l’Empire romain d’Occident ?",
    options: ["476", "800", "1492", "1789"],
    answer: 0
  },
  {
    question: "Qui fut couronné empereur en 1804 ?",
    options: ["Louis XVI", "Napoléon Bonaparte", "Charlemagne", "Henri IV"],
    answer: 1
  },
  {
    question: "Quelle révolution débute en 1789 en France ?",
    options: ["Révolution industrielle", "Révolution française", "Révolution américaine", "Révolution russe"],
    answer: 1
  },
  {
    question: "Où a eu lieu le débarquement du 6 juin 1944 ?",
    options: ["Normandie", "Provence", "Bretagne", "Ardennes"],
    answer: 0
  },
  {
    question: "Qui a inventé l’imprimerie ?",
    options: ["Christophe Colomb", "Gutenberg", "Galilée", "Pasteur"],
    answer: 1
  },
  {
    question: "Quelle bataille célèbre a eu lieu en 1415 ?",
    options: ["Azincourt", "Verdun", "Austerlitz", "Marignan"],
    answer: 0
  },
  {
    question: "Quel roi fut guillotiné pendant la Révolution française ?",
    options: ["Louis XIV", "Louis XVI", "Louis XVIII", "Charles X"],
    answer: 1
  },
  {
    question: "En quelle année a eu lieu la chute du mur de Berlin ?",
    options: ["1989", "1945", "1968", "2001"],
    answer: 0
  },
  {
    question: "Quel peuple a construit les pyramides de Gizeh ?",
    options: ["Les Grecs", "Les Romains", "Les Égyptiens", "Les Mayas"],
    answer: 2
  },
  {
    question: "Qui était Jeanne d’Arc ?",
    options: [
      "Une reine de France",
      "Une sainte et héroïne nationale",
      "Une exploratrice du Nouveau Monde",
      "Une inventrice célèbre"
    ],
    answer: 1
  }
];

let current = 0;
let score = 0;
let passed = 0;
let transitioning = false;

function setProgressBar() {
  const percent = Math.round((current) / questions.length * 100);
  document.getElementById('progress').style.width = percent + "%";
  document.getElementById('progress-text').textContent = percent + "%";
}

function animateTransition(outCallback, inCallback) {
  const qcm = document.getElementById('qcm');
  qcm.classList.remove('fade-in');
  qcm.classList.add('fade-out');
  transitioning = true;
  setTimeout(() => {
    outCallback && outCallback();
    qcm.classList.remove('fade-out');
    inCallback && inCallback();
    qcm.classList.add('fade-in');
    setTimeout(() => { transitioning = false; }, 300);
  }, 420);
}

function showQuestion() {
  setProgressBar();
  const q = questions[current];
  let html = `<div class="question">${current + 1}/10 - ${q.question}</div><div class="options">`;
  q.options.forEach((opt, idx) => {
    html += `<label><input type="radio" name="option" value="${idx}"> ${opt}</label>`;
  });
  html += `</div>
    <button onclick="btnClick(event,submitAnswer)">Valider</button>
    <button class="ripple" onclick="btnClick(event,skipQuestion)">Passer</button>
  `;
  animateTransition(() => {
    document.getElementById('qcm').innerHTML = html;
  }, () => {});
}

function btnClick(e, fn) {
  // ripple effect
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  circle.className = 'ripple-effect';
  const d = Math.max(btn.clientWidth, btn.clientHeight);
  circle.style.width = circle.style.height = d + 'px';
  circle.style.left = (e.clientX - btn.getBoundingClientRect().left - d/2) + 'px';
  circle.style.top = (e.clientY - btn.getBoundingClientRect().top - d/2) + 'px';
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 500);
  fn();
}

function submitAnswer() {
  if (transitioning) return;
  const radios = document.getElementsByName('option');
  let selected = -1;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) selected = parseInt(radios[i].value);
  }
  if (selected === -1) {
    alert("Veuillez choisir une réponse ou cliquez sur Passer.");
    return;
  }
  if (selected === questions[current].answer) score++;
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function skipQuestion() {
  if (transitioning) return;
  passed++;
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById('progress').style.width = "100%";
  document.getElementById('progress-text').textContent = "100%";
  let note = Math.round((score / questions.length) * 20);
  let commentaire = "";
  if (note >= 18) commentaire = "Excellent ! Tu es un as de l’histoire !";
  else if (note >= 14) commentaire = "Bravo, très bon niveau !";
  else if (note >= 10) commentaire = "Pas mal, tu as des bases solides !";
  else if (note >= 6) commentaire = "Peut mieux faire, révise encore un peu.";
  else commentaire = "Il reste du travail, l’histoire n’a pas de secret pour toi… mais il faut réviser !";
  let html = `
    <div class="score">Ta note : ${note}/20</div>
    <div class="comment">${commentaire}</div>
    <div class="result-details">
      <span>Réponses justes : <b>${score}</b></span> &mdash;
      <span>Questions passées : <b>${passed}</b></span> <br>
      <span>Questions totales : ${questions.length}</span>
    </div>
    <button onclick="btnClick(event,restart)">Recommencer</button>
  `;
  animateTransition(() => {
    document.getElementById('qcm').innerHTML = html;
  }, () => {});
}

function restart() {
  if (transitioning) return;
  current = 0;
  score = 0;
  passed = 0;
  showQuestion();
}

// Démarrage QCM avec fade-in initial
document.getElementById('qcm').classList.add('fade-in');
showQuestion();