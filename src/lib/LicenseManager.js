import { verify } from "crypto";

/**
 * This is the public key counterpart of your public/private
 * key-pair combination you use to generate the signature.
 */
const publicKey = require("./../assets/publicKey").default.key;

class LicenseManager {
    /**
     * Verify the given data and signature.
     * 
     * @param {String} signature 
     * @param {String} data 
     */
    verifyLicenseKey(signature, data) {
        return verify(
            "sha256",
            Buffer.from(data),
            publicKey,
            Buffer.from(signature, "base64")
        )
    }
}

export default new LicenseManager