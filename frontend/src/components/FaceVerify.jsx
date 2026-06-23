import React, { useEffect, useRef, useState } from "react";

const MODELS_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
const API = "https://ai-proctor-23da.onrender.com";

let faceApiLoaded = false;

async function loadFaceApi() {
  if (faceApiLoaded) return;
  const faceapi = window.faceapi;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
  ]);
  faceApiLoaded = true;
}

// ── shared camera + detection logic ──────────────────────────────────────────
function useFaceCapture(videoRef, active) {
  const [status, setStatus] = useState("Loading face models...");
  const [ready, setReady] = useState(false);
  const [descriptor, setDescriptor] = useState(null);

  useEffect(() => {
    if (!active) return;
    let interval;
    (async () => {
      try {
        await loadFaceApi();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("Position your face in the frame");

        interval = setInterval(async () => {
          if (!videoRef.current) return;
          const faceapi = window.faceapi;
          const result = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks(true)
            .withFaceDescriptor();
          if (result) {
            setDescriptor(Array.from(result.descriptor));
            setReady(true);
            setStatus("✅ Face detected — ready!");
          } else {
            setReady(false);
            setStatus("👤 No face detected — look at the camera");
          }
        }, 800);
      } catch (e) {
        setStatus("❌ Camera access denied or model failed to load");
      }
    })();

    return () => {
      clearInterval(interval);
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    };
  }, [active]);

  return { status, ready, descriptor };
}

// ── Face Registration (after signup) ─────────────────────────────────────────
export function FaceRegister({ token, onDone }) {
  const videoRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const { status, ready, descriptor } = useFaceCapture(videoRef, true);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/auth/register-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ faceDescriptor: descriptor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("Face registered successfully!");
      setTimeout(onDone, 1200);
    } catch (e) {
      setMsg(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Register Your Face</h2>
        <p className="text-sm text-gray-500 mb-5">This is used to verify your identity during exams.</p>

        <div className="relative rounded-xl overflow-hidden bg-black mb-4" style={{ aspectRatio: "4/3" }}>
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className={`absolute inset-x-0 bottom-0 text-center text-xs py-2 font-medium ${ready ? "bg-green-600 text-white" : "bg-black/60 text-white"}`}>
            {status}
          </div>
        </div>

        {msg && <p className="text-sm text-center mb-3 text-blue-600 font-medium">{msg}</p>}

        <button
          disabled={!ready || saving}
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition"
        >
          {saving ? "Saving..." : "Save Face & Continue →"}
        </button>

        <button onClick={onDone} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2">
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ── Face Verification (during login) ─────────────────────────────────────────
export function FaceVerify({ token, onSuccess, onCancel }) {
  const videoRef = useRef(null);
  const [verifying, setVerifying] = useState(false);
  const [msg, setMsg] = useState("");
  const { status, ready, descriptor } = useFaceCapture(videoRef, true);

  const handleVerify = async () => {
    setVerifying(true);
    setMsg("");
    try {
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Face Verification</h2>
        <p className="text-sm text-gray-500 mb-5">Look at the camera to verify your identity.</p>

        <div className="relative rounded-xl overflow-hidden bg-black mb-4" style={{ aspectRatio: "4/3" }}>
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className={`absolute inset-x-0 bottom-0 text-center text-xs py-2 font-medium ${ready ? "bg-green-600 text-white" : "bg-black/60 text-white"}`}>
            {status}
          </div>
        </div>

        {msg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-3">
            {msg}
          </div>
        )}

        <button
          disabled={!ready || verifying}
          onClick={handleVerify}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition"
        >
          {verifying ? "Verifying..." : "Verify & Sign In →"}
        </button>

        <button onClick={onCancel} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2">
          Cancel
        </button>
      </div>
    </div>
  );
}
