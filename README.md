# Quant OCR Project

This project is built with a modern web stack combining a **Next.js** frontend and a **Flask** backend. It leverages a trained OCR model (developed in a Jupyter Notebook) to convert images or handwritten documents into digital text. The application also includes an image preview section for a better user experience.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Applications](#running-the-applications)
- [Training Data & OCR Model](#training-data--ocr-model)
- [Usage](#usage)
- [Images & Screenshots](#images--screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Screenshot:
![Alt text](images/your-image.png)


---

## Features

- **Next.js Frontend:**  
  - A modern, responsive, and interactive web interface built using Next.js.
  - Dynamic routing, server-side rendering (SSR), and static site generation (SSG) are used to optimize the user experience.
  - Built-in components include file upload with drag-and-drop support and real-time image preview.

- **Flask Backend:**  
  - A lightweight RESTful API built with Flask.
  - Handles file uploads and processes OCR requests.
  - Designed to work seamlessly with the OCR model for text extraction.
  
- **OCR Model:**  
  - The model is trained using deep learning techniques in a Jupyter Notebook.
  - The training process involves data preprocessing, augmentation, and model optimization.
  - Final trained weights (and full model saved in `.h5` format) are used during inference.
  
- **Image Preview:**  
  - Users can preview the image they upload.
  - This ensures that the correct file is being processed before sending it to the backend.

---

## Project Structure

The project is organized as follows:

```plaintext
quant/
├── backend/               # Flask backend code and API endpoints
│   ├── app.py             # Main Flask application; sets up endpoints and OCR processing
│   ├── requirements.txt   # Python dependencies (Flask, flask-cors, tensorflow, pillow, etc.)
│   └── config.py          # (Optional) Configuration settings for the Flask app
│
├── frontend/              # Next.js frontend application
│   ├── pages/             # Next.js pages and components (e.g., home page, file upload components)
│   ├── public/            # Static assets (e.g., images, favicon)
│   ├── components/        # Reusable components (e.g., file upload, navigation, preview)
│   ├── styles/            # CSS/SCSS stylesheets or Tailwind CSS configuration
│   └── package.json       # Node.js dependencies and scripts
│
├── trained_model/         # Contains the trained OCR model and training notebook
│   ├── ocr_model_training.ipynb  # Jupyter Notebook with detailed training steps, experiments, and evaluation
│   ├── ocr_model_v8.h5     # Full saved model for inference
│   ├── ocr_model_v4.weights.h5    # Weights from an earlier version of training (if needed)
│   └── ocr_model_v5.weights.h5    # Weights from another training version for comparison
│
├── images/                # (Optional) Sample images or screenshots to showcase the project
│   └── screenshot.png     # Example screenshot of the app interface
│
└── README.md              # This file
