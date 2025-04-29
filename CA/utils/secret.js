import * as sss from "shamirs-secret-sharing";
import * as paillierBigint from 'paillier-bigint';

export async function secretKey() {
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(32);


    const privateKeyString = JSON.stringify({
        _p: privateKey._p.toString(),
        _q: privateKey._q.toString(),
        lambda: privateKey.lambda.toString(),
        mu: privateKey.mu.toString()
    });

    console.log("Serialized Private Key (String):", privateKeyString);

    console.log("Private Key:", privateKey);
    console.log("Public Key:", publicKey);

    return {
        privateKeyString,
        privateKey,
        publicKey
    };
}

export async function splitShares(privateKeyString) {

    const secret = Buffer.from(privateKeyString);


    const shares = sss.split(secret, { shares: 3, threshold: 2 });
    console.log("Shares:", shares);

    const sharesToCombine = [shares[0], shares[1]];
    console.log("Shares to Combine:", sharesToCombine);


    const recovered = sss.combine(sharesToCombine);
    const recovered_string = recovered.toString("utf-8");
    const deserializedPrivateKey = JSON.parse(recovered_string);

    const privateKeyRecreated = {
        _p: BigInt(deserializedPrivateKey._p),
        _q: BigInt(deserializedPrivateKey._q),
        lambda: BigInt(deserializedPrivateKey.lambda),
        mu: BigInt(deserializedPrivateKey.mu)
    };

    console.log("Recreated Private Key:", privateKeyRecreated);

    return shares;
}


export async function addVote(privateKey, publicKey, voteCount, candidate) {
    if (candidate === "A") {
        const c1 = publicKey.encrypt(0);
        const c2 = publicKey.encrypt(BigInt(voteCount));
        console.log("Encrypted Votes : ", c2);

        const encryptedSum = publicKey.addition(c1, c2);
        const decryptedSum = privateKey.decrypt(encryptedSum);
        console.log("Decrypted Vote Count:", decryptedSum);
    }


    if (candidate === "B") {
        const c1 = publicKey.encrypt(bigInt);
        const c2 = publicKey.encrypt(BigInt(voteCount));
        console.log("Encrypted Votes : ", c2);

        const encryptedSum = publicKey.addition(c1, c2);
        const decryptedSum = privateKey.decrypt(encryptedSum);
        console.log("Decrypted Vote Count:", decryptedSum);
    }
}




