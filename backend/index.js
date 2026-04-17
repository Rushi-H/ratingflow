require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes');
const storeOwnerRoutes = require('./src/routes/storeOwnerRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

const auth = require('./src/middleware/auth');
const roleCheck = require('./src/middleware/roleCheck');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/admin', auth, roleCheck(['admin']), adminRoutes);
app.use('/api', auth, roleCheck(['user']), userRoutes); // User routes are at /api directly based on context.md (e.g. /api/stores)
app.use('/api/store-owner', auth, roleCheck(['store_owner']), storeOwnerRoutes);
app.use('/api/profile', auth, profileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to sync database:', err);
});
