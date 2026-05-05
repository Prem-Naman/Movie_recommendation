# Emocine (Emotion-Driven Cinema) 
** Live Deployment:** [https://emocine-frontend-370437339760.us-central1.run.app](https://emocine-frontend-370437339760.us-central1.run.app)

Emocine is a cutting-edge, full-stack web application that uses computer vision and deep learning to analyze your facial expressions in real-time and recommend movies that match your current mood. 

It is built with a **Next.js** frontend for a sleek, cinematic user interface and a high-performance **FastAPI (Python)** backend that handles PyTorch machine learning models and Natural Language Processing (NLP).

---

##  Key Features
* **Real-time Facial Emotion Detection:** Utilizes OpenCV and a PyTorch Vision Transformer (`dima806/facial_emotions_image_detection`) to accurately classify your mood.
* **TF-IDF NLP Recommendation Engine:** Analyzes the plot summaries of over 40,000 movies using Scikit-Learn to find the perfect thematic match for your detected emotion.
* **Cinematic UI:** A Netflix-style, fully responsive interface built with Tailwind CSS v4 and React.
* **Decoupled Architecture:** Frontend and Backend are entirely separated, communicating via a REST API.
* **Serverless Deployment:** Fully containerized with Docker and deployed on Google Cloud Run for automatic, infinite scaling.

---

##  Tech Stack
### **Frontend**
* **Framework:** Next.js 15 (React 19)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **APIs:** HTML5 `<canvas>` and `<video>` for webcam manipulation.

### **Backend**
* **Framework:** FastAPI (Python 3.11)
* **Computer Vision:** OpenCV (`cv2`)
* **Machine Learning:** PyTorch, Hugging Face Transformers
* **Recommendation Algorithm:** Scikit-Learn (TF-IDF & Cosine Similarity)

### **Infrastructure & DevOps**
* **Containerization:** Docker
* **Deployment:** Google Cloud Run

---

##  Architecture Overview
1. **User Interaction:** The Next.js frontend captures a snapshot from the user's webcam and encodes it as a Base64 string.
2. **API Request:** The frontend sends an asynchronous `POST` request to the backend's `/detect-emotion` endpoint.
3. **Face Extraction:** The FastAPI server uses OpenCV Haar Cascades to isolate and crop the user's face from the background.
4. **Emotion Prediction:** The cropped face is passed through a PyTorch Neural Network which calculates confidence scores for 7 standard emotions (Happy, Sad, Angry, Fear, Surprise, Disgust, Neutral).
5. **Recommendation Generation:** The detected emotion is mapped to a "seed movie." A pre-computed TF-IDF matrix calculates the Cosine Similarity between this seed movie and our local dataset to find 20 visually and thematically similar films.
6. **Data Enrichment:** The backend pings the TMDB API to fetch high-resolution posters and real-time metadata.
7. **Rendering:** The JSON response is sent back to the Next.js frontend, which dynamically renders the movie grid.

---

##  Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Prem-Naman/Movie_recommendation.git
cd Movie_recommendation
```

### 2. Setup the Backend
You will need a TMDB API Key. Create a `.env` file inside the `/backend` directory:
```bash
TMDB_API_KEY=your_tmdb_api_key_here
ALLOWED_ORIGINS=http://localhost:3000
```
Then, install the dependencies and run the server:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000` in your browser!

---

##  License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
