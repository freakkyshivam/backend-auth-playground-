// Goal:
// 1. Session fixation attack ko practically samajhna
// 2. Login ke baad session rotate karke isko fix karna

import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Simple in-memory session store
// Real project me Redis / DB use hota hai
const sessions = {};

function newSid() {
  return crypto.randomUUID();
}

function setSidCookie(res, sid) {
  res.cookie('sid', sid, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  });
}

function createAnonymousSession() {
  const sid = newSid();

  sessions[sid] = {
    isAuthenticated: false,
    userId: null,
    createdAt: new Date().toISOString(),
    flow: 'anonymous',
  };

  return sid;
}

function createAuthenticatedSession() {
  const sid = newSid();

  sessions[sid] = {
    isAuthenticated: true,
    userId: 1,
    createdAt: new Date().toISOString(),
    flow: 'rotated-after-login',
  };

  return sid;
}

// ================= BASIC HELPERS =================

app.get('/', (req, res) => {
  res.send(`
Session Fixation Practice

Vulnerable flow:
GET /attacker/fixate
GET /vulnerable/login
GET /vulnerable/profile

Safe flow:
GET /safe/seed
GET /safe/login
GET /safe/profile

Utilities:
GET /debug/sessions
GET /logout
  `);
});

app.get('/debug/sessions', (req, res) => {
  res.json({
    currentCookieSid: req.cookies.sid || null,
    sessions,
  });
});

app.get('/logout', (req, res) => {
  const sid = req.cookies.sid;

  if (sid) {
    delete sessions[sid];
  }

  res.clearCookie('sid', { path: '/' });
  res.send('Logged out and session cleared');
});

// ================= VULNERABLE FLOW =================

app.get('/attacker/fixate', (req, res) => {
  // Attacker victim ke browser me known session id fix karwana chahta hai.
  // Demo me hum deliberately predictable sid use kar rahe hain taaki attack visible ho.
  const forcedSid = 'fixed-session-id-known-to-attacker';

  sessions[forcedSid] = {
    isAuthenticated: false,
    userId: null,
    createdAt: new Date().toISOString(),
    flow: 'fixed-by-attacker',
  };

  setSidCookie(res, forcedSid);

  res.send(
    'Victim browser now holds a pre-chosen sid. If login reuses this sid, session fixation succeeds.'
  );
});

app.get('/vulnerable/login', (req, res) => {
  // Vulnerable behavior:
  // Agar sid already cookie me present hai, app usi ko continue kar leti hai.
  // Yahi fixation ka root problem hai.
  let sid = req.cookies.sid;

  if (!sid || !sessions[sid]) {
    sid = createAnonymousSession();
  }

  sessions[sid] = {
    ...sessions[sid],
    isAuthenticated: true,
    userId: 1,
    loggedInAt: new Date().toISOString(),
    flow: 'vulnerable-login-reused-old-sid',
  };

  setSidCookie(res, sid);

  res.json({
    message: 'Logged in, but existing session id was reused',
    sid,
    warning: 'If attacker already knew this sid, they now own the authenticated session too.',
  });
});

app.get('/vulnerable/profile', (req, res) => {
  const sid = req.cookies.sid;
  const session = sessions[sid];

  if (!sid || !session || !session.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({
    message: 'Vulnerable profile access granted',
    sid,
    userId: session.userId,
    note: 'This route trusts the old fixed sid if login upgraded it.',
  });
});

// ================= SAFE FLOW =================

app.get('/safe/seed', (req, res) => {
  // Ye route sirf demo ke liye hai:
  // Pehle anonymous/pre-auth session issue hota hai.
  // Login ke time isi session ko rotate karna chahiye.
  const sid = createAnonymousSession();

  setSidCookie(res, sid);

  res.json({
    message: 'Anonymous pre-login session created',
    sid,
    note: 'Next step: call /safe/login and notice sid changes.',
  });
});

app.get('/safe/login', (req, res) => {
  const oldSid = req.cookies.sid;

  // Safe behavior:
  // Login ke baad old sid ko destroy karo aur bilkul naya sid issue karo.
  if (oldSid) {
    delete sessions[oldSid];
  }

  const newAuthenticatedSid = createAuthenticatedSession();
  setSidCookie(res, newAuthenticatedSid);

  res.json({
    message: 'Logged in with session rotation',
    oldSid: oldSid || null,
    newSid: newAuthenticatedSid,
    safe: oldSid !== newAuthenticatedSid,
  });
});

app.get('/safe/profile', (req, res) => {
  const sid = req.cookies.sid;
  const session = sessions[sid];

  if (!sid || !session || !session.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({
    message: 'Safe profile access granted',
    sid,
    userId: session.userId,
    note: 'This sid was freshly generated after login.',
  });
});

app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});
