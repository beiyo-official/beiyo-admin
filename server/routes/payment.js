const express = require("express");
const axios = require("axios");
const uniqid = require("uniqid");
const router = express.Router();
const crypto = require('crypto');

router.get('/',(req,res)=>{
  res.send('Payment');
})
router.post('/callback',(req,res)=>{
  res.send('callBack');
})
router.post('/initiate', async (req, res) => {
  try {
    const MERCHANT_ID = process.env.MERCHANTID;
    const API_KEY = process.env.SECRET_KEY;
    const KEY_INDEX = process.env.KEY_INDEX;
    // const KEY_INDEX = 1;
    const merchantTransactionId = uniqid();
    const amount = req.body.amount
    // Payload object
    console.log(amount);
    const paymain = {
      "merchantId": MERCHANT_ID,
      "merchantTransactionId": merchantTransactionId,
      "merchantUserId":'MUID123',
      "amount": amount*100, // Amount in smallest currency unit
      // "redirectUrl": `https://beiyo-admin.vercel.app/api/pay/status/${merchantTransactionId}`,
      "redirectUrl": `https://www.beiyo.in/`,
      "callbackUrl":`https://beiyo-admin.vercel.app/api/pay/callback`,
      "redirectMode": "REDIRECT",
      "mobileNumber": "9617223930",
      "paymentInstrument": {
        type: "PAY_PAGE"
      }
    };

    // Convert payload to base64
    const base64Payload = Buffer.from(JSON.stringify(paymain)).toString('base64');
    console.log("Base64 Payload:", base64Payload);

    // Create signature
    const string = base64Payload + '/pg/v1/pay' + API_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + KEY_INDEX;
    console.log(checksum);


    // Setup Axios options
    const options = {
      method: 'POST',
      url: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      data: {
        request: base64Payload,
      },
    };

    // Make Axios request
    const response = await axios.request(options);
    console.log("Response:", response.data);
    res.json(response.data); // Send response back to the client


  } catch (error) {
    console.log(error)
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json(error);
  }
});

router.get("/status/:merchantTransactionId", async function (req, res) {
try {
  const MERCHANT_ID = process.env.MERCHANTID;
  const { merchantTransactionId } = req.params;
  // check the status of the payment using merchantTransactionId
  if (merchantTransactionId) {
    let statusUrl =`https://api.phonepe.com/apis/hermes/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` 
      

    // generate X-VERIFY
    let string =`/pg/v1/status/${MERCHANT_ID}/` + merchantTransactionId + API_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + KEY_INDEX;

    const options = {
      method: 'GET',
      url: statusUrl,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': MERCHANT_ID
      },
    };

    // Make Axios request
    const response = await axios.request(options);
    console.log("Response:", response.data);
    res.json(response.data); // Send response back to the client
  } else {
    res.send("Sorry!! Error");
  }
} catch (error) {
  console.log(error)
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).send("Internal Server Error");
}
});

module.exports = router;