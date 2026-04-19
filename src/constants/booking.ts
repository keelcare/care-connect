export const SUBSCRIPTION_PLANS = [
    {
        id: 'ONE_TIME',
        label: 'One-Time Session',
        duration: 0,
        discount: 0,
        popular: false,
        description: 'Perfect for trying out our service',
    },
    {
        id: 'MONTHLY',
        label: 'Monthly Plan',
        duration: 1,
        discount: 10,
        popular: false,
        description: 'Save 10% with monthly commitment',
    },
    {
        id: 'SIX_MONTH',
        label: '6-Month Plan',
        duration: 6,
        discount: 15,
        popular: true,
        description: 'Save 15% with 6-month commitment',
    },
    {
        id: 'YEARLY',
        label: 'Yearly Plan',
        duration: 12,
        discount: 20,
        popular: false,
        description: 'Save 20% with yearly commitment',
    },
];
