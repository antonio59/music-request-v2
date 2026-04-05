import express from 'express';
import {
  createUser,
  getUserByUsername,
  verifyPin,
  createRequest,
  getAllRequests,
  getPendingRequests,
  getRequestsByProfile,
  approveRequest,
  rejectRequest,
  updateRequestStatus,
  deleteRequest,
  getAnalytics,
  getBlockedKeywords,
  addBlockedKeyword,
  removeBlockedKeyword,
  getRequestById,
} from '../database.js';
import { searchYouTube } from '../youtube.js';
import { downloadAndUpload } from '../downloader.js';

const router = express.Router();

// Simple session middleware (in-memory, resets on restart)
const sessions = new Map();

function authenticateSession(req, res, next) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  req.user = sessions.get(sessionId);
  next();
}

function requireParent(req, res, next) {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ error: 'Parent access required' });
  }
  next();
}

// Auth routes - PIN-based
router.post('/auth/login', (req, res) => {
  try {
    const { username, pin } = req.body;
    const user = verifyPin(username, pin);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or PIN' });
    }
    
    // Create session
    const sessionId = Math.random().toString(36).substring(2, 15);
    sessions.set(sessionId, user);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        profile: user.profile,
        display_name: user.display_name,
        avatar_emoji: user.avatar_emoji,
      },
      sessionId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/logout', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId) {
    sessions.delete(sessionId);
  }
  res.json({ success: true });
});

// Search route
router.get('/search', authenticateSession, async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const results = await searchYouTube(q, type || 'music');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request routes
router.post('/requests', authenticateSession, (req, res) => {
  try {
    const { profile, title, url, type, searchQuery, thumbnail, duration } = req.body;
    
    // Check for blocked keywords
    const blockedKeywords = getBlockedKeywords();
    const titleLower = title.toLowerCase();
    const violations = blockedKeywords.filter(kw => titleLower.includes(kw.keyword));
    
    if (violations.length > 0) {
      return res.status(400).json({ 
        error: 'Content blocked',
        violations: violations.map(kw => kw.keyword)
      });
    }
    
    const request = createRequest(req.user.id, profile, title, url, type, searchQuery, thumbnail, duration);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/requests', authenticateSession, (req, res) => {
  try {
    if (req.user.role === 'parent') {
      res.json(getAllRequests());
    } else {
      res.json(getRequestsByProfile(req.user.profile));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/requests/pending', authenticateSession, requireParent, (req, res) => {
  try {
    res.json(getPendingRequests());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/requests/:id/approve', authenticateSession, requireParent, (req, res) => {
  try {
    const request = approveRequest(req.params.id, req.user.id);
    // Trigger download in background
    downloadAndUpload(request).catch(console.error);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/requests/:id/reject', authenticateSession, requireParent, (req, res) => {
  try {
    const { reason } = req.body;
    const request = rejectRequest(req.params.id, reason || 'Not specified');
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/requests/:id', authenticateSession, requireParent, (req, res) => {
  try {
    deleteRequest(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics route (parent only)
router.get('/analytics', authenticateSession, requireParent, (req, res) => {
  try {
    res.json(getAnalytics());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blocked keywords
router.get('/blocked-keywords', authenticateSession, requireParent, (req, res) => {
  try {
    res.json(getBlockedKeywords());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/blocked-keywords', authenticateSession, requireParent, (req, res) => {
  try {
    const { keyword } = req.body;
    addBlockedKeyword(keyword, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/blocked-keywords/:id', authenticateSession, requireParent, (req, res) => {
  try {
    removeBlockedKeyword(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get request status (for real-time updates)
router.get('/requests/:id/status', authenticateSession, (req, res) => {
  try {
    const request = getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ status: request.status, internxt_url: request.internxt_url, error_message: request.error_message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
