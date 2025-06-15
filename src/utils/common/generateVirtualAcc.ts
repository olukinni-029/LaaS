import crypto from "crypto";

export function generateVirtualAccount(): string {
  const bytes = crypto.randomBytes(6); 
  const num = parseInt(bytes.toString("hex"), 16);
  const accountNumber = num.toString().padStart(12, "0").slice(0, 12);
  return `VA${accountNumber}`;
}
