# HarshTube Backend Server

This is the backend server for the HarshTube application, built with Node.js and Express.js.

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Cloudinary integration
- **Real-time Communication**: Socket.IO
- **AI Integration**: OpenAI API
- **Other Key Dependencies**:
  - bcrypt: For password hashing
  - cors: For handling Cross-Origin Resource Sharing
  - cookie-parser: For parsing cookies
  - mongoose-aggregate-paginate-v2: For pagination support
  - socket.io: For real-time features
  - openai: For AI-powered features

## Project Structure

```
server/
├── src/              # Source code directory
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── utils/        # Helper functions
│   ├── middlewares/  # Custom middleware
│   ├── socket/       # WebSocket handlers
│   └── ai/           # AI integration
├── public/           # Public assets
├── node_modules/     # Dependencies
├── package.json      # Project configuration and dependencies
├── .prettierrc      # Prettier configuration
└── .gitignore       # Git ignore rules
```

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5050
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Running the Server**
   ```bash
   npm run dev
   ```
   The server will start on http://localhost:5050 (or the port specified in your .env file)

## API Endpoints

The server provides various endpoints for:
- User authentication (signup, login, logout)
- Video management (upload, update, delete)
- User profile management
- Comments and interactions
- AI-powered features
- Real-time updates

## WebSocket Events

The server implements real-time features using Socket.IO:

### Subscription Events
- `subscription-updated`: Emitted when a user subscribes/unsubscribes
  ```javascript
  {
    channelId: String,
    subscriberId: String,
    isSubscribed: Boolean,
    totalSubscribers: Number
  }
  ```

### Comment Events
- `comment-added`: New comment added
- `comment-updated`: Comment edited
- `comment-deleted`: Comment removed
- `comment-reaction`: Like/dislike on comment

### Video Events
- `video-reaction`: Like/dislike on video
- `video-view`: View count update

## AI Features

The server integrates with OpenAI's API for various AI-powered features:

### Comment Enhancement
- Smart comment suggestions
- Content moderation
- Sentiment analysis

### Content Recommendations
- Video recommendations based on user preferences
- Trending content analysis

## Development

- The server uses nodemon for development, which automatically restarts when changes are detected
- Code formatting is handled by Prettier
- The project follows ES modules syntax (type: "module" in package.json)

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- CORS enabled
- Secure cookie handling
- Environment variable management
- WebSocket authentication
- AI API key protection

## File Upload

The server uses Multer for handling file uploads and Cloudinary for cloud storage of media files.

## Database

MongoDB is used as the primary database with Mongoose as the ODM. The database connection is established in `src/db/index.js`.

## Error Handling

The server implements comprehensive error handling for various scenarios including:
- Database connection errors
- Authentication errors
- File upload errors
- API request validation
- WebSocket connection errors
- AI API errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Database Models

The application uses MongoDB with Mongoose ODM. Here's a detailed breakdown of the data models:

### User Model (`user.model.js`)
```javascript
{
    username: String,      // Required, unique, indexed
    email: String,         // Required, unique
    password: String,      // Required, hashed
    fullName: String,      // Required
    avatar: String,        // Required, Cloudinary URL
    coverImage: String,    // Optional, Cloudinary URL
    watchHistory: [        // Array of Video references
        {
            type: ObjectId,
            ref: 'Video'
        }
    ],
    refreshToken: String   // For JWT refresh token
}
```
**Methods:**
- `isPasswordCorrect(password)`: Verifies password
- `generateAccessToken()`: Generates JWT access token
- `generateRefreshToken()`: Generates JWT refresh token

### Video Model (`video.model.js`)
```javascript
{
    filePath: String,      // Required, video file path
    thumbnail: String,     // Optional, thumbnail URL
    duration: Number,      // Required, video duration
    owner: {              // Reference to User
        type: ObjectId,
        ref: 'User'
    },
    title: String,        // Required
    description: String,  // Required
    views: Number,        // Default: 0
    isPublished: Boolean  // Default: true
}
```
**Features:**
- Supports pagination using mongoose-aggregate-paginate-v2
- Timestamps for creation and updates

### Comment Model (`comment.model.js`)
```javascript
{
    content: String,      // Required
    owner: {             // Reference to User
        type: ObjectId,
        ref: 'User'
    },
    video: {             // Reference to Video
        type: ObjectId,
        ref: 'Video'
    }
}
```
**Features:**
- Supports pagination
- Timestamps for creation and updates

### Additional Models

#### WatchHistory Model (`watchHistory.model.js`)
Tracks user video watch history with timestamps.

#### Likes Model (`likes.model.js`)
Manages video likes and user interactions.

#### Subscription Model (`subscription.model.js`)
Handles user subscriptions and channel following.

#### Playlist Model (`playlist.model.js`)
Manages video playlists with:
- Name and description
- Owner reference
- Array of video references

#### Tweet Model (`tweet.model.js`)
Handles social media integration features.

### Model Relationships
- Users can have multiple videos (one-to-many)
- Videos can have multiple comments (one-to-many)
- Users can have multiple playlists (one-to-many)
- Users can subscribe to multiple channels (many-to-many)
- Videos can be liked by multiple users (many-to-many)
- Users can have multiple watch history entries (one-to-many)

### Database Features
- All models include timestamps (createdAt, updatedAt)
- Proper indexing on frequently queried fields
- Referential integrity through MongoDB references
- Support for pagination where needed
- Secure password hashing
- JWT token generation and management 