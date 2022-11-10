## Fireblocks Raw Signing via API ##

**Instructions:**

*First time*
1. Clone the repo
2. Run `npm install`
3. Create two files in the project directory. One called fireblocks_api.key for your Fireblocks API Key (make sure to enter this on a single line), and another called fireblocks_secret.key for the CSR private key used to create the API key.

*Subsequent times*
1. Flip the `TESTNET` flag to desired value
2. Initialize the value of `VAULT_ACCOUNT_ID` to the Fireblocks vault you'll be using, as an int
3. Initialize the value of `SIGNING_PAYLOAD` to the signing payload created by the Staking API, as a string
4. Open terminal and run `node index.js`
5. Use the signatures in stdout to submit back to the Staking API
