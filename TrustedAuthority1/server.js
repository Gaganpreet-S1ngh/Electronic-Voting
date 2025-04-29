import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";
import axios from "axios";



const app = express();
const PORT = 7009;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CA_URL_Certificate = "https://localhost:7008/gencertificate";
const CA_URL_Share = "https://localhost:7008/locAuthority1";






const setSSLServer = async () => {
    try {
        const response = await axios.post(CA_URL_Certificate, {
            serverHostname: 'localhost'
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        fs.writeFileSync(path.join(__dirname, "key.pem"), response.data.privateKey);
        fs.writeFileSync(path.join(__dirname, "cert.pem"), response.data.certificate);

        const sslServer = https.createServer({
            key: fs.readFileSync(path.join(__dirname, "key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "cert.pem"))
        }, app);

        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());


        //routes


        const response_share = await axios.post(CA_URL_Share, {
            serverHostname: 'localhost'
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        console.log(response_share.data);


        app.post("/recievevotes", (req, res) => {
            console.log(req.body);
        })


        sslServer.listen(PORT, () => {
            console.log(`Secure Server running on https://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error setting up SSL server:", error);
        process.exit(1);
    }
}


setSSLServer();