const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const jsonWebKeys = {
  keys: [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'mGFo0Po1dpwf52E9E7NVp/XBk9SUmJniP0Geo22069c=',
      kty: 'RSA',
      n:
        'uRTXSG5imh5kGvG-cy0LVRvMeuNL1FvbtYuufI6mwL1cAFMnZ_K8rqbmowqIA7JPLjjLacfRSXcPJ29lDmUxH1bw0N4y7et1Bq-d8uN2MjxOQD5uCCNuL8QCWVuGLmvG2lRr-ChcCKNbwkgNSkSqrkwbT04c7zBYu1Yf3sdgPfjlbt1ZdEPuoVEBaC3t4cINXXAMCKqiA0992M5po-KI3PG9kM4FdgK6hrUyrctG3rL7yl0oWv7y5YNL6qNo3eRdP3jlaBls5A9rMyt-clQMR7dt9GW1-CeyzIICMY9td--3pu3jVDHmpL5GGKAl1Pv4zvKEAWc1MZ98DkS5JZn49w',
      use: 'sig',
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'V64p3XmOAJv1Bt0WW2YCFnMWGwzxQPdrShpTvw2ZfzE=',
      kty: 'RSA',
      n:
        'tUIrsIWE9gRHi4YM-_vVk40OzyaKta1mBuZ8ZN_-dKA8QdKXnoAFqcY2E-4kQQTaCGdrae2EJK0xydeA3nDRzJSGGraSAsBzc82TG7Sq3zOgxAEsnejfKvMw_eNjpOh8tFxxQJV0gwK0tf44VtXv4wg71KasuuKiNBnhxO5Z_nn4cZI_H3Ks6hvGi9Is8vxOj_aoThG1ZsdNwDssUNGz1Y4ypUxe0F0pCxCJoqv41MJQQddU2js7oWqnPev36oMLRyC_oxNVbcDg0TghOc-s9rLa6j83Io0MxJynBP3LPQx8bsZAW1uzUq-0kxOlkzRAuqIVJI3c_bQGj-KdPsU8RQ',
      use: 'sig',
    },
  ],
};

function decodeTokenHeader(token) {
  const parts = token.split('.');
  const buff = new Buffer(parts[0], 'base64');
  const text = buff.toString('ascii');
  return JSON.parse(text);
}

function getJsonWebKeyWithKID(kid) {
  for (let jwk of jsonWebKeys.keys) {
    if (jwk.kid === kid) {
      return jwk;
    }
  }
  return null;
}

function verifyJsonWebTokenSignature(token, jsonWebKey, clbk) {
  const pem = jwkToPem(jsonWebKey);
  jwt.verify(token, pem, { algorithms: ['RS256'] }, function(
    err,
    decodedToken,
  ) {
    return clbk(err, decodedToken);
  });
}

module.exports = (token) => {
  const header = decodeTokenHeader(token);
  const jsonWebKey = getJsonWebKeyWithKID(header.kid);

  return new Promise((resolve, reject) => {
    verifyJsonWebTokenSignature(token, jsonWebKey, function(err, decodedToken) {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
};
