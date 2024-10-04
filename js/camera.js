document.getElementById('activarCamara').addEventListener('click', function() {
    const video = document.getElementById('video');

    // Accede a la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Asigna el stream de la cámara al elemento de video
                video.srcObject = stream;
            })
            .catch(function(error) {
                console.log("Ocurrió un error al intentar acceder a la cámara: " + error);
            });
    } else {
        alert("Lo siento, tu navegador no soporta acceso a la cámara.");
    }
});
