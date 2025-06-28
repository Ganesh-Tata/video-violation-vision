
import React from 'react';
import { AlertTriangle, Clock, Hash, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Violation {
  id: string;
  type: string;
  timestamp: number;
  licensePlate: string;
  confidence: number;
  frameUrl: string;
  description: string;
}

interface ViolationCardProps {
  violation: Violation;
}

const ViolationCard: React.FC<ViolationCardProps> = ({ violation }) => {
  const getViolationColor = (type: string) => {
    switch (type) {
      case 'red_light':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'illegal_uturn':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'wrong_lane':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'speeding':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getViolationIcon = (type: string) => {
    return <AlertTriangle className="h-5 w-5" />;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViolationType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getViolationIcon(violation.type)}
            {formatViolationType(violation.type)}
          </CardTitle>
          <Badge 
            className={`${getViolationColor(violation.type)} font-medium`}
            variant="outline"
          >
            {Math.round(violation.confidence * 100)}% confidence
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Violation Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">Time:</span>
                <span className="font-medium">{formatTime(violation.timestamp)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">License:</span>
                <span className="font-mono font-bold text-blue-600">
                  {violation.licensePlate}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {violation.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Confidence:</span>
              <span className={`font-bold ${getConfidenceColor(violation.confidence)}`}>
                {Math.round(violation.confidence * 100)}%
              </span>
            </div>
          </div>

          {/* Frame Capture */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Violation Frame
            </h4>
            <div className="relative bg-slate-100 rounded-lg overflow-hidden">
              <img
                src={violation.frameUrl}
                alt={`${violation.type} violation at ${formatTime(violation.timestamp)}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {formatTime(violation.timestamp)}
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                // Create download link for the frame
                const link = document.createElement('a');
                link.href = violation.frameUrl;
                link.download = `violation_${violation.id}_${violation.timestamp}s.jpg`;
                link.click();
              }}
            >
              Download Frame
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViolationCard;
