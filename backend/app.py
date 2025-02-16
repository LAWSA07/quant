import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
MAX_FILE_SIZE_MB = 5
MODEL_PATH = 'model/ocr_model_50_epoch.h5'  # Update with your model path

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE_MB * 1024 * 1024

# Load your Keras model (do this once at startup)
try:
    model = load_model(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    try:
        # Update this preprocessing to match your model's requirements
        img = Image.open(image_path).convert('RGB')
        img = img.resize((224, 224))  # Example size
        img_array = np.array(img) / 255.0
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        print(f"Preprocessing error: {e}")
        return None

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Preprocess and predict
        processed_image = preprocess_image(file_path)
        if processed_image is None:
            return jsonify({'error': 'Error processing image'}), 500

        if model:
            prediction = model.predict(processed_image)
            # Process prediction array to your final result
            result = float(prediction[0][0])  # Example for binary classification
            return jsonify({
                'result': result,
                'message': 'Prediction successful'
            })
        else:
            return jsonify({'error': 'Model not loaded'}), 500

    except Exception as e:
        print(f"Error during processing: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=8080)