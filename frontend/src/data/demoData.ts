import { Order, ActivityItem, MetricCardData, CustomerFollowUp } from '@/types/crm';

export const DEMO_METRICS: MetricCardData[] = [
  {
    id: 'total-customers',
    title: 'Total Customers',
    value: '1,284',
    change: '+12.4%',
    trend: 'up',
    subtext: 'vs previous 30 days',
    iconName: 'users',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    value: '3,842',
    change: '+8.1%',
    trend: 'up',
    subtext: 'Across all channels',
    iconName: 'shopping-bag',
  },
  {
    id: 'pending-orders',
    title: 'Pending Orders',
    value: '19',
    change: '-3.2%',
    trend: 'down',
    subtext: 'Requires fulfillment review',
    iconName: 'clock',
  },
  {
    id: 'followups-due',
    title: 'Follow-ups Due',
    value: '7',
    change: '+2 today',
    trend: 'neutral',
    subtext: 'High-priority leads & queries',
    iconName: 'calendar-check',
  },
];

// 6-month historical customer growth demo dataset
export const DEMO_CUSTOMER_GROWTH = [
  { month: 'May', customers: 740, newSignups: 110 },
  { month: 'Jun', customers: 850, newSignups: 135 },
  { month: 'Jul', customers: 980, newSignups: 160 },
  { month: 'Aug', customers: 1090, newSignups: 145 },
  { month: 'Sep', customers: 1195, newSignups: 155 },
  { month: 'Oct', customers: 1284, newSignups: 180 },
];

// Recent monthly order volume demo dataset
export const DEMO_ORDER_ANALYTICS = [
  { month: 'May', orders: 490, revenue: 38200 },
  { month: 'Jun', orders: 560, revenue: 44100 },
  { month: 'Jul', orders: 630, revenue: 51200 },
  { month: 'Aug', orders: 690, revenue: 56400 },
  { month: 'Sep', orders: 710, revenue: 58900 },
  { month: 'Oct', orders: 762, revenue: 64200 },
];

// Order status breakdown matching demo totals
export const DEMO_STATUS_DISTRIBUTION = [
  { name: 'Completed', value: 2840, color: '#34D399' },  // soft emerald
  { name: 'Processing', value: 680, color: '#60A5FA' },  // vivid blue
  { name: 'Pending', value: 210, color: '#FBBF24' },     // warm amber
  { name: 'Cancelled', value: 112, color: '#94A3B8' },   // muted slate
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#WC-8941',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@outlook.com',
    total: 249.0,
    currency: '$',
    status: 'completed',
    date: '2026-10-13 11:42',
    itemsCount: 3,
    source: 'WooCommerce',
  },
  {
    id: 'ord-1002',
    orderNumber: '#WC-8940',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.io',
    total: 780.5,
    currency: '$',
    status: 'processing',
    date: '2026-10-13 10:15',
    itemsCount: 5,
    source: 'WooCommerce',
  },
  {
    id: 'ord-1003',
    orderNumber: '#WC-8939',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@gmail.com',
    total: 89.99,
    currency: '$',
    status: 'pending',
    date: '2026-10-13 08:30',
    itemsCount: 1,
    source: 'WooCommerce',
  },
  {
    id: 'ord-1004',
    orderNumber: '#WC-8938',
    customerName: 'David Kalu',
    customerEmail: 'david.kalu@craftstudio.co',
    total: 420.0,
    currency: '$',
    status: 'completed',
    date: '2026-10-12 17:04',
    itemsCount: 4,
    source: 'WooCommerce',
  },
  {
    id: 'ord-1005',
    orderNumber: '#WC-8937',
    customerName: 'Amara Chen',
    customerEmail: 'amara.c@designworks.net',
    total: 135.25,
    currency: '$',
    status: 'cancelled',
    date: '2026-10-12 14:22',
    itemsCount: 2,
    source: 'WooCommerce',
  },
  {
    id: 'ord-1006',
    orderNumber: '#WC-8936',
    customerName: 'Liam O\'Connor',
    customerEmail: 'liam.oc@peakfitness.org',
    total: 512.0,
    currency: '$',
    status: 'completed',
    date: '2026-10-12 11:10',
    itemsCount: 2,
    source: 'WooCommerce',
  },
];

export const DEMO_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'order_placed',
    title: 'New WooCommerce order placed',
    description: 'Sarah Jenkins completed order #WC-8941 for $249.00',
    timestamp: '15 mins ago',
    badge: 'WooCommerce',
    badgeColor: 'blue',
  },
  {
    id: 'act-2',
    type: 'followup_due',
    title: 'VIP Consultation Follow-up due',
    description: 'Call Marcus Vance regarding enterprise bundle quote',
    timestamp: '45 mins ago',
    badge: 'High Priority',
    badgeColor: 'amber',
  },
  {
    id: 'act-3',
    type: 'customer_created',
    title: 'Customer account synchronized',
    description: 'Elena Rostova registered on storefront and synced to CRM',
    timestamp: '2 hours ago',
    badge: 'New Lead',
    badgeColor: 'emerald',
  },
  {
    id: 'act-4',
    type: 'sync_completed',
    title: 'Catalog and order batch sync',
    description: 'WooCommerce webhook processed 14 updated records without errors',
    timestamp: '4 hours ago',
    badge: 'Webhook',
    badgeColor: 'purple',
  },
  {
    id: 'act-5',
    type: 'note_added',
    title: 'Internal sales note logged',
    description: 'David Kalu requested invoice copy for tax review',
    timestamp: 'Yesterday',
    badge: 'Support',
    badgeColor: 'slate',
  },
];

export const DEMO_FOLLOWUPS: CustomerFollowUp[] = [
  {
    id: 'fol-1',
    customerName: 'Marcus Vance',
    email: 'm.vance@techcorp.io',
    dueDate: 'Today, 4:00 PM',
    reason: 'Follow up on bulk order discount agreement',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'fol-2',
    customerName: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    dueDate: 'Tomorrow, 11:30 AM',
    reason: 'Abandoned checkout assistance & coupon offering',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 'fol-3',
    customerName: 'Robert Vance',
    email: 'rvance@vancerefrig.com',
    dueDate: 'Oct 15, 2:00 PM',
    reason: 'Quarterly satisfaction review',
    priority: 'low',
    status: 'pending',
  },
];
