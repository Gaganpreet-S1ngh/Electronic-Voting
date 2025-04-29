import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";
import axios from "axios";
import mongoose from "mongoose";
import http from "http";
import { Voter } from "./models/voter.js";
import { connectToDB } from "./config/db.js";

const app = express();
const PORT = 7007;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CA_URL = "https://10.0.4.106:7008/gencertificate";
const db_url = "mongodb://localhost:27017/ElectionVoting"

const setSSLServer = async () => {
    try {
        const response = await axios.post(CA_URL, {
            serverHostname: 'localhost'
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });


        fs.writeFileSync(path.join(__dirname, "certificate/key.pem"), response.data.privateKey);
        fs.writeFileSync(path.join(__dirname, "certificate/cert.pem"), response.data.certificate);

        const sslServer = https.createServer({
            key: fs.readFileSync(path.join(__dirname, "/certificate/key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "/certificate/cert.pem"))
        }, app);

        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());

        connectToDB(db_url);

        //routes

        app.get("/", (req, res) => {
            return res.sendFile(path.join(__dirname, "public", "login.html"));
        });

        app.get("/voting", (req, res) => {
            return res.sendFile(path.join(__dirname, "public", "voting.html"));
        })


        app.post("/loginid", async (req, res) => {
            const id = req.body.ID;
            const result = await Voter.findOne({
                ID: id
            })

            console.log(result);

            if (!result) {
                return res.send("You are not an authorized voter.")
            }

            if (result.hasVoted === false) {
                await Voter.findByIdAndUpdate(result._id, {
                    hasVoted: true
                })
                return res.redirect("/voting");
            }
            else {
                return res.send("You have already voted!");
            }
        })

        app.post("/vote", async (req, res) => {
            try {
                const response = req.body;

                const result = await axios.post("https://10.0.4.106:7008/receivevote", response, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                });

                res.json(response);
            } catch (error) {
                console.error("Error forwarding data to 7008:", error);
                res.status(500).json({ error: "Failed to forward data" });
            }

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