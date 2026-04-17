const validators = {
  name: /^.{20,60}$/,
  address: /^.{0,400}$/,
  password: /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

const validateSignup = (req, res, next) => {
  const { name, email, password, address } = req.body;
  if (!validators.name.test(name)) return res.status(400).json({ error: 'Name must be 20-60 characters' });
  if (!validators.email.test(email)) return res.status(400).json({ error: 'Invalid email format' });
  if (!validators.password.test(password)) return res.status(400).json({ error: 'Password must be 8-16 characters, 1 uppercase, 1 special char' });
  if (address && !validators.address.test(address)) return res.status(400).json({ error: 'Address exceeds 400 characters' });
  next();
};

const validateAdminUserCreate = (req, res, next) => {
  const { name, email, password, address, role } = req.body;
  if (!validators.name.test(name)) return res.status(400).json({ error: 'Name must be 20-60 characters' });
  if (!validators.email.test(email)) return res.status(400).json({ error: 'Invalid email format' });
  if (!validators.password.test(password)) return res.status(400).json({ error: 'Password must be 8-16 characters, 1 uppercase, 1 special char' });
  if (address && !validators.address.test(address)) return res.status(400).json({ error: 'Address exceeds 400 characters' });
  if (!['admin', 'user', 'store_owner'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  next();
};

const validateStoreCreate = (req, res, next) => {
  const { name, email, address, ownerName, ownerEmail, ownerPassword, ownerAddress } = req.body;
  if (!name || name.trim() === '') return res.status(400).json({ error: 'Store name is required' });
  if (!validators.email.test(email)) return res.status(400).json({ error: 'Invalid store email format' });
  if (address && !validators.address.test(address)) return res.status(400).json({ error: 'Store address exceeds 400 characters' });
  
  if (!validators.name.test(ownerName)) return res.status(400).json({ error: 'Owner name must be 20-60 characters' });
  if (!validators.email.test(ownerEmail)) return res.status(400).json({ error: 'Invalid owner email format' });
  if (!validators.password.test(ownerPassword)) return res.status(400).json({ error: 'Owner password must be 8-16 characters, 1 uppercase, 1 special char' });
  if (ownerAddress && !validators.address.test(ownerAddress)) return res.status(400).json({ error: 'Owner address exceeds 400 characters' });
  next();
};

const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || currentPassword.trim() === '') return res.status(400).json({ error: 'Current password required' });
  if (!validators.password.test(newPassword)) return res.status(400).json({ error: 'New password must be 8-16 characters, 1 uppercase, 1 special char' });
  next();
};

module.exports = {
  validators,
  validateSignup,
  validateAdminUserCreate,
  validateStoreCreate,
  validatePasswordChange
};
