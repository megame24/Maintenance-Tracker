/* eslint-disable no-restricted-globals */
import JWToken from '../helpers/JWToken';
import requestsHelper from '../helpers/requestsHelper';
import errors from '../helpers/errorHelper';

class AuthMiddleware {
  /**
   * Verify user through the provided token
   * @param {Object} req - request from client
   * @param {Object} res - error message
   * @param {Function} next - callback pointing to the next middleware/controller
   */
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

  /**
   * Give user access to an endpoint
   * @param {Object} req - request from client
   * @param {Object} res - error message
   * @param {Function} next - callback pointing to the next middleware/controller
   */
  static userPass(req, res, next) {
    if (isNaN(req.params.id)) { 
      return res.status(400)
        .json({ error: { message: 'Request id must be a number, correct the url and try again' } });
    }
    requestsHelper.foundRequest(req)
      .then((result) => {
        if (result.error) return res.status(404).json(result);
        const { decoded, request } = req.body;
        if (decoded.id === request.ownerid) {
          return next();
        }
        res.status(403).json({ error: { message: 'You do not have permission to do that' } });
      })
      .catch(() => {
        res.status(500).json(errors.error500);
      });
  }

  /**
   * Give admin access to an endpoint
   * @param {Object} req - request from client
   * @param {Object} res - error message
   * @param {Function} next - callback pointing to the next middleware/controller
   */
  static adminPass(req, res, next) {
    if (isNaN(req.params.id)) { 
      return res.status(400)
        .json({ error: { message: 'Request id must be a number, correct the url and try again' } });
    }
    requestsHelper.foundRequest(req)
      .then((result) => {
        if (result.error) return res.status(404).json(result);
        const { decoded } = req.body;
        if (decoded.role === 'admin') {
          return next();
        }
        res.status(403).json({ error: { message: 'You do not have permission to do that' } });
      })
      .catch(() => {
        res.status(500).json(errors.error500);
      });
  }
}

export default AuthMiddleware;
