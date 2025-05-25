require('dotenv').config(); // ✅ correct

const express = require("express");
const cors = require("cors");
const passport = require("passport");  // Missing passport import
const session = require("express-session"); // Missing session import
const connectDB = require("./config");
const MongoStore = require("connect-mongo"); //
require('./password-config');


// Connect to MongoDB
connectDB();

const app = express();

// Middleware to disable caching
app.use((req, res, next) => {
res.set('Cache-Control', 'no-store');  // Disable caching
next();
});

// Allow Frontend to Access Backend (CORS setup)
app.use(cors({
origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use environment variable for flexibility
credentials: true, // Allow cookies to be sent
}));

// Middleware to parse JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/favicon.ico', express.static('public/favicon.ico'));

// Serve Static Images
app.use("/images", express.static("public/images"));

// Session setup
app.use(session({
secret: process.env.SESSION_SECRET || 'your-secret-key',  // Use environment variable for session secret
resave: false,
saveUninitialized: true,
store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
cookie: {
httpOnly: true,
secure: false, // Set true if using HTTPS
maxAge: 1000 * 60 * 60 * 24 // 1 day
}
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/authRouters'));
app.use('/api/user',require('./routes/userRouter'));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));

app.get('/', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    return res.json({
      username: req.user.displayName || req.user.name,
      email: req.user.email,
    });
  } else if (req.session.user) {
    return res.json({
      username: req.session.user.name,
      email: req.session.user.email,
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get("/api", (req, res) => {
res.send("API is running...");
});

app.use((req, res, next) => {
  console.log("🔐 Session:", req.session);
  console.log("👤 Authenticated user:", req.user);
  next();
});


app.get('/',(req, res) =>{
  res.send({
   activeStatus : true,
   error : false,
  })
  
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
