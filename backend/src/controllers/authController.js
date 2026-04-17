const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    
    // Check existing
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: 'user'
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  signup,
  login
};
