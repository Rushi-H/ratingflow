const { Store, Rating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const getStores = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    const stores = await Store.findAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['name', 'email'] }
      ]
    });

    const averageRatings = await Rating.findAll({
      attributes: ['store_id', [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
      group: ['store_id']
    });

    const userRatings = await Rating.findAll({
      where: { user_id: userId }
    });

    const result = stores.map(store => {
      const storeAvg = averageRatings.find(r => r.store_id === store.id);
      const myRating = userRatings.find(r => r.store_id === store.id);
      return {
        ...store.toJSON(),
        averageRating: storeAvg ? parseFloat(storeAvg.dataValues.avgRating).toFixed(1) : 0,
        myRating: myRating ? myRating.rating : null,
        myRatingId: myRating ? myRating.id : null
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const existing = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (existing) {
      return res.status(400).json({ error: 'You have already rated this store' });
    }

    const newRating = await Rating.create({ user_id: userId, store_id: storeId, rating });
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const existingRating = await Rating.findByPk(id);
    if (!existingRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (existingRating.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this rating' });
    }

    existingRating.rating = rating;
    await existingRating.save();

    res.json(existingRating);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getStores,
  createRating,
  updateRating
};
