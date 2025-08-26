export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-IN').format(number);
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeout: number;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateMapUrl = (lat: number, lon: number, zoom: number = 15): string => {
  return `https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`;
};

export const getMarkerColor = (type: string): string => {
  const colors: Record<string, string> = {
    wholesale: '#22c55e',
    retail: '#3b82f6',
    specialty: '#f59e0b',
    default: '#6b7280'
  };
  return colors[type] || colors.default;
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return '#22c55e';
  if (rating >= 4.0) return '#84cc16';
  if (rating >= 3.5) return '#f59e0b';
  if (rating >= 3.0) return '#f97316';
  return '#ef4444';
};

export const getCommodityIcon = (commodity: string): string => {
  const icons: Record<string, string> = {
    wheat: '🌾',
    rice: '🌾',
    vegetables: '🥬',
    fruits: '🍎',
    onion: '🧅',
    potato: '🥔',
    tomato: '🍅',
    cotton: '🌱',
    soybean: '🌱',
    spices: '🌶️',
    flowers: '🌸',
    tea: '🍃',
    coconut: '🥥',
    default: '🏪'
  };
  return icons[commodity?.toLowerCase()] || icons.default;
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const isMarketOpen = (operatingHours: string): boolean => {
  if (!operatingHours) return true;
  
  try {
    const [start, end] = operatingHours.split('-');
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
  } catch (error) {
    return true; // Default to open if can't parse
  }
};

export const getOptimizationIcon = (method: string): string => {
  const icons: Record<string, string> = {
    time: '⏱️',
    distance: '📏',
    cost: '💰',
    default: '🎯'
  };
  return icons[method] || icons.default;
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  
  // Remove country if it's India to save space
  return address.replace(', India', '').trim();
};

export const getDirectionsUrl = (fromLat: number, fromLon: number, toLat: number, toLon: number): string => {
  // Google Maps directions URL
  return `https://www.google.com/maps/dir/${fromLat},${fromLon}/${toLat},${toLon}`;
};

export const shareLocation = async (lat: number, lon: number, name: string): Promise<boolean> => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  const text = `Check out ${name} location: ${url}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${name} Location`,
        text: text,
        url: url
      });
      return true;
    } catch (error) {
      console.log('Sharing failed:', error);
    }
  }
  
  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.log('Copy to clipboard failed:', error);
    return false;
  }
};

export const validateCoordinates = (lat: number | string, lon: number | string): { valid: boolean; error?: string; lat?: number; lon?: number } => {
  const latitude = parseFloat(lat.toString());
  const longitude = parseFloat(lon.toString());
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return { valid: false, error: 'Invalid coordinates' };
  }
  
  if (latitude < -90 || latitude > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  
  if (longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  
  return { valid: true, lat: latitude, lon: longitude };
};

export interface LocationData {
  lat: number;
  lon: number;
  accuracy?: number;
}

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};
