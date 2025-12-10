'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Upload, AlertCircle, Loader2, Wand2, GitCompare, Eye, EyeOff } from 'lucide-react';
import { FeatureIcon } from '@/components/feature-icons';

import AudioSamples from './_components/AudioSamples';
import TranscriptDisplay from './_components/TranscriptDisplay';
import ChatModal from './_components/ChatModal';
import UploadModal from './_components/UploadModal';
import { useAuthContext } from '../../context/AuthContext';
import helpers from '@/utils/helper';
import constants from '@/utils/constants';
import { toast } from 'sonner';

// Predefined audio files from S3 bucket
const predefinedAudios = [
  {
    id: '1',
    title: 'Sample data 1.mp3',
    url: 'https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios1.mp3',
    s3: 's3://dax-healthscribe-v2/predefinedAudios/predefinedAudios1.mp3',
    duration: '10:26',
    transcript:
      "This is a sample transcript for the first audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
  {
    id: '2',
    title: 'Sample data 2.mp3',
    url: 'https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios2.mp3',
    s3: 's3://dax-healthscribe-v2/predefinedAudios/predefinedAudios2.mp3',
    duration: '10:45',
    transcript:
      "This is a sample transcript for the second audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
  {
    id: '3',
    title: 'Sample data 3.mp3',
    url: 'https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios3.mp3',
    duration: '10:46',
    transcript:
      "This is a sample transcript for the third audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function HealthScribePage() {
  // === States ===
  const [activeAudio, setActiveAudio] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [sampleAudios, setSampleAudios] = useState(predefinedAudios);
  const [formattedTranscript, setFormattedTranscript] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState({});
  const [uploadedAudios, setUploadedAudios] = useState([]);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [error, setError] = useState(null);
  const [hasTranscriptionData, setHasTranscriptionData] = useState(false);
  
  // NEW STATES for transcript management
  const [isRefining, setIsRefining] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState(''); // Store original
  const [refinedTranscript, setRefinedTranscript] = useState(''); // Store refined
  const [showOriginal, setShowOriginal] = useState(false); // Toggle view
  const [refinementHistory, setRefinementHistory] = useState([]); // Store all refinements

  // Get session token from context
  const { sessionToken, isLoaded, isSignedIn } = useAuthContext();
  const token = 'Bearer ' + sessionToken;

  // === Refs ===
  const transcriptRef = useRef(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const abortRef = useRef(null);
  const transcriptionAbortRef = useRef(null);

  // === Effects ===

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }
  }, []);

  // Listen for audio time updates
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const updateProgress = () => {
      if (playingAudioId) {
        setAudioProgress((prev) => ({
          ...prev,
          [playingAudioId]: audioEl.currentTime,
        }));
      }
    };

    const handleEnded = () => {
      setPlayingAudioId(null);
      setAudioProgress((prev) => ({
        ...prev,
        [playingAudioId]: 0,
      }));
    };

    if (playingAudioId) {
      audioEl.addEventListener('timeupdate', updateProgress);
      audioEl.addEventListener('ended', handleEnded);
    }

    return () => {
      audioEl.removeEventListener('timeupdate', updateProgress);
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, [playingAudioId]);

  // Parse transcript when it changes - now checks which transcript to parse
  useEffect(() => {
    const currentTranscript = showOriginal ? originalTranscript : refinedTranscript || transcript;
    
    if (currentTranscript) {
      const formatted = formatTranscript(currentTranscript);
      setFormattedTranscript(formatted);
      setHasTranscriptionData(true);
    } else {
      setFormattedTranscript(null);
      setHasTranscriptionData(false);
    }
  }, [transcript, refinedTranscript, originalTranscript, showOriginal]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current && formattedTranscript) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [formattedTranscript]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // === Handlers ===

  // Play/Pause audio
  const togglePlay = async (audio) => {
    try {
      const audioEl = audioRef.current;

      if (playingAudioId === audio.id) {
        // Pause current audio
        audioEl.pause();
        setPlayingAudioId(null);
      } else {
        // Stop any playing audio
        if (playingAudioId) {
          audioEl.pause();
          audioEl.currentTime = 0;
        }

        // Play new audio
        audioEl.src = audio.url;
        await audioEl.play();
        setPlayingAudioId(audio.id);
      }
    } catch (error) {
      console.error('Audio play error:', error);
      toast.error('Failed to play audio');
    }
  };

  function formatTranscript(transcript) {
    if (!transcript || typeof transcript !== 'string') {
      return {
        chiefComplaint: {
          title: 'Chief Complaint',
          content: 'No transcript available',
        },
        historyOfPresentIllness: {
          title: 'History of Present Illness',
          content: 'No transcript available',
        },
        reviewOfSystems: {
          title: 'Review of Systems',
          content: 'No transcript available',
        },
        pastMedicalHistory: {
          title: 'Past Medical History',
          content: 'No transcript available',
        },
        assessment: {
          title: 'Assessment',
          content: 'No transcript available',
        }
      };
    }

    // Helper function to extract content between section headers
    const extractSection = (text, sectionName, nextSection = null) => {
      // Create regex pattern
      const escapedSection = sectionName.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
      let pattern;

      if (nextSection) {
        const escapedNext = nextSection.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
        pattern = new RegExp(`${escapedSection}:\\s*([\\s\\S]*?)(?=${escapedNext}:|$)`, 'i');
      } else {
        pattern = new RegExp(`${escapedSection}:\\s*([\\s\\S]*?)$`, 'i');
      }

      const match = text.match(pattern);
      return match ? match[1].trim() : '';
    };

    // Extract all sections
    const sections = {
      chiefComplaint: {
        title: 'Chief Complaint',
        content: extractSection(transcript, 'CHIEF_COMPLAINT', 'HISTORY_OF_PRESENT_ILLNESS'),
      },
      historyOfPresentIllness: {
        title: 'History of Present Illness',
        content: extractSection(transcript, 'HISTORY_OF_PRESENT_ILLNESS', 'REVIEW_OF_SYSTEMS'),
      },
      reviewOfSystems: {
        title: 'Review of Systems',
        content: extractSection(transcript, 'REVIEW_OF_SYSTEMS', 'PAST_MEDICAL_HISTORY'),
      },
      pastMedicalHistory: {
        title: 'Past Medical History',
        content: extractSection(transcript, 'PAST_MEDICAL_HISTORY', 'PAST_FAMILY_HISTORY'),
      },
      pastFamilyHistory: {
        title: 'Past Family History',
        content: extractSection(transcript, 'PAST_FAMILY_HISTORY', 'PAST_SOCIAL_HISTORY'),
      },
      pastSocialHistory: {
        title: 'Past Social History',
        content: extractSection(transcript, 'PAST_SOCIAL_HISTORY', 'PHYSICAL_EXAMINATION'),
      },
      physicalExamination: {
        title: 'Physical Examination',
        content: extractSection(transcript, 'PHYSICAL_EXAMINATION', 'DIAGNOSTIC_TESTING'),
      },
      diagnosticTesting: {
        title: 'Diagnostic Testing',
        content: extractSection(transcript, 'DIAGNOSTIC_TESTING', 'ASSESSMENT'),
      },
      assessment: {
        title: 'Assessment',
        content: extractSection(transcript, 'ASSESSMENT', 'PLAN'),
      },
      plan: {
        title: 'Plan',
        content: extractSection(transcript, 'PLAN'),
      }
    };

    // Clean up empty sections
    Object.keys(sections).forEach(key => {
      if (!sections[key].content) {
        sections[key].content = 'No information provided';
      }
    });

    return sections;
  }

  const selectAudio = async (audio) => {
    try {
      setIsLoadingSample(true);
      setError(null);
      setActiveAudio(audio);
      
      // Store the transcript as original
      if (audio.transcript && !audio.transcript.includes('sample transcript')) {
        setOriginalTranscript(audio.transcript);
        setTranscript(audio.transcript);
        setRefinedTranscript(''); // Clear any previous refinement
      } else {
        setOriginalTranscript('');
        setTranscript('');
        setRefinedTranscript('');
      }
      
      setChatMessages([]);
      setHasTranscriptionData(false);
      setShowOriginal(true); // Default to showing original

      // If this is a sample audio with only placeholder transcript, clear it
      if (audio.transcript && audio.transcript.includes('sample transcript')) {
        setTranscript('');
        setOriginalTranscript('');
      }
    } catch (error) {
      console.error('Error selecting audio:', error);
      setError('Failed to load audio');
      toast.error('Failed to load audio');
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file
      const fileError = helpers.fileSize(constants.fileSize.audio.inBytes, constants.fileSize.audio.inMB)(file);
      if (fileError) {
        toast.error(fileError);
        return;
      }

      const typeError = helpers.checkAudioFileType(file);
      if (typeError) {
        toast.error(typeError);
        return;
      }

      const corruptionError = await helpers.checkAudioCorruption(file);
      if (corruptionError) {
        toast.error(corruptionError);
        return;
      }

      const isValid = await helpers.checkAudioDuration(file, constants.fileSize.audio.maxSize);
      if (!isValid) {
        toast.error(`File is too long. Max allowed is ${constants.fileSize.audio.maxSize} minutes.`);
        return;
      }

      setSelectedFile(file);
    } catch (error) {
      console.error('File validation error:', error);
      toast.error('Failed to validate file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      // 1. Upload audio to S3
      const uploadData = await helpers.uploadFile(
        selectedFile,
        token,
        setUploadProgress,
        abortRef
      );

      const fileUrl = uploadData.fileUrl;
      setUploadStatus('processing');

      // 2. Start transcription immediately
      const controller = new AbortController();
      abortRef.current = () => controller.abort();

      const transcriptionResponse = await fetch(`${BACKEND_URL}/healthscribe/start-transcription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ audioUrl: fileUrl }),
        signal: controller.signal,
      });

      if (!transcriptionResponse.ok) {
        throw new Error(`Transcription failed: ${transcriptionResponse.statusText}`);
      }

      const transcriptionData = await transcriptionResponse.json();

      // 3. Create local URL for audio playback
      const localAudioUrl = URL.createObjectURL(selectedFile);

      // 4. Create new audio object
      const newAudio = {
        id: Date.now().toString(),
        title: selectedFile.name,
        duration: transcriptionData.duration || '00:00',
        transcript: transcriptionData.summary || '',
        url: localAudioUrl,
        s3: fileUrl,
        isUploaded: true,
      };

      // 5. Update state
      setActiveAudio(newAudio);
      const newTranscript = transcriptionData.summary || '';
      setOriginalTranscript(newTranscript); // Store as original
      setTranscript(newTranscript); // Set current display
      setRefinedTranscript(''); // Clear refinement
      setUploadedAudios((prev) => [newAudio, ...prev]);
      setShowOriginal(true); // Show original view

      toast.success('Audio uploaded and transcribed successfully!');

      // 6. Reset and close modal
      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadProgress(0);
        setUploadStatus('idle');
        setSelectedFile(null);
      }, 1000);

    } catch (error) {
      if (error.name === 'AbortError') {
        toast.info('Upload cancelled');
      } else {
        console.error('Upload error:', error);
        setError(error.message);
        toast.error(`Upload failed: ${error.message}`);
      }
      setUploadStatus('idle');
      setUploadProgress(0);
    } finally {
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current();
    }
    setUploadModalOpen(false);
    setUploadProgress(0);
    setUploadStatus('idle');
    setSelectedFile(null);
    setError(null);
  };

  const handleTranscribe = async () => {
    if (!activeAudio) {
      toast.error('Please select an audio file first');
      return;
    }

    setIsTranscribing(true);
    setTranscribeProgress(0);
    setError(null);

    const controller = new AbortController();
    transcriptionAbortRef.current = () => controller.abort();

    try {
      const response = await fetch(`${BACKEND_URL}/healthscribe/start-transcription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ audioUrl: activeAudio.s3 }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      // Handle streaming response
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        result += decoder.decode(value, { stream: true });
        receivedLength += value.length;

        if (total) {
          const percentage = Math.round((receivedLength / total) * 100);
          setTranscribeProgress(percentage);
        }
      }

      result += decoder.decode();
      const json = JSON.parse(result);

      if (json.error) {
        throw new Error(json.error);
      }

      // Update transcripts
      const newTranscript = json.summary || 'Transcription completed successfully.';
      setOriginalTranscript(newTranscript); // Store as original
      setTranscript(newTranscript); // Set current display
      setRefinedTranscript(''); // Clear any previous refinement
      setShowOriginal(true); // Show original view

      // Update audio object with transcript
      if (activeAudio.isUploaded) {
        const updatedAudio = {
          ...activeAudio,
          transcript: newTranscript,
        };
        setActiveAudio(updatedAudio);

        // Update in uploaded audios list
        setUploadedAudios(prev =>
          prev.map(audio =>
            audio.id === updatedAudio.id ? updatedAudio : audio
          )
        );
      }

      toast.success('Transcription completed!');

    } catch (error) {
      if (error.name === 'AbortError') {
        toast.info('Transcription cancelled');
      } else {
        console.error('Transcription error:', error);
        setError(error.message);
        toast.error(`Transcription failed: ${error.message}`);
      }
    } finally {
      setIsTranscribing(false);
      setTranscribeProgress(0);
      transcriptionAbortRef.current = null;
    }
  };

  const cancelTranscription = () => {
    if (transcriptionAbortRef.current) {
      transcriptionAbortRef.current();
    }
  };

  const formatResponseText = (text) =>
    text.split('\n').map((line, index) => <p key={index}>{line}</p>);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const currentTranscript = showOriginal ? originalTranscript : refinedTranscript || transcript;
    
    if (!currentQuestion.trim() || !currentTranscript) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: currentQuestion },
    ]);
    setCurrentQuestion('');
    setIsLoadingAnswer(true);

    try {
      const response = await fetch(`${BACKEND_URL}/healthscribe/question-ans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          question: currentQuestion,
          transcript: currentTranscript
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer || 'No answer provided.'
        }
      ]);

    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered an error. Please try again.'
        },
      ]);
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  const handleChatClick = () => {
    const currentTranscript = showOriginal ? originalTranscript : refinedTranscript || transcript;
    
    if (!currentTranscript || currentTranscript.includes('sample transcript')) {
      toast.info('Please transcribe an audio file first');
      return;
    }
    setChatModalOpen(true);
  };
  
  const handleRefine = async (formatType = 'SOAP') => {
    const transcriptToRefine = showOriginal ? originalTranscript : refinedTranscript || transcript;
    
    if (!transcriptToRefine) {
      toast.error('No transcript to refine');
      return;
    }

    setIsRefining(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/healthscribe/refine-transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          transcript: transcriptToRefine,
          format_type: formatType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Refinement failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Store in refinement history
        setRefinementHistory(prev => [...prev, {
          id: Date.now(),
          original: transcriptToRefine,
          refined: data.refined_transcript,
          format: formatType,
          timestamp: new Date().toISOString()
        }]);
        
        // Update refined transcript
        setRefinedTranscript(data.refined_transcript);
        
        // Switch to refined view
        setShowOriginal(false);
        
        toast.success(`Transcript refined in ${formatType} format`);
        
      } else {
        toast.error('Failed to refine transcript');
      }
    } catch (error) {
      console.error('Error refining transcript:', error);
      toast.error('Failed to refine transcript');
    } finally {
      setIsRefining(false);
    }
  };

  // Toggle between original and refined view
  const toggleTranscriptView = () => {
    if (refinedTranscript) {
      setShowOriginal(!showOriginal);
    } else {
      toast.info('No refined transcript available. Please refine first.');
    }
  };

  // Revert to original
  const revertToOriginal = () => {
    setShowOriginal(true);
    toast.info('Showing original transcript');
  };

  // Use refined transcript
  const useRefined = () => {
    if (refinedTranscript) {
      setShowOriginal(false);
      toast.success('Showing refined transcript');
    }
  };

  // Clear refinement
  const clearRefinement = () => {
    setRefinedTranscript('');
    setShowOriginal(true);
    setRefinementHistory([]);
    toast.info('Refinement cleared');
  };

  // === Animation Variants ===
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // === JSX ===
  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="mb-8 flex items-center" variants={itemVariants}>
        <FeatureIcon
          icon={Stethoscope}
          size="lg"
          gradient="blue"
          className="mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold heading-font">Health Scribe</h1>
          <p className="text-muted-foreground mt-1">
            Transform medical audio into accurate transcriptions with AI-powered insights
          </p>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Audio Samples */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <div className="sticky top-24">
            <AudioSamples
              sampleAudios={sampleAudios}
              playingAudioId={playingAudioId}
              togglePlay={togglePlay}
              audioProgress={audioProgress}
              selectAudio={selectAudio}
              isLoading={isLoadingSample}
            />

            {uploadedAudios.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-8 mb-4">
                  Uploaded Audios
                </h2>
                <AudioSamples
                  sampleAudios={uploadedAudios}
                  playingAudioId={playingAudioId}
                  togglePlay={togglePlay}
                  audioProgress={audioProgress}
                  selectAudio={selectAudio}
                  />
              </>
            )}
          </div>
        </motion.div>

        {/* Right: Transcript and controls */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <TranscriptDisplay
            activeAudio={activeAudio}
            transcript={showOriginal ? originalTranscript : refinedTranscript || transcript}
            isTranscribing={isTranscribing}
            transcribeProgress={transcribeProgress}
            formattedTranscript={formattedTranscript}
            hasTranscriptionData={hasTranscriptionData}
            handleTranscribe={handleTranscribe}
            handleRefine={handleRefine}
            handleChatClick={handleChatClick}
            handleUploadClick={handleUploadClick}
            handleCancel={cancelTranscription}
            isLoadingSample={isLoadingSample}
            // New props for transcript management
            isRefining={isRefining}
            showOriginal={showOriginal}
            hasRefinedTranscript={!!refinedTranscript}
            toggleTranscriptView={toggleTranscriptView}
            revertToOriginal={revertToOriginal}
            useRefined={useRefined}
            clearRefinement={clearRefinement}
            refinementHistory={refinementHistory}
          />
        </motion.div>
      </div>


      {/* Upload Modal */}
      <UploadModal
        uploadModalOpen={uploadModalOpen}
        setUploadModalOpen={setUploadModalOpen}
        uploadStatus={uploadStatus}
        setUploadStatus={setUploadStatus}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleFileSelect={handleFileSelect}
        handleUpload={handleUpload}
        handleCancel={handleCancel}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        error={error}
      />

      {/* Chat Modal */}
      <ChatModal
        chatModalOpen={chatModalOpen}
        setChatModalOpen={setChatModalOpen}
        chatMessages={chatMessages}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        handleChatSubmit={handleChatSubmit}
        isLoadingAnswer={isLoadingAnswer}
        formatResponseText={formatResponseText}
        chatContainerRef={chatContainerRef}
      />
    </motion.div>
  );
}