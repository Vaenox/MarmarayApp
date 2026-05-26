# 🚆 MarmarayApp

MarmarayApp is a mobile application that displays real-time train schedules for Marmaray, Istanbul's metro system.

## 📱 Features

- **Live Train Schedules**: View departure times of trains from your selected station
- **Two Direction Support**: Track trains going towards Halkalı and Gebze separately
- **Real-time Countdown**: Monitor how many minutes until the next train departs
- **Weekend Schedule Support**: Special trains that run only on weekends are marked
- **Easy Station Selection**: Quickly switch between stations and monitor different stops
- **Dark Theme**: Eye-friendly modern design

## 🚀 Getting Started

1. **Start the Application**:
   ```bash
   npm start
   ```

2. **Choose Your Platform**:
   - **iOS**: Press `i` in the terminal or use `npm run ios`
   - **Android**: Press `a` in the terminal or use `npm run android`
   - **Web**: Press `w` in the terminal or use `npm run web`

## 📖 User Guide

### 1. Station Selection
- When you open the app, you'll see "Select Station" message
- Tap on the station icon or name in the header to open the station selection screen
- Select your station from the list and tap it to save

### 2. Viewing Train Schedules
- See all trains from your selected station in two directions:
  - **Halkalı Direction**: Displayed in red-orange
  - **Gebze Direction**: Displayed in gold-yellow
- Each train card shows:
  - Destination station
  - Departure time
  - Minutes remaining until departure

### 3. Badges & Indicators
- 🕖 **LIVE**: Indicates the app is showing real-time data
- **W/E**: Weekend-only trains (Saturday-Sunday only)
- **Green Badge**: Train departs in less than 2 minutes

### 4. Check the Time
- Live clock is displayed in the top-right corner of the header
- Make sure the app shows the correct time

## 📝 Updating Train Schedules

Train schedules are stored in `src/app/utils/trainTimes.json`. Edit this file to add new stations or update train times.

**JSON Format**:
```json
{
  "stations": {
    "StationName": {
      "halkali": [
        { "departure": "06:30", "destination": "Destination", "weekendOnly": false }
      ],
      "gebze": [
        { "departure": "06:45", "destination": "Destination", "weekendOnly": false }
      ]
    }
  }
}
```

## 🛠️ Technical Information

- **Framework**: React Native / Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet

## 📦 Requirements

- Node.js 16+
- npm or yarn
- Expo CLI (optional)

## 🤝 Feedback

For feedback and suggestions about the application, please contact the project owner.

---

**Version**: 1.0.1  
**Last Updated**: 2026
