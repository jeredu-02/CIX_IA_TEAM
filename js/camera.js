document.getElementById('activarCamara').addEventListener('click', function() {
    // Intenta acceder a la cámara del dispositivo
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.getElementById('video');
            video.srcObject = stream;

            // Mostrar el contenedor del video
            document.getElementById('video-container').style.display = 'block';
            
            // Ocultar el ícono de la cámara
            document.getElementById('activarCamara').style.display = 'none';
        })
        .catch(function(error) {
            console.error("Error al activar la cámara: ", error);
        });
});
