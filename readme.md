# ✈️ Flight Search CLI Tool

A command-line interface for searching flight offers using the Amadeus API.

## 📦 Prerequisites

- Node.js (v14+)
- npm or yarn
- Amadeus API credentials

## 🛠 Installation

1. Clone the repository:
   ```command
   git clone https://github.com/robertomiguez/fruggle_script
   cd fruggle_script
   ```

2. Clone the repository:
   ```command
    npm install amadeus dotenv
    ```

3. Create a .env file with your Amadeus credentials:
   ```command
    AMADEUS_API_KEY=your_api_key
    AMADEUS_API_SECRET=your_api_secret
    ```

## 🚀 Usage

Run directly from the project root:

Basic Search (One-way)
```command
    npx ts-node flight_search.ts ORIGIN DESTINATION DEPARTURE_DATE
```
Round-trip Search

```bash
npx ts-node flight_search.ts ORIGIN DESTINATION DEPARTURE_DATE RETURN_DATE
```
Advanced Options
``` bash
npx ts-node flight_search.ts ORIGIN DESTINATION DEPARTURE_DATE RETURN_DATE MAX_PRICE CURRENCY NONSTOP ADULTS MAX_RESULTS
```

## 📂 Results Structure

Search results are automatically saved in timestamped JSON files:

```bash
/flight-search-cli
├── results/  # All search outputs go here
│   ├── flights_GIG_LIS_2025-10-15_2025-05-25T14-30-00Z.json
│   └── ...
├── flight_search.ts
├── .env
└── README.md
```

## 💡 Tips

    - Airport codes must be IATA format (e.g., "JFK" for New York)
    - Dates must be in YYYY-MM-DD format
    - Set nonStop=true for direct flights only

## 🐛 Troubleshooting

    - Double-check your .env file
    - Ensure environment variables are loaded
    - Verify your Amadeus account status

## 🤝 Contributing

Contributions welcome! Please:
    
    - Fork the repository
    - Create a feature branch
    - Submit a pull request

## 📄 License

    MIT License

 
