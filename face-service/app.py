from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os

app = Flask(__name__)
CORS(app)

# Load Haar cascade once at startup
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def decode_image(b64_string):
    """Decode base64 image to numpy array."""
    if ',' in b64_string:
        b64_string = b64_string.split(',')[1]
    img_bytes = base64.b64decode(b64_string)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def extract_descriptor(image, face):
    """Extract a 128-value descriptor from face region."""
    x, y, w, h = face
    pad = int(w * 0.1)
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(image.shape[1], x + w + pad)
    y2 = min(image.shape[0], y + h + pad)

    face_roi = image[y1:y2, x1:x2]
    face_resized = cv2.resize(face_roi, (64, 64))
    gray = cv2.cvtColor(face_resized, cv2.COLOR_BGR2GRAY)

    # Normalize and sample 128 values
    flat = gray.flatten().astype(np.float32) / 255.0
    indices = np.linspace(0, len(flat) - 1, 128, dtype=int)
    return flat[indices].tolist()

def detect_face(image):
    """Detect face and return descriptor."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50)
    )
    if len(faces) == 0:
        return None, "No face detected. Look straight at the camera."
    return faces[0], None

def euclidean_distance(a, b):
    return float(np.sqrt(np.sum((np.array(a) - np.array(b)) ** 2)))

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        image_b64 = data.get('image')
        if not image_b64:
            return jsonify({'error': 'No image provided'}), 400

        image = decode_image(image_b64)
        face, err = detect_face(image)
        if err:
            return jsonify({'error': err}), 400

        descriptor = extract_descriptor(image, face)
        return jsonify({'descriptor': descriptor})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/verify', methods=['POST'])
def verify():
    try:
        data = request.get_json()
        image_b64 = data.get('image')
        stored = data.get('descriptor')

        if not image_b64 or not stored:
            return jsonify({'error': 'Missing image or descriptor'}), 400

        image = decode_image(image_b64)
        face, err = detect_face(image)
        if err:
            return jsonify({'error': err}), 400

        live_descriptor = extract_descriptor(image, face)
        distance = euclidean_distance(live_descriptor, stored)

        # Threshold tuned for 128-point pixel descriptor
        threshold = 0.35
        if distance > threshold:
            return jsonify({'verified': False, 'distance': distance,
                            'error': 'Face does not match. Please try again.'}), 401

        return jsonify({'verified': True, 'distance': distance})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
