import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { AlertCircle, Camera, Check } from "lucide-react";

export default function FaceNutritionAnalyzer() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFeatures, setDetectedFeatures] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [mealPlan, setMealPlan] = useState([]); // State to store added foods
  const [showCamera, setShowCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Mock face analysis function
  const analyzeFace = (imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          paleSkin: Math.random() > 0.5,
          darkCirclesUnderEyes: Math.random() > 0.5,
          hairThinning: Math.random() > 0.5,
          dryLips: Math.random() > 0.7,
          rashesOnFace: Math.random() > 0.8,
        });
      }, 1500);
    });
  };

  const getNutritionRecommendations = (features) => {
    const recommendations = [];
    if (features.paleSkin) {
      recommendations.push({
        issue: "Pale skin",
        possibleDeficiency: "Iron deficiency",
        foodRecommendations: [
          "Spinach", "Red meat", "Lentils", "Pumpkin seeds", "Quinoa"
        ],
      });
    }
    if (features.darkCirclesUnderEyes) {
      recommendations.push({
        issue: "Dark circles under eyes",
        possibleDeficiency: "Vitamin K deficiency",
        foodRecommendations: [
          "Kale", "Spinach", "Broccoli", "Brussels sprouts", "Cabbage"
        ],
      });
    }
    if (features.hairThinning) {
      recommendations.push({
        issue: "Hair thinning or brittle hair",
        possibleDeficiency: "Biotin & Protein deficiency",
        foodRecommendations: [
          "Eggs", "Almonds", "Sweet potatoes", "Avocados", "Salmon"
        ],
      });
    }
    if (features.dryLips) {
      recommendations.push({
        issue: "Dry or cracked lips",
        possibleDeficiency: "Vitamin B2 deficiency",
        foodRecommendations: [
          "Milk", "Yogurt", "Eggs", "Beef liver", "Mushrooms"
        ],
      });
    }
    if (features.rashesOnFace) {
      recommendations.push({
        issue: "Facial rashes",
        possibleDeficiency: "Vitamin B3 deficiency",
        foodRecommendations: [
          "Chicken", "Tuna", "Turkey", "Mushrooms", "Peanuts"
        ],
      });
    }
    return recommendations;
  };
  const addToMealPlan = (foods) => {
    setMealPlan((prevMealPlan) => [...prevMealPlan, ...foods]);
  };

  const startDetection = async () => {
    if (!showCamera) {
      setShowCamera(true);
      return;
    }

    setIsDetecting(true);
    setErrorMessage("");

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const features = await analyzeFace(imageData);
      setDetectedFeatures(features);

      const nutritionRecommendations = getNutritionRecommendations(features);
      setRecommendations(nutritionRecommendations);
    } catch (error) {
      setErrorMessage("Error during detection: " + error.message);
    } finally {
      setIsDetecting(false);
    }
  };

  const initCamera = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setErrorMessage("Error accessing camera: " + error.message);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setDetectedFeatures(null);
    setRecommendations([]);
    setErrorMessage("");
  };

  useEffect(() => {
    if (showCamera) {
      initCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [showCamera]);

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Face Nutrition Analyzer</h1>

      <div className="w-full bg-gray-100 p-6 rounded-lg mb-6">
        <p className="mb-4">
          This application uses facial analysis to detect potential signs of nutritional deficiencies and provides dietary recommendations. Note that this is for educational purposes only and does not replace medical advice.
        </p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
            {showCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Camera not active</p>
              </div>
            )}
            <canvas ref={canvasRef} width="640" height="480" className="hidden" />
          </div>

          <button
            onClick={startDetection}
            disabled={isDetecting}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isDetecting ? (
              <>
                Analyzing<span className="animate-pulse">...</span>
              </>
            ) : showCamera ? (
              <>
                <Camera size={20} /> Analyze Face
              </>
            ) : (
              <>Start Camera</>
            )}
          </button>

          <button
            onClick={stopCamera}
            className="mt-4 flex items-center justify-center gap-2 bg-red-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-red-700"
          >
            Stop Camera
          </button>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="mt-1 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>

        <div className="lg:w-1/2">
          {detectedFeatures ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Detected Features:</h3>
                <ul className="space-y-1">
                  {Object.entries(detectedFeatures).map(([feature, detected]) => (
                    <li key={feature} className="flex items-center gap-2">
                      {detected ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <span className="inline-block w-5 h-5"></span>
                      )}
                      <span
                        className={detected ? "font-medium" : "text-gray-500"}
                      >
                        {feature
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        {!detected && " (not detected)"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {recommendations.length > 0 ? (
  <div className="max-h-96 overflow-y-auto pr-2"> {/* Added scrolling */}
    <h3 className="font-medium mb-2">Nutrition Recommendations:</h3>
    <div className="space-y-4">
      {recommendations.map((rec, idx) => (
        <div 
          key={idx} 
          className="p-3 bg-green-50 border border-green-100 rounded-lg relative" // Added relative
        >
          <p className="font-medium text-green-800">{rec.issue}</p>
          <p className="text-sm mb-2">
            Possible deficiency: {rec.possibleDeficiency}
          </p>
          <p className="text-sm font-medium mb-1">Recommended foods:</p>
          <p className="text-sm mb-3">{rec.foodRecommendations.join(", ")}</p> {/* Added mb-3 */}
          <button
  onClick={() => addToMealPlan(rec.foodRecommendations)}
  className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
>
  <Check size={16} className="inline mr-2" />
  Add to Meal Plan
</button>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="p-3 bg-blue-50 text-blue-800 rounded-lg">
    No potential deficiencies detected.
  </div>
)}

              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-lg text-sm">
                <p className="font-medium mb-1">Important Disclaimer:</p>
                <p>
                  This analysis is not a medical diagnosis. The recommendations are general and educational in nature. Always consult with a healthcare professional for proper diagnosis and personalized advice.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center h-full">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  No analysis results yet. Take a photo to analyze potential nutritional indicators.
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm w-full">
                <p className="font-medium">How it works:</p>
                <ol className="list-decimal list-inside mt-2">
                  <li>Click "Start Camera" to activate your webcam</li>
                  <li>Position your face clearly in the frame</li>
                  <li>Click "Analyze Face" to detect features</li>
                  <li>View nutrition recommendations based on analysis</li>
                </ol>
              </div>
            </div>
          )}
          {mealPlan.length > 0 && (
  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h3 className="text-lg font-medium mb-2">Your Meal Plan:</h3>
    <ul className="list-disc list-inside space-y-1">
      {mealPlan.map((food, idx) => (
        <li key={idx} className="text-sm">{food}</li>
      ))}
    </ul>
  </div>
)}
        </div>
      </div>
    </div>
  );
}
