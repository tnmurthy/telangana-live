# Data Engine Scraping Flow

This diagram illustrates how the Python `data_engine.py` script pulls data from live sources, validates it, and writes it to both the frontend codebase and the backend cache.

```mermaid
flowchart TD
    %% Main Entry Points
    Start((Cron Job / CLI)) --> TaskRouter{Argument Parser}

    %% Task Branches
    TaskRouter -- "--task gold" --> SyncGold[sync_gold]
    TaskRouter -- "--task fuel" --> SyncFuel[sync_fuel]
    TaskRouter -- "--task mandi" --> SyncMandi[sync_pulses]
    TaskRouter -- "--task weather" --> SyncWeather[sync_weather]
    TaskRouter -- "--task rtc" --> SyncRTC[sync_rtc]

    %% Example Sub-Flow for a typical Scraper (e.g., Gold)
    subgraph Data Extraction & Validation
        SyncGold --> FetchURL[HTTP GET Request\nwith Retries]
        FetchURL --> HTMLParser[BeautifulSoup HTML Parsing]
        HTMLParser --> AnomalyCheck{Boundary Checks\n& Normalization}
        AnomalyCheck -- "Fails Check" --> Fallback[Load Fallback Data]
        AnomalyCheck -- "Passes" --> NewsFeed[Fetch Correlated News\nvia NewsAPI]
        Fallback --> NewsFeed
    end

    %% Storage Destinations
    subgraph Storage & Export
        NewsFeed --> BuildJSON[Construct JSON Payload]
        BuildJSON --> WriteLocal[(Write to Local JS Files\ne.g., goldRates.js)]
        BuildJSON --> WriteRedis[(Sync to Upstash Redis\nCache Layer)]
    end
    
    WriteLocal --> Frontend([React Frontend])
    WriteRedis --> API([Serverless Backend APIs])
```
