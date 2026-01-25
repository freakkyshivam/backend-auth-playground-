import express from 'express';

const PORT = 3000;
const app = express();

 
// Global CORS middleware
app.use((req, res, next) => {

  // Server browser ko bata raha hai:
  // "Sirf is exact origin ka JS response read kar sakta hai"
  // IMPORTANT: credentials ke saath '*' allowed nahi hota
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:3001"
  );

  // credentials: "include" ke liye mandatory header
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  next();
});


// ================= LOGIN =================
app.get("/login", (req, res) => {

  // Server browser ko auth cookie set kar raha hai
  // Cookie browser mein store hogi
  res.setHeader(
    "Set-Cookie",
    "authToken=SECRET123; HttpOnly; SameSite=None; Secure; Path=/"
  );

  res.json({ message: "Logged in" });
});


// ================= PROFILE =================
app.get("/profile", (req, res) => {

  // Yahan hum check kar rahe hain
  // browser ne cookie attach ki ya nahi
  res.json({
    cookie: req.headers.cookie || "NO COOKIE",
  });
});


// Server start
app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});


/**
 credentials: "include"
+
Access-Control-Allow-Origin: *
=
❌ cookies silently dropped



Browser silently enforce karta hai.
Server ko lagta hai sab sahi hai.

 */