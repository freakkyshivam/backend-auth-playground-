// Goal: Samajhna ki browser actual mein kya-kya bhejta hai
// Headers, method, aur cookies ka raw view dekhna

import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;

// Cookie-parser middleware
// Iske bina req.cookies undefined rahega
app.use(cookieParser());

 
// Browser vs Postman ka difference dekhne ke liye

app.get('/inspect', (req, res) => {

    // Request ka raw data return kar rahe hain
    // Taaki hum clearly dekh sakein:
    // - kaunse headers aaye
    // - kaunsa HTTP method use hua
    // - cookies bheji gayi ya nahi
    res.json({
        method: req.method,        // GET / POST / etc.
        headers: req.headers,      // Saare request headers
        cookies: req.cookies || null // Browser ke cookies (agar hain)
    });
});


// Server start
app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
});

/**
 # Browser request mein --
 ✔ User-Agent
✔ Accept
✔ Accept-Encoding
✔ Accept-Language
✔ Connection
✔ Cookies (agar present)

# Postman request mein
✔ Minimal headers
✔ No automatic cookies
✔ No browser security rules
 */

/**
 Browser ≠ normal HTTP client

Browser:
• Cookies automatically attach karta hai
• CORS enforce karta hai
• SameSite, Secure follow karta hai

Postman:
• Sirf HTTP bhejta hai
• Koi browser rule nahi maanta

 */