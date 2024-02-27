const DEPLOYED_URL =
  process.env.NEXT_PUBLIC_URL ?? // A custom env variable representing the final domain URL.
  process.env.NEXT_PUBLIC_VERCEL_URL; //The domain name of the generated deployment URL.

export const FULL_DEPLOYED_URL = DEPLOYED_URL
  ? `https://${DEPLOYED_URL}`
  : "http://localhost:3000";
