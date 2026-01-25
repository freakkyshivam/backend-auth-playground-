// Goal: Prove karna ki server cookies ko force nahi kar sakta
// Cookie bhejni hai ya nahi — ye browser decide karta hai

import express from 'express';

const app = express();
const PORT = 3000;

 
// Secure cookie behavior samajhne ke liye

app.get("/set-cookie", (req, res) => {

  // Server browser ko bol raha hai:
  // "Ye cookie set kar lo, aur sirf Secure connection pe bhejna"
  // Lekin actual decision browser lega
  res.setHeader(
    "Set-Cookie",
    "secureTest=YES; Secure; HttpOnly; Path=/"
  );

  res.send("Cookie set");
});


app.get('/check-cookie', (req, res) => {

    // Yahan hum direct raw Cookie header dekh rahe hain
    // Agar browser ne cookie attach ki hogi
    // to yahan dikhegi
    res.json(req.headers.cookie || "No cookie received");
});


// Server start
app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
});

/**
 ✔ Server sirf Set-Cookie bhej sakta hai
✔ Cookie attach hogi ya nahi → browser decide karta hai
✔ Secure flag ka behavior browser enforce karta hai
 */


/**
 Cookie sent over HTTP?
→ ONLY if Secure flag is NOT set
 */

/*
DEV EXCEPTION:
Modern browsers allow Secure cookies
over HTTP ONLY on localhost.
*/

/**
 Production mein:
HTTP + Secure cookie = ❌ NEVER
HTTPS + Secure cookie = ✅ ALWAYS
 */