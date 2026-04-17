require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Store, Rating } = require('./src/models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    
    // Admin
    const adminPass = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'System Administrator', // >= 20 chars
      email: 'admin@test.com',
      password: adminPass,
      address: '123 Admin St, Central City',
      role: 'admin'
    });

    // Store Owners & Stores
    const ownerPass = await bcrypt.hash('Owner@123', 10);
    const storesData = [];
    const ownersData = [];
    
    for (let i = 1; i <= 5; i++) {
      const owner = await User.create({
        name: `Store Owner Number ${i}`, // >= 20 chars
        email: `owner${i}@test.com`,
        password: ownerPass,
        address: `${i}00 Owner Ave`,
        role: 'store_owner'
      });
      ownersData.push(owner);

      const store = await Store.create({
        name: `Amazing Store Alpha ${i}`,
        email: `contact@store${i}.com`,
        address: `${i}00 Store St`,
        owner_id: owner.id
      });
      storesData.push(store);
    }

    // Normal Users
    const userPass = await bcrypt.hash('User@1234', 10);
    const usersData = [];
    for (let i = 1; i <= 3; i++) {
      const user = await User.create({
        name: `Normal User Persona ${i}`, // >= 20 chars
        email: `user${i}@test.com`,
        password: userPass,
        address: `${i}00 User Blvd`,
        role: 'user'
      });
      usersData.push(user);
    }

    // Ratings
    for (let i = 0; i < 15; i++) {
      const randomUser = usersData[Math.floor(Math.random() * usersData.length)];
      const randomStore = storesData[Math.floor(Math.random() * storesData.length)];
      const randomRating = Math.floor(Math.random() * 5) + 1;

      // avoid duplicates
      const existing = await Rating.findOne({ where: { user_id: randomUser.id, store_id: randomStore.id } });
      if (!existing) {
        await Rating.create({
          user_id: randomUser.id,
          store_id: randomStore.id,
          rating: randomRating
        });
      }
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
