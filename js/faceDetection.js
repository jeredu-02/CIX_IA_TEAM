const URL = "https://teachablemachine.withgoogle.com/models/umuVqfis6/"; // Reemplaza esta URL con la tuya

let model, webcam, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargar el modelo y los metadatos
    model = await tmImage.load(modelURL, metadataURL);  // Carga el modelo desde Teachable Machine
    maxPredictions = model.getTotalClasses();

    console.log("Modelo cargado correctamente"); // Verificar si el modelo se ha cargado

    // Configurar la cámara
    const flip = true; // Flip para que el video se vea como un espejo
    webcam = new tmImage.Webcam(320, 320, flip); 
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Agregar el video al contenedor
    document.getElementById("video-container").appendChild(webcam.canvas);
    console.log("Cámara configurada correctamente"); // Verificar si la cámara está funcionando
}

async function loop() {
    webcam.update(); // Actualiza la cámara
    await predict(); // Realiza una predicción
    window.requestAnimationFrame(loop); // Llama la función en un bucle
}

async function predict() {
    const prediction = await model.predict(webcam.canvas); // Predice el contenido de la cámara
    console.log("Predicciones: ", prediction); // Ver las predicciones en la consola

    let plasticoDetectado = false;
    let vidrioDetectado = false;

    prediction.forEach((pred) => {
        console.log(`${pred.className}: ${pred.probability}`); // Loguear cada predicción y probabilidad

        if (pred.className === "Botella Plástico" && pred.probability > 0.95) {
            plasticoDetectado = true;
        } else if (pred.className === "Botella Vidrio" && pred.probability > 0.90) {
            vidrioDetectado = true;
        }
    });

    // Cambiar el color de los botones
    if (plasticoDetectado) {
        document.getElementById("btnVerde").classList.add("btn-active");
    } else {
        document.getElementById("btnVerde").classList.remove("btn-active");
    }

    if (vidrioDetectado) {
        document.getElementById("btnVerde").classList.add("btn-active");
    } else {
        document.getElementById("btnVerde").classList.remove("btn-active");
    }
}

// Inicializa la detección después de activar la cámara
document.getElementById('activarCamara').addEventListener('click', function() {
    console.log("Cámara activada");
    init(); // Inicia la detección del modelo
});
