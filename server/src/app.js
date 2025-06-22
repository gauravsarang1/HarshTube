import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: [
      'https://harsh-tube.vercel.app',
      'https://harsh-tube-kmsb7zeke-gauravs-projects-dd9fd690.vercel.app',
      'https://harsh-tube-3xg9jjwy2-gauravs-projects-dd9fd690.vercel.app',
      process.env.CORS_ORIGIN // e.g. http://localhost:5173 for dev
    ],
    credentials: true
  }));
  
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public")) 
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import commentRouter from './routes/comment.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import likeRouter from './routes/likes.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import watchHistoryRouter from './routes/watchHistory.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/playlist', playlistRouter)
app.use('/api/v1/watch-history', watchHistoryRouter)

export { app }