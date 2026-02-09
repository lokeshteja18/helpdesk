// API Response utilities
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

export const errorResponse = (res, error, statusCode = 500) => {
  res.status(statusCode).json({
    status: 'error',
    error: error.message || error
  });
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Role-based permission checker
export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    'superadmin': 4,
    'admin': 3,
    'agent': 2,
    'user': 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
