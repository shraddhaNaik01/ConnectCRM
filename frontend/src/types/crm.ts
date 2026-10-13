export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  currency: string;
  status: OrderStatus;
  date: string;
  itemsCount: number;
  source: 'WooCommerce' | 'Manual';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  tier: string;
  orders_count: number;
  total_spent: number;
  source: string;
  created_at?: string | null;
}

export interface ActivityItem {
  id: string;
  type: 'order_placed' | 'followup_due' | 'sync_completed' | 'customer_created' | 'note_added';
  title: string;
  description: string;
  timestamp: string;
  badge?: string;
  badgeColor?: 'blue' | 'amber' | 'emerald' | 'purple' | 'slate';
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  subtext: string;
  iconName: 'users' | 'shopping-bag' | 'clock' | 'calendar-check';
}

export interface CustomerFollowUp {
  id: string;
  customerName: string;
  email: string;
  dueDate: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  completed_at?: string | null;
}
