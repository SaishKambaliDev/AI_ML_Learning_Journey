/**
 * authMiddleware.js
 * Verifies AWS Cognito JWT tokens on every protected route and socket connection.
 *
 * How it works:
 *   1. Client logs in via Cognito Hosted UI → gets id_token (JWT)
 *   2. Client sends token in Authorization: Bearer <token> header (HTTP)
 *      or as socket.handshake.auth.token (WebSocket)
 *   3. This middleware fetches Cognito's public JWKS keys (cached) and
 *      verifies the token signature + expiry + audience
 *   4. Decoded payload (sub = userId, email, etc.) is attached to req.user / socket.user
 */

const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

// JWKS client — fetches and caches Cognito's public signing keys
const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10 * 60 * 60 * 1000 // 10 hours
});

/**
 * Fetches the correct signing key from Cognito's JWKS endpoint.
 * jwt.verify calls this automatically when verifying a token.
 */
function getSigningKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        callback(null, key.getPublicKey());
    });
}

/**
 * Verifies a raw JWT string and returns the decoded payload.
 * Throws if the token is invalid, expired, or wrong audience.
 */
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            getSigningKey,
            {
                algorithms: ['RS256'],
                issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
                // Validate that the token was issued for our app
                audience: process.env.COGNITO_CLIENT_ID
            },
            (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            }
        );
    });
}

/**
 * Express middleware — protects HTTP routes.
 * Usage: app.use('/api', requireAuth, router)
 */
async function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = await verifyToken(token);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid or expired: ' + err.message });
    }
}

/**
 * Socket.IO middleware — protects WebSocket connections.
 * Usage: io.use(requireAuthSocket)
 * Client must send: socket = io({ auth: { token: '<id_token>' } })
 */
async function requireAuthSocket(socket, next) {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error('AUTH_REQUIRED: No token provided in socket handshake'));
    }
    try {
        socket.user = await verifyToken(token);
        next();
    } catch (err) {
        return next(new Error('AUTH_INVALID: ' + err.message));
    }
}

module.exports = { requireAuth, requireAuthSocket, verifyToken };