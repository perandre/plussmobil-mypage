// Mock data for development — replace with erate Selfcare API calls

export const mockUser = {
  name: "Karin Jonna Kristina Fridh",
  firstName: "Karin",
  phone: "997 72 626",
  email: "karin.fridh@gmail.com",
  address: "Rolfsbuktveien 12",
  postalCode: "1364",
  city: "Fornebu",
  accountId: "ACC-31005119",
  billingGroupId: "31005119",
};

export type Subscription = {
  id: string;
  phone: string;
  holderName: string;
  planName: string;
  planGroup: "fri-data" | "standard" | "familie";
  price: number;
  dataTotal: number | null; // null = unlimited
  dataUsed: number;
  speed: string;
  status: "active" | "suspended";
  simType: "physical" | "esim";
  startDate: string;
  variantId: string;
};

export const mockSubscriptions: Subscription[] = [
  {
    id: "SUB-001",
    phone: "997 72 626",
    holderName: "Karin Jonna Kristina Fridh",
    planName: "Fri Data Maks",
    planGroup: "fri-data",
    price: 499,
    dataTotal: null,
    dataUsed: 10.32,
    speed: "1000 Mbit/s",
    status: "active",
    simType: "physical",
    startDate: "2023-08-08",
    variantId: "202111091314000395",
  },
  {
    id: "SUB-002",
    phone: "412 34 567",
    holderName: "Erik Fridh",
    planName: "15GB Standard",
    planGroup: "standard",
    price: 248,
    dataTotal: 15,
    dataUsed: 8.7,
    speed: "150 Mbit/s",
    status: "active",
    simType: "esim",
    startDate: "2024-02-15",
    variantId: "202106101521451304",
  },
];

export type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: "paid" | "unpaid" | "overdue";
  period: string;
};

export const mockInvoices: Invoice[] = [
  {
    id: "INV-006",
    invoiceNumber: "18832901",
    date: "2026-03-01",
    dueDate: "2026-03-20",
    amount: 2261.18,
    amountPaid: 0,
    status: "unpaid",
    period: "Mars 2026",
  },
  {
    id: "INV-005",
    invoiceNumber: "18503381",
    date: "2026-02-01",
    dueDate: "2026-02-20",
    amount: 2462.58,
    amountPaid: 2462.58,
    status: "paid",
    period: "Februar 2026",
  },
  {
    id: "INV-004",
    invoiceNumber: "18301700",
    date: "2026-01-01",
    dueDate: "2026-01-22",
    amount: 2613.17,
    amountPaid: 2613.17,
    status: "paid",
    period: "Januar 2026",
  },
  {
    id: "INV-003",
    invoiceNumber: "18149184",
    date: "2025-12-01",
    dueDate: "2025-12-22",
    amount: 1946.69,
    amountPaid: 1946.69,
    status: "paid",
    period: "Desember 2025",
  },
  {
    id: "INV-002",
    invoiceNumber: "17912222",
    date: "2025-11-01",
    dueDate: "2025-11-20",
    amount: 1428.49,
    amountPaid: 1428.49,
    status: "paid",
    period: "November 2025",
  },
  {
    id: "INV-001",
    invoiceNumber: "17680345",
    date: "2025-10-01",
    dueDate: "2025-10-20",
    amount: 1398.0,
    amountPaid: 1398.0,
    status: "paid",
    period: "Oktober 2025",
  },
];

export type Plan = {
  id: string;
  name: string;
  price: number;
  data: string;
  speed: string;
  group: "fri-data" | "standard";
  highlights: string[];
  popular?: boolean;
  variantId: string;
};

export const mockPlans: Plan[] = [
  {
    id: "plan-fri-start",
    name: "Fri Data Start",
    price: 298,
    data: "Ubegrenset",
    speed: "10 Mbit/s",
    group: "fri-data",
    highlights: ["Fri tale, SMS og MMS", "40 GB i EU/EØS", "Ubegrenset data"],
    variantId: "202502111055144903",
  },
  {
    id: "plan-fri-smart",
    name: "Fri Data Smart",
    price: 348,
    data: "Ubegrenset",
    speed: "20 Mbit/s",
    group: "fri-data",
    popular: true,
    highlights: ["Fri tale, SMS og MMS", "45 GB i EU/EØS", "Ubegrenset data"],
    variantId: "202502111055205720",
  },
  {
    id: "plan-fri-standard",
    name: "Fri Data Standard",
    price: 398,
    data: "Ubegrenset",
    speed: "150 Mbit/s",
    group: "fri-data",
    highlights: ["Fri tale, SMS og MMS", "50 GB i EU/EØS", "Ubegrenset data"],
    variantId: "202108041536494096",
  },
  {
    id: "plan-fri-maks",
    name: "Fri Data Maks",
    price: 499,
    data: "Ubegrenset",
    speed: "1000 Mbit/s",
    group: "fri-data",
    highlights: [
      "Fri tale, SMS og MMS",
      "100 GB i EU/EØS",
      "Ubegrenset data",
      "Høyeste hastighet",
    ],
    variantId: "202111091314000395",
  },
  {
    id: "plan-10gb",
    name: "10GB Standard",
    price: 198,
    data: "10 GB",
    speed: "150 Mbit/s",
    group: "standard",
    highlights: ["Fri tale, SMS og MMS", "Data rollover"],
    variantId: "202106101521451305",
  },
  {
    id: "plan-15gb",
    name: "15GB Standard",
    price: 248,
    data: "15 GB",
    speed: "150 Mbit/s",
    group: "standard",
    highlights: ["Fri tale, SMS og MMS", "Data rollover"],
    variantId: "202106101521451304",
  },
  {
    id: "plan-30gb",
    name: "30GB Standard",
    price: 298,
    data: "30 GB",
    speed: "150 Mbit/s",
    group: "standard",
    highlights: ["Fri tale, SMS og MMS", "Data rollover"],
    variantId: "202108051409115987",
  },
];

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  category: "security" | "data" | "international";
};

export const mockServices: Service[] = [
  {
    id: "svc-datakontroll",
    name: "Datakontroll",
    description:
      "Hindrer overforbruk. Mobildata stoppes når kvoten er brukt opp.",
    price: 0,
    active: true,
    category: "data",
  },
  {
    id: "svc-utland",
    name: "Bruk i utlandet",
    description: "Bruk mobilen på reise i utlandet innen EU/EØS.",
    price: 0,
    active: true,
    category: "international",
  },
  {
    id: "svc-samtaler-utland",
    name: "Samtaler til utlandet",
    description:
      "Ring til utlandet mens du befinner deg i Norge.",
    price: 0,
    active: true,
    category: "international",
  },
  {
    id: "svc-mobiltrygghet",
    name: "Mobil Trygghet",
    description:
      "Beskytter mot svindel-SMS, uønskede anrop og phishing.",
    price: 49,
    active: false,
    category: "security",
  },
  {
    id: "svc-innhold",
    name: "Innholdstjenester/Strex",
    description:
      "Betal for tjenester via mobilregningen (Strex, Apple, Google).",
    price: 0,
    active: true,
    category: "data",
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\s/g, "");
  return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
}

// Usage breakdown for the primary subscription
export const mockUsageBreakdown = {
  calls: { used: 142, total: 10000, unit: "min" },
  sms: { used: 87, total: 10000, unit: "stk" },
  mms: { used: 3, total: 10000, unit: "stk" },
  dataEu: { used: 12.4, total: 100, unit: "GB" },
};

// Monthly spending for chart
export const mockSpendingHistory = [
  { month: "Okt", amount: 1398 },
  { month: "Nov", amount: 1428 },
  { month: "Des", amount: 1947 },
  { month: "Jan", amount: 2613 },
  { month: "Feb", amount: 2463 },
  { month: "Mar", amount: 2261 },
];

// Quick stats for the dashboard
export const mockQuickStats = {
  totalMonthly: 747, // sum of all subscriptions
  nextInvoiceDate: "20. mars 2026",
  activeSims: 3,
  daysUntilRenewal: 12,
};
