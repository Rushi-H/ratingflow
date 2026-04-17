const bcrypt = require('bcrypt');
const { User, Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role });
    res.status(201).json({ id: user.id, name, email, role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createStore = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, address, ownerName, ownerEmail, ownerPassword, ownerAddress } = req.body;
    
    const existingUser = await User.findOne({ where: { email: ownerEmail } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Owner email already exists' });
    }

    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    const user = await User.create({
      name: ownerName,
      email: ownerEmail,
      password: hashedPassword,
      address: ownerAddress,
      role: 'store_owner'
    }, { transaction });

    const store = await Store.create({
      name,
      email,
      address,
      owner_id: user.id
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ store, owner: { id: user.id, email: user.email } });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['name', 'email'] },
      ]
    });

    // Average rating
    const ratings = await Rating.findAll({
      attributes: ['store_id', [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
      group: ['store_id']
    });
    
    const storesWithStats = stores.map(store => {
      const storeRating = ratings.find(r => r.store_id === store.id);
      return {
        ...store.toJSON(),
        averageRating: storeRating ? parseFloat(storeRating.dataValues.avgRating).toFixed(1) : 0
      };
    });

    res.json(storesWithStats);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{
        model: Store,
        as: 'stores',
        attributes: ['id', 'name'] // include store if they are store owner
      }]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createUser,
  createStore,
  getStats,
  getStores,
  getUsers
};
