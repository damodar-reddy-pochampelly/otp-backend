# OTP Generation and Verification App

This Node.js application provides OTP (One-Time Password) generation and verification services using Twilio. It allows you to send OTPs to mobile numbers that have been verified by Twilio.

## Folder Structure

The project folder structure looks like this:

- `otp-app/` (Root directory)
  - `index.js` (Main application file)
  - `otp_database.db` (SQLite database for OTP storage)
  - `app.http` (HTTP request examples, if applicable)

## Technologies Used

- Node.js
- Express.js
- SQLite3
- Twilio

## Getting Started

Follow these steps to get the OTP generation and verification app up and running locally:

### Prerequisites

- Node.js and npm (Node Package Manager) must be installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/damodar-reddy-pochampelly/otp-backend.git
   cd otp-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:

   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

   Make sure to replace `your_twilio_account_sid`, `your_twilio_auth_token`, and `your_twilio_phone_number` with your actual Twilio credentials and phone number.

4. Start the application:

   ```bash
   npm start
   ```

The application will start on `http://localhost:3000/`.

## Usage

### Generate OTP

To generate an OTP for a mobile number, make a POST request to `/generate-otp` with the following JSON payload:

```json
{
  "mobileNumber": "your_mobile_number"
}
```

Replace `your_mobile_number` with the recipient's mobile number. The application will send an OTP to the provided mobile number via Twilio.

### Verify OTP

To verify an OTP, make a POST request to `/verify-otp` with the following JSON payload:

```json
{
  "mobileNumber": "your_mobile_number",
  "otp": "the_received_otp"
}
```

Replace `your_mobile_number` with the recipient's mobile number and `the_received_otp` with the OTP received by the recipient. The application will verify the OTP.

## Deployed Version

This app has been deployed using Render. You can access the live version https://otp-generator-cadz.onrender.com.

## Git Repository

- https://github.com/damodar-reddy-pochampelly/otp-backend.git

## Contact

If you have any questions or need further assistance, feel free to contact us at damodarreddy18107@gmail.com.

```

```
