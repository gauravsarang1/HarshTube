import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const allowedOrigins = [
  'https://harsh-tube.vercel.app',
  'https://harsh-tube-kmsb7zeke-gauravs-projects-dd9fd690.vercel.app',
  'https://harsh-tube-3xg9jjwy2-gauravs-projects-dd9fd690.vercel.app',// e.g. http://localhost:5173 for dev
]

if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN)
}

app.use(cors({
    origin: allowedOrigins,
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
import aiRouter from './routes/ai.routes.js'
import viewRouter from './routes/view.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/playlist', playlistRouter)
app.use('/api/v1/watch-history', watchHistoryRouter)
app.use('/api/v1/ai', aiRouter)
app.use('/api/v1/views', viewRouter)

export { app }