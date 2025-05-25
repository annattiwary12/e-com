const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel');



// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) return done(null, existingUser);

    // Create new user
    const newUser = await User.create({
      googleId: profile.id,
      username: profile.displayName, // Map to the required username field
      displayName: profile.displayName,
      email: profile.emails[0].value,
    });

    done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user._id); // Only store user ID in session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Populate req.user
  } catch (err) {
    done(err, null);
  }
});
