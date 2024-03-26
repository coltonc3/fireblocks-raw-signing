const fs = require('fs');
const { createHash } = require('crypto');

const secretKey = fs.readFileSync('./fireblocks_secret.key', "utf8"); 
const apiKey = fs.readFileSync('./fireblocks_api.key', "utf8"); 

const { FireblocksSDK, TransactionStatus, PeerType, TransactionOperation } = require("fireblocks-sdk");
const fireblocks = new FireblocksSDK(secretKey, apiKey);

/* Make sure to set these every time! */
const TESTNET = true;
const VAULT_ACCOUNT_ID = 1;
const SIGNING_PAYLOAD = "<signing_payload>";
const ASSET_SUBSTRING = "SOL";

async function waitForTxCompletion(fbTx) {
  let tx = fbTx;

  while (tx.status != TransactionStatus.COMPLETED) {
      if(tx.status == TransactionStatus.BLOCKED ||
         tx.status == TransactionStatus.FAILED || 
         tx.status == TransactionStatus.REJECTED || 
         tx.status == TransactionStatus.CANCELLED) {
          console.log("Transaction's status: " + tx.status);
          
          throw Error("Exiting the operation due to error");
      }
      console.log("Transaction's status:",(await fireblocks.getTransactionById(fbTx.id)).status);
      setTimeout(() => { }, 4000);
      
      tx = await fireblocks.getTransactionById(fbTx.id);
                  
  }
  
  return (await fireblocks.getTransactionById(fbTx.id));
}

(async() => {
  let note = "Testing Figment's API with Fireblocks...";

  const fbTx = await fireblocks.createTransaction({
    assetId: TESTNET ? `${ASSET_SUBSTRING}_TEST` : ASSET_SUBSTRING,
    operation: TransactionOperation.RAW,
    source: {
        type: PeerType.VAULT_ACCOUNT,
        id: String(VAULT_ACCOUNT_ID)
    },
    note,
    extraParameters: {
        rawMessageData: {
            messages: [{ content: SIGNING_PAYLOAD }]
        }
    }
  });

  console.log("+*************************************************************************+");
  console.log("|                                                                         |");
  console.log(`|            ${note}                     |`);
  console.log("|                                                                         |");
  console.log("+*************************************************************************+\n\n");
  
  let tx = await waitForTxCompletion(fbTx);

  console.log("Signed tx below:");
  tx.signedMessages.forEach(msg => (console.log(`${msg.signature.fullSig}\n`)));
})();

