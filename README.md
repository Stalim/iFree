# iFree API Documentation

## Base URL
```
https://ifree-production.up.railway.app
```

## Quick Start 🚀

All endpoints are accessible without authentication. Just make sure to:
1. Use the correct HTTP method (GET, POST, etc.)
2. Send data in JSON format when required
3. Use multipart/form-data for file uploads

## Available Endpoints 📚

### Health Check
```
GET /test
```
Check if the server and database are running.

### Players
```
GET    /api/players          # Get all players
GET    /api/players/:id      # Get player by ID
POST   /api/players          # Create new player
DELETE /api/players/:id      # Delete player
```

### Tournaments (Knockout)
```
GET    /api/knockout                         # Get all tournaments
GET    /api/knockout/:leagueId              # Get tournament by league
POST   /api/knockout/:leagueId/populate     # Create/update tournament
PATCH  /api/knockout/:leagueId/match/:id    # Update match result
PATCH  /api/knockout/:leagueId/reset/:round # Reset tournament round
```

### Rankings (Tabla)
```
GET /api/tabla      # Get all rankings
GET /api/tabla/:name # Get specific ranking
```

### Events
```
GET /api/events/:id # Get event details
```

## Common Request Examples 📝

### Create a Player
```json
POST /api/players
Content-Type: multipart/form-data

{
  "playerData": {
    "id": "player-id",
    "name": "Player Name",
    "age": 25,
    "nationality": "España",
    "rapStyle": "Technical",
    "stats": {
      "wins": 10,
      "losses": 5,
      "draws": 2,
      "winRate": 58
    },
    "achievements": ["Achievement 1"],
    "description": "Player bio"
  },
  "profileImage": [file],
  "bannerImage": [file]
}
```

### Populate Tournament
```json
POST /api/knockout/redbull_internacional/populate
Content-Type: application/json

{
  "participants": [
    {
      "id": "aczino",
      "name": "Aczino",
      "flag": "🇲🇽"
    },
    // ... 7 more participants (total 8 required)
  ]
}
```

### Update Match Result
```json
PATCH /api/knockout/redbull_internacional/match/123
Content-Type: application/json

{
  "winnerId": "aczino",
  "score1": 3,
  "score2": 1
}
```

## Response Examples 📤

### Player Response
```json
{
  "id": "aczino",
  "name": "Aczino",
  "imageUrl": "/uploads/aczino.jpg",
  "bannerUrl": "/uploads/aczino-banner.jpg",
  "age": 31,
  "nationality": "México",
  "rapStyle": "Punchline / Técnico",
  "stats": {
    "wins": 150,
    "losses": 20,
    "draws": 5,
    "winRate": 84
  },
  "achievements": [
    "3x FMS Internacional Champion",
    "2x Red Bull Internacional Champion"
  ],
  "description": "One of the most successful freestylers..."
}
```

### Tournament Response
```json
{
  "leagueId": "redbull_internacional",
  "title": "Red Bull Batalla Internacional - Final",
  "rounds": [
    {
      "name": "Cuartos de Final",
      "matches": [
        {
          "id": "QF1",
          "date": "2024-03-20T18:00:00Z",
          "competitor1": {
            "id": "aczino",
            "name": "Aczino",
            "flag": "🇲🇽"
          },
          "competitor2": {
            "id": "chuty",
            "name": "Chuty",
            "flag": "🇪🇸"
          },
          "winner": null,
          "score1": 0,
          "score2": 0
        }
        // ... more matches
      ]
    }
    // ... more rounds
  ],
  "currentRound": 0
}
```

## Error Handling ⚠️

The API returns standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error

Error responses include a message:
```json
{
  "message": "Error description",
  "error": "Detailed error info"
}
```

## File Upload Rules 📁

- Supported formats: jpeg, jpg, png, gif
- Files are stored in /uploads
- Access files via: `/uploads/filename.jpg`

## Development 💻

To run locally:
1. Clone the repository
2. Install dependencies: `npm install`
3. Set environment variables in `.env`:
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=3001
   ```
4. Start server: `npm run dev`

## Need Help? 🤝

For issues or questions:
1. Check the error message
2. Verify your request format
3. Ensure all required fields are provided
4. Contact support if problem persists

# Freestyle App

A mobile application for freestyle rap battle events and leagues.

## GitHub Actions Setup for iOS Builds

This repository is configured to automatically build iOS IPA files using GitHub Actions when you push code to the repository. This allows you to bypass the EAS build limits on free accounts.

### Setting up Expo Token

To enable GitHub Actions to build your app, you need to set up an Expo token:

1. Go to [Expo Access Tokens](https://expo.dev/settings/access-tokens)
2. Create a new token with a descriptive name (e.g., "GitHub Actions")
3. Copy the token
4. Go to your GitHub repository
5. Navigate to Settings > Secrets and Variables > Actions
6. Click on "New repository secret"
7. Name: `EXPO_TOKEN`
8. Value: Paste your Expo token
9. Click "Add secret"

### How It Works

When you push code to the repository, GitHub Actions will:

1. Set up a macOS environment
2. Install Node.js and dependencies
3. Install Expo and EAS CLI
4. Configure the EAS build
5. Log in to Expo using your token
6. Build the IPA file
7. You can download the IPA file from the build logs or from your Expo dashboard

### Downloading Your IPA

1. After the build completes, go to the "Actions" tab in your GitHub repository
2. Click on the completed workflow run
3. Find the build URL in the logs
4. Open the URL to download your IPA file from Expo

## Local Development

To run the app locally:

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start
```

## Features

- Events calendar with event details
- Leagues and tournament brackets
- Dark/light mode support
- Player profiles and statistics 