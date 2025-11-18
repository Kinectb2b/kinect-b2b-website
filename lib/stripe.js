import Stripe from 'stripe';

export const stripe = new Stripe('sk_test_51QhYNvB1XLx1C2PMoMoQpnpVfQ5afgPqVclSJSikPyMFAqNxVUd8UH4G8ltNO9SaewnxywDLXGZKo1MsuDP2bGQE009S4odrsb', {
  apiVersion: '2023-10-16',
});

// Product IDs - you'll create these in Stripe Dashboard
export const STRIPE_PRODUCTS = {
  SETUP_CALL: 'price_1Qhe6SB1XLx1C2PMBI5TXb7J', // One-time $349
  
  PRO_100_MONTHLY: 'price_1SOgpoB1XLx1C2PMMyYwzWEx',   // $250/month
  PRO_100_ANNUAL: 'price_1SOgpoB1XLx1C2PM72RSvSws',     // $2,750/year
  
  PRO_200_MONTHLY: 'price_1QheBQB1XLx1C2PMsXJPMmyg',   // $500/month
  PRO_200_ANNUAL: 'price_1QheBQB1XLx1C2PM5KCv7EAU',     // $5,500/year
  
  PRO_300_MONTHLY: 'price_1SOgr4B1XLx1C2PMudxUcewq',   // $750/month
  PRO_300_ANNUAL: 'price_1SOgr4B1XLx1C2PMCXXbgckl',     // $8,250/year
  
  PRO_400_MONTHLY: 'price_1SOh3CB1XLx1C2PMejyBNboC',   // $1,000/month
  PRO_400_ANNUAL: 'price_1SOh3CB1XLx1C2PM3AYh2kG7',     // $11,000/year
  
  PRO_500_MONTHLY: 'price_1SOh4EB1XLx1C2PM73CDLksr',   // $1,250/month
  PRO_500_ANNUAL: 'price_1SOh4EB1XLx1C2PMzQsdK2dO',     // $13,750/year
  
  PRO_600_MONTHLY: 'price_1SOh5DB1XLx1C2PMkLYpahEt',   // $1,500/month
  PRO_600_ANNUAL: 'price_1SOh5DB1XLx1C2PMncTOXg8X',     // $16,500/year
  
  PRO_700_MONTHLY: 'price_1SOh5gB1XLx1C2PMjXOh1Ly7',   // $1,750/month
  PRO_700_ANNUAL: 'price_1SOh8pB1XLx1C2PM0QgwxGpz',     // $19,250/year
  
  PRO_800_MONTHLY: 'price_1SOh9TB1XLx1C2PMuHpGhjeq',   // $2,000/month
  PRO_800_ANNUAL: 'price_1SOh9TB1XLx1C2PMCeuuZTO0',     // $22,000/year
  
  PRO_900_MONTHLY: 'price_1SOhA6B1XLx1C2PMGxr3mDNw',   // $2,250/month
  PRO_900_ANNUAL: 'price_1SOhA6B1XLx1C2PMo0Ubo00K',     // $24,750/year
  
  PRO_1000_MONTHLY: 'price_1SOhAzB1XLx1C2PMy2WSRkrO', // $2,500/month
  PRO_1000_ANNUAL: 'price_1SOhAzB1XLx1C2PM0zuXc3qb',   // $27,500/year
  
  PRO_1100_MONTHLY: 'price_1SOhBiB1XLx1C2PM6kAxx9Sf', // $2,750/month
  PRO_1100_ANNUAL: 'price_1SOhBiB1XLx1C2PM8A4FXIp3',   // $30,250/year
  
  PRO_1200_MONTHLY: 'price_1SOhCUB1XLx1C2PMWAd0O76Q', // $3,000/month
  PRO_1200_ANNUAL: 'price_1SOhCuB1XLx1C2PMLwXyV162',   // $33,000/year
};