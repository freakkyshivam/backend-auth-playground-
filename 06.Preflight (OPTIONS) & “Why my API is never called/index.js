import express from 'express';

const PORT = 3000;
const app = express();
 
// Ye route sirf preflight ke liye hai
// Browser pehle OPTIONS bhejta hai, POST se pehle

app.options("/preflight-test", (req, res) => {

  // Server browser ko bata raha hai:
  // "Is origin ko request bhejne ki permission hai"
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:3001"
  );

  // Kaunse HTTP methods allowed hain
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST"
  );

  // Kaunse headers browser bhej sakta hai
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Agar credentials (cookies) use ho rahe hain
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  // Preflight ke liye body ki zarurat nahi hoti
  res.sendStatus(204);
});


// ================= REAL POST REQUEST =================
app.post("/preflight-test", (req, res) => {

  // Ye headers real request ke response ke liye bhi chahiye
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:3001"
  );
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  // Agar yahan log print hua
  // to matlab preflight SUCCESS ho chuka hai
  console.log("POST /preflight-test HIT");

  res.json({ message: "POST SUCCESS" });
});


// Server start
app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});


// Browser pehle OPTIONS request bhejta hai
// Agar OPTIONS allow na kare → POST kabhi nahi jaata
// Agar OPTIONS allow kare → POST normal chal jaata
// POST ke bina OPTIONS ka failure possible hai


// Preflight fail hua
// → REAL request kabhi browser se nikli hi nahi
