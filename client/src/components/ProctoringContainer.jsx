import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import screenfull from 'screenfull';
import { useSocket } from '../context/SocketContext';
import { AlertTriangle, Camera, Eye } from 'lucide-react';
import * as faceapi from 'face-api.js';

const ProctoringContainer = ({ children, testCode, onViolation }) => {
    const socket = useSocket();
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [warnings, setWarnings] = useState([]);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const webcamRef = useRef(null);
    const warningTimeoutRef = useRef(null);
    const intervalRef = useRef(null);

    // 0. Load AI Models
    useEffect(() => {
        const loadModels = async () => {
            try {
                // Use local models folder
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ]);
                setIsModelLoaded(true);
                console.log("AI Models Loaded Locally");
            } catch (err) {
                console.error("Failed to load AI models", err);
                addWarning("AI Model Load Failed - Monitoring Limited");
            }
        };
        loadModels();
    }, []);

    // 1. Enforce Fullscreen
    useEffect(() => {
        if (screenfull.isEnabled) {
            const handleFullscreenChange = () => {
                const isFull = screenfull.isFullscreen;
                setIsFullscreen(isFull);
                if (!isFull) {
                    addWarning("Fullscreen mode exited!");
                }
            };
            screenfull.on('change', handleFullscreenChange);
            return () => screenfull.off('change', handleFullscreenChange);
        }
    }, []);

    // 2. Tab Switch Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                addWarning("Tab switching detected!");
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    // 3. AI Monitoring Loop
    useEffect(() => {
        if (isWebcamActive && isModelLoaded && webcamRef.current?.video) {
            intervalRef.current = setInterval(async () => {
                detectFaces();
            }, 2000); // Check every 2 seconds to reduce load
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isWebcamActive, isModelLoaded]);

    const detectFaces = async () => {
        if (!webcamRef.current || !webcamRef.current.video) return;

        const video = webcamRef.current.video;
        if (video.readyState !== 4) return;

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

        if (detections.length === 0) {
            // No face detected
            addWarning("No face detected! Please stay in frame.");
        } else if (detections.length > 1) {
            // Multiple faces
            addWarning("Multiple faces detected! Unauthorized person.");
        } else {
            // Single face - Check if looking away (Simple heuristic using landmarks)
            //  const landmarks = detections[0].landmarks;
            //  const leftEye = landmarks.getLeftEye();
            //  const rightEye = landmarks.getRightEye();
            // (Eye tracking logic is complex, keeping it simple for now: valid face found)
        }
    };

    const addWarning = (msg) => {
        // Prevent duplicate spamming of same warning
        setWarnings(prev => {
            const lastWarning = prev[prev.length - 1];
            if (lastWarning && lastWarning.msg === msg && (Date.now() - lastWarning.id < 3000)) return prev;

            // Emit violation
            if (onViolation) onViolation(msg);
            if (socket) socket.emit('proctoring-violation', { testCode, type: msg });

            // Clear previous timeout
            if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
            warningTimeoutRef.current = setTimeout(() => setWarnings([]), 5000);

            return [...prev, { id: Date.now(), msg }];
        });
    };

    const requestFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Webcam Feed (Floating) */}
            <div className="fixed bottom-4 right-4 z-50 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-xl border-2 border-indigo-500">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    onUserMedia={() => setIsWebcamActive(true)}
                    onUserMediaError={() => addWarning("Webcam access denied/failed!")}
                />
                {!isWebcamActive && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs text-center p-2">
                        <Camera className="w-6 h-6 mb-1 mx-auto" />
                        Initializing Camera...
                    </div>
                )}
                {isModelLoaded && isWebcamActive && (
                    <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="AI Monitoring Active"></div>
                    </div>
                )}
                {!isModelLoaded && (
                    <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Loading Models..."></div>
                    </div>
                )}
            </div>

            {/* Warning Overlay */}
            {warnings.length > 0 && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-bold">{warnings[warnings.length - 1].msg}</span>
                    </div>
                </div>
            )}

            {/* Test Content or Blocker */}
            {!isFullscreen ? (
                <div className="fixed inset-0 z-40 bg-gray-900/95 flex flex-col items-center justify-center text-white p-8 text-center backdrop-blur-sm">
                    <Eye className="w-20 h-20 text-indigo-400 mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Proctoring Mode Active</h2>
                    <p className="max-w-md text-gray-300 mb-8 text-lg">
                        This exam requires fullscreen mode. Please enable fullscreen to continue the assessment.
                    </p>
                    <button
                        onClick={requestFullscreen}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/30"
                    >
                        Enable Fullscreen to Start
                    </button>
                    <p className="mt-8 text-sm text-gray-500">
                        Camera and screen monitoring are active. {isModelLoaded ? "(AI Enabled)" : "(Loading AI...)"}
                    </p>
                </div>
            ) : (
                <div className="relative z-0">
                    {children}
                </div>
            )}
        </div>
    );
};

export default ProctoringContainer;
