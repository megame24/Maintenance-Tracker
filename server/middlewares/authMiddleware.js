import JWToken from '../helpers/JWToken';

const authMiddleware = {
  verifyUser(req, res, next) {
    const token = req.headers.authorization || req.query.token;
    if (token) {
      const decoded = JWToken.verifyToken(token);
      if (decoded) {
        req.body.decoded = decoded;
        next();
      } else {
        res.status(401).json({ error: { message: 'Authentication failed' } });
      }
    } else {
      res.status(401).json({ error: { message: 'Authentication failed' } });
    }
  },
  allowUnverified(req, res, next) {
    next();
  }
};

export default authMiddleware;
