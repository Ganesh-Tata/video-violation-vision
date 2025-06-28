
import React, { useState, useRef } from 'react';
import { Upload, Play, Pause, AlertTriangle, Camera, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import ViolationCard from '@/components/ViolationCard';
import { detectViolations } from '@/utils/violationDetector';

interface Violation {
  id: string;
  type: string;
  timestamp: number;
  licensePlate: string;
  confidence: number;
  frameUrl: string;
  description: string;
}

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [violations, setViolations] = useState<Violation[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setViolations([]);
      toast({
        title: "Video uploaded successfully",
        description: "Ready to analyze for traffic violations",
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const detectedViolations = await detectViolations(videoFile, (progress) => {
        setAnalysisProgress(progress);
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setViolations(detectedViolations);

      toast({
        title: "Analysis complete",
        description: `Found ${detectedViolations.length} potential violations`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "An error occurred during video analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 2000);
    }
  };

  const getViolationStats = () => {
    const stats = violations.reduce((acc, violation) => {
      acc[violation.type] = (acc[violation.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Traffic Violation Detection System
          </h1>
          <p className="text-lg text-slate-600">
            AI-powered video analysis for traffic violation detection and license plate recognition
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
          <CardContent className="p-8">
            <div className="text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="video/*"
                className="hidden"
              />
              <div className="mb-4">
                <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Upload Traffic Camera Footage
                </h3>
                <p className="text-slate-500 mb-4">
                  Select a video file to analyze for traffic violations
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                Choose Video File
              </Button>
              {videoFile && (
                <div className="mt-4 text-sm text-slate-600">
                  Selected: {videoFile.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Player and Analysis */}
        {videoUrl && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Video Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VideoPlayer videoUrl={videoUrl} />
                <div className="mt-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze for Violations'}
                  </Button>
                  {isAnalyzing && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Analysis Progress</span>
                        <span>{analysisProgress}%</span>
                      </div>
                      <Progress value={analysisProgress} className="w-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {violations.length}
                      </div>
                      <div className="text-sm text-blue-800">Total Violations</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {violations.filter(v => v.confidence > 0.8).length}
                      </div>
                      <div className="text-sm text-red-800">High Confidence</div>
                    </div>
                  </div>
                  
                  {Object.entries(getViolationStats()).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-slate-700 capitalize">{type.replace('_', ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Violations Results */}
        {violations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Detected Violations
            </h2>
            <div className="grid gap-6">
              {violations.map((violation) => (
                <ViolationCard key={violation.id} violation={violation} />
              ))}
            </div>
          </div>
        )}

        {/* No violations found */}
        {violations.length === 0 && videoUrl && !isAnalyzing && analysisProgress === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-green-600 mb-4">
                <AlertTriangle className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No violations detected
              </h3>
              <p className="text-slate-500">
                The AI analysis found no traffic violations in this video footage.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
