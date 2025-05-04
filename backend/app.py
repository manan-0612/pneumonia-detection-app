from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS
from io import BytesIO
from PIL import Image
# import cv2

app = Flask(__name__)
CORS(app)

# Load the model once at startup
model = load_model('pneumonia_model.h5')

def preprocess_image(img_data, target_size=(224, 224)):
    with open("temp.jpg", "wb") as f:
        f.write(img_data)

    img = image.load_img("temp.jpg", target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    img_data = file.read()

    processed_img = preprocess_image(img_data)
    prediction = model.predict(processed_img)[0][0]

    label = "PNEUMONIA" if prediction >= 0.7 else "NORMAL"
    return jsonify({
        'prediction': label,
        'probability': round(float(prediction), 2)
    })

if __name__ == '__main__':
    app.run(debug=True)


# Advanced preprocessing method
# def preprocess_image_1(img_data, target_size=(224, 224)):
#     with open("temp.jpg", "wb") as f:
#         f.write(img_data)

#     img = cv2.imread("temp.jpg")
#     img = cv2.resize(img, target_size)

#     # Gamma Correction
#     gamma = 0.7
#     img = np.power(img / 255.0, gamma) * 255.0

#     # Contrast Stretching
#     p2, p98 = np.percentile(img, (2, 98))
#     img = np.clip((img - p2) / (p98 - p2) * 255.0, 0, 255).astype(np.uint8)

#     # Adaptive Histogram Equalization (CLAHE)
#     clahe = cv2.createCLAHE(clipLimit=0.03, tileGridSize=(8, 8))
#     if len(img.shape) == 2:
#         img = clahe.apply(img)
#     else:
#         lab = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_BGR2LAB)
#         lab[..., 0] = clahe.apply(lab[..., 0])
#         img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

#     # Unsharp Masking
#     blurred = cv2.GaussianBlur(img, (0, 0), 5)
#     img = cv2.addWeighted(img, 2, blurred, -1, 0)

#     # Optional Techniques
#     # --- White Top Hat Transform ---
#     # kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (10, 10))
#     # img = cv2.morphologyEx(img, cv2.MORPH_TOPHAT, kernel)

#     # --- Local Histogram Equalization ---
#     # img = cv2.createCLAHE(tileGridSize=(30, 30)).apply(img)

#     # --- Contrast Enhancement (Sigmoid) ---
#     # cutoff = 0.5
#     # gain = 10
#     # img = 255 / (1 + np.exp(-gain * (img / 255.0 - cutoff)))

#     img = img.astype(np.float32) / 255.0
#     img = np.expand_dims(img, axis=0)
#     return img