// Express framework import
// Simple HTTP server banane ke liye
import express from 'express';

// JSON Web Token library
// JWT create aur verify karne ke kaam aati hai
import jwt from 'jsonwebtoken';

// JWT sign karne ke liye secret key
// Real project mein ye ENV variable hota hai
const secret = 'SUPERSECRET';

// Express app initialize
const app = express();

// Server ka port
const PORT = 3000;


// ================= LOGIN ROUTE =================
app.get('/login', (req, res) => {

    // JWT create kar rahe hain
    // Payload mein userId daal diya
    // Token 1 hour ke baad expire ho jayega
    const token = jwt.sign(
        { userId: 1 },
        secret,
        { expiresIn: "1h" }
    );

    // Client ko token return kar rahe hain
    // Ab client is token ko store karega (usually localStorage / memory)
    res.json({ token });
});


// ================= PROTECTED ROUTE =================
app.get('/profile', (req, res) => {

    // Authorization header se token nikal rahe hain
    // Format hota hai: "Bearer <token>"
    const auth = req.headers.authorization;

    // Agar Authorization header hi nahi hai
    // to user unauthorized hai
    if (!auth) return res.status(401).send("No token");

    try {
        // "Bearer <token>" ko split karke actual token nikal rahe hain
        const token = auth.split(" ")[1];

        // Token verify kar rahe hain
        // Agar token invalid ya expire hai to error throw hoga
        const payload = jwt.verify(token, secret);

        // Token valid hai, user authenticated hai
        res.json({ userId: payload.userId });

    } catch {
        // Token invalid / expired / tampered
        res.status(401).send("Invalid token");
    }
});


// ================= LOGOUT ROUTE =================
app.get('/logout', (req, res) => {

    // JWT system mein logout ka koi real meaning nahi hota
    // Kyunki token client ke paas hota hai
    // Server ke paas use invalidate karne ka koi direct way nahi
    res.send("Logged out (fake)");
});


// ================= SERVER START =================
app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
});
