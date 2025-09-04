import winnerConditional from "../helpers/ganador.js";
import { GAME_MODE } from "../helpers/gamemode.js";
import { hasTwoSimilarElements } from "../helpers/eventossimilares.js";
import { CENTER_SQUARE } from "../helpers/centtablero.js";

export class Bot {
  constructor(dificultad) {
    this.difficulty = dificultad;
  };

  jugar(casillaAJugar) {
    setTimeout(() => {
      casillaAJugar.click();
    }, 300);
  }  

  obtenerElemento(id) {
    return document.getElementById(id);
  };

  primerMovimiento(movimientosArray) {
    if (this.difficulty === GAME_MODE.impossible) {
      if (!movimientosArray.includes(CENTER_SQUARE)) {
        return CENTER_SQUARE;
      }
      return this.calcularEsquinaAleatoria(movimientosArray);
    } else {
      return this.calcularEsquinaAleatoria(movimientosArray);
    }
  }

  calcularMovimiento(movsJugador, movsOponente) {
  return winnerConditional.filter(comb =>
    !comb.some(pos => movsOponente.includes(pos))
  );
}

  intentarGanar(posiblesGanadas, movimientos) {
    for (let i = 0; i < posiblesGanadas.length; i++) {
        const subarreglo = posiblesGanadas[i];
        let coincidencias = 0;
        for (let j = 0; j < subarreglo.length; j++) {
            if (movimientos.includes(subarreglo[j])) {
                coincidencias++;
            }
        }
        if (coincidencias === 2) {
            return subarreglo;
        }
    }
    return [];
}

  calcularCasillaVacia(masCercanos, ambasPosiciones) {
    return masCercanos.filter(mov => !ambasPosiciones.includes(mov));
  };

  seleccionarEsquina(arreglo) {
    const esquinasYCentro = [1, 3, 7, 9, 5];
    const esquinaFiltrada = esquinasYCentro.filter(el => arreglo.includes(el))[0];
    return esquinaFiltrada ? esquinaFiltrada : arreglo[0];
  };

  calcularEsquinaAleatoria(movsNoDisponibles = []) {
  const esquinas = [1, 3, 7, 9];
  const esquinasDisponibles = esquinas.filter(esquina => !movsNoDisponibles.includes(esquina));
  if (esquinasDisponibles.length === 0) return null;
  const indiceAleatorio = Math.floor(Math.random() * esquinasDisponibles.length);
  return esquinasDisponibles[indiceAleatorio];
}

  calcularLateralAleatorio(movsNoDisponibles = []) {
    const laterales = [2, 4, 6, 8];
    const disponibles = laterales.filter(l => !movsNoDisponibles.includes(l));
    if (disponibles.length === 0) return null;
    const indiceAleatorio = Math.floor(Math.random() * disponibles.length);
    return disponibles[indiceAleatorio];
  };

decidirMovimiento(movsHumano, movsBot) {
    const todosMovs = movsHumano.concat(movsBot);

    // 1. Intentar ganar (Prioridad máxima)
    const posiblesGanadas = this.calcularMovimiento(movsBot, movsHumano);
    const intentoGanar = this.intentarGanar(posiblesGanadas, movsBot);
    const movGanar = this.calcularCasillaVacia(intentoGanar, todosMovs);
    if (movGanar.length > 0) {
        console.log("Bot intenta ganar en:", movGanar[0]);
        return movGanar[0];
    }

    // 2. Bloquear al humano si va a ganar (Segunda prioridad)
    const posiblesBloqueos = this.calcularMovimiento(movsHumano, movsBot);
    const intentoBloqueo = this.intentarGanar(posiblesBloqueos, movsHumano);
    const movBloqueo = this.calcularCasillaVacia(intentoBloqueo, todosMovs);
    if (movBloqueo.length > 0) {
        console.log("Bot intenta bloquear en:", movBloqueo[0]);
        return movBloqueo[0];
    }

    // 3. NUEVO: Crear un fork (Ataque en L) si es posible
    if (this.difficulty === GAME_MODE.impossible) { // Solo para la dificultad más alta
        const forkMove = this.encontrarFork(movsBot, movsHumano, todosMovs);
        if (forkMove !== null && forkMove !== undefined) {
            console.log("Bot crea un fork (ataque L) en:", forkMove);
            return forkMove;
        }
    }
    
    // 4. Tomar el centro si está libre
    if (!todosMovs.includes(CENTER_SQUARE)) {
        console.log("Bot toma el centro:", CENTER_SQUARE);
        return CENTER_SQUARE;
    }

    // 5. Bloquear L clásica (esquinas opuestas)
    const esquinasOpuestas = [
        [1, 9], 
        [3, 7]
    ];
    const humanoTieneL = esquinasOpuestas.some(pair => 
        movsHumano.includes(pair[0]) && movsHumano.includes(pair[1]));
    if (humanoTieneL) {
        const lateral = this.calcularLateralAleatorio(todosMovs);
        if (lateral !== null && lateral !== undefined) {
            console.log("Bot bloquea L clásica en lateral:", lateral);
            return lateral;
        }
    }

    // 6. Bloquear L corta (esquina y lateral)
    // (Esta lógica se mantiene igual)
    const lateralesAdyacentes = [
        [2, 4, 1], [2, 6, 3], [4, 8, 7], [6, 8, 9], [2, 3, 1],
        [4, 1, 7], [6, 3, 9], [8, 9, 7], [2, 9, 3], [4, 9, 7],
        [6, 1, 3], [8, 1, 7], [4, 3, 1], [8, 3, 9], [6, 7, 9],
        [2, 7, 1]
    ];
    const humanoTieneLCorta = lateralesAdyacentes.find(
        pair => movsHumano.includes(pair[0]) && movsHumano.includes(pair[1])
    );
    if (humanoTieneLCorta) {
        const esquinaClave = humanoTieneLCorta[2];
        if (!todosMovs.includes(esquinaClave)) {
            console.log("Bot bloquea L corta en esquina:", esquinaClave);
            return esquinaClave;
        }
    }

    // 7. Tomar una esquina disponible
    const esquina = this.calcularEsquinaAleatoria(todosMovs);
    if (esquina !== null && esquina !== undefined) {
        console.log("Bot toma esquina:", esquina);
        return esquina;
    }

    // 8. Tomar un lateral disponible
    const lateral = this.calcularLateralAleatorio(todosMovs);
    if (lateral !== null && lateral !== undefined) {
        console.log("Bot toma lateral:", lateral);
        return lateral;
    }

    console.log("Bot no encuentra movimiento");
    return null;
}

// Nueva función para encontrar fork (doble amenaza)
encontrarFork(movsBot, movsHumano, todosMovs) {
    // Busca casillas vacías que permitan al bot tener dos formas de ganar
    const vacias = Array.from({length: 9}, (_, i) => i + 1).filter(pos => !todosMovs.includes(pos));
    for (let pos of vacias) {
        const posibles = this.calcularMovimiento([...movsBot, pos], movsHumano);
        let count = 0;
        for (let comb of posibles) {
            if (comb.filter(p => [...movsBot, pos].includes(p)).length === 2 &&
                comb.some(p => p === pos)) {
                count++;
            }
        }
        if (count >= 2) {
            return pos;
        }
    }
    return null;
}

}
