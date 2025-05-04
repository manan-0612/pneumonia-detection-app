# Pneumonia Detection Web App

This project is a full-stack web application for detecting pneumonia from X-ray images using a deep learning model.

## 📁 Project Structure

PROJECT-2/
├── backend/
│ ├── app.py
│ ├── predict.py
│ ├── requirements.txt
│ └── pneumonia_model.h5 <-- Not included (see below)
├── frontend/
│ ├── public/
│ │ └── index.html
│ └── src/
│ ├── App.js
│ ├── index.js
│ └── index.css
├── package.json
├── package-lock.json
├── .gitignore
└── README.md


## ⚠️ Model File

The trained model file `pneumonia_model.h5` is not included in this repository due to GitHub's file size limits (100MB max).

### ➡️ Download Link:
👉 [Download the model from Google Drive](https://drive.google.com/uc?id=YOUR_FILE_ID)

**After downloading**, place it inside the `backend/` directory before running the backend server.

## 🚀 How to Run the Project

1. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start

🧪 Features

Upload X-ray images through a web interface
Backend processes the image using a deep learning model
Displays prediction result (Pneumonia / Normal)

📦 Technologies Used

Frontend: React.js, HTML, CSS
Backend: Python, Flask
ML: TensorFlow/Keras
Deployment: Localhost (Dev Mode)