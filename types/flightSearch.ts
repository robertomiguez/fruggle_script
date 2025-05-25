export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  maxPrice?: string | null;
  currency: string;
  nonStop: boolean;
  adults: number;
  max: number;
}

export interface FlightSearchResult {
  data?: any;
  success: boolean;
  error?: string;
}

export interface FlightOffer {
  price: {
    grandTotal: string;
    currency: string;
  };
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
    }>;
    duration: string;
  }>;
}
