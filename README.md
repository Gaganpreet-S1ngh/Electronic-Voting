🗳️ Electronic Voting System using Node.js, Shamir Secret Sharing & CA Servers
This project is a secure electronic voting system built with Node.js, using Shamir's Secret Sharing for secure vote distribution and reconstruction. It includes three Certificate Authority (CA) Servers: TrustedAuthority1, TrustedAuthority2, and TrustedAuthority3, which validate and securely store vote shares.

🔐 Features
Shamir's Secret Sharing (2-of-3 threshold)

Three Trusted Authorities for decentralized trust

Voter Authentication

Modular Structure

Vote Reconstruction from CA shares

🗂️ Project Structure
electronic-voting/
├── authorities/
│ ├── TrustedAuthority1/
│ ├── TrustedAuthority2/
│ └── TrustedAuthority3/
├── voter/
│ ├── client.js
│ └── keygen.js
├── shared/
│ └── shamir.js
├── voteCollector/
│ └── server.js
├── README.md
└── package.json

🚀 Getting Started
Step 1: Clone the repository from GitHub and navigate into the project folder.
Step 2: Install the required dependencies using npm.
Step 3: Start each Trusted Authority server individually.
Step 4: Launch the Vote Collector server.
Step 5: Run the Voter Client script to submit a vote.

⚙️ How It Works
Vote Encryption: The voter's ballot is split into 3 shares using Shamir's Secret Sharing.

Distributed Trust: Each share is sent to a separate CA (TrustedAuthority1, 2, and 3).

Threshold Reconstruction: At least 2 out of 3 authorities collaborate to reconstruct the vote during tallying.

Authentication: Voters are validated using a basic identity check (extendable with real PKI).

📦 Technologies Used
Node.js

Express.js

Shamir's Secret Sharing (custom or using shamirs-secret-sharing npm library)

Crypto module

Basic HTTP communication (can be upgraded to HTTPS)

🔐 Security Notes
Use HTTPS and proper JWT/session authentication for real deployment.

CA servers should be hosted independently to preserve trust assumptions.

Votes and keys should be encrypted during transfer and at rest.

📚 References
Shamir's Secret Sharing (Wikipedia): https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing

Node.js Crypto Module: https://nodejs.org/api/crypto.html

shamirs-secret-sharing npm: https://www.npmjs.com/package/shamirs-secret-sharing

📜 License
This project is licensed under the MIT License.

🚧 Future Improvements
Add a front-end interface for voting and results.

Implement full TLS/HTTPS for all servers.

Use real X.509 certificates or blockchain for voter identity.

