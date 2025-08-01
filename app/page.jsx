"use client"

import { ArrowRight, CheckCircle, Search } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"
import { Stethoscope, FileText, User, Bot, Shirt } from "lucide-react"
import { motion } from "framer-motion"



export default function Home() {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="container mx-auto px-4 py-6 md:py-10 lg:py-14">
        {/* Hero Section */}
        <motion.div
          className="max-w-6xl mx-auto mb-8 md:mb-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center mb-6 md:mb-10" variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-5 text-gray-800 heading-font">
               Agentic AI Demo Interface
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-5 md:mb-8 para-font">
              Explore our suite of Agentic AI features and tools designed to transform your business operations
            </p>
          </motion.div>

          {/* Agentic AI Demo Interface Mockup */}
          <motion.div
            className="rounded-xl overflow-hidden border-2 md:border-4 border-blue-100 bg-blue-50 shadow-lg max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <div className="relative bg-white">
              {/* Browser-like header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-3 md:px-4 py-2 md:py-3">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs md:text-sm font-medium text-gray-500 para-font"> Agentic AI Demo Interface</div>
                <div className="flex items-center">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500 mr-1 md:mr-2 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                  <span className="text-xs md:text-sm font-medium para-font">Demo User</span>
                </div>
              </div>

              {/* Main content */}
              <div className="flex flex-col md:flex-row">
                {/* Sidebar - hidden on mobile */}
                <div className="hidden md:block w-36 lg:w-48 bg-white border-r border-gray-100 p-4">
                  <div className="mb-6">
                    <div className="text-xs font-medium text-gray-500 mb-2 subheading-font">COMPONENTS</div>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-blue-50 rounded-md text-xs lg:text-sm text-blue-700 para-font">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Text Analysis
                      </div>
                      <div className="flex items-center p-2 text-xs lg:text-sm text-gray-600 para-font">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        Sentiment
                      </div>
                      <div className="flex items-center p-2 text-xs lg:text-sm text-gray-600 para-font">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        Generation
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2 subheading-font">TEMPLATES</div>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 text-xs lg:text-sm text-gray-600 para-font">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        Chatbot
                      </div>
                      <div className="flex items-center p-2 text-xs lg:text-sm text-gray-600 para-font">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        Analyzer
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 p-3 md:p-4">
                  {/* Mobile-only tabs */}
                  <div className="flex md:hidden mb-3 border-b border-gray-100 pb-2">
                    <button className="flex-1 text-center text-xs font-medium text-blue-700 border-b-2 border-blue-500 pb-1">
                      Dashboard
                    </button>
                    <button className="flex-1 text-center text-xs font-medium text-gray-500">Components</button>
                    <button className="flex-1 text-center text-xs font-medium text-gray-500">Templates</button>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <button className="w-full flex items-center px-3 py-2 text-xs md:text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors para-font">
                      <Search className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      <span>Search features...</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="font-medium text-sm md:text-base subheading-font">Text Analysis Demo</div>
                      <div className="text-xs px-2 py-0.5 md:py-1 bg-blue-100 text-blue-700 rounded-full para-font">
                        Active
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 para-font">
                      Process and analyze text to extract key information and insights.
                    </div>
                    <div className="flex space-x-2">
                      <div className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full para-font">NLP</div>
                      <div className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full para-font">
                        Analysis
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                      <div className="w-full h-16 md:h-24 bg-blue-50 rounded-md mb-2 md:mb-3 flex items-center justify-center">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-200 flex items-center justify-center">
                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm font-medium text-center subheading-font">
                        Entity Recognition
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                      <div className="w-full h-16 md:h-24 bg-blue-50 rounded-md mb-2 md:mb-3 flex items-center justify-center">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-200 flex items-center justify-center">
                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm font-medium text-center subheading-font">
                        Sentiment Analysis
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* How It Helps Businesses Section */}
        <motion.div
          className="max-w-6xl mx-auto mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-5 heading-font">
              How It Helps Businesses
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-7 para-font">
              Our AI solutions are designed to transform how businesses operate, providing immediate value through
              automation, insights, and enhanced decision-making capabilities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <motion.div
                className="bg-blue-50 rounded-lg p-4 md:p-5"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2 heading-font">Operational Efficiency</h3>
                <p className="text-xs md:text-sm text-gray-600 para-font">
                  Automate routine tasks and processes, reducing manual effort and operational costs by up to 70%.
                </p>
              </motion.div>

              <motion.div
                className="bg-blue-50 rounded-lg p-4 md:p-5"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2 heading-font">Data-Driven Insights</h3>
                <p className="text-xs md:text-sm text-gray-600 para-font">
                  Extract meaningful patterns and insights from your data, enabling better strategic decision-making.
                </p>
              </motion.div>

              <motion.div
                className="bg-blue-50 rounded-lg p-4 md:p-5"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2 heading-font">Enhanced Customer Experience</h3>
                <p className="text-xs md:text-sm text-gray-600 para-font">
                  Deliver personalized, responsive interactions that improve customer satisfaction and loyalty.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto space-y-10 md:space-y-16">
          {/* Feature #1: NL2SQL - Description on left, image on right */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Feature Content */}
              <div className="w-full lg:w-1/2 p-3 md:p-4">
                <div className="flex items-center mb-3">
                  <div className="text-3xl md:text-5xl font-bold text-blue-100">#1</div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800 ml-3 heading-font">NL2SQL</h2>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-5 para-font">
                  Convert natural language queries into SQL statements using AI Agent. Get instant results and
                  visualizations from your database without writing complex SQL code.
                </p>

                <div className="mb-4 md:mb-5">
                  <h3 className="text-base md:text-lg font-semibold mb-3 heading-font">Business Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Key Benefits</h4>
                      <ul className="space-y-1">
                        {[
                          "Reduce SQL development time by 85%",
                          "Enable non-technical users to query data",
                          "Increase data accessibility across teams",
                          "Accelerate business intelligence workflows",
                          "Eliminate query syntax errors",
                        ].map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Use Cases</h4>
                      <ul className="space-y-1">
                        {[
                          "Ad-hoc data analysis by business users",
                          "Quick dashboard creation",
                          "Data exploration without SQL knowledge",
                          "Automated reporting systems",
                          "Interactive data querying in meetings",
                        ].map((useCase, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-3 w-3 md:h-4 md:h-4 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <a href="/nl2sql">
                  <GradientButton className="inline-flex items-center px-3 py-1.5 text-xs">
                    Try NL2SQL <ArrowRight className="ml-1.5 h-3 w-3" />
                  </GradientButton>
                </a>
              </div>

              {/* Feature Visual */}
              <motion.div
                className="w-full lg:w-1/2 bg-purple-50 p-3 md:p-4 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-md p-4 md:p-5 w-full max-w-md">
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">EXAMPLE QUERY</div>
                    <div className="bg-gray-50 rounded-md p-2 text-xs font-mono text-gray-700 para-font">
                      "Show me the top 5 customers by total purchase amount in the last quarter"
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">GENERATED SQL</div>
                    <div className="bg-gray-50 rounded-md p-2 text-xs font-mono text-purple-700 para-font overflow-x-auto">
                      SELECT c.customer_name, SUM(o.amount) as total_amount
                      <br />
                      FROM customers c<br />
                      JOIN orders o ON c.id = o.customer_id
                      <br />
                      WHERE o.order_date &gt;= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
                      <br />
                      GROUP BY c.customer_name
                      <br />
                      ORDER BY total_amount DESC
                      <br />
                      LIMIT 5;
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 numbers-font">Processing time: 0.24s</div>
                    <div className="text-xs font-medium text-purple-600 para-font">View Results →</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature #2: Health Scribe - Image on left, description on right */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row-reverse">
              {/* Feature Content */}
              <div className="w-full lg:w-1/2 p-3 md:p-4">
                <div className="flex items-center mb-3">
                  <div className="text-3xl md:text-5xl font-bold text-blue-100">#2</div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800 ml-3 heading-font">Health Scribe</h2>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-5 para-font">
                  Transcribe medical audio recordings and get instant answers to medical queries. Perfect for healthcare
                  professionals looking to save time on documentation.
                </p>

                <div className="mb-4 md:mb-5">
                  <h3 className="text-base md:text-lg font-semibold mb-3 heading-font">Business Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Key Benefits</h4>
                      <ul className="space-y-1">
                        {[
                          "Reduce documentation time by 75%",
                          "Improve accuracy of medical records",
                          "Ensure compliance with healthcare regulations",
                          "Free up time for patient care",
                          "Reduce transcription costs",
                        ].map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Use Cases</h4>
                      <ul className="space-y-1">
                        {[
                          "Patient consultations and follow-ups",
                          "Medical rounds and team discussions",
                          "Surgical procedure documentation",
                          "Medical research interviews",
                          "Remote patient monitoring notes",
                        ].map((useCase, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-3 w-3 md:h-4 md:h-4 rounded-full bg-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <a href="/health-scribe">
                  <GradientButton className="inline-flex items-center px-3 py-1.5 text-xs">
                    Try Health Scribe <ArrowRight className="ml-1.5 h-3 w-3" />
                  </GradientButton>
                </a>
              </div>

              {/* Feature Visual */}
              <motion.div
                className="w-full lg:w-1/2 bg-green-50 p-3 md:p-4 flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-md p-4 md:p-5 w-full max-w-md">
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">AUDIO TRANSCRIPTION</div>
                    <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-700 para-font">
                      <div className="flex items-center mb-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <Stethoscope className="h-3 w-3 text-green-600" />
                        </div>
                        <div className="text-xs font-medium">Medical Recording - Patient Consultation</div>
                      </div>
                      <div className="h-1.5 bg-green-200 rounded-full mb-2 w-full"></div>
                      <div className="h-1.5 bg-green-200 rounded-full mb-2 w-3/4"></div>
                      <div className="h-1.5 bg-green-200 rounded-full mb-2 w-1/2"></div>
                      <div className="text-xs text-gray-500">00:03:24 / 00:05:30</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">TRANSCRIPTION RESULT</div>
                    <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-700 para-font">
                      "Patient presents with symptoms of seasonal allergies including nasal congestion, itchy eyes, and
                      occasional sneezing. No fever or other concerning symptoms. Recommending over-the-counter
                      antihistamine and follow-up in two weeks if symptoms persist."
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 numbers-font">Accuracy: 98.7%</div>
                    <div className="text-xs font-medium text-green-600 para-font">Generate Report →</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature #3: Face Recognition - Description on left, image on right */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Feature Content */}
              <div className="w-full lg:w-1/2 p-3 md:p-4">
                <div className="flex items-center mb-3">
                  <div className="text-3xl md:text-5xl font-bold text-blue-100">#3</div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800 ml-3 heading-font">Face Recognition</h2>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-5 para-font">
                  Real-time face detection and identification system with advanced security features. Identify
                  individuals in images or video streams with high accuracy and low latency.
                </p>

                <div className="mb-4 md:mb-5">
                  <h3 className="text-base md:text-lg font-semibold mb-3 heading-font">Business Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Key Benefits</h4>
                      <ul className="space-y-1">
                        {[
                          "99.8% identification accuracy",
                          "Process up to 30 faces simultaneously",
                          "Works in varying lighting conditions",
                          "Privacy-preserving technology",
                          "Seamless integration with existing systems",
                        ].map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Use Cases</h4>
                      <ul className="space-y-1">
                        {[
                          "Secure facility access control",
                          "Attendance tracking systems",
                          "Customer recognition for VIP service",
                          "Security monitoring and alerts",
                          "Contactless authentication",
                        ].map((useCase, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-3 w-3 md:h-4 md:h-4 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <a href="/face-recognition">
                  <GradientButton className="inline-flex items-center px-3 py-1.5 text-xs">
                    Try Face Recognition <ArrowRight className="ml-1.5 h-3 w-3" />
                  </GradientButton>
                </a>
              </div>

              {/* Feature Visual */}
              <motion.div
                className="w-full lg:w-1/2 bg-blue-50 p-3 md:p-4 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-md p-4 md:p-5 w-full max-w-md">
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">LIVE DETECTION</div>
                    <div className="bg-gray-800 rounded-md p-2 aspect-video relative">
                      <div className="absolute top-1/4 left-1/4 w-14 h-14 border-2 border-blue-400 rounded-lg"></div>
                      <div className="absolute top-1/4 left-1/4 w-14 h-14 flex items-center justify-center">
                        <div className="text-xs text-blue-400 font-mono">ID: 8742</div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/3 w-12 h-12 border-2 border-green-400 rounded-lg"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-12 h-12 flex items-center justify-center">
                        <div className="text-xs text-green-400 font-mono">ID: 5291</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">RECOGNITION RESULTS</div>
                    <div className="bg-gray-50 rounded-md p-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-blue-100 mr-2"></div>
                          <span className="text-xs font-medium">Person #8742</span>
                        </div>
                        <span className="text-xs text-blue-600 numbers-font">98% match</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-green-100 mr-2"></div>
                          <span className="text-xs font-medium">Person #5291</span>
                        </div>
                        <span className="text-xs text-green-600 numbers-font">99% match</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 numbers-font para-font">Processing: 24ms/frame</div>
                    <div className="text-xs font-medium text-blue-600 para-font">View Details →</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature #4: PDF Extractor - Image on left, description on right */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row-reverse">
              {/* Feature Content */}
              <div className="w-full lg:w-1/2 p-3 md:p-4">
                <div className="flex items-center mb-3">
                  <div className="text-3xl md:text-5xl font-bold text-blue-100">#4</div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800 ml-3 heading-font">PDF Extractor</h2>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-5 para-font">
                  Upload PDFs and chat with your documents to extract insights, answer questions, and summarize content
                  without manual reading or searching.
                </p>

                <div className="mb-4 md:mb-5">
                  <h3 className="text-base md:text-lg font-semibold mb-3 heading-font">Business Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Key Benefits</h4>
                      <ul className="space-y-1">
                        {[
                          "Reduce document review time by 90%",
                          "Extract key information automatically",
                          "Process hundreds of pages in seconds",
                          "Support for 25+ languages",
                          "Maintain document context in responses",
                        ].map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Use Cases</h4>
                      <ul className="space-y-1">
                        {[
                          "Legal document review and analysis",
                          "Research paper information extraction",
                          "Contract clause identification",
                          "Financial report summarization",
                          "Technical documentation Q&A",
                        ].map((useCase, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-3 w-3 md:h-4 md:h-4 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <a href="/pdf-extractor">
                  <GradientButton className="inline-flex items-center px-3 py-1.5 text-xs">
                    Try PDF Extractor <ArrowRight className="ml-1.5 h-3 w-3" />
                  </GradientButton>
                </a>
              </div>

              {/* Feature Visual */}
              <motion.div
                className="w-full lg:w-1/2 bg-orange-50 p-3 md:p-4 flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-md p-4 md:p-5 w-full max-w-md">
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">DOCUMENT ANALYSIS</div>
                    <div className="flex items-center bg-gray-50 rounded-md p-2 mb-2">
                      <FileText className="h-7 w-7 text-orange-500 mr-2" />
                      <div>
                        <div className="text-xs font-medium">Financial_Report_2023.pdf</div>
                        <div className="text-xs text-gray-500">42 pages • 3.2 MB • Uploaded 2 minutes ago</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">CHAT WITH YOUR PDF</div>
                    <div className="bg-gray-50 rounded-md p-2 space-y-2">
                      <div className="flex items-start">
                        <div className="bg-gray-200 rounded-full p-1 mr-2">
                          <User className="h-3 w-3 text-gray-600" />
                        </div>
                        <div className="text-xs text-gray-700">What was the total revenue for Q3?</div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-orange-200 rounded-full p-1 mr-2">
                          <Bot className="h-3 w-3 text-orange-600" />
                        </div>
                        <div className="text-xs text-gray-700">
                          According to page 17 of the report, the total revenue for Q3 was $24.8 million, which
                          represents a 12% increase compared to the same quarter last year.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 para-font">3 of 42 pages analyzed</div>
                    <div className="text-xs font-medium text-orange-600 para-font">View Full Analysis →</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature #5: Virtual Try-On - Description on left, image on right */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Feature Content */}
              <div className="w-full lg:w-1/2 p-3 md:p-4">
                <div className="flex items-center mb-3">
                  <div className="text-3xl md:text-5xl font-bold text-blue-100">#5</div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800 ml-3 heading-font">Virtual Try-On</h2>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-5 para-font">
                  Try garments on digital models using just product images. Visualize how clothing items look on
                  different body types without physical samples.
                </p>

                <div className="mb-4 md:mb-5">
                  <h3 className="text-base md:text-lg font-semibold mb-3 heading-font">Business Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Key Benefits</h4>
                      <ul className="space-y-1">
                        {[
                          "Reduce return rates by up to 40%",
                          "Increase conversion rates by 25%",
                          "Eliminate need for multiple photo shoots",
                          "Support for all clothing categories",
                          "Realistic fabric simulation",
                        ].map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm subheading-font">Use Cases</h4>
                      <ul className="space-y-1">
                        {[
                          "E-commerce product visualization",
                          "Fashion design prototyping",
                          "Virtual fashion shows",
                          "Personalized shopping experiences",
                          "Inventory-free retail displays",
                        ].map((useCase, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-3 w-3 md:h-4 md:h-4 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700 para-font">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <a href="/virtual-try-on">
                  <GradientButton className="inline-flex items-center px-3 py-1.5 text-xs">
                    Try Virtual Try-On <ArrowRight className="ml-1.5 h-3 w-3" />
                  </GradientButton>
                </a>
              </div>

              {/* Feature Visual */}
              <motion.div
                className="w-full lg:w-1/2 bg-pink-50 p-3 md:p-4 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-md p-4 md:p-5 w-full max-w-md">
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">VIRTUAL TRY-ON</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 rounded-md p-2 aspect-square flex items-center justify-center">
                        <Shirt className="h-10 w-10 text-pink-400" />
                      </div>
                      <div className="bg-gray-50 rounded-md p-2 aspect-square flex items-center justify-center">
                        <div className="relative w-8 h-14 bg-gray-300 rounded-md">
                          <div className="absolute inset-0 bg-pink-400 opacity-30 rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-1 subheading-font">MODEL SELECTION</div>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      <div className="w-8 h-14 bg-gray-200 rounded-md flex-shrink-0 border-2 border-pink-400"></div>
                      <div className="w-8 h-14 bg-gray-200 rounded-md flex-shrink-0"></div>
                      <div className="w-8 h-14 bg-gray-200 rounded-md flex-shrink-0"></div>
                      <div className="w-8 h-14 bg-gray-200 rounded-md flex-shrink-0"></div>
                      <div className="w-8 h-14 bg-gray-200 rounded-md flex-shrink-0"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 para-font">5 models available</div>
                    <div className="text-xs font-medium text-pink-600 para-font">Generate Preview →</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
