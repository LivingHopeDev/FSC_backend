import https from "https";
import paymentVerification from "../models/paymentVerification.js";
import Profile from "../models/profile.js";
const paystackKey = process.env.PAYSTACK_SECRET_KEY;

export const deposit = async (req, res) => {
  const { email, amount } = req.body;
  const userId = req.user.id;

  try {
    const params = JSON.stringify({
      email: `${email}`,
      amount: `${amount * 100}`,
      metadata: {
        user: userId,
      },

      callback_url: "http://localhost:3000/verify",
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        "Content-Type": "application/json",
      },
    };
    // client request to paystack API
    const reqpaystack = https
      .request(options, (reqpaystack) => {
        let data = "";

        reqpaystack.on("data", (chunk) => {
          data += chunk;
        });

        reqpaystack.on("end", () => {
          res.status(200).json(data);
        });
      })
      .on("error", (error) => {
        res.send(error);
      });

    reqpaystack.write(params);
    reqpaystack.end();
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

export const verifyDeposit = async (req, res) => {
  const { reference } = req.body;
  const existingReference = await paymentVerification.findOne({ reference });
  if (existingReference) {
    return res
      .status(200)
      .json({
        message: "Incorrect details or transaction has already been completed",
      });
  }

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${paystackKey}`,
    },
  };

  const reqpaystack = https
    .request(options, (respaystack) => {
      let data = "";

      respaystack.on("data", (chunk) => {
        data += chunk;
      });

      respaystack.on("end", async () => {
        const response = JSON.parse(data);
        if (response.message && response.status === true) {
          const amountDeposited = response.data.amount / 100;
          const payerId = response.data.metadata.user;
          const payerDetails = await Profile.findOne({ user: payerId });
          if (!payerDetails) {
            return res
              .status(404)
              .json({ message: "User details not found", data: payerDetails });
          }
          payerDetails.wallet += amountDeposited;
          const newVerification = new paymentVerification({
            user: response.data.metadata.user,
            amount: amountDeposited,
            email: response.data.customer.email,
            customer_code: response.data.customer.customer_code,
            customer_id: response.data.customer.id,
            verification_id: response.data.id,
            reference: response.data.reference,
          });
          await newVerification.save();
          await payerDetails.save();
          res
            .status(200)
            .json({ message: "Deposit verified", data: newVerification });
        }
      });
    })
    .on("error", (error) => {
      res.send(JSON.parse(error));
    });
  reqpaystack.end();
};
