import type { FlightSearchParams, FlightSearchResult, FlightOffer } from './types/flightSearch';
const Amadeus = require('amadeus');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResult> {
  try {
    const searchParams: any = {
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.adults || 1,
      nonStop: params.nonStop || false,
      currencyCode: params.currency || 'USD',
      max: params.max || 250
    };

    if (params.returnDate) {
      searchParams.returnDate = params.returnDate;
    }

    if (params.maxPrice) {
      searchParams.maxPrice = params.maxPrice;
    }

    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

    return {
      data: response.data,
      success: true
    };
  } catch (error: unknown) {
    console.error('Flight search error:', error);
    const errorMessage = error instanceof Error ? error.message : 
                        (error as any)?.description || 'Unknown error';
    return {
      error: errorMessage,
      success: false
    };
  }
}

function generateFilename(params: FlightSearchParams): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  return `flights_${params.origin}_${params.destination}_${params.departureDate}_${timestamp}.json`;
}

function saveResultsToFile(data: any, params: FlightSearchParams): void {
  const resultsDir = path.join(__dirname, 'results');
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const filename = generateFilename(params);
  const filePath = path.join(resultsDir, filename);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`\n💾 Results saved to: ${filename}`);
}

async function performFlightSearch(params: FlightSearchParams): Promise<void> {
  try {
    console.log('🔍 Searching flights...');
    console.log(`From: ${params.origin} → ${params.destination}`);
    console.log(`Departure: ${params.departureDate}`);
    if (params.returnDate) console.log(`Return: ${params.returnDate}`);
    if (params.maxPrice) console.log(`Max Price: ${params.maxPrice} ${params.currency}`);
    
    const result = await searchFlights(params);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    const flights: FlightOffer[] = result.data || [];
    
    flights.sort((a: FlightOffer, b: FlightOffer) => 
      parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal)
    );

    console.log(`\n📈 Found ${flights.length} flights`);
    
    if (flights.length === 0) {
      console.log('\n🚫 No flights found matching your criteria.');
      return;
    }

    saveResultsToFile({
      searchParams: params,
      flights: flights,
      timestamp: new Date().toISOString()
    }, params);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error:', errorMessage);
  }
}

function parseArgs(): FlightSearchParams {
  const args = process.argv.slice(2);
  return {
    origin: args[0],
    destination: args[1],
    departureDate: args[2],
    returnDate: args[3] || null,
    maxPrice: args[4] || null,
    currency: args[5] || 'USD',
    nonStop: args[6] === 'true',
    adults: parseInt(args[7]) || 1,
    max: parseInt(args[8]) || 250
  };
}

(async function(): Promise<void> {
  try {
    const params = parseArgs();
    await performFlightSearch(params);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error:', errorMessage);
    process.exit(1);
  }
})();