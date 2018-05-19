import JWToken from '../helpers/JWToken';
import requestsHelper from '../helpers/requestsHelper';

const authMiddleware = {
  verifyUser(req, res, next) {
    const token = req.headers.authorization || req.query.token;
    if (token) {
      const decoded = JWToken.verifyToken(token);
      if (decoded) {
        req.body.decoded = decoded;
        return next();
      }
      return res.status(401).json({ error: { message: 'Authentication failed' } });
    }
    return res.status(401).json({ error: { message: 'Authentication failed' } });
  },

  authorized(req, res, next) {
    if (!requestsHelper.foundRequest(req)) {
      return res.status(404).json({ error: { message: 'Request not found' } });
    }
    const { decoded, request } = req.body;
    if (decoded.role === 'admin') {
      return next();
    }
    if (decoded.role === 'user' && decoded.id === request.ownerId) {
      return next();
    }
    res.status(403).json({ error: { message: 'You do not have permission to do that' } });
  }
};

export default authMiddleware;
