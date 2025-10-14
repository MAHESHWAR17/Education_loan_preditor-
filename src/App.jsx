import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, FileCheck, Brain, PieChart, Home, Menu, X, User, Briefcase, Building, Upload, CheckCircle, XCircle, Clock, Eye, Download, Landmark, Pencil } from 'lucide-react';

const EducationLoanSystem = () => {
  const [userRole, setUserRole] = useState(null); // 'student', 'manager', 'bank'
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Applications Database (simulated)
  const [applications, setApplications] = useState([
    {
      id: 'APP001',
      studentName: 'Rahul Kumar',
      email: 'rahul@email.com',
      income: '600000',
      creditScore: '750',
      courseType: 'Postgraduate',
      courseFees: '1200000',
      academicScore: '88',
      existingDebt: '0',
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
      maxLoanAmount: 1200000
    },
    {
      id: 'APP002',
      studentName: 'Priya Sharma',
      email: 'priya@email.com',
      income: '450000',
      creditScore: '680',
      courseType: 'Undergraduate',
      courseFees: '800000',
      academicScore: '75',
      existingDebt: '100000',
      documents: {
        identityProof: 'aadhar_priya.pdf',
        incomeProof: 'income_cert.pdf',
        academicRecords: 'class12_marks.pdf',
        admissionLetter: 'admission_letter.pdf'
      },
      status: 'approved_manager',
      managerComments: 'Good academic record',
      bankComments: '',
      submittedDate: '2025-10-03',
      eligibilityScore: 62,
      maxLoanAmount: 800000
    }
  ]);

  // Student Form State
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

  // Calculate Eligibility Score
  const calculateEligibility = (formData) => {
    const { income, creditScore, courseFees, academicScore, existingDebt } = formData;
    
    const incomeNum = parseFloat(income);
    const creditNum = parseInt(creditScore);
    const feesNum = parseFloat(courseFees);
    const scoreNum = parseFloat(academicScore);
    const debtNum = parseFloat(existingDebt || 0);

    let eligibilityScore = 0;
    
    if (creditNum >= 750) eligibilityScore += 40;
    else if (creditNum >= 700) eligibilityScore += 30;
    else if (creditNum >= 650) eligibilityScore += 20;
    else eligibilityScore += 10;
    
    const incomeToFeesRatio = incomeNum / feesNum;
    if (incomeToFeesRatio >= 2) eligibilityScore += 30;
    else if (incomeToFeesRatio >= 1.5) eligibilityScore += 20;
    else if (incomeToFeesRatio >= 1) eligibilityScore += 10;
    
    if (scoreNum >= 85) eligibilityScore += 20;
    else if (scoreNum >= 75) eligibilityScore += 15;
    else if (scoreNum >= 65) eligibilityScore += 10;
    else eligibilityScore += 5;
    
    if (debtNum === 0) eligibilityScore += 10;
    else if (debtNum < incomeNum * 0.3) eligibilityScore += 7;
    else eligibilityScore += 3;

    const maxLoanAmount = Math.min(feesNum, incomeNum * 4);
    
    return { eligibilityScore, maxLoanAmount };
  };

  // Submit Student Application
  const submitApplication = () => {
    const requiredFields = ['studentName', 'email', 'phone', 'income', 'creditScore', 'courseFees', 'academicScore', 'collegeName', 'courseName'];
    const missingFields = requiredFields.filter(field => !studentForm[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill all required fields!');
      return;
    }

    const requiredDocs = ['identityProof', 'incomeProof', 'academicRecords', 'admissionLetter'];
    const missingDocs = requiredDocs.filter(doc => !uploadedDocs[doc]);
    
    if (missingDocs.length > 0) {
      alert('Please upload all required documents!');
      return;
    }

    const { eligibilityScore, maxLoanAmount } = calculateEligibility(studentForm);

    const newApplication = {
      id: `APP${String(applications.length + 1).padStart(3, '0')}`,
      ...studentForm,
      documents: {...uploadedDocs},
      status: 'pending_manager',
      managerComments: '',
      bankComments: '',
      submittedDate: new Date().toISOString().split('T')[0],
      eligibilityScore,
      maxLoanAmount
    };

    setApplications([...applications, newApplication]);
    alert('Application submitted successfully! Application ID: ' + newApplication.id);
    
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

  // Manager Actions
  const handleManagerAction = (appId, action, comments) => {
    setApplications(applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: action === 'approve' ? 'approved_manager' : 'rejected_manager',
          managerComments: comments
        };
      }
      return app;
    }));
    setSelectedApplication(null);
    alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
  };

  // Bank Actions
  const handleBankAction = (appId, action, comments) => {
    setApplications(applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: action === 'approve' ? 'approved_bank' : 'rejected_bank',
          bankComments: comments
        };
      }
      return app;
    }));
    setSelectedApplication(null);
    alert(`Loan ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
  };

  
  // Role Selection Screen
  
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

  // Steps for "How It Works" section
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
          // Updated to use Landmark icon instead of the problematic 'Bank' icon
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
              className="p-8 transition-all bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-105"
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800">Student</h3>
              <p className="text-gray-600">Apply for education loan</p>
            </div>

            {/* Manager Card */}
            <div 
              onClick={() => setUserRole('manager')}
              className="p-8 transition-all bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-105"
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800">Manager</h3>
              <p className="text-gray-600">Review & approve applications</p>
            </div>

            {/* Bank Card */}
            <div 
              onClick={() => setUserRole('bank')}
              className="p-8 transition-all bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-105"
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-600">
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

        <div className="flex space-x-12 animate-marquee">
          {banks.concat(banks).map((bank, index) => (
            <div key={index} className="flex items-center justify-center flex-shrink-0 w-40 h-20">
              <img src={bank} alt={`Bank ${index}`} className="object-contain h-full" />
            </div>
          ))}
        </div>
      </section>
      {/* how it's work  */}
       
       <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">How It Works</h2>
                    <p className="text-lg text-gray-600">A simple 3-step process to get your education loan approved.</p>
                </div>
                
                <div className="grid max-w-6xl gap-8 px-4 mx-auto md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className="p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300 bg-white relative text-left"
                        >
                            {/* Step Number */}
                            <span className="absolute text-5xl font-extrabold leading-none text-gray-200 opacity-75 top-4 right-4">
                                {`0${index + 1}`}
                            </span>
                            
                            {/* Check if index is 2 (Bank Approval step) and use Landmark, otherwise use the icon defined in steps */}
                            <div className={`w-16 h-16 flex items-center justify-center rounded-xl mb-4 ${step.iconBg} shadow-lg`}>
                                {index === 2 ? <Landmark className="w-10 h-10 text-white" /> : step.icon}
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
          src="https://i.pinimg.com/736x/3d/1f/3c/3d1f3c3be9ae71b3d2d09c04d610c58c.jpg"
          alt="Student"
          className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-indigo-500 rounded-full"
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
          src="https://i.pinimg.com/736x/5a/ab/f8/5aabf84d67477f77d3bb8f0fe4cfcd17.jpg"
          alt="Student"
          className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-purple-500 rounded-full"
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
          src="https://i.pinimg.com/736x/2d/f5/cb/2df5cb85709cf3f8e4ec0dc7554b9ddc.jpg"
          alt="Student"
          className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-pink-500 rounded-full"
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
          src="https://i.pinimg.com/736x/e9/3a/09/e93a0996a2d838b7a5dac7eada0117f5.jpg"
          alt="Student"
          className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-blue-500 rounded-full"
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
    </>
  );
};



  // Student Dashboard
  const renderStudentDashboard = () => (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            <User className="inline mr-3 text-blue-600" />
            Student Application Form
          </h2>
          <button
            onClick={() => setUserRole(null)}
            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
          <h3 className="mb-6 text-2xl font-bold text-gray-800">Personal Information</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                value={studentForm.studentName}
                onChange={(e) => setStudentForm({...studentForm, studentName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                value={studentForm.email}
                onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="john@email.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                value={studentForm.phone}
                onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Annual Family Income (₹) *
              </label>
              <input
                type="number"
                value={studentForm.income}
                onChange={(e) => setStudentForm({...studentForm, income: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="500000"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Credit Score *
              </label>
              <input
                type="number"
                value={studentForm.creditScore}
                onChange={(e) => setStudentForm({...studentForm, creditScore: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="750"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Existing Debt (₹)
              </label>
              <input
                type="number"
                value={studentForm.existingDebt}
                onChange={(e) => setStudentForm({...studentForm, existingDebt: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <h3 className="mt-8 mb-6 text-2xl font-bold text-gray-800">Course Information</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                College/University Name *
              </label>
              <input
                type="text"
                value={studentForm.collegeName}
                onChange={(e) => setStudentForm({...studentForm, collegeName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="IIT Delhi"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Course Name *
              </label>
              <input
                type="text"
                value={studentForm.courseName}
                onChange={(e) => setStudentForm({...studentForm, courseName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="B.Tech Computer Science"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Course Type *
              </label>
              <select
                value={studentForm.courseType}
                onChange={(e) => setStudentForm({...studentForm, courseType: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="doctorate">Doctorate</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Total Course Fees (₹) *
              </label>
              <input
                type="number"
                value={studentForm.courseFees}
                onChange={(e) => setStudentForm({...studentForm, courseFees: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="1000000"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Academic Score (%) *
              </label>
              <input
                type="number"
                value={studentForm.academicScore}
                onChange={(e) => setStudentForm({...studentForm, academicScore: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="85"
              />
            </div>
          </div>

          <h3 className="mt-8 mb-6 text-2xl font-bold text-gray-800">Document Upload</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { key: 'identityProof', label: 'Identity Proof (Aadhar/Passport)' },
              { key: 'incomeProof', label: 'Income Proof (Salary Slip/ITR)' },
              { key: 'academicRecords', label: 'Academic Records (Marksheet)' },
              { key: 'admissionLetter', label: 'Admission Letter' }
            ].map(doc => (
              <div key={doc.key} className="p-4 border-2 border-gray-300 border-dashed rounded-lg">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {doc.label} *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadedDocs({...uploadedDocs, [doc.key]: e.target.files[0]?.name || null})}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadedDocs[doc.key] && (
                  <p className="flex items-center mt-2 text-sm text-green-600">
                    <CheckCircle size={16} className="mr-1" /> {uploadedDocs[doc.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={submitApplication}
            className="w-full py-4 mt-8 text-lg font-bold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl"
          >
            Submit Application
          </button>
        </div>

        {/* Application Status */}
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <h3 className="mb-6 text-2xl font-bold text-gray-800">My Applications</h3>
          
          {applications.filter(app => app.email === studentForm.email).length === 0 ? (
            <p className="py-8 text-center text-gray-500">No applications yet. Submit your first application above!</p>
          ) : (
            <div className="space-y-4">
              {applications.filter(app => app.email === studentForm.email).map(app => (
                <div key={app.id} className="p-4 transition border rounded-lg hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold">{app.id}</p>
                      <p className="text-sm text-gray-600">Submitted: {app.submittedDate}</p>
                      <p className="text-sm text-gray-600">Course: {app.courseName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        app.status === 'pending_manager' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'approved_manager' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'approved_bank' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Manager Dashboard
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
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 mb-8 md:grid-cols-4">
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-purple-600">{applications.length}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingApps.length}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved_manager').length}
              </p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected_manager').length}
              </p>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
            <h3 className="mb-6 text-2xl font-bold text-gray-800">
              <Clock className="inline mr-2" />
              Pending Applications
            </h3>
            
            {pendingApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No pending applications</p>
            ) : (
              <div className="space-y-4">
                {pendingApps.map(app => (
                  <div key={app.id} className="p-6 transition border-2 border-gray-200 rounded-lg hover:border-purple-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{app.studentName}</h4>
                        <p className="text-sm text-gray-600">Application ID: {app.id}</p>
                        <p className="text-sm text-gray-600">Email: {app.email}</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                        Pending Review
                      </span>
                    </div>

                    <div className="grid gap-4 mb-4 md:grid-cols-3">
                      <div className="p-3 rounded bg-gray-50">
                        <p className="text-xs text-gray-600">Course</p>
                        <p className="font-semibold">{app.courseName}</p>
                        <p className="text-sm text-gray-600">{app.collegeName}</p>
                      </div>
                      <div className="p-3 rounded bg-gray-50">
                        <p className="text-xs text-gray-600">Loan Amount</p>
                        <p className="font-semibold">₹ {parseFloat(app.courseFees).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-3 rounded bg-gray-50">
                        <p className="text-xs text-gray-600">Eligibility Score</p>
                        <p className="font-semibold text-purple-600">{app.eligibilityScore}/100</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="flex items-center justify-center w-full py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
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
            <h3 className="mb-6 text-2xl font-bold text-gray-800">Reviewed Applications</h3>
            
            {reviewedApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No reviewed applications yet</p>
            ) : (
              <div className="space-y-4">
                {reviewedApps.map(app => (
                  <div key={app.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{app.studentName}</p>
                        <p className="text-sm text-gray-600">{app.id} - {app.submittedDate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        app.status === 'approved_manager' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status === 'approved_manager' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                    {app.managerComments && (
                      <p className="mt-2 text-sm text-gray-600">Comments: {app.managerComments}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b">
                <h3 className="text-2xl font-bold">Review Application - {selectedApplication.id}</h3>
                <button onClick={() => setSelectedApplication(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-lg font-bold">Student Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Name:</span> {selectedApplication.studentName}</p>
                      <p><span className="font-semibold">Email:</span> {selectedApplication.email}</p>
                      <p><span className="font-semibold">Phone:</span> {selectedApplication.phone}</p>
                      <p><span className="font-semibold">Income:</span> ₹ {parseFloat(selectedApplication.income).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Credit Score:</span> {selectedApplication.creditScore}</p>
                      <p><span className="font-semibold">Existing Debt:</span> ₹ {parseFloat(selectedApplication.existingDebt || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-lg font-bold">Course Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">College:</span> {selectedApplication.collegeName}</p>
                      <p><span className="font-semibold">Course:</span> {selectedApplication.courseName}</p>
                      <p><span className="font-semibold">Type:</span> {selectedApplication.courseType}</p>
                      <p><span className="font-semibold">Fees:</span> ₹ {parseFloat(selectedApplication.courseFees).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Academic Score:</span> {selectedApplication.academicScore}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 mb-6 rounded-lg bg-purple-50">
                  <h4 className="mb-3 text-lg font-bold">AI Assessment</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span>Eligibility Score:</span>
                    <span className="text-2xl font-bold text-purple-600">{selectedApplication.eligibilityScore}/100</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 bg-purple-600 rounded-full"
                      style={{width: `${selectedApplication.eligibilityScore}%`}}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">Max Loan Amount:</span> ₹ {parseFloat(selectedApplication.maxLoanAmount).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-bold">Uploaded Documents</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedApplication.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded bg-gray-50">
                        <span className="text-sm">{value}</span>
                        <Download size={16} className="text-blue-600 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-lg font-bold">Manager Comments</label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    rows="3"
                    placeholder="Enter your comments here..."
                    id="managerComments"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const comments = document.getElementById('managerComments').value;
                      handleManagerAction(selectedApplication.id, 'approve', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => {
                      const comments = document.getElementById('managerComments').value;
                      handleManagerAction(selectedApplication.id, 'reject', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
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

  // Bank Dashboard
  const renderBankDashboard = () => {
    const bankPendingApps = applications.filter(app => app.status === 'approved_manager');
    const bankReviewedApps = applications.filter(app => app.status === 'approved_bank' || app.status === 'rejected_bank');

    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-800">
              <Building className="inline mr-3 text-green-600" />
              Bank Dashboard
            </h2>
            <button
              onClick={() => setUserRole(null)}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 mb-8 md:grid-cols-4">
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Manager Approved</p>
              <p className="text-3xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'approved_manager').length}
              </p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{bankPendingApps.length}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Loans Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved_bank').length}
              </p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <p className="text-sm text-gray-600">Loans Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected_bank').length}
              </p>
            </div>
          </div>

          {/* Total Disbursed Amount */}
          <div className="p-8 mb-8 text-white shadow-xl bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
            <h3 className="mb-2 text-2xl font-bold">Total Loans Disbursed</h3>
            <p className="text-5xl font-bold">
              ₹ {applications
                .filter(app => app.status === 'approved_bank')
                .reduce((sum, app) => sum + parseFloat(app.maxLoanAmount), 0)
                .toLocaleString('en-IN')}
            </p>
          </div>

          {/* Pending Applications for Bank */}
          <div className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
            <h3 className="mb-6 text-2xl font-bold text-gray-800">
              <Clock className="inline mr-2" />
              Applications for Final Review
            </h3>
            
            {bankPendingApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No applications pending for bank review</p>
            ) : (
              <div className="space-y-4">
                {bankPendingApps.map(app => (
                  <div key={app.id} className="p-6 transition border-2 border-gray-200 rounded-lg hover:border-green-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{app.studentName}</h4>
                        <p className="text-sm text-gray-600">Application ID: {app.id}</p>
                        <p className="text-sm text-gray-600">Email: {app.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="block px-3 py-1 mb-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                          Manager Approved
                        </span>
                        <span className="text-xs text-gray-600">Submitted: {app.submittedDate}</span>
                      </div>
                    </div>

                    <div className="grid gap-4 mb-4 md:grid-cols-4">
                      <div className="p-3 rounded bg-gray-50">
                        <p className="text-xs text-gray-600">Credit Score</p>
                        <p className="text-lg font-semibold">{app.creditScore}</p>
                      </div>
                      <div className="p-3 rounded bg-gray-50">
                        <p className="text-xs text-gray-600">Annual Income</p>
                        <p className="font-semibold">₹ {parseFloat(app.income).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-3 rounded bg-gray-50">
                        <p className="text-xs text-gray-600">Loan Amount</p>
                        <p className="font-semibold">₹ {parseFloat(app.maxLoanAmount).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-3 rounded bg-gray-50">
                        <p className="text-xs text-gray-600">AI Score</p>
                        <p className="font-semibold text-green-600">{app.eligibilityScore}/100</p>
                      </div>
                    </div>

                    {app.managerComments && (
                      <div className="p-3 mb-4 rounded bg-blue-50">
                        <p className="mb-1 text-xs text-gray-600">Manager Comments:</p>
                        <p className="text-sm">{app.managerComments}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="flex items-center justify-center w-full py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
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
            <h3 className="mb-6 text-2xl font-bold text-gray-800">Processed Loans</h3>
            
            {bankReviewedApps.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No processed loans yet</p>
            ) : (
              <div className="space-y-4">
                {bankReviewedApps.map(app => (
                  <div key={app.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-bold">{app.studentName}</p>
                        <p className="text-sm text-gray-600">{app.id} - {app.collegeName}</p>
                        <p className="text-sm text-gray-600">Amount: ₹ {parseFloat(app.maxLoanAmount).toLocaleString('en-IN')}</p>
                        {app.bankComments && (
                          <p className="mt-2 text-sm text-gray-600">Comments: {app.bankComments}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        app.status === 'approved_bank' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status === 'approved_bank' ? 'Loan Approved' : 'Loan Rejected'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bank Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b">
                <h3 className="text-2xl font-bold">Loan Review - {selectedApplication.id}</h3>
                <button onClick={() => setSelectedApplication(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-green-50">
                    <h4 className="mb-3 text-lg font-bold">Financial Profile</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Annual Income:</span> ₹ {parseFloat(selectedApplication.income).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Credit Score:</span> {selectedApplication.creditScore}</p>
                      <p><span className="font-semibold">Existing Debt:</span> ₹ {parseFloat(selectedApplication.existingDebt || 0).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Debt-to-Income:</span> {((parseFloat(selectedApplication.existingDebt || 0) / parseFloat(selectedApplication.income)) * 100).toFixed(2)}%</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50">
                    <h4 className="mb-3 text-lg font-bold">Loan Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Requested Amount:</span> ₹ {parseFloat(selectedApplication.courseFees).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Approved Amount:</span> ₹ {parseFloat(selectedApplication.maxLoanAmount).toLocaleString('en-IN')}</p>
                      <p><span className="font-semibold">Course Duration:</span> {selectedApplication.courseType === 'undergraduate' ? '3-4 years' : selectedApplication.courseType === 'postgraduate' ? '2 years' : '3-5 years'}</p>
                      <p><span className="font-semibold">Academic Score:</span> {selectedApplication.academicScore}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 mb-6 rounded-lg bg-gradient-to-r from-green-100 to-blue-100">
                  <h4 className="mb-3 text-lg font-bold">Risk Assessment</h4>
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
                  <div className="p-4 mb-6 rounded-lg bg-purple-50">
                    <h4 className="mb-2 text-lg font-bold">Manager's Assessment</h4>
                    <p className="text-sm">{selectedApplication.managerComments}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-bold">Documents Verification</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedApplication.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border-2 border-green-300 rounded bg-gray-50">
                        <div className="flex items-center">
                          <CheckCircle size={18} className="mr-2 text-green-600" />
                          <span className="text-sm">{value}</span>
                        </div>
                        <Download size={16} className="text-blue-600 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-lg font-bold">Bank Comments & Terms</label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    rows="3"
                    placeholder="Enter loan terms, interest rate, repayment conditions, or rejection reason..."
                    id="bankComments"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const comments = document.getElementById('bankComments').value;
                      handleBankAction(selectedApplication.id, 'approve', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2" />
                    Approve Loan
                  </button>
                  <button
                    onClick={() => {
                      const comments = document.getElementById('bankComments').value;
                      handleBankAction(selectedApplication.id, 'reject', comments);
                    }}
                    className="flex items-center justify-center flex-1 py-3 font-bold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
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
    <div className="font-sans">
      {!userRole && renderRoleSelection()}
      {userRole === 'student' && renderStudentDashboard()}
      {userRole === 'manager' && renderManagerDashboard()}
      {userRole === 'bank' && renderBankDashboard()}
    </div>
  );
};

export default EducationLoanSystem;