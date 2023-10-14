import crypto from 'crypto'
import fs from 'fs'


crypto.generateKeyPair('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    }
}, (err, publicKey, privateKey) => {
    if (err) {
        console.error('Key pair generation error:', err);
    } else {
        fs.writeFileSync('../certs/private.pem', privateKey)
        fs.writeFileSync('../certs/public.pem', publicKey)
    }
});
