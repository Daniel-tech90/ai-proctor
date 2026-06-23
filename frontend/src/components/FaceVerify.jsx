import React, { useEffect, useRef, useState } from "react";

const API = "https://ai-proctor-23da.onrender.com";
const FACE_API = "https://ai-proctor-face.onrender.com";

// Wake up face service on load
fetch(`${FACE_API}/health`).catch(() => {});

function useCamera(videoRef) {
  const [ready, setReady] = useState(false);
  const [camError, setCamError] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        setReady(true);
      })
      .catch(() => setCamError("❌ Camera access denied. Please allow camera and refresh."));

    return () => {
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { ready, camError };
}

function captureSnapshot(videoRef) {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 240;
  canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 320, 240);
  return canvas.toDataURL("image/jpeg", 0.8);
}

function CameraBox({ videoRef, status }) {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{ width: 320, height: 240 }}>
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 text-center text-xs py-2 font-medium bg-black/60 text-white">
          {status}
        </div>
      </div>
    </div>
  );
}

// ── Face Registration ─────────────────────────────────────────────────────────
export function FaceRegister({ token, onDone }) {
  const videoRef = useRef(null);
  const { ready, camError } = useCamera(videoRef);
  const [status, setStatus] = useState("📷 Look at camera, then click Capture");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setStatus("Detecting face...");
    try {
      const image = captureSnapshot(videoRef);

      // Get descriptor from face service
      const faceRes = await fetch(`${FACE_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      }).catch(() => { throw new Error("Face service unavailable. Please wait 30 seconds and retry (service waking up)."); });
      const faceData = await faceRes.json();
      if (!faceRes.ok) throw new Error(faceData.error);

      // Save descriptor to backend
      setStatus("Saving...");
      const res = await fetch(`${API}/api/auth/register-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ faceDescriptor: faceData.descriptor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus("✅ Face registered!");
      setTimeout(onDone, 1000);
    } catch (e) {
      setStatus(`❌ ${e.message}`);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 my-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Register Your Face</h2>
        <p className="text-sm text-gray-500 mb-5">Look straight at the camera, then click Capture.</p>
        {camError
          ? <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{camError}</div>
          : <CameraBox videoRef={videoRef} status={ready ? status : "Starting camera..."} />}
        <button disabled={!ready || saving} onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition">
          {saving ? "Processing..." : "📸 Capture & Register →"}
        </button>
        <button onClick={onDone} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2">Skip for now</button>
      </div>
    </div>
  );
}

// ── Face Verification (login) ─────────────────────────────────────────────────
export function FaceVerify({ token, onSuccess, onCancel }) {
  const videoRef = useRef(null);
  const { ready, camError } = useCamera(videoRef);
  const [status, setStatus] = useState("📷 Look at camera, then click Verify");
  const [verifying, setVerifying] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleVerify = async () => {
    setVerifying(true);
    setErrMsg("");
    setStatus("Detecting face...");
    try {
      const image = captureSnapshot(videoRef);

      // Get stored descriptor from backend
      const meRes = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();

      // Verify via face service
      setStatus("Verifying...");
      const faceRes = await fetch(`${FACE_API}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, descriptor: meData.faceDescriptor }),
      }).catch(() => { throw new Error("Face service unavailable. Please wait 30 seconds and retry."); });
      const faceData = await faceRes.json();
      if (!faceRes.ok) throw new Error(faceData.error);

      onSuccess();
    } catch (e) {
      setErrMsg(e.message);
      setStatus("📷 Look at camera, then click Verify");
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 my-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Face Verification</h2>
        <p className="text-sm text-gray-500 mb-5">Look straight at the camera, then click Verify.</p>
        {camError
          ? <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{camError}</div>
          : <CameraBox videoRef={videoRef} status={ready ? status : "Starting camera..."} />}
        {errMsg && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-3">{errMsg}</div>}
        <button disabled={!ready || verifying} onClick={handleVerify}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition">
          {verifying ? "Verifying..." : "Verify & Sign In →"}
        </button>
        <button onClick={onCancel} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-2">Cancel</button>
      </div>
    </div>
  );
}
