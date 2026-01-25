// Express framework import kar rahe hain
// Ye HTTP server banane ke kaam aata hai
import express from 'express'

// Cookie-parser middleware import
// Isse hum req.cookies ke through cookies read kar sakte hain
import cookieParser from 'cookie-parser'

// Node ka crypto module
// Yahan hum secure random session IDs generate karne ke liye use kar rahe hain
import crypto from 'node:crypto'

// Express app initialize
const app = express();

// Server ka port define
const PORT = 3000;

// Cookie-parser ko middleware ke roop mein use kar rahe hain
// Iske bina req.cookies undefined rahega
app.use(cookieParser());

// In-memory session store
// Real production mein yahan DB ya Redis hota hai
const sessions = {};

// ================= LOGIN ROUTE =================
app.get('/login', (req, res) => {

    // Har login pe ek naya random session id generate ho rahi hai
    // Ye important hai taaki session fixation attack na ho
    const sid = crypto.randomUUID();

    // Session store mein sid ke against user data store kar rahe hain
    sessions[sid] = { userId: 1 };

    // Browser ko cookie set kar rahe hain
    res.cookie('sid', sid, {
        sameSite: "strict",  // CSRF se protection ke liye
        httpOnly: true       // JS access se bachane ke liye
    });

    // Client ko response
    res.send("Logged in with cookie");
});


// ================= PROTECTED ROUTE =================
app.get('/profile', (req, res) => {

    // Browser se aayi cookie se session id nikal rahe hain
    const sid = req.cookies.sid;

    // Agar cookie nahi hai ya session exist nahi karta
    // to user unauthorized hai
    if (!sid || !sessions[sid]) {
        return res.status(401).send("Unauthorized");
    }

    // Agar valid session hai to user ka data bhej rahe hain
    res.json({ userId: sessions[sid].userId });
});


// ================= LOGOUT ROUTE =================
app.get("/logout", (req, res) => {

    // Cookie se session id nikal rahe hain
    const { sid } = req.cookies;

    // Server side se session delete kar rahe hain
    // Ye REAL logout hai (JWT ke jaise fake nahi)
    delete sessions[sid];

    // Browser se cookie clear kar rahe hain
    res.clearCookie('sid');

    res.send("Logout");
});


// ================= SERVER START =================
app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
});
