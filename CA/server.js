import express from "express";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs, { write } from "fs";
import https from "https";
import { addVote, splitShares } from "./utils/secret.js";
import { secretKey } from "./utils/secret.js";
import axios from "axios";


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 7008;

const { privateKey, publicKey, privateKeyString } = await secretKey();
const shares = await splitShares(privateKeyString)



app.use(express.json());






const setSSLServer = async () => {
    try {
        execSync("openssl genrsa -out certificate/key.pem 2048");
        execSync(`openssl req -new -key certificate/key.pem -out certificate/csr.pem -subj "/C=IN/ST=Diu/L=Kevdi/O=IIIT VADODARA - ICD/OU=CSE/CN=10.0.4.92/emailAddress=admin@example.com"`);
        execSync("openssl x509 -req -days 365 -in certificate/csr.pem -signkey certificate/key.pem -out certificate/cert.pem");
        const sslServer = https.createServer({
            key: fs.readFileSync(path.join(__dirname, "/certificate/key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "/certificate/cert.pem"))
        }, app);

        sslServer.listen(PORT, () => {
            console.log(`Certification Authority Online!`);
        });

    } catch (error) {
        console.error("Error setting up SSL server:", error);
        process.exit(1);
    }
}

app.post("/gencertificate", (req, res) => {
    try {
        const privateKey = fs.readFileSync(path.join(__dirname, "/certificate/key.pem"), "utf-8");
        const certificate = fs.readFileSync(path.join(__dirname, "/certificate/cert.pem"), "utf-8");

        res.json({
            privateKey,
            certificate,
            message: "Certificates generated successfully!"
        });

    } catch (error) {
        console.error("Error generating certificates:", error);
        res.status(500).json({ error: "Failed to generate certificates" });
    }
});

app.post("/locAuthority1", (req, res) => {
    res.json({
        secret1: shares[0],
    });
});

app.post("/locAuthority2", (req, res) => {
    res.json({
        secret2: shares[1]
    });
});

app.post("/locAuthority3", (req, res) => {
    res.json({
        secret3: shares[2]
    });
});


app.post("/receivevote", async (req, res) => {
    try {
        const voteData = req.body;
        console.log("Candidate Voted : ", voteData);

        const buffer = fs.readFileSync(path.join(__dirname, "votes.json"), "utf-8");
        const data = JSON.parse(buffer);


        if (voteData.option === "A") {
            const c1 = publicKey.encrypt(1);
            const c2 = publicKey.encrypt(BigInt(data.voteSum));
            console.log("Encrypted Votes : ", c2);

            const encryptedSum = publicKey.addition(c1, c2);
            console.log("Encrypted Addition : ", encryptedSum);
            const decryptedSum = privateKey.decrypt(encryptedSum);
            console.log("Decrypted Vote Count:", decryptedSum);

            data.voteSum++;


            const obj = {
                EncryptedVote: c1.toString(),
                TotalVotes: c2.toString()
            }


            data.voteCount++;

            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(path.join(__dirname, "votes.json"), jsonData, "utf-8");

            const [response1, response2, response3] = await axios.all([
                axios.post("https://localhost:7009/recievevotes", obj, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                }),

                axios.post("https://localhost:7010/recievevotes", obj, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                }),

                axios.post("https://localhost:7011/recievevotes", obj, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                })
            ]);

        }



        if (voteData.option === "B") {
            const c1 = publicKey.encrypt(0);
            const c2 = publicKey.encrypt(BigInt(data.voteSum));
            console.log("Encrypted Votes : ", c2);

            const encryptedSum = publicKey.addition(c1, c2);
            console.log("Encrypted Addition : ", encryptedSum);
            const decryptedSum = privateKey.decrypt(encryptedSum);
            console.log("Decrypted Vote Count:", decryptedSum);


            const obj = {
                EncryptedVote: c1.toString(),
                TotalVotes: c2.toString()
            }


            data.voteCount++;

            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(path.join(__dirname, "votes.json"), jsonData, "utf-8");

            const [response1, response2, response3] = await axios.all([
                axios.post("https://localhost:7009/recievevotes", obj, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                }),

                axios.post("https://localhost:7010/recievevotes", obj, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                }),

                axios.post("https://localhost:7011/recievevotes", obj, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                })
            ]);


        }






    } catch (error) {
        console.error("Error processing vote data:", error);
        res.status(500).json({ error: "Failed to process vote data" });
    }
});


setSSLServer();

