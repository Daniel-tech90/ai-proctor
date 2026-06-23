import React, { useEffect, useRef, useState, useCallback } from "react";

const MODELS_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
const API = "https://ai-proctor-23da.onrender.com";

// Load state — shared across all instances so models load only once ever
const loadState = { detection: false, full: false };

async function loadDetectionModel() {
  if (loadState.detection) return;
  await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL);
  loadState.detection = true;
}

async function loadFullModels() {
  if (loadState.full) return;
  await Promise.all([
    window.faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL),
    window.faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
  ]);
  loadState.full = true;
}

// ── Shared hook — only detects face presence (lightweight), stops when found ──
function useFacePresence(videoRef) {
  const [status, setStatus] = useState("Starting camera...");
  const [faceFound, setFaceFound] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(async () => {
    try {
      setStatus("Loading face detector...");
      await loadDetectionModel();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("👤 Look at the camera...");

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || faceFound) return;
        try {
          const result = await window.faceapi.detectSingleFace(
            videoRef.current,
            new window.faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
          );
          if (result) {
            clearInterval(intervalRef.current);
            setFaceFound(true);
            setStatus("✅ Face detected — ready!");
          } else {
            setStatus("👤 No face detected — look straight at camera");
          }
        } catch {}
      }, 1200);
    } catch {
      setStatus("❌ Camera access denied. Please allow camera.");
    }
  }, []);

  useEffect(() => {
    start();
    return () => {
      clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { status, faceFound };
}

// ── Capture descriptor once on button click (heavy models load only then) ─────
async function captureDescriptor(videoRef) {
  await loadFullModels();
  const result = await window.faceapi
    .detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions({ inputSize: 160 }))
    .withFaceLandmarks(true)
    .withFaceDescriptor();
  if (!result) throw new Error("Could not capture face. Please try again.");
  return Array.from(result.descriptor);
}

// ── Face Registration ─────────────────────────────────────────────────────────
export function FaceRegister({ token, onDone }) {
  const videoRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const { status, faceFound } = useFacePresence(videoRef);

  const handleSave = async () => {
    setSaving(true);
    setMsg("Capturing face...");
    try {
      const descriptor = await captureDescriptor(videoRef);
      setMsg("Saving...");
      const res = await fetch(`${API}/api/auth/register-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ faceDescriptor: descriptor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("✅ Face registered successfully!");
      setTimeout(onDone, 1000);
    } catch (e) {
      setMsg(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 my-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Register Your Face</h2>
        <p className="text-sm text-gray-500 mb-5">Used to verify your identity during exams.</p>

        <div className="flex justify-center mb-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{ width: 320, height: 240 }}>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className={`absolute inset-x-0 bottom-0 text-center text-xs py-2 font-medium transition ${faceFound ? "bg-green-600 text-white" : "bg-black/60 text-white"}`}>
              {status}
            </div>
          </div>
        </div>

        {msg && <p className={`text-sm text-center mb-3 font-medium ${msg.startsWith("✅") ? "text-green-600" : "text-blue-600"}`}>{msg}</p>}

        <button disabled={!faceFound || saving} onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition">
          {saving ? "Processing..." : "📸 Save Face & Continue →"}
        </button>
        <button onClick={onDone} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2">Skip for now</button>
      </div>
    </div>
  );
}

// ── Face Verification (login) ─────────────────────────────────────────────────
export function FaceVerify({ token, onSuccess, onCancel }) {
  const videoRef = useRef(null);
  const [verifying, setVerifying] = useState(false);
  const [msg, setMsg] = useState("");
  const { status, faceFound } = useFacePresence(videoRef);

  const handleVerify = async () => {
    setVerifying(true);
    setMsg("Capturing face...");
    try {
      const descriptor = await captureDescriptor(videoRef);
      setMsg("Verifying...");
      const res = await fetch(`${API}/api/auth/verify-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ faceDescriptor: descriptor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess();
    } catch (e) {
      setMsg(e.message);
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 my-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Face Verification</h2>
        <p className="text-sm text-gray-500 mb-5">Look at the camera to verify your identity.</p>

        <div className="flex justify-center mb-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{ width: 320, height: 240 }}>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className={`absolute inset-x-0 bottom-0 text-center text-xs py-2 font-medium transition ${faceFound ? "bg-green-600 text-white" : "bg-black/60 text-white"}`}>
              {status}
            </div>
          </div>
        </div>

        {msg && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-3">{msg}</div>}

        <button disabled={!faceFound || verifying} onClick={handleVerify}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition">
          {verifying ? "Verifying..." : "Verify & Sign In →"}
        </button>
        <button onClick={onCancel} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2">Cancel</button>
      </div>
    </div>
  );
}
