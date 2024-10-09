const URL = "https://teachablemachine.withgoogle.com/models/umuVqfis6/"; // Reemplaza esta URL con la tuya

let model, webcam, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargar el modelo y los metadatos
    model = await tmImage.load(modelURL, metadataURL);  // Carga el modelo desde Teachable Machine
    maxPredictions = model.getTotalClasses();

    // Configurar la cámara
    const flip = true; // Flip para que el video se vea como un espejo
    webcam = new tmImage.Webcam(320, 320, flip); 
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Agregar el video al contenedor
    document.getElementById("video-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update(); // Actualiza la cámara
    await predict(); // Realiza una predicción
    window.requestAnimationFrame(loop); // Llama la función en un bucle
}

async function predict() {
    const prediction = await model.predict(webcam.canvas); // Predice el contenido de la cámara

    prediction.forEach((pred) => {
        if (pred.className === "Plástico" && pred.probability > 0.9) {
            document.getElementById("btnPlastico").classList.add("btn-active");
        } else if (pred.className === "Vidrio" && pred.probability > 0.9) {
            document.getElementById("btnVidrio").classList.add("btn-active");
        } else {
            document.getElementById("btnPlastico").classList.remove("btn-active");
            document.getElementById("btnVidrio").classList.remove("btn-active");
        }
    });
}

// Inicializa la detección después de activar la cámara
document.getElementById('activarCamara').addEventListener('click', function() {
    init(); // Inicia la detección del modelo
});
