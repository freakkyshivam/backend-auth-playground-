// Goal: SameSite=Strict ka real behavior dekhna
// Browser request bhejega, lekin cookie attach nahi karega

import express from 'express';

const app = express();
const PORT = 3000;

 
app.get("/set-cookie", (req, res) => {

 

  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:5500" // frontend ka origin (HTML file)
  );

  // credentials ke saath cookies allow karne ke liye
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  // SameSite=Strict cookie set kar rahe hain
  // Ye cookie cross-site request pe attach nahi hogi
  res.setHeader(
    "Set-Cookie",
    "samesiteTest=YES; HttpOnly; SameSite=Strict; Path=/"
  );

  res.send("SameSite cookie set");
});


app.get("/check-cookie", (req, res) => {

  // Yahan hum dekh rahe hain
  // browser ne cookie attach ki ya nahi
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:5500"
  );
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  res.json({
    cookie: req.headers.cookie || "NO COOKIE RECEIVED",
  });
});


// Server start
app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});


/*
SameSite:
• Request ko block nahi karta
• Sirf cookie attachment ko block karta
• Browser silently enforce karta hai
*/