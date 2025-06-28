
interface Violation {
  id: string;
  type: string;
  timestamp: number;
  licensePlate: string;
  confidence: number;
  frameUrl: string;
  description: string;
}

export const detectViolations = async (
  videoFile: File,
  onProgress: (progress: number) => void
): Promise<Violation[]> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate mock violations with simple, valid frame URLs
        const violations: Violation[] = [
          {
            id: `violation_${Date.now()}_1`,
            type: 'red_light',
            timestamp: Math.random() * 60,
            licensePlate: generateMockLicensePlate(),
            confidence: 0.7 + Math.random() * 0.3,
            frameUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZyYW1lIENhcHR1cmU8L3RleHQ+PC9zdmc+',
            description: 'Vehicle ran red light at intersection'
          },
          {
            id: `violation_${Date.now()}_2`,
            type: 'illegal_uturn',
            timestamp: Math.random() * 60,
            licensePlate: generateMockLicensePlate(),
            confidence: 0.6 + Math.random() * 0.4,
            frameUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZyYW1lIENhcHR1cmU8L3RleHQ+PC9zdmc+',
            description: 'Illegal U-turn performed in no U-turn zone'
          }
        ];
        
        console.log('Generated violations:', violations);
        resolve(violations);
      }
    }, 300);
  });
};

const generateMockLicensePlate = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let plate = '';
  for (let i = 0; i < 2; i++) {
    plate += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 4; i++) {
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return plate;
};
