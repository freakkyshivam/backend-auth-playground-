// Goal: CORS ka real behavior dekhna
// Server response bhejega, par browser JS ko read karne se rok sakta hai

import express from 'express';

const PORT = 3000;
const app = express();

app.get("/cors-test", (req, res) => {

  // Server explicitly bol raha hai:
  // "Sirf is origin ka JS response read kar sakta hai"
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:3001"
  );

  // Agar cookies ya credentials use ho rahe hain
  // to ye header mandatory hota hai
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  // Server ka response
  // Ye response actually client tak ja raha hai
  res.json({
    message: "SECRET DATA FROM SERVER",
  });
});


// Server start
app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});


/**
 ✔ Request server tak pahunchti hai
✔ Server response bhejta hai
✔ Response network tab mein dikhta hai
❌ Browser JS ko response read karne nahi deta (agar origin mismatch)

 */

/**
  CORS request ko block nahi karta.
CORS JavaScript access ko block karta hai.

 */