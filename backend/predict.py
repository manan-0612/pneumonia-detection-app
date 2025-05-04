import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

# Load the saved model
model = load_model('pneumonia_model.h5')

# Function to load and preprocess an image for prediction
def preprocess_image(img_path, target_size=(224, 224)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Rescale to [0, 1]
    return img_array

# Function to predict the class of an image
def predict_image(img_path):
    img_array = preprocess_image(img_path)
    prediction = model.predict(img_array)[0][0]  # Get the prediction probability

    if prediction < 0.7:
        prediction_text = "NORMAL"
    else:
        prediction_text = "PNEUMONIA"

    # Display the image with prediction result
    img = image.load_img(img_path, target_size=(224, 224))
    plt.imshow(img)
    plt.title(f"Prediction: {prediction_text}")
    plt.xlabel(f"Probability: {prediction:.2f}")
    plt.show()
    return prediction_text


# Get the path to the single image
image_path = 'IM-0001-0001.jpeg'  # Replace with the actual path to your image

# Make the prediction
prediction_result = predict_image(image_path)

# Print the prediction result
print(f"Prediction for {image_path}: {prediction_result}")