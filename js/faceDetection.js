let model, video, canvas, ctx;

document.getElementById('activarCamara').addEventListener('click', async function() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Acceder a la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();

            // Ajusta el tamaño del canvas para que coincida con el tamaño del video
            video.addEventListener('loadeddata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });
        });
    }

    // Cargar el modelo de detección de rostros de BlazeFace
    model = await blazeface.load();

    // Empezar a detectar rostros
    detectFaces();
});

async function detectFaces() {
    const predictions = await model.estimateFaces(video, false);

    // Limpiar el canvas antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar los rostros detectados en el canvas
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            // Obtener las coordenadas y tamaños escalados para el canvas
            const start = prediction.topLeft;
            const end = prediction.bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];

            // Dibuja el rectángulo alrededor del rostro en el canvas
            ctx.beginPath();
            ctx.lineWidth = "4";
            ctx.strokeStyle = "blue";
            ctx.rect(start[0], start[1], size[0], size[1]);
            ctx.stroke();
        });
    }

    // Continuar con la detección
    requestAnimationFrame(detectFaces);
}
