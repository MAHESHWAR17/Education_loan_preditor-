import React, { useState, useEffect } from 'react';
import {
  Calculator, TrendingUp, DollarSign, FileCheck, Brain, PieChart, Home, Menu, X,
  User, Briefcase, Building, Upload, CheckCircle, XCircle, Clock, Eye, Download, Landmark, Pencil,
  ArrowUp, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, GraduationCap
} from 'lucide-react';

// --- Helper Component: Message Modal (Replaces alert()) ---
const MessageModal = ({ text, onClose }) => {
  if (!text) return null;
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md p-8 transition-all transform scale-100 bg-white shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="flex items-center text-2xl font-bold text-gray-800">
            <CheckCircle size={24} className="mr-2 text-blue-600" />
            Notification
          </h4>
          <button onClick={onClose} className="text-gray-400 transition hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="mb-6 leading-relaxed text-gray-700">{text}</p>
        <button 
          onClick={onClose} 
          className="w-full py-3 font-semibold text-white transition shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Got It
        </button>
      </div>
    </div>
  );
};

// --- Helper Component: Stepper ---
const Stepper = ({ step }) => {
  const steps = ['Personal Info', 'Course Info', 'Documents', 'Review'];
  return (
    <div className="flex justify-between max-w-4xl p-4 mx-auto mb-8 bg-white shadow-md rounded-xl">
      {steps.map((s, i) => (
        <div key={i} className="relative flex-1 text-center">
          {/* Connector Line */}
          {i > 0 && (
            <div className={`absolute top-4 left-0 w-1/2 h-0.5 transform -translate-x-full transition-colors duration-500 ${i <= step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          )}
          {i < steps.length - 1 && (
            <div className={`absolute top-4 right-0 w-1/2 h-0.5 transform translate-x-full transition-colors duration-500 ${i < step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          )}

          <div
            className={`w-10 h-10 mx-auto mb-2 rounded-full text-white flex items-center justify-center font-bold relative z-10 transition-all duration-500 ${
              i < step ? 'bg-green-600' : // Completed
              i === step ? 'bg-blue-600 shadow-lg scale-110' : // Active
              'bg-gray-400' // Inactive
            }`}
          >
            {i < step ? <CheckCircle size={20} /> : i + 1}
          </div>
          <span className={`text-sm font-medium transition-colors ${i <= step ? 'text-gray-800' : 'text-gray-500'}`}>{s}</span>
        </div>
      ))}
    </div>
  );
};

// --- Helper Component: InputField ---
const InputField = ({ label, type, value, onChange, placeholder, required = false, children, disabled = false }) => (
  <div className={type === 'select' ? 'col-span-1' : ''}>
    <label className="block mb-2 text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 transition-colors bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={disabled}
      >
        {children}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={disabled}
      />
    )}
  </div>
);

// --- Helper Component: DocumentUpload ---
const DocumentUpload = ({ label, file, onChange, required = false }) => (
  <div className="p-4 transition-colors border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500">
    <label className="block mb-2 text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      onChange={onChange}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {file && (
      <p className="flex items-center mt-2 text-sm text-green-600">
        <CheckCircle size={16} className="mr-1" /> {file}
      </p>
    )}
  </div>
);

// --- Helper Component: ApplicationCard (Used in Student Status Section) ---
const ApplicationCard = ({ app }) => {
  const statusClasses = {
    pending_manager: 'bg-yellow-100 text-yellow-800',
    approved_manager: 'bg-blue-100 text-blue-800',
    rejected_manager: 'bg-red-100 text-red-800',
    pending_bank: 'bg-yellow-100 text-yellow-800',
    approved_bank: 'bg-green-100 text-green-800',
    rejected_bank: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-4 transition-shadow border border-gray-200 rounded-xl hover:shadow-md">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <p className="text-xl font-bold text-gray-800">{app.id}</p>
          <p className="text-sm text-gray-600">Submitted: {app.submittedDate}</p>
          <p className="text-sm text-gray-600">
            {app.courseName} at {app.collegeName}
          </p>
        </div>
        <div className="mt-3 md:mt-0 md:text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${statusClasses[app.status]}`}>
            {app.status.replace('_', ' ').toUpperCase()}
          </span>
          {app.status.includes('approved_bank') && (
            <p className="mt-1 text-sm font-semibold text-green-600">
              Loan Amount: ₹{parseFloat(app.maxLoanAmount).toLocaleString('en-IN')}
            </p>
          )}
          {(app.managerComments || app.bankComments) && (
            <p className="mt-1 text-xs italic text-gray-500">
              Comments: {app.bankComments || app.managerComments}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Component: DashboardSummary (NEW) ---
const DashboardSummary = ({ applications }) => {
  // Filter and calculate totals based on application status
  const total = applications.length;
  const pending = applications.filter(a => a.status.includes('pending')).length;
  // Count applications that are approved by EITHER manager OR bank, but not rejected
  const approved = applications.filter(a => a.status.includes('approved')).length; 
  const rejected = applications.filter(a => a.status.includes('rejected')).length;
  
  // Calculate total loan amount for finally approved loans
  const totalLoan = applications
    .filter(a => a.status === 'approved_bank')
    .reduce((sum, a) => sum + (a.maxLoanAmount || 0), 0);

  const summaryItems = [
    { label: 'Total Applications', value: total, color: 'bg-blue-100 text-blue-800' },
    { label: 'Pending Review', value: pending, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Approved (All Stages)', value: approved, color: 'bg-green-100 text-green-800' },
    { label: 'Total Rejected', value: rejected, color: 'bg-red-100 text-red-800' },
    { 
      label: 'Loan Disbursed/Final', 
      value: `₹${totalLoan.toLocaleString('en-IN')}`, 
      color: 'bg-purple-100 text-purple-800' 
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-5">
      {summaryItems.map((item, idx) => (
        <div key={idx} className={`p-4 rounded-xl shadow text-center transition-transform hover:scale-[1.05] ${item.color}`}>
          <p className="text-sm font-semibold">{item.label}</p>
          <p className="mt-2 text-xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
};


const EducationLoanSystem = () => {
  const [userRole, setUserRole] = useState(null); // 'student', 'manager', 'bank'
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Custom Message Modal State and Handlers
  const [message, setMessage] = useState(null);
  const showMessage = (text) => setMessage(text);
  const closeMessage = () => setMessage(null);

  // Mock banks for assignment
  const MOCK_BANKS = [
    "State Bank of Unity",
    "Republic Financial",
    "Axis Global Bank",
    "HDFC Trust",
    "ICICI Capital Group",
    "Kotak Premier Bank",
  ];

  // Applications Database (simulated)
  const [applications, setApplications] = useState([
    {
      id: 'APP001',
      studentName: 'Rahul Kumar',
      email: 'rahul@email.com',
      phone: '9988776655',
      income: '600000',
      creditScore: '750',
      courseType: 'Postgraduate',
      courseFees: '1200000',
      academicScore: '88',
      existingDebt: '0',
      collegeName: 'IIT Madras',
      courseName: 'M.Tech AI',
      documents: {
        identityProof: 'aadhar_rahul.pdf',
        incomeProof: 'salary_slip.pdf',
        academicRecords: 'marksheet.pdf',
        admissionLetter: 'admission_iit.pdf'
      },
      status: 'pending_manager', // pending_manager, approved_manager, rejected_manager, pending_bank, approved_bank, rejected_bank
      managerComments: '',
      bankComments: '',
      submittedDate: '2025-10-01',
      eligibilityScore: 85,
      maxLoanAmount: 1200000,
      assignedBank: '', // Added assignedBank field
    },
    {
      id: 'APP002',
      studentName: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '9911223344',
      income: '450000',
      creditScore: '680',
      courseType: 'Undergraduate',
      courseFees: '800000',
      academicScore: '75',
      existingDebt: '100000',
      collegeName: 'Pune University',
      courseName: 'B.Com Accounting',
      documents: {
        identityProof: 'aadhar_priya.pdf',
        incomeProof: 'income_cert.pdf',
        academicRecords: 'class12_marks.pdf',
        admissionLetter: 'admission_letter.pdf'
      },
      status: 'approved_manager',
      managerComments: 'Good academic record, moderate credit score. Recommended for approval with a lower maximum limit.',
      bankComments: '',
      submittedDate: '2025-10-03',
      eligibilityScore: 62,
      maxLoanAmount: 700000, // Reduced from original 800000 based on internal calculation/manager
      assignedBank: '', // Added assignedBank field
    }
  ]);

  // Student Form State (Centralized)
  const [studentForm, setStudentForm] = useState({
    studentName: '',
    email: '',
    phone: '',
    income: '',
    creditScore: '',
    courseType: 'undergraduate',
    courseFees: '',
    academicScore: '',
    existingDebt: '',
    collegeName: '',
    courseName: ''
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    identityProof: null,
    incomeProof: null,
    academicRecords: null,
    admissionLetter: null
  });

  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fix for Hooks Error: Hoisted state for Student Application Steps
  const [studentStep, setStudentStep] = useState(0); 

  // Calculate Eligibility Score
  const calculateEligibility = (formData) => {
    const { income, creditScore, courseFees, academicScore, existingDebt } = formData;

    const incomeNum = parseFloat(income || 0);
    const creditNum = parseInt(creditScore || 0);
    const feesNum = parseFloat(courseFees || 0);
    const scoreNum = parseFloat(academicScore || 0);
    const debtNum = parseFloat(existingDebt || 0);

    let eligibilityScore = 0;

    // Credit Score (max 40)
    if (creditNum >= 750) eligibilityScore += 40;
    else if (creditNum >= 700) eligibilityScore += 30;
    else if (creditNum >= 650) eligibilityScore += 20;
    else if (creditNum >= 600) eligibilityScore += 10;
    else eligibilityScore += 5;

    // Income to Fees Ratio (max 30)
    const incomeToFeesRatio = incomeNum / feesNum;
    if (incomeToFeesRatio >= 2) eligibilityScore += 30;
    else if (incomeToFeesRatio >= 1.5) eligibilityScore += 20;
    else if (incomeToFeesRatio >= 1) eligibilityScore += 10;
    else eligibilityScore += 5;

    // Academic Score (max 20)
    if (scoreNum >= 85) eligibilityScore += 20;
    else if (scoreNum >= 75) eligibilityScore += 15;
    else if (scoreNum >= 65) eligibilityScore += 10;
    else eligibilityScore += 5;

    // Existing Debt (max 10)
    if (debtNum === 0) eligibilityScore += 10;
    else if (debtNum < incomeNum * 0.3) eligibilityScore += 7;
    else eligibilityScore += 3;

    // Cap the score at 100
    eligibilityScore = Math.min(100, eligibilityScore);

    // Max Loan Amount calculation (e.g., Min of Course Fees or 4x Income)
    const maxLoanAmount = Math.min(feesNum, incomeNum * 4, (eligibilityScore / 100) * feesNum * 1.2);

    return { eligibilityScore: Math.round(eligibilityScore), maxLoanAmount: Math.round(maxLoanAmount) };
  };

  // Submit Student Application (Centralized)
  const submitApplication = () => {
    // Note: Step 3 validation is done in renderStudentDashboard before calling this.
    
    const { eligibilityScore, maxLoanAmount } = calculateEligibility(studentForm);

    const newApplication = {
      id: `APP${String(applications.length + 1).padStart(3, '0')}`,
      ...studentForm,
      documents: { ...uploadedDocs },
      status: 'pending_manager',
      managerComments: '',
      bankComments: '',
      submittedDate: new Date().toISOString().split('T')[0],
      eligibilityScore,
      maxLoanAmount,
      assignedBank: '', // New application starts with an empty assigned bank
    };

    setApplications([...applications, newApplication]);
    showMessage(`Application submitted successfully! Application ID: ${newApplication.id}. You can track your status below.`);

    // Reset form
    setStudentForm({
      studentName: '',
      email: '',
      phone: '',
      income: '',
      creditScore: '',
      courseType: 'undergraduate',
      courseFees: '',
      academicScore: '',
      existingDebt: '',
      collegeName: '',
      courseName: ''
    });
    setUploadedDocs({
      identityProof: null,
      incomeProof: null,
      academicRecords: null,
      admissionLetter: null
    });
  };

  // Manager Actions (Centralized)
  const handleManagerAction = (appId, action, comments) => {
    setApplications(applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: action === 'approve' ? 'approved_manager' : 'rejected_manager',
          managerComments: comments,
          // 'approved_manager' status indicates it is ready for bank review.
        };
      }
      return app;
    }));
    setSelectedApplication(null);
    showMessage(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully and sent for Bank review (if approved).`);
  };

  // Bank Actions (Centralized)
  const handleBankAction = (appId, action, comments) => {
    setApplications(applications.map(app => {
      if (app.id === appId) {
        let update = {
          ...app,
          bankComments: comments
        };

        if (action === 'approve') {
          const assignedBank = MOCK_BANKS[Math.floor(Math.random() * MOCK_BANKS.length)];
          update.status = 'approved_bank';
          update.assignedBank = assignedBank; // Assign bank on approval
        } else {
          update.status = 'rejected_bank';
        }

        return update;
      }
      return app;
    }));
    setSelectedApplication(null);
    showMessage(`Loan ${action === 'approve' ? 'approved' : 'rejected'} successfully! Student will be notified.`);
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ..................................
  // Role Selection Screen (Kept for continuity)
  // ..................................

  const renderRoleSelection = () => {
    const banks = [
      "https://i.pinimg.com/736x/19/f3/b0/19f3b057b30a904266f57a130cae0f0f.jpg",
      "https://i.pinimg.com/1200x/c1/ef/2e/c1ef2e91b95eac43bc00afbd580d23a3.jpg",
      "https://i.pinimg.com/1200x/a1/4e/3f/a14e3fb21b8be6b320f7aa5699086fa2.jpg",
      "https://i.pinimg.com/736x/10/bd/4d/10bd4d10ae67ef1e8df12568f2e5e058.jpg",
      "https://i.pinimg.com/736x/99/c2/11/99c211dce89cb5930791b692a9a880ca.jpg",
      "https://i.pinimg.com/1200x/56/f9/07/56f907a2edf527b7ab25b08d6a57d3f8.jpg",
      "https://i.pinimg.com/1200x/0c/13/07/0c13072f1067b67f2dfa9e50ae66bc67.jpg",
    ];

    const steps = [
      {
        title: "Apply Online",
        description: "Fill in your student details and upload required documents quickly and easily.",
        iconBg: "bg-blue-500",
        icon: <Pencil className="w-10 h-10 text-white" />,
      },
      {
        title: "Manager Review",
        description: "Your application will be reviewed and verified by our managers for eligibility.",
        iconBg: "bg-purple-500",
        icon: <CheckCircle className="w-10 h-10 text-white" />,
      },
      {
        title: "Bank Approval",
        description: "Once approved by the bank, the funds are processed and transferred to your account.",
        iconBg: "bg-green-500",
        icon: <Landmark className="w-10 h-10 text-white" />,
      },
    ];

    return (
      <>
        {/* Role Selection Section */}
        <div
          className="relative flex items-center justify-center min-h-screen p-4 bg-center bg-cover"
          style={{ backgroundImage: "url('https://i.pinimg.com/736x/9d/a3/aa/9da3aad4357c549e9a3449e667afd7f9.jpg')" }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/70 to-pink-500/70"></div>

          {/* Logo - Top Left */}
          <div className="absolute z-50 cursor-pointer top-6 left-6" onClick={scrollToTop}>
            <div className="flex items-center px-4 py-2 space-x-3 bg-white shadow-lg rounded-xl">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">EduLoan</h1>
                <p className="text-xs text-gray-500">Education First</p>
              </div>
            </div>
          </div>


          {/* Content */}
          <div className="relative text-center">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl animate-pulse">
              Education Loan Portal
            </h1>
            <p className="mb-12 text-xl text-white opacity-90">Select Your Role to Continue</p>

            <div className="grid max-w-4xl gap-6 mx-auto md:grid-cols-3">
              {/* Student Card */}
              <div
                onClick={() => setUserRole('student')}
                className="p-8 transition-all bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-[1.03] hover:shadow-indigo-500/50"
              >
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-br from-blue-400 to-blue-600">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">Student</h3>
                <p className="text-gray-600">Apply for education loan</p>
              </div>

              {/* Manager Card */}
              <div
                onClick={() => setUserRole('manager')}
                className="p-8 transition-all bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-[1.03] hover:shadow-purple-500/50"
              >
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-br from-purple-400 to-purple-600">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">Manager</h3>
                <p className="text-gray-600">Review & approve applications</p>
              </div>

              {/* Bank Card */}
              <div
                onClick={() => setUserRole('bank')}
                className="p-8 transition-all bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-[1.03] hover:shadow-green-500/50"
              >
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-br from-green-400 to-green-600">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">Bank</h3>
                <p className="text-gray-600">Final loan approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Banks Auto-Scroll Section */}
        <section className="relative w-full py-12 overflow-hidden bg-gray-100">
          <h2 className="mb-8 text-3xl font-bold text-center md:text-4xl">Our Partner Banks</h2>
          <p className="mb-6 text-lg text-center text-gray-600">
            We collaborate with India’s top banks to make your education dreams a reality.
          </p>

          {/* NOTE: Tailwind JIT animation utility for 'animate-marquee' is assumed for this demo */}
          <style jsx="true">
            {`
              .animate-marquee {
                display: flex;
                width: 200%; /* Double the width to ensure seamless loop */
                animation: marquee 30s linear infinite;
              }
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}
          </style>

          <div className="flex space-x-12 animate-marquee">
            {banks.concat(banks).map((bank, index) => (
              <div key={index} className="flex items-center justify-center flex-shrink-0 w-40 h-20">
                <img src={bank} alt={`Bank ${index}`} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x80/cccccc/333333?text=Bank+Logo"; }} className="object-contain h-full" />
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-16 bg-white">
          <div className="max-w-6xl mx-auto mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">How It Works</h2>
            <p className="text-lg text-gray-600">A simple 3-step process to get your education loan approved.</p>
          </div>

          <div className="grid max-w-6xl gap-8 px-4 mx-auto md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300 bg-white relative text-left border-t-4 border-indigo-500"
              >
                {/* Step Number */}
                <span className="absolute text-5xl font-extrabold leading-none text-gray-200 opacity-75 top-4 right-4">
                  {`0${index + 1}`}
                </span>

                {/* Icon */}
                <div className={`w-16 h-16 flex items-center justify-center rounded-xl mb-4 ${step.iconBg} shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="max-w-6xl px-6 mx-auto text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">
              What Our Students Say
            </h2>
            <p className="mb-12 text-lg text-gray-600">
              Real success stories from students who achieved their dreams through our Education Loan Portal.
            </p>

            {/* Testimonial Cards */}
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {/* Testimonial 1 */}
              <div className="p-8 transition-transform duration-300 bg-white shadow-xl rounded-2xl hover:scale-105">
                <img
                  src="https://placehold.co/96x96/4f46e5/ffffff?text=A.S."
                  alt="Aditi Sharma"
                  className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-indigo-500 rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/4f46e5/ffffff?text=A.S."; }}
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Aditi Sharma</h3>
                <p className="mb-4 text-sm text-gray-500">MBA Student, Delhi University</p>
                <p className="italic text-gray-600">
                  “The process was smooth and fast! Within a week, my education loan got approved. Highly recommend this platform to all students.”
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="p-8 transition-transform duration-300 bg-white shadow-xl rounded-2xl hover:scale-105">
                <img
                  src="https://placehold.co/96x96/8b5cf6/ffffff?text=R.V."
                  alt="Rohan Verma"
                  className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-purple-500 rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/8b5cf6/ffffff?text=R.V."; }}
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Rohan Verma</h3>
                <p className="mb-4 text-sm text-gray-500">Engineering Student, IIT Bombay</p>
                <p className="italic text-gray-600">
                  “Thanks to this portal, I could focus on my studies instead of worrying about finances. The best experience ever!”
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="p-8 transition-transform duration-300 bg-white shadow-xl rounded-2xl hover:scale-105">
                <img
                  src="https://placehold.co/96x96/ec4899/ffffff?text=P.N."
                  alt="Priya Nair"
                  className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-pink-500 rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/ec4899/ffffff?text=P.N."; }}
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Priya Nair</h3>
                <p className="mb-4 text-sm text-gray-500">Medical Student, AIIMS</p>
                <p className="italic text-gray-600">
                  “The support team was very helpful. My documents were verified quickly and I got my funds without any hassle.”
                </p>
              </div>

              {/* Testimonial 4 */}
              <div className="p-8 transition-transform duration-300 bg-white shadow-xl rounded-2xl hover:scale-105">
                <img
                  src="https://placehold.co/96x96/3b82f6/ffffff?text=A.P."
                  alt="Arjun Patel"
                  className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-blue-500 rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/3b82f6/ffffff?text=A.P."; }}
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Arjun Patel</h3>
                <p className="mb-4 text-sm text-gray-500">Law Student, NALSAR University</p>
                <p className="italic text-gray-600">
                  “I never thought getting a student loan could be this easy. The platform guided me at every step with clear instructions.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="w-full py-12 text-white bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="max-w-6xl px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-4">
              {/* Company Info */}
              <div>
                <h3 className="mb-4 text-2xl font-bold">EduLoan Portal</h3>
                <p className="mb-4 text-gray-300">
                  Making education accessible for every student through seamless loan processing.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="transition-colors hover:text-indigo-300">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="transition-colors hover:text-indigo-300">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="transition-colors hover:text-indigo-300">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="transition-colors hover:text-indigo-300">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">How It Works</a></li>
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">Partner Banks</a></li>
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">FAQs</a></li>
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">Blog</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="mb-4 text-lg font-semibold">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">Terms & Conditions</a></li>
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 transition-colors hover:text-white">Contact Us</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="mb-4 text-lg font-semibold">Contact Us</h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <MapPin className="flex-shrink-0 w-5 h-5 mt-1" />
                    <span className="text-gray-300">123 Education Street, Bangaluru, Karnataka 560001</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone className="flex-shrink-0 w-5 h-5" />
                    <span className="text-gray-300">+91 98765 43210</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="flex-shrink-0 w-5 h-5" />
                    <span className="text-gray-300">support@eduloan.com</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 mt-8 text-center border-t border-gray-700">
              <p className="text-gray-400">
                © 2025 Education Loan Portal. Bridging Education and Opportunities ❤️.
              </p>
            </div>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed z-50 flex items-center justify-center w-12 h-12 text-white transition-all duration-300 transform bg-indigo-600 rounded-full shadow-2xl bottom-8 right-8 hover:bg-indigo-700 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </>
    );
  };


  // Student Dashboard (Refactored to use Stepper and Components)
  const renderStudentDashboard = () => {
    // Hoisted state variables from parent scope
    const step = studentStep;
    const setStep = setStudentStep;
    const studentApplications = applications.filter(app => app.email === studentForm.email);

    // Fields required for each step
    const stepValidation = {
      0: ['studentName', 'email', 'phone', 'income', 'creditScore'],
      1: ['collegeName', 'courseName', 'courseFees', 'academicScore'],
      2: ['identityProof', 'incomeProof', 'academicRecords', 'admissionLetter']
    };

    const validateStep = (currentStep) => {
      const requiredFields = stepValidation[currentStep];
      let missing = [];

      if (currentStep < 2) {
        missing = requiredFields.filter(field => !studentForm[field]);
      } else if (currentStep === 2) {
        missing = requiredFields.filter(field => !uploadedDocs[field]);
      }

      if (missing.length > 0) {
        showMessage(`Please complete all required fields/documents before proceeding. Missing: ${missing.map(f => f.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}`);
        return false;
      }
      return true;
    };

    const handleNext = () => {
      if (validateStep(step)) {
        setStep((prev) => Math.min(prev + 1, 3));
      }
    };

    const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));

    const handleSubmit = () => {
      // Final check (which calls the parent submitApplication logic)
      if (validateStep(2)) { // Only final required fields check before submission
        submitApplication();
        setStep(0); // Reset step after successful submission
      }
    };

    // Calculate preliminary eligibility for review step
    const { eligibilityScore, maxLoanAmount } = calculateEligibility(studentForm);


    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="flex items-center text-4xl font-bold text-gray-800">
              <User className="inline mr-3 text-blue-600" />
              Student Application Portal
            </h2>
            <button
              onClick={() => setUserRole(null)}
              className="px-4 py-2 text-white transition-colors bg-red-500 rounded-lg shadow-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          
          {/* Dashboard Summary - NEW ADDITION */}
          <DashboardSummary applications={studentApplications} />

          <Stepper step={step} />

          <div className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
            {/* Step 0: Personal Info */}
            {step === 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <h3 className="pb-2 mb-4 text-2xl font-bold text-gray-800 border-b col-span-full">Step 1: Personal and Financial Details</h3>
                <InputField
                  label="Full Name" type="text" required
                  value={studentForm.studentName}
                  onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
                  placeholder="John Doe"
                />
                <InputField
                  label="Email Address" type="email" required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="john@email.com"
                />
                <InputField
                  label="Phone Number" type="tel" required
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  placeholder="9876543210"
                />
                <InputField
                  label="Annual Family Income (₹)" type="number" required
                  value={studentForm.income}
                  onChange={(e) => setStudentForm({ ...studentForm, income: e.target.value })}
                  placeholder="500000"
                />
                <InputField
                  label="Credit Score" type="number" required
                  value={studentForm.creditScore}
                  onChange={(e) => setStudentForm({ ...studentForm, creditScore: e.target.value })}
                  placeholder="750"
                />
                <InputField
                  label="Existing Debt (₹)" type="number"
                  value={studentForm.existingDebt}
                  onChange={(e) => setStudentForm({ ...studentForm, existingDebt: e.target.value })}
                  placeholder="0"
                />
              </div>
            )}

            {/* Step 1: Course Info */}
            {step === 1 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <h3 className="pb-2 mb-4 text-2xl font-bold text-gray-800 border-b col-span-full">Step 2: Course Information</h3>
                <InputField
                  label="College/University Name" type="text" required
                  value={studentForm.collegeName}
                  onChange={(e) => setStudentForm({ ...studentForm, collegeName: e.target.value })}
                  placeholder="IIT Delhi"
                />
                <InputField
                  label="Course Name" type="text" required
                  value={studentForm.courseName}
                  onChange={(e) => setStudentForm({ ...studentForm, courseName: e.target.value })}
                  placeholder="B.Tech Computer Science"
                />
                <InputField
                  label="Course Type" type="select" required
                  value={studentForm.courseType}
                  onChange={(e) => setStudentForm({ ...studentForm, courseType: e.target.value })}
                >
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="doctorate">Doctorate</option>
                </InputField>
                <InputField
                  label="Total Course Fees (₹)" type="number" required
                  value={studentForm.courseFees}
                  onChange={(e) => setStudentForm({ ...studentForm, courseFees: e.target.value })}
                  placeholder="1000000"
                />
                <InputField
                  label="Academic Score (%)" type="number" required
                  value={studentForm.academicScore}
                  onChange={(e) => setStudentForm({ ...studentForm, academicScore: e.target.value })}
                  placeholder="85"
                />
              </div>
            )}

            {/* Step 2: Document Upload */}
            {step === 2 && (
              <div className="grid gap-6 md:grid-cols-2">
                <h3 className="pb-2 mb-4 text-2xl font-bold text-gray-800 border-b col-span-full">Step 3: Document Upload (Required)</h3>
                <DocumentUpload
                  label="Identity Proof (Aadhar/Passport)" required
                  file={uploadedDocs.identityProof}
                  onChange={(e) => setUploadedDocs({ ...uploadedDocs, identityProof: e.target.files[0]?.name })}
                />
                <DocumentUpload
                  label="Income Proof (Salary Slip/ITR)" required
                  file={uploadedDocs.incomeProof}
                  onChange={(e) => setUploadedDocs({ ...uploadedDocs, incomeProof: e.target.files[0]?.name })}
                />
                <DocumentUpload
                  label="Academic Records (Marksheet)" required
                  file={uploadedDocs.academicRecords}
                  onChange={(e) => setUploadedDocs({ ...uploadedDocs, academicRecords: e.target.files[0]?.name })}
                />
                <DocumentUpload
                  label="Admission Letter" required
                  file={uploadedDocs.admissionLetter}
                  onChange={(e) => setUploadedDocs({ ...uploadedDocs, admissionLetter: e.target.files[0]?.name })}
                />
              </div>
            )}

            {/* Step 3: Review and Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="pb-2 text-2xl font-bold text-gray-800 border-b">Step 4: Review and Submit</h3>

                <div className="p-6 border-l-4 border-blue-600 rounded-lg bg-blue-50">
                  <h4 className="mb-2 text-lg font-bold text-blue-800">Preliminary Eligibility Assessment</h4>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">AI Eligibility Score:</span>
                    <span className="text-xl font-bold text-purple-600">{eligibilityScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Max Recommended Loan:</span>
                    <span className="text-xl font-bold text-green-700">₹ {maxLoanAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Personal Info Review */}
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="mb-2 font-semibold text-gray-800">Personal Details</h4>
                    <p className="text-sm"><span className="font-medium">Name:</span> {studentForm.studentName}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {studentForm.email}</p>
                    <p className="text-sm"><span className="font-medium">Income:</span> ₹ {parseFloat(studentForm.income).toLocaleString('en-IN')}</p>
                    <p className="text-sm"><span className="font-medium">Credit Score:</span> {studentForm.creditScore}</p>
                  </div>
                  {/* Course Info Review */}
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="mb-2 font-semibold text-gray-800">Course Details</h4>
                    <p className="text-sm"><span className="font-medium">College:</span> {studentForm.collegeName}</p>
                    <p className="text-sm"><span className="font-medium">Course:</span> {studentForm.courseName}</p>
                    <p className="text-sm"><span className="font-medium">Fees:</span> ₹ {parseFloat(studentForm.courseFees).toLocaleString('en-IN')}</p>
                    <p className="text-sm"><span className="font-medium">Academic Score:</span> {studentForm.academicScore}%</p>
                  </div>
                </div>

                {/* Documents Summary */}
                <div className="p-4 bg-gray-100 border rounded-lg">
                  <h4 className="mb-2 font-semibold text-gray-800">Uploaded Documents</h4>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(uploadedDocs).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-600" />
                        <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 mt-8 border-t">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className="px-6 py-3 font-semibold text-white transition-colors bg-gray-400 rounded-lg hover:bg-gray-500 disabled:opacity-50"
              >
                <ArrowUp size={16} className="inline mr-2 rotate-270" />
                Previous
              </button>
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Next Step
                  <ArrowUp size={16} className="inline ml-2 rotate-90" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
                >
                  <FileCheck size={18} className="inline mr-2" />
                  Final Submit Application
                </button>
              )}
            </div>
          </div>

          {/* Applications Status */}
          <div className="p-8 bg-white shadow-xl rounded-2xl">
            <h3 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b">My Applications Status</h3>
            {studentApplications.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No applications submitted yet. Complete the form above!</p>
            ) : (
              <div className="space-y-4">
                {studentApplications.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Manager Dashboard (Kept for continuity)
  const renderManagerDashboard = () => {
    const pendingApps = applications.filter(app => app.status === 'pending_manager');
    const reviewedApps = applications.filter(app => app.status === 'approved_manager' || app.status === 'rejected_manager');

    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-800">
              <Briefcase className="inline mr-3 text-purple-600" />
              Manager Dashboard
            </h2>
            <button
              onClick={() => setUserRole(null)}
              className="px-4 py-2 text-white transition-colors bg-red-500 rounded-lg shadow-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 mb-8 md:grid-cols-4">
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-purple-600">{applications.length}</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingApps.length}</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Approved (Sent to Bank)</p>
              <p className="text-3xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'approved_manager').length}
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Final Rejected (by Manager)</p>
              <p className="text-3xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected_manager').length}
              </p>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
            <h3 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b">
              <Clock className="inline mr-2" />
              Pending Applications for Manager Review
            </h3>

            {pendingApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No new applications pending for review.</p>
            ) : (
              <div className="space-y-4">
                {pendingApps.map(app => (
                  <div key={app.id} className="p-6 transition border-2 border-gray-200 shadow-sm rounded-xl hover:border-purple-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{app.studentName}</h4>
                        <p className="text-sm text-gray-600">Application ID: {app.id} | Submitted: {app.submittedDate}</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full shadow-sm">
                        Pending Manager Review
                      </span>
                    </div>

                    <div className="grid gap-4 mb-4 md:grid-cols-3">
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600">Course & College</p>
                        <p className="font-semibold">{app.courseName}</p>
                        <p className="text-sm text-gray-600">{app.collegeName}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600">Requested Loan</p>
                        <p className="text-lg font-semibold text-purple-600">₹ {parseFloat(app.courseFees).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600">AI Score</p>
                        <p className="text-lg font-semibold text-green-600">{app.eligibilityScore}/100</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="flex items-center justify-center w-full py-2 mt-2 text-white transition bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
                    >
                      <Eye className="mr-2" size={18} />
                      Review Application
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviewed Applications */}
          <div className="p-8 bg-white shadow-xl rounded-2xl">
            <h3 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b">Reviewed Applications</h3>

            {reviewedApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No applications have been reviewed yet.</p>
            ) : (
              <div className="space-y-4">
                {reviewedApps.map(app => (
                  <div key={app.id} className="p-4 border rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{app.studentName} ({app.id})</p>
                        <p className="text-sm text-gray-600">Submitted: {app.submittedDate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                        app.status === 'approved_manager' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {app.status === 'approved_manager' ? 'Forwarded to Bank' : 'Rejected by Manager'}
                      </span>
                    </div>
                    {app.managerComments && (
                      <p className="p-2 mt-2 text-sm text-gray-700 bg-white border-l-4 border-purple-400 rounded-lg">
                        **Manager Comments:** {app.managerComments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b rounded-t-2xl">
                <h3 className="text-2xl font-bold">Review Application - {selectedApplication.id}</h3>
                <button onClick={() => setSelectedApplication(null)} className="text-gray-500 transition hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-blue-50">
                    <h4 className="mb-3 text-xl font-bold text-blue-800">Student Profile</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Name:</span> {selectedApplication.studentName}</p>
                      <p><span className="font-semibold">Email:</span> {selectedApplication.email}</p>
                      <p><span className="font-semibold">Credit Score:</span> <span className="font-bold text-blue-600">{selectedApplication.creditScore}</span></p>
                      <p><span className="font-semibold">Income:</span> ₹ {parseFloat(selectedApplication.income).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-purple-500 rounded-lg bg-purple-50">
                    <h4 className="mb-3 text-xl font-bold text-purple-800">Course & Loan</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">College:</span> {selectedApplication.collegeName}</p>
                      <p><span className="font-semibold">Course:</span> {selectedApplication.courseName}</p>
                      <p><span className="font-semibold">Fees:</span> ₹ {parseFloat(selectedApplication.courseFees).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Academic Score:</span> <span className="font-bold text-purple-600">{selectedApplication.academicScore}%</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 mb-6 border border-yellow-300 rounded-lg bg-yellow-50">
                  <h4 className="flex items-center mb-3 text-lg font-bold text-yellow-800"><Brain size={20} className="mr-2" /> AI Assessment & Limit</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span>Eligibility Score:</span>
                    <span className="text-3xl font-bold text-purple-600">{selectedApplication.eligibilityScore}/100</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div
                      className="h-3 bg-purple-600 rounded-full"
                      style={{ width: `${selectedApplication.eligibilityScore}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-green-700">
                    <DollarSign size={18} className="inline mr-1" /> Max Recommended Loan: ₹ {parseFloat(selectedApplication.maxLoanAmount).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-bold">Uploaded Documents</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedApplication.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 transition bg-gray-100 border rounded-lg hover:bg-gray-200">
                        <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Download size={16} className="text-blue-600 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="managerComments" className="block mb-2 text-lg font-bold">Manager Comments</label>
                  <textarea
                    className="w-full p-3 transition-colors border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    rows="3"
                    placeholder="Enter your comments here..."
                    id="managerComments"
                    defaultValue={selectedApplication.managerComments}
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const comments = document.getElementById('managerComments').value;
                      handleManagerAction(selectedApplication.id, 'approve', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-green-600 shadow-md rounded-xl hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2" />
                    Approve & Forward to Bank
                  </button>
                  <button
                    onClick={() => {
                      const comments = document.getElementById('managerComments').value;
                      handleManagerAction(selectedApplication.id, 'reject', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-red-600 shadow-md rounded-xl hover:bg-red-700"
                  >
                    <XCircle className="mr-2" />
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Bank Dashboard (Kept for continuity)
  const renderBankDashboard = () => {
    const bankPendingApps = applications.filter(app => app.status === 'approved_manager');
    const bankReviewedApps = applications.filter(app => app.status === 'approved_bank' || app.status === 'rejected_bank');

    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-800">
              <Landmark className="inline mr-3 text-green-600" />
              Bank Dashboard
            </h2>
            <button
              onClick={() => setUserRole(null)}
              className="px-4 py-2 text-white transition-colors bg-red-500 rounded-lg shadow-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 mb-8 md:grid-cols-4">
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Total Applications Processed</p>
              <p className="text-3xl font-bold text-blue-600">
                {applications.filter(app => app.status.includes('bank')).length}
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Pending Final Review</p>
              <p className="text-3xl font-bold text-yellow-600">{bankPendingApps.length}</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Loans Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved_bank').length}
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
              <p className="text-sm text-gray-600">Total Disbursed (simulated)</p>
              <p className="text-2xl font-bold text-indigo-600">
                ₹ {applications
                  .filter(app => app.status === 'approved_bank')
                  .reduce((sum, app) => sum + parseFloat(app.maxLoanAmount), 0)
                  .toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Pending Applications for Bank */}
          <div className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
            <h3 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b">
              <Clock className="inline mr-2" />
              Applications for Final Review
            </h3>

            {bankPendingApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No applications pending for final bank review.</p>
            ) : (
              <div className="space-y-4">
                {bankPendingApps.map(app => (
                  <div key={app.id} className="p-6 transition border-2 border-gray-200 shadow-sm rounded-xl hover:border-green-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{app.studentName}</h4>
                        <p className="text-sm text-gray-600">Application ID: {app.id} | Course: {app.courseName}</p>
                      </div>
                      <div className="text-right">
                        <span className="block px-3 py-1 mb-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full shadow-sm">
                          Manager Approved
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 mb-4 md:grid-cols-4">
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600">Credit Score</p>
                        <p className="text-lg font-semibold">{app.creditScore}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600">Max Loan</p>
                        <p className="text-lg font-semibold text-green-600">₹ {parseFloat(app.maxLoanAmount).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600">Income</p>
                        <p className="font-semibold">₹ {parseFloat(app.income).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600">AI Score</p>
                        <p className="text-lg font-semibold text-blue-600">{app.eligibilityScore}/100</p>
                      </div>
                    </div>

                    {app.managerComments && (
                      <div className="p-3 mb-4 border-l-4 border-purple-400 rounded-lg bg-purple-50">
                        <p className="mb-1 text-xs font-semibold text-gray-700">Manager Comments:</p>
                        <p className="text-sm italic">{app.managerComments}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="flex items-center justify-center w-full py-2 mt-2 text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700"
                    >
                      <Eye className="mr-2" size={18} />
                      Review & Process Loan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Processed Loans */}
          <div className="p-8 bg-white shadow-xl rounded-2xl">
            <h3 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b">Processed Loans (Final Decision)</h3>

            {bankReviewedApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No loans have been processed by the bank yet.</p>
            ) : (
              <div className="space-y-4">
                {bankReviewedApps.map(app => (
                  <div key={app.id} className="p-4 border rounded-xl bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-bold">{app.studentName} ({app.id})</p>
                        <p className="text-sm text-gray-600">{app.collegeName}</p>
                        
                        {/* New Bank Assignment Display */}
                        {app.status === 'approved_bank' && app.assignedBank && (
                          <p className="flex items-center mt-1 text-sm font-semibold text-green-700">
                            <Building size={16} className="mr-1" /> **Bank:** {app.assignedBank}
                          </p>
                        )}
                        
                        <p className="mt-1 text-sm font-semibold text-indigo-600">Disbursed Amount: ₹ {parseFloat(app.maxLoanAmount).toLocaleString('en-IN')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                        app.status === 'approved_bank' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {app.status === 'approved_bank' ? 'Loan Disbursed' : 'Loan Rejected'}
                      </span>
                    </div>
                    {app.bankComments && (
                      <p className="p-2 mt-2 text-sm text-gray-700 bg-white border-l-4 border-green-400 rounded-lg">
                        **Bank Terms/Notes:** {app.bankComments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bank Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b rounded-t-2xl">
                <h3 className="text-2xl font-bold">Loan Review - {selectedApplication.id}</h3>
                <button onClick={() => setSelectedApplication(null)} className="text-gray-500 transition hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div className="p-4 border-l-4 border-green-500 rounded-lg bg-green-50">
                    <h4 className="mb-3 text-xl font-bold text-green-800">Financial Profile</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Annual Income:</span> ₹ {parseFloat(selectedApplication.income).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Credit Score:</span> <span className="font-bold text-green-600">{selectedApplication.creditScore}</span></p>
                      <p><span className="font-semibold">Existing Debt:</span> ₹ {parseFloat(selectedApplication.existingDebt || 0).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Debt-to-Income:</span> <span className="font-bold text-red-600">{((parseFloat(selectedApplication.existingDebt || 0) / parseFloat(selectedApplication.income)) * 100).toFixed(2)}%</span></p>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-blue-50">
                    <h4 className="mb-3 text-xl font-bold text-blue-800">Loan Request</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Requested Amount:</span> ₹ {parseFloat(selectedApplication.courseFees).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Max Approved Amount:</span> <span className="font-bold text-indigo-600">₹ {parseFloat(selectedApplication.maxLoanAmount).toLocaleString('en-IN')}</span></p>
                      <p><span className="font-semibold">Course:</span> {selectedApplication.courseName}</p>
                      <p><span className="font-semibold">Academic Score:</span> {selectedApplication.academicScore}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 mb-6 border-t-4 border-red-500 rounded-lg bg-gradient-to-r from-yellow-50 to-red-50">
                  <h4 className="flex items-center mb-3 text-lg font-bold text-red-800"><TrendingUp size={20} className="mr-2" /> Risk Assessment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">AI Eligibility Score</p>
                      <p className="text-3xl font-bold text-green-600">{selectedApplication.eligibilityScore}/100</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <p className="text-2xl font-bold">
                        {selectedApplication.eligibilityScore >= 80 ? <span className="text-green-600">Low Risk</span> :
                          selectedApplication.eligibilityScore >= 60 ? <span className="text-yellow-600">Medium Risk</span> :
                            <span className="text-red-600">High Risk</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedApplication.managerComments && (
                  <div className="p-4 mb-6 border-l-4 border-purple-400 rounded-lg bg-purple-50">
                    <h4 className="mb-2 text-lg font-bold text-purple-800">Manager's Assessment</h4>
                    <p className="text-sm italic">{selectedApplication.managerComments}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-bold">Documents Verification</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedApplication.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-100 border-2 border-green-300 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle size={18} className="mr-2 text-green-600" />
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                        <Download size={16} className="text-blue-600 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="bankComments" className="block mb-2 text-lg font-bold">Bank Comments & Terms</label>
                  <textarea
                    className="w-full p-3 transition-colors border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    rows="3"
                    placeholder="Enter loan terms, interest rate, repayment conditions, or rejection reason..."
                    id="bankComments"
                    defaultValue={selectedApplication.bankComments}
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const comments = document.getElementById('bankComments').value;
                      handleBankAction(selectedApplication.id, 'approve', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-green-600 shadow-md rounded-xl hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2" />
                    Approve Loan & Disburse
                  </button>
                  <button
                    onClick={() => {
                      const comments = document.getElementById('bankComments').value;
                      handleBankAction(selectedApplication.id, 'reject', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-red-600 shadow-md rounded-xl hover:bg-red-700"
                  >
                    <XCircle className="mr-2" />
                    Reject Loan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="font-sans antialiased">
      {!userRole && renderRoleSelection()}
      {userRole === 'student' && renderStudentDashboard()}
      {userRole === 'manager' && renderManagerDashboard()}
      {userRole === 'bank' && renderBankDashboard()}

      {/* Render the Custom Message Modal */}
      <MessageModal text={message} onClose={closeMessage} />
    </div>
  );
};

export default EducationLoanSystem;
