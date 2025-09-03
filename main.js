import { Bot } from './bot/bot.js';
import { GAME_MODE } from './helpers/gamemode.js';

const tablero = document.getElementById('board');
const casillas = [];
let movimientosHumano = [];
let movimientosBot = [];
let bot;
let turno;
const preguntas = [
  {
    pregunta: "¿Qué es la transparencia gubernamental?",
    opciones: [
      "La obligación de los gobiernos de ocultar información",
      "La obligación de los gobiernos de hacer pública su información",
      "La obligación de los ciudadanos de informar al gobierno"
    ],
    correcta: 1
  },
  {
    pregunta: "¿Qué ley garantiza el acceso a la información pública en México?",
    opciones: [
      "Ley Federal del Trabajo",
      "Ley General de Transparencia y Acceso a la Información Pública",
      "Ley de Ingresos"
    ],
    correcta: 1
  },
  {
    pregunta: "¿Quién puede solicitar información pública a una dependencia de gobierno?",
    opciones: [
      "Solo periodistas",
      "Cualquier persona",
      "Solo funcionarios públicos"
    ],
    correcta: 1
  },
  {
    pregunta: "¿Qué institución federal protege el derecho de acceso a la información en México?",
    opciones: [
      "INAI",
      "INE",
      "IMSS"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué información NO puede ser solicitada por transparencia?",
    opciones: [
      "Presupuesto ejercido",
      "Datos personales de terceros",
      "Contratos públicos"
    ],
    correcta: 1
  },
  {
    pregunta: "¿Qué plazo tiene la autoridad para responder una solicitud de información pública en México?",
    opciones: [
      "20 días hábiles",
      "60 días naturales",
      "5 días hábiles"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué es una obligación de transparencia?",
    opciones: [
      "Información que las autoridades deben publicar sin que se la pidan",
      "Información reservada por el gobierno",
      "Información solo para funcionarios"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué puede hacer un ciudadano si no recibe respuesta a su solicitud de información?",
    opciones: [
      "Nada, debe esperar indefinidamente",
      "Presentar un recurso de revisión ante el INAI",
      "Solicitar la información a la policía"
    ],
    correcta: 1
  },
  {
    pregunta: "¿Cuál de los siguientes es un ejemplo de información pública?",
    opciones: [
      "El presupuesto anual de una dependencia",
      "La contraseña del correo institucional de un funcionario",
      "El número de seguro social de un ciudadano"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué significa el principio de máxima publicidad?",
    opciones: [
      "Toda la información en poder del gobierno es pública salvo excepciones",
      "Solo la información publicada en internet es pública",
      "Solo los funcionarios pueden ver la información"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué tipo de información puede ser clasificada como reservada?",
    opciones: [
      "Información sobre seguridad nacional",
      "El nombre del presidente",
      "El domicilio de una oficina pública"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué es el Portal Nacional de Transparencia?",
    opciones: [
      "Un sitio web para consultar información pública de todo el país",
      "Una red social del gobierno",
      "Un sistema de pagos en línea"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué debe contener una solicitud de acceso a la información?",
    opciones: [
      "Nombre, domicilio y motivo de la solicitud",
      "Solo la descripción clara de la información solicitada",
      "Firma de un notario"
    ],
    correcta: 1
  },
  {
    pregunta: "¿Qué sucede si la información solicitada contiene datos personales de terceros?",
    opciones: [
      "Se entrega toda la información sin restricción",
      "Se protege la identidad y datos personales antes de entregar la información",
      "Se destruye la información"
    ],
    correcta: 1
  },
  {
    pregunta: "¿Qué es el INAI?",
    opciones: [
      "Instituto Nacional de Acceso a la Información",
      "Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales",
      "Instituto Nacional de Administración e Información"
    ],
    correcta: 1
  }
];

function obtenerPreguntaAleatoria() {
  return preguntas[Math.floor(Math.random() * preguntas.length)];
}
let casillaPendiente = null;

function iniciarJuego() {
  tablero.innerHTML = '';
  casillas.length = 0;
  movimientosHumano = [];
  movimientosBot = [];
  bot = new Bot(GAME_MODE.impossible);
  turno = 'humano';

  for (let i = 1; i <= 9; i++) {
    const casilla = document.createElement('div');
    casilla.classList.add('square');
    casilla.setAttribute('id', i);
    casilla.addEventListener('click', () => manejarClick(casilla));
    casillas.push(casilla);
    tablero.appendChild(casilla);
    // Estado inicial para animación (se sobreescribe abajo)
  }

  // Configuración de entradas y colores para cada casilla
  const entradas = [
    { x: -150, y: 0, color: "#2196f3" }, // 1: izquierda, azul
    { x: 0, y: -150, color: "#4caf50" }, // 2: arriba, verde
    { x: 150, y: 0, color: "#ff9800" },  // 3: derecha, naranja
    { x: -150, y: 0, color: "#e91e63" }, // 4: izquierda, rosa
    { x: 0, y: 150, color: "#9c27b0" },  // 5: abajo, morado
    { x: 150, y: 0, color: "#00bcd4" },  // 6: derecha, celeste
    { x: -150, y: 0, color: "#ffc107" }, // 7: izquierda, amarillo
    { x: 0, y: -150, color: "#8bc34a" }, // 8: arriba, verde claro
    { x: 150, y: 0, color: "#f44336" }   // 9: derecha, rojo
  ];

  casillas.forEach((casilla, idx) => {
    const entrada = entradas[idx];
    gsap.fromTo(
      casilla,
      { x: entrada.x, y: entrada.y, scale: 0.7, opacity: 0, backgroundColor: entrada.color },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        backgroundColor: "#f2f2f2",
        duration: 1.5,
        ease: "bounce.out",
        delay: 0.08 * idx
      }
    );
  });
}

function esEmpate() {
  return (movimientosHumano.length + movimientosBot.length === 9) &&
  !verificarGanador(movimientosHumano) &&
  !verificarGanador(movimientosBot);
}

function colorPorIndice(idx) {
  const colores = [
    "#2196f3", // 1: azul
    "#4caf50", // 2: verde
    "#ff9800", // 3: naranja
    "#e91e63", // 4: rosa
    "#9c27b0", // 5: morado
    "#00bcd4", // 6: celeste
    "#ffc107", // 7: amarillo
    "#8bc34a", // 8: verde claro
    "#f44336"  // 9: rojo
  ];
  return colores[idx];
}

function manejarClick(casilla) {
  const id = parseInt(casilla.id);
  if (casilla.textContent || turno !== 'humano') return;

  casillaPendiente = casilla;
  mostrarPreguntaQuiz();
}

function mostrarPreguntaQuiz() {
  const quizDiv = document.getElementById('quiz');
  quizDiv.style.display = 'block';
  const preguntaObj = obtenerPreguntaAleatoria();
  quizDiv.dataset.correcta = preguntaObj.correcta;
  quizDiv.dataset.pregunta = preguntaObj.pregunta;
  document.getElementById('question').textContent = preguntaObj.pregunta;
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  preguntaObj.opciones.forEach((op, idx) => {
    const btn = document.createElement('button');
    btn.textContent = op;
    btn.onclick = () => responderQuiz(idx, preguntaObj.correcta, btn, optionsDiv);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('quiz-result').textContent = '';
}

function responderQuiz(idx, correcta, btnClicked, optionsDiv) {
  const quizDiv = document.getElementById('quiz');
  const resultDiv = document.getElementById('quiz-result');
  const buttons = optionsDiv.querySelectorAll('button');
  buttons.forEach((btn, i) => {
    if (i === correcta) {
      btn.classList.add('correct');
    } else {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  if (idx === correcta) {
    resultDiv.textContent = "¡Correcto!";
    resultDiv.style.color = "#11ff9e";
    setTimeout(() => {
      quizDiv.style.display = 'none';
      buttons.forEach(btn => btn.classList.remove('correct', 'incorrect'));
      colocarFichaHumano();
    }, 900);
  } else {
    resultDiv.textContent = "Incorrecto. El bot jugará en el opuesto.";
    resultDiv.style.color = "red";
    setTimeout(() => {
      quizDiv.style.display = 'none';
      buttons.forEach(btn => btn.classList.remove('correct', 'incorrect'));
      colocarFichaHumanoAleatoria();
    }, 1300);
  }
}

function colocarFichaHumano() {
  if (!casillaPendiente) return;
  const id = parseInt(casillaPendiente.id);
  casillaPendiente.textContent = 'X';
  movimientosHumano.push(id);

  casillaPendiente.style.backgroundColor = colorPorIndice(id - 1);

  lanzarParticulas(casillaPendiente, "#000"); // O el color que prefieras

  if (verificarGanador(movimientosHumano)) {
    setTimeout(() => alert("¡Ganaste! 🎉"), 100);
    return reiniciarTablero();
  }
  if (esEmpate()) {
    setTimeout(() => alert("¡Empate! 🤝"), 100);
    return reiniciarTablero();
  }

  turno = 'bot';
  setTimeout(turnoBot, 300);
}

function colocarFichaHumanoAleatoria() {
  const disponibles = casillas.filter(c => !c.textContent);
  if (disponibles.length > 0) {
    const random = disponibles[Math.floor(Math.random() * disponibles.length)];
    random.textContent = 'X';
    movimientosHumano.push(parseInt(random.id));
    random.style.backgroundColor = colorPorIndice(parseInt(random.id) - 1);
    lanzarParticulas(random, "#2196f3");
  }
  turno = 'bot';
  setTimeout(turnoBot, 300);
}

function turnoBot() {
  const casillaParaJugar = bot.decidirMovimiento(movimientosHumano, movimientosBot);
  if (!casillaParaJugar) {
    turno = 'humano';
    return;
  }
  const casillaDOM = document.getElementById(casillaParaJugar);
  if (casillaDOM && !casillaDOM.textContent) {
    casillaDOM.textContent = 'O';
    lanzarParticulas(casillaPendiente, "#000"); // O el color que prefieras
    movimientosBot.push(casillaParaJugar);
    casillaDOM.style.backgroundColor = colorPorIndice(casillaParaJugar - 1);

    lanzarParticulas(casillaDOM, "#000");
  }
  
  if (verificarGanador(movimientosBot)) {
    setTimeout(() => alert("Perdiste 😢"), 100);
    return reiniciarTablero();
  }
  if (esEmpate()) {
    setTimeout(() => alert("¡Empate! 🤝"), 100);
    return reiniciarTablero();
  }
  turno = 'humano';
}

function verificarGanador(movimientos) {
  const combinacionesGanadoras = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]
  ];
  return combinacionesGanadoras.some(comb => comb.every(pos => movimientos.includes(pos)));
}

function reiniciarTablero() {
  if (casillas.length = 9) {
    setTimeout(() => iniciarJuego(), 500);
  }}

function lanzarParticulas(casilla, color = "#2196f3") {
  for (let i = 0; i < 12; i++) {
    const part = document.createElement("div");
    part.className = "particula";
    part.style.background = color;
    part.style.position = "absolute";
    part.style.left = "50%";
    part.style.top = "50%";
    part.style.width = "8px";
    part.style.height = "8px";
    part.style.borderRadius = "50%";
    part.style.pointerEvents = "none";
    part.style.zIndex = 20;
    casilla.appendChild(part);

    const angle = (Math.PI * 2 * i) / 12;
    const dist = 40 + Math.random() * 20;
    gsap.to(part, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      scale: 1 + Math.random() * 0.8,
      opacity: 0,
      duration: 1.2 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => part.remove()
    });
  }
}

iniciarJuego();
