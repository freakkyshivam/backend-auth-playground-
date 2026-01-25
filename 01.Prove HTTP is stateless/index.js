// Express import kar rahe hain
// Simple HTTP server banane ke liye
import express from 'express';

// Express app initialize
const app = express();

// Server kis port pe chalega
const PORT = 3000;


// ================= PRACTICE 1 =================
// Goal: HTTP ki stateless nature prove karna

app.get('/counter', (req, res) => {

    // Har request pe ek random number generate kar rahe hain
    // Is value ka koi relation previous request se nahi hai
    const count = Math.floor(Math.random() * 1000);

    // Client ko response bhej rahe hain
    res.send(`Count : ${count}`);
});


// Server start kar rahe hain
app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
});

/**
 ✔ Har refresh pe naya response
✔ Server kuch yaad nahi rakhta
✔ Koi session, cookie, DB use nahi ho raha
 */

/**
 HTTP is stateless by default.

Matlab:
• Har request nayi hoti hai
• Server ko nahi pata pehle kya hua
• Memory tab aati hai jab tum khud add karte ho
  (cookies, DB, cache, sessions)

 */