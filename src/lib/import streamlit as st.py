import streamlit as st
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

# Title
st.title("OCR Model Checker")
st.write("Upload an image to see the OCR model's prediction.")

# Load the model (update the filename/path as needed)
@st.cache(allow_output_mutation=True)
def load_ocr_model():
    model = load_model("ocr_model.h5")  # Replace with your model file
    return model

model = load_ocr_model()

# File uploader
uploaded_file = st.file_uploader("Choose an image...", type=["png", "jpg", "jpeg"])
if uploaded_file is not None:
    # Open and display the image
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)
    
    # Preprocess the image for the model
    # (Customize these steps based on your model's requirements)
    # For example, let's assume your model expects 224x224 RGB images:
    image_resized = image.resize((224, 224))
    img_array = np.array(image_resized).astype("float32") / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Make prediction
    prediction = model.predict(img_array)
    
    # Display prediction (customize the output formatting as needed)
    st.write("Model Prediction:")
    st.write(prediction)
