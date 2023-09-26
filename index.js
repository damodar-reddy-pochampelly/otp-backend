require("dotenv").config();

const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const twilio = require("twilio");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 3000;

const dbPath = path.join(__dirname, "otp_database.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(PORT, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Generate and send OTP via Twilio
function sendOTPviaTwilio(mobileNumber, otp) {
  return client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: TWILIO_PHONE_NUMBER,
    to: mobileNumber,
  });
}

// Generate OTP and store it
app.post("/generate-otp", async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber || !/^\+?\d{10,15}$/.test(mobileNumber)) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 6-digit OTP

  // Store the OTP (replace this with database storage)
  //otpStorage[mobileNumber] = otp;

  const addOtpQuery = `
    INSERT INTO 
       otps (mobilenumber,otp)
    VALUES 
       ('${mobileNumber}', '${otp}');
  `;

  await db.run(addOtpQuery);

  try {
    // Send OTP via Twilio
    await sendOTPviaTwilio(mobileNumber, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP via Twilio:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp || !/^\d{4}$/.test(otp)) {
    return res.status(400).json({ error: "Invalid OTP or mobile number" });
  }

  // Check if OTP exists for the provided mobile number
  //   if (!otpStorage[mobileNumber]) {
  //     return res.status(400).json({ error: "OTP not found" });
  //   }

  const getOtpQuery = `
    SELECT 
      otp 
    FROM 
      otps 
    WHERE 
      mobilenumber = '${mobileNumber}';
  `;

  const actualOtp = await db.get(getOtpQuery);

  console.log(actualOtp);

  const deleteOtpQuery = `
    DELETE FROM 
        otps 
    WHERE 
       mobilenumber = '${mobileNumber}';
  `;

  if (actualOtp === undefined) {
    return res.status(400).json({ error: "OTP not found" });
  }

  // Check if the provided OTP matches the stored OTP
  if (otp === actualOtp.otp) {
    // OTP is valid, you can clear it from storage here if needed
    await db.run(deleteOtpQuery);
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});
