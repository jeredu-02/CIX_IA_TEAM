import os
import torch
from torchvision import transforms
from PIL import Image
from flask import Flask, request, jsonify

# Cargar el modelo y sus configuraciones
class MultiLabelClassifier:
    def __init__(self, model_path, labels):
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),  # Tamaño esperado por el modelo
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Cargar modelo preentrenado
        self.model = torch.load(model_path, map_location=self.device)
        self.model.eval()

        self.labels = labels
        self.idx_to_label = {idx: label for idx, label in enumerate(labels)}

    def predict(self, image):
        # Transformar imagen
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)

        # Predecir
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            top_prob, top_class = probabilities.topk(1, dim=1)

            predicted_idx = top_class.item()
            predicted_label = self.idx_to_label[predicted_idx]
            confidence = top_prob.item()

        return predicted_label, confidence


# Configuración de Flask
app = Flask(__name__)

# Inicializar el modelo
MODEL_PATH = "CIX_IA_TEAM/multi_label_classifier.pkl"
LABELS = ["paper", "cardboard", "plastic", "glass", "metal", "trash"]
classifier = MultiLabelClassifier(MODEL_PATH, LABELS)


@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No se proporcionó una imagen"}), 400

    file = request.files['image']
    try:
        # Abrir imagen y realizar predicción
        image = Image.open(file).convert('RGB')
        predicted_label, confidence = classifier.predict(image)

        return jsonify({
            "predicted_label": predicted_label,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
