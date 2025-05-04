import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  LinearProgress,
  Container,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

export default function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const fileInputRef = useRef(null);

  // Handle progress animation when loading
  useEffect(() => {
    let timer;
    let statusTimer;
    
    if (loading) {
      // Reset progress
      setProgress(0);
      setProcessingStatus('Initializing CNN model...');
      
      // Animate progress from 0 to 100 over 2 seconds
      const startTime = Date.now();
      const duration = 2000; // 2 seconds
      
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const nextProgress = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(nextProgress);
        
        if (nextProgress >= 100) {
          clearInterval(timer);
        }
      }, 20); // Update every 20ms for smooth animation
      
      // Update status text at different points
      statusTimer = setTimeout(() => {
        setProcessingStatus('Loading model weights...');
        
        setTimeout(() => {
          setProcessingStatus('Analyzing X-ray features...');
          
          setTimeout(() => {
            setProcessingStatus('Finalizing prediction...');
          }, 700);
        }, 700);
      }, 600);
    }
    
    return () => {
      clearInterval(timer);
      clearTimeout(statusTimer);
    };
  }, [loading]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setPrediction(null);
    setError(null);

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setImage(file);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Reset states
      setPrediction(null);
      setError(null);
  
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
  
      setImage(file);
  
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', image);

      // Wait for the progress animation to complete (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Make actual API call to the prediction endpoint
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetAll = () => {
    setImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    setProgress(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh', 
      bgcolor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#3f51b5', fontWeight: 500 }}>
          Alveoli Infection Detection Using CNN
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          A medical imaging tool for pneumonia detection in X-ray images
        </Typography>
      </Box>

      <Container maxWidth="md">
        {/* Main Content */}
        {!loading && !prediction && (
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 3, textAlign: 'center' }}>
                Upload X-ray Image
              </Typography>
              
              <Box 
                sx={{ 
                  border: '2px dashed #d0d0d0',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  mb: 3,
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  accept="image/*"
                />

                {imagePreview ? (
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <img
                      src={imagePreview}
                      alt="X-ray preview"
                      style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                ) : (
                  <>
                    <ImageIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      Drag & drop your X-ray image here
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      or click to browse files
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Supported formats: JPEG, PNG, TIFF
                    </Typography>
                  </>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePredict}
                  disabled={!image}
                  sx={{ 
                    px: 4, 
                    borderRadius: 28,
                    bgcolor: '#2196f3',
                    '&:hover': {
                      bgcolor: '#1976d2',
                    }
                  }}
                >
                  Detect Infection
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress size={40} thickness={4} sx={{ color: '#2196f3', mb: 2 }} />
              <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                Processing
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Our CNN model is analyzing your X-ray image
              </Typography>
              
              <Box sx={{ width: '100%', my: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#2196f3'
                    }
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                {processingStatus}
              </Typography>
              
              <Button 
                variant="text" 
                onClick={resetAll}
                sx={{ 
                  color: '#5c5c5c',
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results View */}
        {prediction && !loading && (
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 3, textAlign: 'center' }}>
                Results
              </Typography>
              
              {/* X-ray Image Result */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                  Uploaded X-ray Image
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="X-ray"
                    style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </Box>
              </Paper>
              
              {/* Prediction Result */}
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 2,
                  bgcolor: prediction.prediction === "PNEUMONIA" ? '#fff5f5' : '#f5fff7',
                  border: prediction.prediction === "PNEUMONIA" ? '1px solid #ffcccc' : '1px solid #ccffcc',
                  textAlign: 'center'
                }}
              >
                {prediction.prediction === "PNEUMONIA" ? (
                  <>
                    <WarningIcon sx={{ fontSize: 32, color: '#d32f2f', mb: 1 }} />
                    <Typography variant="h6" component="h3" sx={{ color: '#d32f2f' }}>
                      Pneumonia Detected
                    </Typography>
                    {/* <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Probability: {Math.round(prediction.probability * 100)}%
                    </Typography> */}
                  </>
                ) : (
                  <>
                    <CheckIcon sx={{ fontSize: 32, color: '#2e7d32', mb: 1 }} />
                    <Typography variant="h6" component="h3" sx={{ color: '#2e7d32' }}>
                      Normal
                    </Typography>
                    {/* <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Probability: {Math.round((1 - prediction.probability) * 100)}%
                    </Typography> */}
                  </>
                )}
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={resetAll}
                  sx={{ 
                    px: 3, 
                    borderRadius: 28,
                    bgcolor: '#2196f3',
                    '&:hover': {
                      bgcolor: '#1976d2',
                    }
                  }}
                >
                  Analyze Another Image
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Footer */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
        © 2025 Alveoli Infection Detection. All rights reserved.
      </Typography>
    </Box>
  );
}