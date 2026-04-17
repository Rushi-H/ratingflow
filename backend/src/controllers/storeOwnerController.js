const { Rating, Store, User, sequelize } = require('../models');

const getRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findAll({ where: { owner_id: ownerId } });
    const storeIds = stores.map(s => s.id);

    const ratings = await Rating.findAll({
      where: { store_id: storeIds },
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Store, as: 'store', attributes: ['name'] }
      ]
    });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findAll({ where: { owner_id: ownerId } });
    const storeIds = stores.map(s => s.id);

    if (storeIds.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0 });
    }

    const totalRatings = await Rating.count({ where: { store_id: storeIds } });
    
    // Average rating logic
    const avg = await Rating.findAll({
      where: { store_id: storeIds },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']]
    });

    const averageRating = avg[0]?.dataValues.avgRating ? parseFloat(avg[0].dataValues.avgRating).toFixed(1) : 0;

    res.json({ averageRating, totalRatings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getRatings,
  getStats
};
