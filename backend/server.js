const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// ✅ MongoDB Direct Connection with DB name `disaster`
mongoose.connect(
  'mongodb+srv://jellavineela17:Vineela123@cluster0.m1qx8we.mongodb.net/disaster',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Mongo Error:', err));

// ✅ Gemini API Key
const GEMINI_API_KEY = 'AIzaSyDg_Z6ClBH52_wGXv_ELHPcgvdLC06XVfo';

// ✅ Disaster Schema
const disasterSchema = new mongoose.Schema({
  title: String,
  location_name: String,
  location: { lat: Number, lng: Number },
  description: String,
  tags: [String],
  owner_id: String,
  created_at: { type: Date, default: Date.now },
  audit_trail: [Object]
});

const Disaster = mongoose.model('Disaster', disasterSchema);

// ➕ Create Disaster
app.post('/disasters', async (req, res) => {
  const data = req.body;
  const disaster = new Disaster(data);
  disaster.audit_trail = [{ action: 'create', user_id: data.owner_id, timestamp: new Date() }];
  await disaster.save();
  io.emit('disaster_updated', disaster);
  res.status(201).json(disaster);
});

// 🔍 Read All or by Tag
app.get('/disasters', async (req, res) => {
  const tag = req.query.tag;
  const results = tag ? await Disaster.find({ tags: tag }) : await Disaster.find();
  res.json(results);
});

// ✏️ Update Disaster
app.put('/disasters/:id', async (req, res) => {
  const update = req.body;
  const disaster = await Disaster.findByIdAndUpdate(req.params.id, {
    ...update,
    $push: {
      audit_trail: {
        action: 'update',
        user_id: update.owner_id || 'unknown',
        timestamp: new Date()
      }
    }
  }, { new: true });
  io.emit('disaster_updated', disaster);
  res.json(disaster);
});

// ❌ Delete Disaster
app.delete('/disasters/:id', async (req, res) => {
  await Disaster.findByIdAndDelete(req.params.id);
  io.emit('disaster_updated', { deleted: req.params.id });
  res.json({ message: 'Deleted' });
});

// 🌍 Location Extraction via Gemini + Mock Geocoding
app.post('/geocode', async (req, res) => {
  const { description } = req.body;

  try {
    // 🌟 Extract location name using Gemini
  app.post('/geocode', async (req, res) => {
  const { description } = req.body;

  try {
    // 🌟 Extract location name using Gemini
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: `Extract the location from this text: ${description}` }]
          }
        ]
      }
    );

    const location_name = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!location_name) {
      return res.status(400).json({ error: 'Location name could not be extracted' });
    }

    // 🌟 Geocode using OpenStreetMap
    const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: { q: location_name, format: 'json', limit: 1 }
    });

    if (!geoRes.data.length) {
      return res.status(404).json({ error: 'Location not found in OpenStreetMap' });
    }

    const { lat, lon } = geoRes.data[0];

    res.json({
      location_name,
      lat: parseFloat(lat),
      lng: parseFloat(lon)
    });

  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});

    if (geoRes.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lon } = geoRes.data[0];
    res.json({ location_name, lat: parseFloat(lat), lng: parseFloat(lon) });

  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});

// 🐦 Mock Social Media Feed
app.get('/disasters/:id/social-media', async (req, res) => {
  const mockPosts = [
    { post: '#floodrelief Need food in NYC', user: 'citizen1' },
    { post: '#earthquake trapped in basement', user: 'citizen2' }
  ];
  io.emit('social_media_updated', mockPosts);
  res.json(mockPosts);
});

// 📸 Image Verification via Gemini Vision API
app.post('/disasters/:id/verify-image', async (req, res) => {
  const { image_url } = req.body;

  try {
    const geminiVision = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: `Analyze this image for signs of disaster or manipulation: ${image_url}` }
          ]
        }]
      }
    );

    const result = geminiVision.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No result';
    res.json({ verification_result: result });

  } catch (err) {
    res.status(500).json({ error: 'Image verification failed', details: err.message });
  }
});

// 🔌 WebSocket
io.on('connection', socket => {
  console.log('🔌 Socket connected');
  socket.on('disconnect', () => console.log('❌ Socket disconnected'));
});

// 🚀 Start Server
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
