import crypto from "crypto";

const secret = "whsec_Bfb1/nzntGcpOFwiVzNnBLFtROrYu/Kg";
const payload = JSON.stringify({
  type: "user.created",
  data: { id: "user_123456789" },
});
const id = "evt_abcdef123456"; // Random unique ID, can be any string
const timestamp = Math.floor(Date.now() / 1000).toString();

const toSign = `${timestamp}.${payload}`;
const signature = crypto
  .createHmac("sha256", secret)
  .update(toSign)
  .digest("hex");

console.log("svix-id:", id);
console.log("svix-timestamp:", timestamp);
console.log("svix-signature:", `v1=${signature}`);
