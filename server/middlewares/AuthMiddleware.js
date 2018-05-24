import JWToken from '../helpers/JWToken';
import requestsHelper from '../helpers/requestsHelper';

class AuthMiddleware {
  static verifyUser(req, res, next) {
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
  }

  static userPass(req, res, next) {
    requestsHelper.foundRequest(req)
      .then(() => {
        const { decoded, request } = req.body;
        if (decoded.id === request.ownerid) {
          return next();
        }
        res.status(403).json({ error: { message: 'You do not have permission to do that' } });
      })
      .catch(() => res.status(404).json({ error: { message: 'Request not found' } }));
  }

  static adminPass(req, res, next) {
    requestsHelper.foundRequest(req)
      .then(() => {
        const { decoded } = req.body;
        if (decoded.role === 'admin') {
          return next();
        }
        res.status(403).json({ error: { message: 'You do not have permission to do that' } });
      })
      .catch(() => res.status(404).json({ error: { message: 'Request not found' } }));
  }
}

export default AuthMiddleware;
