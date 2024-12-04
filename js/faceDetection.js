const SERVER_URL = "http://127.0.0.1:5000/predict"; // Cambia esto según la dirección de tu servidor

let webcam;

// Mapeo de etiquetas hacia grupos específicos
const labelGroups = {
    "papelycarton": ["paper", "cardboard"], // Azul
    "plastico": ["plastic"], // Blanco
    "residuosnoaprovechables": ["glass", "metal", "trash"] // Negro
};

const buttons = [
    { id: "papelycarton", color: "blue", label: "Papel y Cartón" },
    { id: "plastico", color: "white", label: "Plástico" },
    { id: "residuosnoaprovechables", color: "black", label: "Residuos No Aprovechables" }
];

async function init() {
    // Configurar la cámara
    const flip = true; // Voltear el video como un espejo
    webcam = new tmImage.Webcam(320, 320, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Agregar el video al contenedor
    document.getElementById("video-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update(); // Actualiza la cámara
    await predict(); // Enviar la imagen al servidor para predecir
    await new Promise((resolve) => setTimeout(resolve, 500)); // Agrega un retraso de 500 ms
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Toma una instantánea del video como imagen
    const canvas = webcam.canvas;
    canvas.toBlob(async function (blob) {
        const formData = new FormData();
        formData.append("image", blob, "image.jpg");

        try {
            const response = await fetch(SERVER_URL, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            console.log(data);

            // Actualizar botones según la predicción
            updateButtons(data.predicted_label);
        } catch (error) {
            console.error("Error al predecir:", error);
        }
    }, "image/jpeg");
}

function generateButtons(buttons) {
    const container = document.getElementById("material-buttons");

    buttons.forEach((button) => {
        // Crear un botón para cada grupo
        const div = document.createElement("div");
        div.id = `btn-${button.id}`; // Aquí corregimos el uso de template literals
        div.className = "btn-inactive"; // Clase inicial para los botones
        div.style.backgroundColor = "lightgray"; // Fondo inicial gris
        div.textContent = button.label; // Texto del botón
        container.appendChild(div);
    });
}

function updateButtons(predictedLabel) {
    // Determinar a qué grupo pertenece la etiqueta detectada
    let activatedGroup = null;

    for (const [group, labels] of Object.entries(labelGroups)) {
        if (labels.includes(predictedLabel)) {
            activatedGroup = group;
            break;
        }
    }

    // Reiniciar el estado de los botones
    const buttons = document.querySelectorAll("#material-buttons div");
    buttons.forEach((button) => button.style.backgroundColor = "lightgray");

    // Activar el botón correspondiente
    if (activatedGroup) {
        const button = document.getElementById(`btn-${activatedGroup}`); // También corregimos aquí
        if (button) {
            button.style.backgroundColor = getButtonColor(activatedGroup);
        }
    }
}

function getButtonColor(group) {
    const button = buttons.find((btn) => btn.id === group);
    return button ? button.color : "lightgray";
}

// Generar los botones al cargar la página
generateButtons(buttons);

// Inicializa la detección después de activar la cámara
document.getElementById("activarCamara").addEventListener("click", function () {
    init();
});
