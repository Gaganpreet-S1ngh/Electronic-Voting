const paillier = require("paillier-bigint");
const { publicKey, privateKey } = paillier.generateKeypair();

// Encrypting values
const encryptedValue1 = publicKey.encrypt(BigInt(15));
const encryptedValue2 = publicKey.encrypt(BigInt(10));

console.log('Encrypted Value 1:', encryptedValue1.toString());
console.log('Encrypted Value 2:', encryptedValue2.toString());

// Homomorphic Addition (Add the encrypted values)
const encryptedSum = encryptedValue1.add(encryptedValue2);
console.log('Encrypted Sum:', encryptedSum.toString());

// Decrypt the result
const decryptedSum = privateKey.decrypt(encryptedSum);
console.log('Decrypted Sum:', decryptedSum.toString()); // Output should be 25
