const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Full name is required.' });
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email address is required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  next();
};

const validateFoodItem = (req, res, next) => {
  const { name, price, category, description, image } = req.body;

  if (!name || !price || !category || !description || !image) {
    return res.status(400).json({
      success: false,
      message: 'Name, price, category, description, and image are mandatory fields.'
    });
  }

  if (isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number.'
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateFoodItem
};
