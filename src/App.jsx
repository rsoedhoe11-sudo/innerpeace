import { useState, useEffect } from "react";
import {
  LogIn,
  UserPlus,
  Home,
  Sun,
  Users,
  MessageSquare,
  TrendingUp,
  X,
  Heart,
} from "lucide-react";
import "./App.css";
// --- Constants and Utility Functions ---

const APP_NAME = "Inner Peace";
const RECOMMENDED_EMAIL = "test@gmail.com";
const RECOMMENDED_PASSWORD = "12345";
const QUIZ_STORAGE_KEY = "innerPeaceQuizHistory";

const initialQuizHistory =
  JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY)) || [];

// Constants for Quiz Normalization
const MAX_RAW_SCORE = 26; // Q1(10) + Q2(2) + Q3(2) + Q4(2) + Q5(10) = 26
const MIN_RAW_SCORE = 2; // Q1(1) + Q2(0) + Q3(0) + Q4(0) + Q5(1) = 2
const NORMALIZATION_RANGE = MAX_RAW_SCORE - MIN_RAW_SCORE; // 24

const quizQuestions = [
  {
    id: 1,
    text: "When you feel stress in your body, does it feel like excitement or like tension?",
    type: "slider",
    min: 1,
    max: 10,
    labels: ["Tension / anxiety / blocking", "Energy / focus / activation"],
  },
  {
    id: 2,
    text: "Under a deadline, stress feels to you more like…",
    type: "buttons",
    options: [
      { label: "A: It helps me focus", score: 2, value: "A" },
      { label: "B: It makes it harder", score: 0, value: "B" },
    ],
  },
  {
    id: 3,
    text: "When stress shows up, is your first thought usually “I can handle this” or “this is too much”?",
    type: "buttons",
    options: [
      { label: "A: I can handle this", score: 2, value: "A" },
      { label: "B: This is too much", score: 0, value: "B" },
    ],
  },
  {
    id: 4, // Note: Renumbered from '3' in the prompt to avoid collision
    text: "Stress usually makes me feel…",
    type: "multiple_choice",
    options: [
      { label: "A: Active / alert", score: 2, value: "A" },
      { label: "B: Creative", score: 1, value: "B" },
      { label: "C: Insecure", score: 0, value: "C" },
      { label: "D: Drained / tired", score: 0, value: "D" },
    ],
  },
  {
    id: 5,
    text: "How fast do you usually recover after a stressful moment?",
    type: "slider",
    min: 1,
    max: 10,
    labels: ["Takes days", "Within one hour I feel okay again"],
  },
];

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getRecommendation = (normalizedScore) => {
  // Normalized score is 0-10
  if (normalizedScore <= 3) return "1:1 Therapy Session (High Need)";
  if (normalizedScore <= 7) return "Group Session (Moderate Need)";
  return "Self-Care Focus (Low Need)"; // Score 8-10
};

/**
 * Normalizes the raw score to a 0-10 scale.
 * Formula: (raw score - min) / (max - min) * 10
 */
const calculateNormalizedScore = (rawScore) => {
  const normalized = ((rawScore - MIN_RAW_SCORE) / NORMALIZATION_RANGE) * 10;
  // Round to one decimal place for display
  return parseFloat(normalized.toFixed(1));
};

// --- Sub-Components ---

/**
 * Custom Modal for displaying messages instead of alert().
 */
const Modal = ({ title, message, onClose }) => (
  <div className="fixed inset-0 !bg-gray-900 !bg-opacity-75 z-50 flex items-center justify-center p-4">
    <div className="!bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-indigo-700">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-indigo-600 transition">
          <X size={20} />
        </button>
      </div>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="text-right">
        <button
          onClick={onClose}
          className="!bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md">
          Close
        </button>
      </div>
    </div>
  </div>
);

/**
 * Registration Form Component
 */
const RegistrationForm = ({ switchToLogin, setModal }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const handleRegistration = (e) => {
    e.preventDefault();

    // Mock Registration Logic
    // In a real app, this data would be sent to a server/database (e.g., Firestore)
    console.log("Mock Registration Data:", { fullName, email, gender, dob });

    // Since we are not storing real user data, we just confirm success
    setModal({
      title: "Success!",
      message:
        "Registration successful! Please log in with the default credentials to access the app.",
    });

    // After mock registration, switch to login view
    setTimeout(() => {
      switchToLogin();
    }, 1500);
  };

  return (
    <div className="!bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleRegistration} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="At least 6 characters"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              required>
              <option value="" disabled>
                Select
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-Binary</option>
              <option value="prefer-not-say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 !bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-300 shadow-lg shadow-indigo-500/50">
          Register
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="font-semibold text-indigo-600 hover:text-indigo-800 transition">
          Login Here
        </button>
      </p>
    </div>
  );
};

/**
 * Login Form Component (Refactored from AuthForm)
 */
const LoginForm = ({
  setIsLoggedIn,
  setIsAuthModalOpen,
  setModal,
  switchToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock Auth Logic
    if (email === RECOMMENDED_EMAIL && password === RECOMMENDED_PASSWORD) {
      localStorage.setItem("isLoggedIn", "true");
      setModal({
        title: "Success!",
        message: "Login successful. Welcome to Inner Peace!",
      });
      setTimeout(() => {
        setIsLoggedIn(true);
        setIsAuthModalOpen(false);
      }, 1000);
    } else {
      setModal({
        title: "Authentication Failed",
        message: `Invalid credentials. Please use: ${RECOMMENDED_EMAIL} / ${RECOMMENDED_PASSWORD}`,
      });
    }
  };

  return (
    <div className="!bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        Welcome Back!
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="test@gmail.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="12345"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 !bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-300 shadow-lg shadow-indigo-500/50">
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={switchToRegister}
          className="font-semibold text-indigo-600 hover:text-indigo-800 transition">
          Register Here
        </button>
      </p>
    </div>
  );
};

/**
 * Parent component to manage Login/Register view state within the modal
 */
const AuthModalContent = ({ setIsLoggedIn, setIsAuthModalOpen }) => {
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [modal, setModal] = useState(null);

  const switchToLogin = () => setIsRegisterView(false);
  const switchToRegister = () => setIsRegisterView(true);

  return (
    <div className="relative">
      {modal && (
        <Modal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}

      <button
        onClick={() => setIsAuthModalOpen(false)}
        className="absolute top-4 right-0 text-gray-400  transition z-50"
        aria-label="Close Authentication">
        <X size={24} />
      </button>

      {isRegisterView ? (
        <RegistrationForm switchToLogin={switchToLogin} setModal={setModal} />
      ) : (
        <LoginForm
          setIsLoggedIn={setIsLoggedIn}
          setIsAuthModalOpen={setIsAuthModalOpen}
          setModal={setModal}
          switchToRegister={switchToRegister}
        />
      )}
    </div>
  );
};

/**
 * Main Landing Page Component
 */
const LanderPage = ({ setIsAuthModalOpen }) => {
  const services = [
    {
      icon: <MessageSquare size={32} className="text-indigo-500" />,
      title: "1:1 Sessions",
      description: "Personalized, private therapy with licensed professionals.",
      delay: 0,
    },
    {
      icon: <Users size={32} className="text-green-500" />,
      title: "Group Therapy",
      description: "Shared wisdom and communal support in a safe environment.",
      delay: 200,
    },
    {
      icon: <Heart size={32} className="text-red-500" />,
      title: "Daily Wellness Quiz",
      description:
        "Quick check-ins to monitor your emotional state and progress.",
      delay: 400,
    },
  ];

  // Tailwind CSS Utility class for custom animation
  // Note: In a real environment, custom keyframes are usually defined in a CSS file.
  // Here we rely on Tailwind's existing classes or inline styles.

  return (
    <div className="min-h-screen !bg-gray-50">
      {/* Hero Section - Fancy Gradient and Animation */}
      <header className="!bg-gradient-to-br from-indigo-700 to-purple-600 py-28 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-64 h-64 !bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1
            className="text-6xl font-black tracking-tight mb-4 animate-fadeInDown transition duration-1000 transform opacity-0 translate-y-5"
            style={{ animationFillMode: "forwards", animationDelay: "0.1s" }}>
            Find Your <span className="text-yellow-300">Inner Peace</span>
          </h1>
          <p
            className="text-xl mb-12 opacity-80 max-w-4xl mx-auto animate-fadeIn transition duration-1000 transform opacity-0 translate-y-5"
            style={{ animationFillMode: "forwards", animationDelay: "0.4s" }}>
            Your journey to emotional balance and clarity starts here. We
            connect you with the right support, right now.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="!bg-white text-indigo-700 hover:bg-gray-100 font-extrabold py-4 px-12 rounded-full text-xl shadow-2xl transition duration-300 transform hover:scale-105 animate-pulse-once" // Added pulse effect
            style={{
              animationFillMode: "forwards",
              animationDelay: "0.7s",
              animation: "pulse 2s infinite",
            }}>
            Start Your Journey Today{" "}
            <UserPlus className="inline ml-3" size={24} />
          </button>
        </div>
      </header>

      {/* Services Section - Modern Cards with Hover Effects */}
      <section className="py-20 !bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-14">
            Our Core Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="!bg-white rounded-xl shadow-xl p-8 text-center border border-gray-100 
                                           transform transition duration-500 hover:scale-[1.05] hover:shadow-2xl hover:border-indigo-400"
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.8s forwards`,
                  animationDelay: `${service.delay}ms`,
                }}>
                <div className="p-4 !bg-indigo-50 rounded-full inline-block mb-6 shadow-md border-2 border-indigo-100">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA/Footer */}
      <footer className="!bg-gray-800 py-10 text-center text-gray-300">
        <p>
          &copy; {new Date().getFullYear()} Inner Peace. All rights reserved.
        </p>
        <p className="text-sm mt-2">
          Design for mental wellness and emotional growth.
        </p>
      </footer>
      {/* Custom CSS for Animations - In a real app, this would be in a separate CSS file */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation-name: fadeInDown;
          animation-duration: 1s;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Helper to render a single Quiz Question based on its type
 */
const QuizQuestionRenderer = ({ question, answer, setAnswer }) => {
  const handleSliderChange = (e) => {
    // Sliders use the value directly as the score
    setAnswer(parseInt(e.target.value));
  };

  const handleButtonChange = (value) => {
    // Buttons: find the score associated with the selected value ('A' or 'B')
    const selectedOption = question.options.find((opt) => opt.value === value);
    setAnswer(selectedOption ? selectedOption.score : 0);
  };

  const handleMultipleChoiceChange = (value) => {
    // Multiple Choice: find the score associated with the selected value ('A', 'B', 'C', 'D')
    const selectedOption = question.options.find((opt) => opt.value === value);
    setAnswer(selectedOption ? selectedOption.score : 0);
  };

  return (
    <div className="p-5 !bg-gray-50 rounded-lg border border-gray-200">
      <p className="font-semibold text-gray-800 mb-4 text-lg">
        {question.id}) {question.text}
      </p>

      {question.type === "slider" && (
        <div>
          <input
            type="range"
            min={question.min}
            max={question.max}
            value={answer || question.min} // Default to min
            onChange={handleSliderChange}
            className="w-full h-2 !bg-indigo-100 rounded-lg appearance-none cursor-pointer range-lg transition duration-200"
          />
          <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
            <span className="font-medium">{question.labels[0]}</span>
            <span className="text-xl font-bold text-indigo-600 w-10 text-center">
              {answer || question.min}
            </span>
            <span className="font-medium">{question.labels[1]}</span>
          </div>
        </div>
      )}

      {question.type === "buttons" && (
        <div className="flex space-x-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleButtonChange(option.value)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold border-2 transition duration-300 shadow-sm
                                ${
                                  answer === option.score
                                    ? "!bg-indigo-600 text-white border-indigo-700 shadow-indigo-500/50"
                                    : "!bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
                                }
                            `}>
              {option.label}
            </button>
          ))}
        </div>
      )}

      {question.type === "multiple_choice" && (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.value}
              className="flex items-center cursor-pointer p-3 !bg-white rounded-lg border border-gray-200 hover:border-indigo-400 transition">
              <input
                type="radio"
                name={`q${question.id}`}
                value={option.value}
                checked={answer === option.score}
                onChange={() => handleMultipleChoiceChange(option.value)}
                className="form-radio h-5 w-5 text-indigo-600"
                required
              />
              <span className="ml-3 text-gray-700">
                {option.label} (Score: +{option.score})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Daily Quiz Component
 */
const Quiz = ({ setPage, quizHistory, setQuizHistory }) => {
  const today = getTodayDate();
  // const hasTakenQuizToday =false
  const hasTakenQuizToday = quizHistory.some((item) => item.date === today);

  // Initial state: Set answer scores for sliders (Q1, Q5) to their minimum value (1). Others to 0.
  const initialAnswers = quizQuestions.map((q) => {
    if (q.type === "slider") return q.min;
    return 0;
  });

  const [answers, setAnswers] = useState(initialAnswers);
  const [recommendation, setRecommendation] = useState(null);
  const [normalizedScore, setNormalizedScore] = useState(0);

  const updateAnswer = (index, score) => {
    const newAnswers = [...answers];
    newAnswers[index] = score;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rawScore = answers.reduce((sum, current) => sum + current, 0);
    const finalNormalizedScore = calculateNormalizedScore(rawScore);
    const finalRecommendation = getRecommendation(finalNormalizedScore);

    // Update state and localStorage
    const newEntry = {
      date: today,
      rawScore: rawScore,
      normalizedScore: finalNormalizedScore,
      recommendation: finalRecommendation,
    };
    const newHistory = [...quizHistory, newEntry];

    setQuizHistory(newHistory);
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(newHistory));

    setNormalizedScore(finalNormalizedScore);
    setRecommendation(finalRecommendation);
  };

  if (hasTakenQuizToday && !recommendation) {
    // Find today's result if page reloaded
    const todayResult = quizHistory.find((item) => item.date === today);
    if (todayResult) {
      setNormalizedScore(todayResult.normalizedScore);
      setRecommendation(todayResult.recommendation);
    }
  }

  if (recommendation) {
    let borderColor = "border-indigo-500";
    let buttonColor = "!bg-indigo-600 hover:bg-indigo-700";
    let buttonText = "Return to Home";

    if (recommendation.includes("1:1 Therapy")) {
      borderColor = "border-red-500";
      buttonColor = "!bg-red-500 hover:bg-red-600";
      buttonText = "Start 1:1 Chat Now";
    } else if (recommendation.includes("Group Session")) {
      borderColor = "border-yellow-500";
      buttonColor = "!bg-yellow-500 hover:bg-yellow-600";
      buttonText = "View Group Sessions";
    }

    return (
      <div
        className={`bg-white p-8 rounded-xl shadow-2xl max-w-2xl mx-auto text-center border-t-8 ${borderColor}`}>
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          Quiz Complete!
        </h2>
        <p className="text-xl text-gray-700 mb-6">
          Your **Normalized Stress Management Score** is:{" "}
          <span className="font-extrabold text-4xl text-green-600">
            {normalizedScore}
          </span>{" "}
          / 10
        </p>

        <div
          className={`bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 mb-8`}>
          <h3 className="text-2xl font-semibold text-indigo-800 mb-2">
            Our Recommendation:
          </h3>
          <p className="text-2xl font-bold text-gray-900">{recommendation}</p>
        </div>

        <div className="space-y-4">
          {recommendation.includes("1:1 Therapy") && (
            <button
              onClick={() => setPage("chat")}
              className={`w-full py-3 ${buttonColor} text-white font-bold rounded-lg transition duration-300 shadow-lg`}>
              {buttonText}
            </button>
          )}
          {recommendation.includes("Group Session") && (
            <button
              onClick={() => setPage("group")}
              className={`w-full py-3 ${buttonColor} text-white font-bold rounded-lg transition duration-300 shadow-lg`}>
              {buttonText}
            </button>
          )}
          <button
            onClick={() => setPage("home")}
            className="w-full py-3 !bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition duration-300 shadow-md">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (hasTakenQuizToday) {
    return (
      <div className="!bg-white p-8 rounded-xl shadow-2xl max-w-2xl mx-auto text-center border-t-8 border-indigo-500">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          Daily Quiz Complete!
        </h2>
        <p className="text-xl text-gray-700 mb-6">
          You have already completed your daily check-in today.
        </p>
        <button
          onClick={() => setPage("home")}
          className="w-full py-3 !bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-300 shadow-lg">
          Go to Home / View Progress
        </button>
      </div>
    );
  }

  return (
    <div className="!bg-white p-8 rounded-xl shadow-2xl max-w-3xl mx-auto border-t-8 border-indigo-500">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Daily Stress Resilience Check-in
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Answer the following questions to assess how you currently experience
        and manage stress.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {quizQuestions.map((q, index) => (
          <QuizQuestionRenderer
            key={q.id}
            question={q}
            answer={answers[index]}
            setAnswer={(score) => updateAnswer(index, score)}
          />
        ))}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 !bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-300 shadow-lg shadow-indigo-500/50">
            Submit Check-in
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Progress Chart Component (Simple SVG/Div based Bar Chart)
 */
const ProgressChart = ({ history }) => {
  // Only display up to the last 14 entries for visual clarity
  const displayHistory = history.slice(-14);
  const maxScore = 10; // Normalized max score

  if (displayHistory.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Take a quiz to start tracking your progress!
      </p>
    );
  }

  return (
    <div className="!bg-white p-6 rounded-xl shadow-lg border-t-8 border-green-500">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <TrendingUp size={24} className="text-green-500 mr-2" /> Daily Progress
        Tracking (Score 0-10)
      </h3>
      {/* Chart container adjusted for better tooltip visibility */}
      <div className="flex items-end h-64 border-b border-l border-gray-300 pr-2 pt-6 overflow-x-auto pl-4 pb-4">
        {displayHistory.map((item, index) => {
          // Calculate bar height relative to the max normalized score (10)
          const heightPercent = (item.normalizedScore / maxScore) * 100;
          const dateLabel = item.date.substring(5); // Show MM-DD

          let barColor = "!bg-green-400";
          if (item.normalizedScore <= 7 && item.normalizedScore > 3)
            barColor = "!bg-yellow-400";
          if (item.normalizedScore <= 3) barColor = "!bg-red-500";

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end h-full mx-1 group min-w-[30px]">
              {/* Bar itself */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-6 rounded-t-md transition-all duration-500 ease-out ${barColor} relative shadow-md`}>
                <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 p-1 px-2 !bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Score: {item.normalizedScore} / 10
                  <br />
                  {item.recommendation}
                </span>
              </div>

              {/* Date Label */}
              <span className="text-xs text-gray-500 mt-1 rotate-45 transform origin-top-left -ml-2">
                {dateLabel}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>0 (High Need)</span>
        <span>10 (Low Need)</span>
      </div>
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>
          <span className="inline-block w-3 h-3 !bg-red-500 rounded-full mr-2"></span>{" "}
          Score 0-3: 1:1 Therapy Session (High Need)
        </p>
        <p>
          <span className="inline-block w-3 h-3 !bg-yellow-400 rounded-full mr-2"></span>{" "}
          Score 4-7: Group Session (Moderate Need)
        </p>
        <p>
          <span className="inline-block w-3 h-3 !bg-green-400 rounded-full mr-2"></span>{" "}
          Score 8-10: Self-Care Focus (Low Need)
        </p>
      </div>
    </div>
  );
};

/**
 * 1:1 Chat Session UI
 */
const OneOnOneChat = ({ setPage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, I'm Dr. Evelyn. Thank you for reaching out. What brings you to Inner Peace today?",
      sender: "Therapist",
    },
    {
      id: 2,
      text: "I've been feeling quite overwhelmed and stressed lately after taking the quiz.",
      sender: "User",
    },
    {
      id: 3,
      text: "I understand. Let's explore those feelings together. Remember, this is a safe space.",
      sender: "Therapist",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage = { id: Date.now(), text: input, sender: "User" };
    setMessages([...messages, newMessage]);
    setInput("");

    // Mock Therapist response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "That's a great start. Can you tell me more about when the stress usually peaks?",
        sender: "Therapist",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[70vh] !bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-red-500 max-w-4xl mx-auto">
      <header className="flex justify-between items-center p-4 !bg-red-500 text-white shadow-md">
        <h2 className="text-xl font-bold">1:1 Session with Dr. Evelyn</h2>
        <button
          onClick={() => setPage("home")}
          className="flex items-center text-sm opacity-90 hover:opacity-100 transition">
          <X size={20} className="mr-1" /> End Session
        </button>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto !bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "User" ? "justify-end" : "justify-start"
            }`}>
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                msg.sender === "User"
                  ? "!bg-indigo-500 text-white rounded-br-none"
                  : "!bg-white text-gray-800 rounded-tl-none border border-gray-200"
              }`}>
              <p className="font-medium text-sm mb-1">
                {msg.sender === "Therapist" ? "Dr. Evelyn" : "You"}
              </p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 !bg-gray-100 border-t border-gray-200">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-grow p-3 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="p-3 !bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition duration-300">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Group Session UI
 */
const GroupSession = ({ setPage }) => {
  const participants = [
    { name: "User (You)", color: "!bg-indigo-500", icon: "U" },
    { name: "Alex R.", color: "!bg-green-500", icon: "A" },
    { name: "Maria L.", color: "!bg-pink-500", icon: "M" },
    { name: "David T.", color: "!bg-yellow-500", icon: "D" },
    { name: "Sarah K.", color: "!bg-purple-500", icon: "S" },
    { name: "Omar Z.", color: "!bg-red-500", icon: "O" },
    { name: "Chloe P.", color: "!bg-teal-500", icon: "C" },
    { name: "Facilitator (Dr. J)", color: "!bg-gray-700", icon: "J" },
  ];

  return (
    <div className="!bg-white p-8 rounded-xl shadow-2xl border-t-8 border-yellow-500 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-3xl font-bold text-yellow-700">
          Group Session: Finding Clarity
        </h2>
        <button
          onClick={() => setPage("home")}
          className="flex items-center py-2 px-4 !bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition duration-300">
          <Home size={18} className="mr-2" /> Back to Home
        </button>
      </header>

      <p className="text-gray-600 mb-8">
        Welcome to the group. You are currently viewing the participants in the
        session. This is a live video call environment.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {participants.map((p, index) => (
          <div
            key={index}
            className="flex flex-col items-center !bg-gray-100 p-4 rounded-lg shadow-md transform hover:scale-[1.03] transition duration-300">
            {/* Avatar / Video Placeholder */}
            <div
              className={`w-24 h-24 ${
                p.color
              } rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg ring-4 ring-offset-2 ${
                p.name.includes("You") ? "ring-indigo-500" : "ring-gray-300"
              }`}>
              {p.icon}
            </div>
            <p className="text-lg font-semibold text-gray-800 text-center">
              {p.name}
            </p>
            {p.name.includes("You") && (
              <span className="text-xs text-indigo-600 font-medium">
                (Speaking)
              </span>
            )}
            {p.name.includes("Facilitator") && (
              <span className="text-xs text-gray-700 font-medium">(Host)</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t text-center">
        <button className="py-3 px-8 !bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition duration-300">
          Join Audio/Video Call
        </button>
      </div>
    </div>
  );
};

/**
 * Home Page Component
 */
const HomeDashboard = ({ setPage, quizHistory }) => {
  const today = getTodayDate();
  const todayResult = quizHistory.find((item) => item.date === today);

  const recommendation = todayResult
    ? todayResult.recommendation
    : "Take the quiz to get started!";

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <header className="!bg-indigo-500 p-6 rounded-xl shadow-xl text-white">
        <h1 className="text-4xl font-extrabold mb-1">Welcome back!</h1>
        <p className="text-xl opacity-90">
          Your daily check-in is the first step to a clearer mind.
        </p>
      </header>

      {/* Quick Actions & Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendation Card */}
        <div
          className={`p-6 rounded-xl shadow-lg border-l-8 ${
            todayResult ? "border-indigo-600" : "border-gray-400"
          } !bg-white lg:col-span-1`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
            <Sun size={24} className="text-yellow-500 mr-2" /> Daily
            Recommendation
          </h2>
          <p className="text-gray-600 mb-4">
            Based on your last quiz ({todayResult ? todayResult.date : "N/A"}):
          </p>
          <p className="text-3xl font-extrabold text-indigo-700">
            {recommendation}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            {recommendation.includes("1:1 Therapy") && (
              <button
                onClick={() => setPage("chat")}
                className="w-full py-2 !bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300">
                Start 1:1 Chat
              </button>
            )}
            {recommendation.includes("Group Session") && (
              <button
                onClick={() => setPage("group")}
                className="w-full py-2 !bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition duration-300">
                View Group Sessions
              </button>
            )}
            {recommendation === "Take the quiz to get started!" && (
              <button
                onClick={() => setPage("quiz")}
                className="w-full py-2 !bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300">
                Start Quiz
              </button>
            )}
            {recommendation.includes("Self-Care Focus") && (
              <p className="text-sm text-green-600 font-medium">
                Keep up the great work! Focus on your daily routine.
              </p>
            )}
          </div>
        </div>

        {/* Main Action Card (Quiz) */}
        <div className="!bg-white p-6 rounded-xl shadow-lg border-l-8 border-green-500 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Sun size={24} className="text-green-500 mr-2" /> Daily Check-in
          </h2>
          <p className="text-gray-600 mb-6">
            Track your emotional state with a quick, daily quiz.
          </p>
          <button
            onClick={() => setPage("quiz")}
            disabled={todayResult !== undefined}
            className={`w-full py-3 font-bold rounded-lg transition duration-300 shadow-md ${
              todayResult
                ? "!bg-gray-400 text-gray-700 cursor-not-allowed"
                : "!bg-green-600 hover:bg-green-700 text-white"
            }`}>
            {todayResult ? "Completed Today" : "Start Daily Quiz"}
          </button>
        </div>
      </div>

      {/* Progress Chart Section */}
      <ProgressChart history={quizHistory} />
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [currentPage, setCurrentPage] = useState(
    isLoggedIn ? "home" : "lander"
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quizHistory, setQuizHistory] = useState(initialQuizHistory);

  // Effect to handle navigation after successful login
  useEffect(() => {
    if (isLoggedIn) {
      setCurrentPage("home");
    }
  }, [isLoggedIn]);

  // Simple Page Renderer based on state
  const renderPage = () => {
    if (!isLoggedIn) {
      return <LanderPage setIsAuthModalOpen={setIsAuthModalOpen} />;
    }

    switch (currentPage) {
      case "home":
        return (
          <HomeDashboard setPage={setCurrentPage} quizHistory={quizHistory} />
        );
      case "quiz":
        return (
          <Quiz
            setPage={setCurrentPage}
            quizHistory={quizHistory}
            setQuizHistory={setQuizHistory}
          />
        );
      case "chat":
        return <OneOnOneChat setPage={setCurrentPage} />;
      case "group":
        return <GroupSession setPage={setCurrentPage} />;
      default:
        return (
          <HomeDashboard setPage={setCurrentPage} quizHistory={quizHistory} />
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setCurrentPage("lander");
  };

  return (
    <div className="min-h-screen !bg-gray-100 font-sans antialiased flex flex-col">
      {/* Navigation Bar */}
      <nav className="!bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            onClick={() => setCurrentPage(isLoggedIn ? "home" : "lander")}
            className="text-3xl font-extrabold text-indigo-600 cursor-pointer transition duration-300 hover:text-indigo-800">
            {APP_NAME}
          </h1>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setCurrentPage("home")}
                  className={`flex items-center text-gray-600 hover:text-indigo-600 transition p-2 rounded-lg ${
                    currentPage === "home" && "!bg-indigo-50 text-indigo-600"
                  }`}>
                  <Home size={20} className="mr-1 hidden sm:inline" />
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage("quiz")}
                  className={`flex items-center text-gray-600 hover:text-indigo-600 transition p-2 rounded-lg ${
                    currentPage === "quiz" && "!bg-indigo-50 text-indigo-600"
                  }`}>
                  <Sun size={20} className="mr-1 hidden sm:inline" />
                  Quiz
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white !bg-red-500 hover:bg-red-600 font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md">
                  <LogIn size={20} className="mr-2 hidden sm:inline" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center text-white !bg-indigo-600 hover:bg-indigo-700 font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md">
                <LogIn size={20} className="mr-2 hidden sm:inline" />
                Login / Register
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">{renderPage()}</main>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 !bg-gray-900 !bg-opacity-70 z-50 flex items-center justify-center p-4">
          <AuthModalContent
            setIsLoggedIn={setIsLoggedIn}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />
        </div>
      )}
    </div>
  );
};

export default App;
