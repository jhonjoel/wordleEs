const lista = ["ARBOL", "ANGEL", "MARCO", "COMAS", "ARCOS", "ALOHA"];
const API = "https://random-word-api.herokuapp.com/word?length=5&lang=es";

let palabra = lista[Math.floor(Math.random() * lista.length)];
let intentos = 6;

fetch(API)
    .then(r => r.json())
    .then(r => {
        if (r && r[0]) {
            palabra = r[0].toUpperCase();
        }
    })
    .catch(() => {
        palabra = lista[Math.floor(Math.random() * lista.length)];
    });

const input = document.getElementById("guess-input");
const boton = document.getElementById("guess-button");

input.addEventListener("keyup", e => {
    input.value = input.value.replace(/[^a-zA-ZñÑ]/g, "").toUpperCase();
    if (e.key === "Enter") {
        intentar();
        return;
    }
    boton.disabled = input.value.length !== 5;
});

boton.addEventListener("click", intentar);

function intentar() {
    const GRID = document.getElementById("grid");
    const ROW = document.createElement("div");
    ROW.className = "row";
    const INTENTO = leerIntento();

    if (INTENTO.length !== 5) {
        mostrarMensaje("La palabra debe tener 5 letras");
        return;
    }

    const resultado = evaluar(INTENTO);

    for (let i = 0; i < INTENTO.length; i++) {
        const SPAN = document.createElement("span");
        SPAN.className = "letter " + resultado[i];
        SPAN.textContent = INTENTO[i];
        ROW.appendChild(SPAN);
    }

    GRID.appendChild(ROW);
    intentos--;
    input.value = "";
    boton.disabled = true;

    if (INTENTO === palabra) {
        terminar("¡Ganaste!");
    } else if (intentos === 0) {
        terminar(`¡Perdiste! La palabra era ${palabra}`);
    }
}

function leerIntento() {
    return input.value.toUpperCase();
}

function mostrarMensaje(mensaje) {
    const elem = document.getElementById("message");
    elem.textContent = mensaje;
    setTimeout(() => (elem.textContent = ""), 2000);
}

function terminar(mensaje) {
    boton.disabled = true;
    input.disabled = true;
    document.getElementById("guesses").innerHTML = `<h2>${mensaje}</h2>`;
}

function evaluar(INTENTO) {
    const result = Array(5).fill("absent");
    const letras = {};
    for (const l of palabra) {
        letras[l] = (letras[l] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {
        if (INTENTO[i] === palabra[i]) {
            result[i] = "correct";
            letras[INTENTO[i]]--;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue;
        if (letras[INTENTO[i]] > 0) {
            result[i] = "present";
            letras[INTENTO[i]]--;
        }
    }
    return result;
}

