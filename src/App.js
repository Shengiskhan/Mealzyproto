import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Camera,
  Home,
  User,
  LogIn,
  ShoppingBag,
  MessageCircle,
  LogOut,
  Menu as MenuIcon,
  X,
  Send,
  Plus,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import "./App.css";

// Authentication Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(userData);
    return true;
  };

  const signup = (userData) => {
    // In a real app, you would send this to your backend
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = React.useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return children;
};

// Navbar Component
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          Mealzy
        </Link>

        <div
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <Link
              to="/"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} /> Home
            </Link>
          </li>

          {currentUser ? (
            <>
              <li>
                <Link
                  to="/analyze"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Camera size={18} /> Analyze
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag size={18} /> Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/chatbot"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle size={18} /> Food Assistant
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="nav-link logout-button"
                >
                  <LogOut size={18} /> Logout
                </button>
              </li>
              <li className="user-info">
                <User size={18} /> {currentUser.name}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/signin"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn size={18} /> Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="nav-link sign-up-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} /> Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Mealzy</h3>
          <p>Personalized nutrition based on your skin health</p>
        </div>

        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/analyze">Analysis</Link>
            </li>
            <li>
              <Link to="/chatbot">Food Assistant</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: contact@mealzy.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mealzy. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Home Page Component
const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Personalized Nutrition for Better Skin Health</h1>
          <p>
            Mealzy uses AI to analyze your skin and recommend foods that can
            help improve your skin condition and overall health.
          </p>
          <div className="hero-buttons">
            <Link to="/analyze" className="primary-button">
              <Camera size={18} /> Try Skin Analysis
            </Link>
            <Link to="/chatbot" className="secondary-button">
              <MessageCircle size={18} /> Get Food Recommendations
            </Link>
          </div>
        </div>
        <div className="hero-image">
      <img 
        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        alt="Healthy food options"
        className="hero-img"
        loading="lazy"
      />
</div>
      </section>

      <section className="features-section">
        <h2>How Mealzy Works</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <Camera size={32} />
            </div>
            <h3>AI Skin Analysis</h3>
            <p>
              Our advanced Vision Transformer detects skin conditions with 78.6%
              accuracy
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShoppingBag size={32} />
            </div>
            <h3>Personalized Food Plan</h3>
            <p>
              Get recommendations tailored to your specific skin health needs
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MessageCircle size={32} />
            </div>
            <h3>AI Food Assistant</h3>
            <p>Chat with our AI to get real-time food and nutrition advice</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>
              "Mealzy helped me identify foods that were triggering my eczema
              and suggested alternatives that improved my skin in just 3 weeks!"
            </p>
            <div className="testimonial-author">
              <img
                src="/api/placeholder/50/50"
                alt="User"
                className="testimonial-avatar"
              />
              <div>
                <h4>Sarah J.</h4>
                <span>Eczema Management</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p>
              "The chatbot gave me amazing recipes full of antioxidants that
              helped with my rosacea. My skin is so much calmer now!"
            </p>
            <div className="testimonial-author">
              <img
                src="/api/placeholder/50/50"
                alt="User"
                className="testimonial-avatar"
              />
              <div>
                <h4>Michael T.</h4>
                <span>Rosacea Improvement</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sign In Component
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // Mock login - in a real app, you would verify credentials with your backend
    const mockUser = {
      name: "John Doe",
      email: email,
      id: "user123",
    };

    // Log the user in
    login(mockUser);
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Sign In to Mealzy</h2>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            <LogIn size={18} /> Sign In
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p>
            <Link to="/">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Sign Up Component
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Mock signup - in a real app, you would create a user in your backend
    const newUser = {
      name: name,
      email: email,
      id: "user" + Math.floor(Math.random() * 1000),
    };

    // Sign up the user
    signup(newUser);
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Create an Account</h2>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            <User size={18} /> Sign Up
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Orders Component
const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-1234",
      date: "2025-04-12",
      status: "Delivered",
      items: [
        { name: "Weekly Vitamin Pack", quantity: 1, price: 24.99 },
        { name: "Anti-Inflammatory Meal Kit", quantity: 1, price: 49.99 },
      ],
      total: 74.98,
    },
    {
      id: "ORD-1235",
      date: "2025-04-05",
      status: "Processing",
      items: [
        { name: "Skin Health Supplement Bundle", quantity: 1, price: 39.99 },
        { name: "Eczema Relief Food Kit", quantity: 1, price: 54.99 },
      ],
      total: 94.98,
    },
  ]);

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">Placed on {order.date}</p>
                </div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="order-actions">
                  <button className="secondary-button">Track Order</button>
                  <button className="outline-button">Reorder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders">
          <ShoppingBag size={48} />
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="primary-button">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

// Chatbot Component
const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! I'm your Mealzy Food Assistant. How can I help you with your nutrition today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);
  const { currentUser } = React.useContext(AuthContext);

  // Food recommendation database (simplified for demo)
  const foodDatabase = {
    acne: [
      "Omega-3 rich foods like salmon",
      "Zinc-rich foods like pumpkin seeds",
      "Vitamin A rich foods like sweet potatoes",
      "Probiotics from yogurt",
      "Antioxidant-rich berries",
    ],
    psoriasis: [
      "Fatty fish high in omega-3",
      "Turmeric for anti-inflammatory benefits",
      "Vitamin D rich foods like mushrooms",
      "Colorful vegetables",
      "Olive oil",
    ],
    eczema: [
      "Foods rich in vitamin E like almonds",
      "Omega-3 fatty acids from walnuts",
      "Probiotic-rich foods like kimchi",
      "Foods high in quercetin like apples",
      "Anti-inflammatory herbs like ginger",
    ],
    rosacea: [
      "Anti-inflammatory foods like leafy greens",
      "Foods rich in zinc like legumes",
      "Omega-3 fatty acids",
      "Alkaline foods like cucumber",
      "Probiotic foods",
    ],
    vitiligo: [
      "Foods rich in B12 like fortified cereals",
      "Folic acid from leafy greens",
      "Vitamin C rich foods",
      "Beta carotene from carrots",
      "Copper-rich foods like mushrooms",
    ],
    general: [
      "Whole grains",
      "Lean proteins",
      "Healthy fats like avocado",
      "Colorful fruits and vegetables",
      "Hydrating foods",
    ],
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(input.toLowerCase());
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (userInput) => {
    let responseText = "";

    if (userInput.includes("help") || userInput.includes("what can you do")) {
      responseText =
        "I can help you with food recommendations based on your skin condition, suggest recipes, and provide general nutrition advice. Just tell me what skin condition you're dealing with or what you're looking for!";
    } else if (userInput.includes("acne") || userInput.includes("pimple")) {
      responseText = `For acne, I recommend: ${foodDatabase.acne.join(
        ", "
      )}. These foods may help reduce inflammation and support skin healing. Would you like specific recipe ideas?`;
    } else if (userInput.includes("psoriasis")) {
      responseText = `For psoriasis, try incorporating: ${foodDatabase.psoriasis.join(
        ", "
      )}. These can help reduce inflammation associated with psoriasis. Would you like to know more?`;
    } else if (userInput.includes("eczema")) {
      responseText = `For eczema management, consider: ${foodDatabase.eczema.join(
        ", "
      )}. These foods may help strengthen your skin barrier. Would you like a sample meal plan?`;
    } else if (userInput.includes("rosacea")) {
      responseText = `For rosacea, I recommend: ${foodDatabase.rosacea.join(
        ", "
      )}. These foods can help calm inflammation. Anything specific you'd like to know about these options?`;
    } else if (userInput.includes("vitiligo")) {
      responseText = `For vitiligo, try including: ${foodDatabase.vitiligo.join(
        ", "
      )}. These nutrients support melanin production. Would you like more detailed information?`;
    } else if (
      userInput.includes("recipe") ||
      userInput.includes("meal") ||
      userInput.includes("food")
    ) {
      responseText = `Here are some skin-healthy food options: ${foodDatabase.general.join(
        ", "
      )}. For personalized recommendations, let me know if you have a specific skin condition.`;
    } else {
      responseText =
        "I'm here to help with food recommendations for your skin health. Could you tell me what specific skin condition you're interested in addressing through nutrition?";
    }

    return {
      id: messages.length + 2,
      sender: "bot",
      text: responseText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>
          <MessageCircle size={24} /> Food Recommendation Assistant
        </h2>
        <p>Get personalized food advice for your skin health</p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === "bot" ? "bot-message" : "user-message"
            }`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-time">{message.time}</div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot-message">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about food recommendations..."
          className="chat-input"
        />
        <button
          type="submit"
          className="send-button"
          disabled={input.trim() === ""}
        >
          <Send size={20} />
        </button>
      </form>

      <div className="chatbot-suggestions">
        <p>Try asking about:</p>
        <div className="suggestion-chips">
          <button
            onClick={() => setInput("What foods help with acne?")}
            className="suggestion-chip"
          >
            Foods for acne
          </button>
          <button
            onClick={() => setInput("Recommend a meal plan for eczema")}
            className="suggestion-chip"
          >
            Eczema meal plan
          </button>
          <button
            onClick={() => setInput("Anti-inflammatory recipes")}
            className="suggestion-chip"
          >
            Anti-inflammatory recipes
          </button>
        </div>
      </div>
    </div>
  );
};

// Analyzer Component
const Analyzer = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedDiseases, setDetectedDiseases] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [customMenu, setCustomMenu] = useState([]);
  const [newFood, setNewFood] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend("webgl");
        const modelUrl = "/outputmodel/model.json";
        const loadedModel = await tf.loadGraphModel(modelUrl);
        setModel(loadedModel);
        setModelLoading(false);
      } catch (error) {
        console.error("Model loading error:", error);
        setErrorMessage(`Failed to load model: ${error.message}`);
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // Camera initialization
  const initCamera = async () => {
    setErrorMessage("");
    try {
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
        };
      }
    } catch (error) {
      console.error("Camera error:", error);
      setCameraActive(false);
      setShowCamera(false);
      
      if (error.name === "NotAllowedError") {
        setErrorMessage("Please allow camera access in your browser settings");
        setPermissionDenied(true);
      } else {
        setErrorMessage(`Camera error: ${error.message}`);
      }
    }
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (showCamera) {
      stopCamera();
    } else {
      setShowCamera(true);
      await initCamera();
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCameraActive(false);
    setErrorMessage("");
  };

  // Start face detection
  const startDetection = async () => {
    if (!model || !cameraActive) return;
    
    setIsDetecting(true);
    setErrorMessage("");
    setDetectedDiseases(null);
    setRecommendations([]);

    try {
      // Mock analysis for demo purposes
      const diseases = {
        acne: Math.random() > 0.5,
        psoriasis: Math.random() > 0.7,
        eczema: Math.random() > 0.6,
        rosacea: Math.random() > 0.8,
        vitiligo: Math.random() > 0.9,
      };

      const recs = getNutritionRecommendations(diseases);

      setDetectedDiseases(diseases);
      setRecommendations(recs);
    } catch (error) {
      setErrorMessage(`Analysis failed: ${error.message}`);
    } finally {
      setIsDetecting(false);
    }
  };

  // Generate nutrition recommendations
  const getNutritionRecommendations = (diseases) => {
    const recommendations = [];

    if (diseases.acne) {
      recommendations.push({
        issue: "Acne",
        possibleDeficiency: "Zinc, Omega-3 deficiency",
        vitamins: ["Zinc", "Vitamin A"],
        foodRecommendations: [
          "Nuts",
          "Salmon",
          "Avocado",
          "Sweet potatoes",
          "Broccoli",
        ],
      });
    }

    if (diseases.psoriasis) {
      recommendations.push({
        issue: "Psoriasis",
        possibleDeficiency: "Vitamin D, Omega-3 deficiency",
        vitamins: ["Vitamin D", "Vitamin B12"],
        foodRecommendations: [
          "Fatty fish",
          "Eggs",
          "Mushrooms",
          "Fortified cereals",
          "Spinach",
        ],
      });
    }

    if (diseases.eczema) {
      recommendations.push({
        issue: "Eczema",
        possibleDeficiency: "Vitamin E, Probiotics deficiency",
        vitamins: ["Vitamin E", "Probiotics"],
        foodRecommendations: [
          "Almonds",
          "Yogurt",
          "Kale",
          "Sunflower seeds",
          "Fermented foods",
        ],
      });
    }

    if (diseases.rosacea) {
      recommendations.push({
        issue: "Rosacea",
        possibleDeficiency: "Vitamin C, Anti-inflammatory foods deficiency",
        vitamins: ["Vitamin C"],
        foodRecommendations: [
          "Citrus fruits",
          "Bell peppers",
          "Berries",
          "Turmeric",
          "Green tea",
        ],
      });
    }

    if (diseases.vitiligo) {
      recommendations.push({
        issue: "Vitiligo",
        possibleDeficiency: "Vitamin B9 (Folate), Vitamin B12 deficiency",
        vitamins: ["Folate", "Vitamin B12"],
        foodRecommendations: [
          "Leafy greens",
          "Lentils",
          "Liver",
          "Shellfish",
          "Whole grains",
        ],
      });
    }

    return recommendations;
  };

  // Handle custom menu
  const addToMenu = (food) => {
    if (food && !customMenu.includes(food)) {
      setCustomMenu([...customMenu, food]);
      setNewFood("");
    }
  };

  const removeFromMenu = (food) => {
    setCustomMenu(customMenu.filter((item) => item !== food));
  };

  const handleAddRecommendedFood = (food) => {
    addToMenu(food);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="analyzer-container">
      <h2 className="page-title">Skin & Nutrition Analysis</h2>
  
      <div className="intro-box">
        <p className="intro-text">
          Our AI uses a Vision Transformer (78.6% accuracy) to detect skin
          diseases and recommends personalized foods and vitamins to improve
          your health. Customize your meal plan below.
        </p>
        <p className="disclaimer">
          For educational purposes only; consult a healthcare professional.
        </p>
      </div>
  
      {modelLoading && (
        <div className="model-loading">
          <span className="animate-pulse">Loading model...</span>
        </div>
      )}
  
      <div className="main-content">
        <div className="camera-section">
          <div className="video-container">
            {showCamera ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="video"
                />
                {!cameraActive && !permissionDenied && (
                  <div className="video-overlay">
                    <p className="overlay-text">Loading camera...</p>
                  </div>
                )}
                {permissionDenied && (
                  <div className="video-overlay error">
                    <div className="overlay-content">
                      <AlertCircle size={40} className="overlay-icon" />
                      <p className="overlay-text">Camera permission denied</p>
                      <p className="overlay-subtext">
                        Please check your browser settings
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="video-placeholder">
                <p className="placeholder-text">Camera not active</p>
              </div>
            )}
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="hidden"
            />
          </div>
  
          <div className="button-group">
            <button
              onClick={toggleCamera}
              disabled={modelLoading}
              className={`primary-button ${modelLoading ? "disabled" : ""}`}
            >
              {showCamera ? (
                <>
                  <X size={20} /> Stop Camera
                </>
              ) : (
                <>
                  <Camera size={20} /> Start Camera
                </>
              )}
            </button>
  
            {cameraActive && (
              <button
                onClick={startDetection}
                className="secondary-button"
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <span>Analyzing...</span>
                ) : (
                  <span>Analyze Face</span>
                )}
              </button>
            )}
          </div>
  
          {errorMessage && (
            <div className="error-message">
              <AlertCircle size={20} />
              {errorMessage}
            </div>
          )}
        </div>
  
        <div className="results-section">
          {detectedDiseases ? (
            <div className="results-box">
              <h2 className="section-title">Analysis Results</h2>
  
              <div className="results-content">
                <h3 className="subtitle">Detected Skin Conditions:</h3>
                <ul className="disease-list">
                  {Object.entries(detectedDiseases).map(
                    ([disease, detected]) => (
                      <li key={disease} className="disease-item">
                        {detected ? (
                          <Check size={18} className="check-icon" />
                        ) : (
                          <span className="empty-icon"></span>
                        )}
                        <span
                          className={
                            detected
                              ? "disease-name"
                              : "disease-name not-detected"
                          }
                        >
                          {disease.charAt(0).toUpperCase() + disease.slice(1)}
                          {!detected && " (not detected)"}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
  
              {recommendations.length > 0 ? (
                <div className="recommendations">
                  <h3 className="subtitle">Nutrition Recommendations:</h3>
                  <div className="recommendation-list">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="recommendation-item">
                        <p className="recommendation-title">{rec.issue}</p>
                        <p className="recommendation-text">
                          Possible deficiency: {rec.possibleDeficiency}
                        </p>
                        <p className="recommendation-subtitle">
                          Recommended vitamins:
                        </p>
                        <ul className="vitamin-list">
                          {rec.vitamins.map((vitamin, vitIdx) => (
                            <li key={vitIdx} className="vitamin-item">
                              {vitamin}
                            </li>
                          ))}
                        </ul>
                        <p className="recommendation-subtitle">
                          Recommended foods:
                        </p>
                        <ul className="food-list">
                          {rec.foodRecommendations.map((food, foodIdx) => (
                            <li key={foodIdx} className="food-item">
                              <span>{food}</span>
                              <button
                                onClick={() => handleAddRecommendedFood(food)}
                                className="add-food-button"
                              >
                                Add to Menu
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-recommendations">
                  No recommendations available
                </p>
              )}
            </div>
          ) : (
            <div className="results-placeholder">
              <p className="placeholder-text">Waiting for face analysis...</p>
            </div>
          )}
  
          <div className="menu-box">
            <h2 className="section-title">Customizable Meal Plan</h2>
            <div className="menu-input-group">
              <input
                type="text"
                value={newFood}
                onChange={(e) => setNewFood(e.target.value)}
                placeholder="Add a food (e.g., Quinoa)"
                className="menu-input"
              />
              <button
                onClick={() => addToMenu(newFood)}
                disabled={!newFood}
                className={`menu-add-button ${!newFood ? "disabled" : ""}`}
              >
                <Plus size={20} /> Add
              </button>
            </div>
            {customMenu.length > 0 ? (
              <ul className="menu-list">
                {customMenu.map((food, idx) => (
                  <li key={idx} className="menu-item">
                    <span>{food}</span>
                    <button
                      onClick={() => removeFromMenu(food)}
                      className="remove-food-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-menu-items">
                No foods added to your meal plan yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/analyze"
                element={
                  <ProtectedRoute>
                    <Analyzer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <ProtectedRoute>
                    <Chatbot />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;