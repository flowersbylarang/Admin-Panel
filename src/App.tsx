import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Flower2,
  Home,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Package,
  PackageCheck,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings2,
  Store,
  Truck,
  Users,
  WalletCards,
  X,
  RotateCcw,
  Tag,
  Star,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "./components/ui/sheet";
import nigerianLocations from "./data/nigeria-locations.json";

type OrderStatus =
  | "New"
  | "Preparing"
  | "Ready for pickup"
  | "Out for delivery"
  | "Completed";
type PayStatus = "Awaiting payment" | "Paid" | "Payment failed";
type Order = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  address: string;
  fulfillment: "Delivery" | "Pickup";
  date: string;
  created: string;
  total: number;
  payment: PayStatus;
  status: OrderStatus;
  items: string[];
  note: string;
};
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  status: "Draft" | "Published";
  sizes: { name: string; price: number; inStock: boolean }[];
  addOnIds?: string[];
};
type BouquetRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  date: string;
  flowers: string[];
  notes: string;
  status:
    | "New"
    | "Reviewing"
    | "Quote sent"
    | "Paid / Order created"
    | "Closed";
  quote: number;
};
type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  created: string;
  status: "New" | "Replied" | "Closed";
};
type Review = {
  id: string;
  name: string;
  product: string;
  rating: number;
  text: string;
  date: string;
  status: "Pending" | "Published" | "Declined";
};
type Zone = {
  id: string;
  state: string;
  fee: number | null;
  towns: { name: string; deliverable: boolean }[];
};
type Announcement = { id: string; message: string; active: boolean };
type Promotion = {
  id: string;
  name: string;
  type: "Percentage" | "Fixed amount";
  amount: number;
  starts: string;
  ends: string;
  product: string;
  active: boolean;
};
type StaffMember = {
  name: string;
  email: string;
  status: string;
  initials: string;
};
type AdminData = {
  orders: Order[];
  products: Product[];
  requests: BouquetRequest[];
  enquiries: Enquiry[];
  reviews: Review[];
  zones: Zone[];
  announcements: Announcement[];
  promotions: Promotion[];
  categories: string[];
  addons: { id: string; name: string; price: number; active: boolean }[];
  settings: {
    phone: string;
    email: string;
    address: string;
    hours: string;
    faqs: string;
    policies: string;
    customStartingPrice: number | null;
  };
  staff: StaffMember[];
};

const KEY = "flowers-lara-admin-preview-v1";
const ANNOUNCEMENT_LIMIT = 80;
const flowerImage =
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80";
const seed: AdminData = {
  orders: [
    {
      id: "FL-1048",
      name: "Ada Okafor",
      phone: "+234 801 222 0164",
      email: "ada.o@example.com",
      city: "Lagos",
      area: "Lekki Phase 1",
      address: "12 Admiralty Way, Lekki Phase 1",
      fulfillment: "Delivery",
      date: "Today · 2:00–4:00 pm",
      created: "10:18 am",
      total: 78500,
      payment: "Paid",
      status: "New",
      items: ["Mauve Morning · Large × 1", "Chocolate × 1"],
      note: "Please call on arrival. Happy birthday, Mum!",
    },
    {
      id: "FL-1047",
      name: "Tunde Adebayo",
      phone: "+234 802 110 3450",
      email: "tunde.a@example.com",
      city: "Abuja",
      area: "Maitama",
      address: "18 Gana Street, Maitama",
      fulfillment: "Delivery",
      date: "Today · 12:00–2:00 pm",
      created: "9:42 am",
      total: 58000,
      payment: "Paid",
      status: "Preparing",
      items: ["Orchid Hour · Medium × 1"],
      note: "Card: Thinking of you.",
    },
    {
      id: "FL-1046",
      name: "Nneka Eze",
      phone: "+234 803 504 8861",
      email: "nneka.e@example.com",
      city: "Lagos",
      area: "Ikoyi",
      address: "7 Bourdillon Road, Ikoyi",
      fulfillment: "Pickup",
      date: "Today · 4:00 pm",
      created: "Yesterday",
      total: 102000,
      payment: "Paid",
      status: "Ready for pickup",
      items: ["Garden Party · Large × 1", "Teddy bear × 1"],
      note: "The recipient is Chidi.",
    },
    {
      id: "FL-1045",
      name: "Ifeoma Nwosu",
      phone: "+234 809 224 1902",
      email: "ifeoma.n@example.com",
      city: "Lagos",
      area: "Ikeja GRA",
      address: "31 Joel Ogunnaike Street, Ikeja",
      fulfillment: "Delivery",
      date: "Tomorrow · 10:00 am",
      created: "Yesterday",
      total: 45000,
      payment: "Awaiting payment",
      status: "New",
      items: ["Mauve Morning · Medium × 1"],
      note: "No note added.",
    },
    {
      id: "FL-1044",
      name: "Kemi Bello",
      phone: "+234 706 501 4421",
      email: "kemi.b@example.com",
      city: "Abuja",
      area: "Wuse 2",
      address: "5 Adetokunbo Ademola Crescent, Wuse 2",
      fulfillment: "Delivery",
      date: "Tomorrow · 1:00 pm",
      created: "Nov 20",
      total: 69000,
      payment: "Paid",
      status: "Out for delivery",
      items: ["The Sunday Bunch · Large × 1", "Wine × 1"],
      note: "Please leave with reception.",
    },
    {
      id: "FL-1043",
      name: "Dara Akin",
      phone: "+234 812 888 0034",
      email: "dara.a@example.com",
      city: "Lagos",
      area: "Victoria Island",
      address: "22 Akin Adesola Street, Victoria Island",
      fulfillment: "Delivery",
      date: "Nov 24 · 11:00 am",
      created: "Nov 20",
      total: 32000,
      payment: "Paid",
      status: "Completed",
      items: ["The Little Thank You · Medium × 1"],
      note: "Thank you for your help.",
    },
  ],
  products: [
    {
      id: "p1",
      name: "The Sunday Bunch",
      category: "Seasonal mix",
      price: 38000,
      image: flowerImage,
      description: "A generous mix of soft petals and leafy stems.",
      status: "Published",
      sizes: [
        { name: "Small", price: 29000, inStock: true },
        { name: "Medium", price: 38000, inStock: true },
        { name: "Large", price: 49000, inStock: true },
        { name: "XL", price: 59000, inStock: false },
      ],
    },
    {
      id: "p2",
      name: "Mauve Morning",
      category: "Garden roses",
      price: 45000,
      image:
        "https://images.unsplash.com/photo-1496290650525-29188efb34e0?auto=format&fit=crop&w=900&q=80",
      description: "Garden roses in a soft, lasting palette.",
      status: "Published",
      sizes: [
        { name: "Small", price: 34000, inStock: true },
        { name: "Medium", price: 45000, inStock: true },
        { name: "Large", price: 58000, inStock: true },
        { name: "XL", price: 70000, inStock: true },
      ],
    },
    {
      id: "p3",
      name: "Garden Party",
      category: "Hand-tied",
      price: 52000,
      image:
        "https://images.unsplash.com/photo-1491994336086-44f5d76dd8f2?auto=format&fit=crop&w=900&q=80",
      description: "An easygoing, just-picked kind of arrangement.",
      status: "Published",
      sizes: [
        { name: "Small", price: 39000, inStock: true },
        { name: "Medium", price: 52000, inStock: true },
        { name: "Large", price: 67000, inStock: true },
        { name: "XL", price: 81000, inStock: true },
      ],
    },
    {
      id: "p4",
      name: "Orchid Hour",
      category: "Orchids",
      price: 58000,
      image:
        "https://images.unsplash.com/photo-1556216750-2108e1e54e9a?auto=format&fit=crop&w=900&q=80",
      description: "Sculptural orchids with a quiet, modern feel.",
      status: "Draft",
      sizes: [
        { name: "Small", price: 44000, inStock: true },
        { name: "Medium", price: 58000, inStock: true },
        { name: "Large", price: 74000, inStock: true },
        { name: "XL", price: 90000, inStock: true },
      ],
    },
  ],
  requests: [
    {
      id: "CB-208",
      name: "Amara Johnson",
      phone: "+234 803 244 0048",
      email: "amara.j@example.com",
      city: "Lagos",
      area: "Ikoyi",
      date: "Today",
      flowers: ["White roses", "Eucalyptus"],
      notes: "Soft white and green palette. For a dinner table.",
      status: "New",
      quote: 0,
    },
    {
      id: "CB-207",
      name: "Feyi Okoro",
      phone: "+234 809 765 2100",
      email: "feyi.o@example.com",
      city: "Abuja",
      area: "Asokoro",
      date: "Nov 25",
      flowers: ["Pink peonies", "Garden roses"],
      notes: "A generous arrangement with a handwritten note.",
      status: "Reviewing",
      quote: 0,
    },
    {
      id: "CB-206",
      name: "Zainab Musa",
      phone: "+234 802 430 1801",
      email: "zainab.m@example.com",
      city: "Lagos",
      area: "Lekki",
      date: "Nov 27",
      flowers: ["Orchids", "Lilies"],
      notes: "For a graduation gift.",
      status: "Quote sent",
      quote: 85000,
    },
  ],
  enquiries: [
    {
      id: "EN-031",
      name: "Sola Adeyemi",
      email: "sola.a@example.com",
      phone: "+234 805 005 1616",
      topic: "Delivery or pickup",
      message:
        "Do you deliver to Gwarinpa in Abuja, and can I schedule delivery for Saturday morning?",
      created: "Today · 9:12 am",
      status: "New",
    },
    {
      id: "EN-030",
      name: "Mariam Bello",
      email: "mariam.b@example.com",
      phone: "+234 812 554 9901",
      topic: "Existing order",
      message: "Could I update the delivery directions for my order?",
      created: "Yesterday",
      status: "Replied",
    },
  ],
  reviews: [],
  zones: [],
  announcements: [
    { id: "announcement-1", message: "Same-day delivery in Lagos & Abuja", active: true },
    { id: "announcement-2", message: "Add a handwritten card message", active: true },
    { id: "announcement-3", message: "Choose delivery or pickup at checkout", active: true },
  ],
  promotions: [],
  categories: ["Hand-tied", "Garden roses", "Seasonal mix", "Orchids"],
  addons: [
    { id: "a1", name: "Chocolate", price: 6500, active: true },
    { id: "a2", name: "Teddy bear", price: 12000, active: true },
    { id: "a3", name: "Wine", price: 18000, active: true },
    { id: "a4", name: "Hampers", price: 0, active: true },
    { id: "a5", name: "Cake", price: 0, active: true },
    { id: "a6", name: "Balloons", price: 0, active: true },
  ],
  settings: {
    phone: "",
    email: "",
    address: "",
    hours: "9:00 am – 7:00 pm",
    faqs: "",
    policies:
      "No refunds or returns. Orders cannot be cancelled after payment.",
    customStartingPrice: null,
  },
  staff: [
    {
      name: "Store manager",
      email: "",
      status: "Pending setup",
      initials: "SM",
    },
    {
      name: "Staff member 2",
      email: "",
      status: "Pending setup",
      initials: "S2",
    },
    {
      name: "Staff member 3",
      email: "",
      status: "Pending setup",
      initials: "S3",
    },
  ],
};

function readData(): AdminData {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return seed;
    const saved = JSON.parse(stored) as Partial<AdminData>;
    return {
      ...seed,
      ...saved,
      zones: normalizeZones(saved.zones),
      announcements: saved.announcements ?? seed.announcements,
      settings: { ...seed.settings, ...saved.settings },
      staff: saved.staff ?? seed.staff,
    };
  } catch {
    return seed;
  }
}
function normalizeZones(zones: unknown): Zone[] {
  if (!Array.isArray(zones)) return [];
  const byState = new Map<string, Zone>();
  for (const value of zones) {
    if (value && typeof value === "object" && "state" in value && "towns" in value) {
      const zone = value as Zone;
      byState.set(zone.state, zone);
      continue;
    }
    if (!value || typeof value !== "object") continue;
    const legacy = value as { id?: string; city?: string; area?: string; fee?: number | null; active?: boolean };
    if (!legacy.city || !legacy.area) continue;
    const state = legacy.city === "Abuja" ? "Federal Capital Territory" : legacy.city;
    const current = byState.get(state) ?? { id: legacy.id ?? `zone-${state}`, state, fee: legacy.fee ?? null, towns: [] };
    current.towns.push({ name: legacy.area, deliverable: legacy.active !== false });
    byState.set(state, current);
  }
  return [...byState.values()];
}
const money = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
const dateLabel = new Intl.DateTimeFormat("en-NG", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/orders", label: "Orders", icon: PackageCheck, count: 2 },
  { to: "/requests", label: "Custom requests", icon: Flower2, count: 1 },
  { to: "/enquiries", label: "Enquiries", icon: Inbox, count: 1 },
  { to: "/products", label: "Products", icon: Flower2 },
  { to: "/delivery", label: "Delivery areas", icon: Truck },
  { to: "/promotions", label: "Promotions", icon: Tag },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/announcements", label: "Announcements", icon: MessageCircle },
  { to: "/website", label: "Website info", icon: Store },
  { to: "/staff", label: "Staff access", icon: Users },
];

function App() {
  const [data, setData] = useState<AdminData>(readData);
  const [preview, setPreview] = useState(
    () => localStorage.getItem("flowers-lara-admin-preview-session") === "yes",
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    if (toast) {
      const timer = window.setTimeout(() => setToast(""), 2800);
      return () => window.clearTimeout(timer);
    }
  }, [toast]);
  const update = (change: Partial<AdminData>) =>
    setData((current) => ({ ...current, ...change }));
  const notify = (message: string) => setToast(message);
  const enterPreview = () => {
    localStorage.setItem("flowers-lara-admin-preview-session", "yes");
    setPreview(true);
    navigate("/");
  };
  const reset = () => {
    setData(seed);
    localStorage.setItem(KEY, JSON.stringify(seed));
    localStorage.removeItem("flowers-lara-admin-staff");
    window.dispatchEvent(new Event("admin-reset"));
    notify("Preview restored");
  };
  const pageName =
    navItems.find((item) => item.to === location.pathname)?.label ?? "Overview";
  if (!preview) return <SignIn onPreview={enterPreview} />;

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[var(--line)] bg-white px-4 pb-5 pt-5 lg:flex">
        <Brand />
        <div className="mt-8 px-3 text-[11px] font-bold uppercase tracking-[.13em] text-[#82908b]">
          Workspace
        </div>
        <nav
          aria-label="Main navigation"
          className="mt-2 flex-1 space-y-1 overflow-y-auto"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              {...item}
              active={location.pathname === item.to}
            />
          ))}
        </nav>
        <div className="rounded-xl bg-[#f4f7f3] p-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-full bg-[#dceae1] text-sm font-bold text-[var(--teal)]">
              FL
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Flowers by Lara</p>
              <p className="text-xs text-[var(--muted)]">Staff workspace</p>
            </div>
            <button
              onClick={reset}
              className="ml-auto rounded-lg p-2 text-[var(--muted)] hover:bg-white"
              title="Restore preview"
              aria-label="Restore preview"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[var(--line)] bg-white/95 px-4 backdrop-blur sm:px-6 lg:ml-[248px] lg:px-8">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <div className="hidden text-sm text-[var(--muted)] lg:block">
            Workspace <span className="mx-2 text-[#bdc7c1]">/</span>
            <span className="font-semibold text-[var(--ink)]">{pageName}</span>
          </div>
          <p className="text-sm font-semibold lg:hidden">{pageName}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-xs text-[var(--muted)] sm:block">
            {dateLabel}
          </span>
          <button
            onClick={() => setNoticeOpen(true)}
            className="relative grid size-10 place-items-center rounded-xl text-[#52635e] hover:bg-[#f2f5f1]"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <i className="absolute right-[9px] top-[8px] size-2 rounded-full bg-[var(--rose)] ring-2 ring-white" />
          </button>
          <div className="hidden h-7 w-px bg-[var(--line)] sm:block" />
          <button
            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-[#f2f5f1]"
            aria-label="Signed in as Flowers by Lara staff"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[#e0ece5] text-xs font-bold text-[var(--teal)]">
              FL
            </span>
            <span className="hidden text-sm font-semibold sm:block">Staff</span>
            <ChevronDown
              size={14}
              className="hidden text-[var(--muted)] sm:block"
            />
          </button>
        </div>
      </header>
      <main className="min-h-[calc(100vh-68px)] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:ml-[248px] lg:px-8 lg:pb-10">
        <div className="mx-auto max-w-[1360px] lift-in">
          <PageRouter data={data} update={update} notify={notify} />
        </div>
      </main>
      <nav
        aria-label="Quick navigation"
        className="safe-bottom fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[var(--line)] bg-white/95 px-3 pt-2 backdrop-blur lg:hidden"
      >
        <MobileLink
          to="/"
          label="Home"
          icon={Home}
          active={location.pathname === "/"}
        />
        <MobileLink
          to="/orders"
          label="Orders"
          icon={PackageCheck}
          active={location.pathname === "/orders"}
          count={2}
        />
        <MobileLink
          to="/requests"
          label="Requests"
          icon={Flower2}
          active={location.pathname === "/requests"}
          count={1}
        />
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-semibold ${moreOpen ? "text-[var(--teal)]" : "text-[#788680]"}`}
          aria-expanded={moreOpen}
        >
          <Menu size={19} />
          <span>More</span>
        </button>
      </nav>
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[82dvh] rounded-t-[24px] border-[var(--line)] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-[var(--ink)] lg:hidden"
        >
          <SheetTitle className="text-lg font-bold">All sections</SheetTitle>
          <div className="grid grid-cols-2 gap-2">
            {navItems.slice(3).map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMoreOpen(false)}
                className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[var(--line)] p-3 text-sm font-semibold"
              >
                <Icon size={18} className="text-[var(--teal)]" />
                {label}
              </Link>
            ))}
          </div>
          <button
            onClick={reset}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4f7f3] p-3 text-sm font-semibold text-[var(--muted)]"
          >
            <RotateCcw size={16} />
            Restore preview
          </button>
        </SheetContent>
      </Sheet>
      {noticeOpen && (
        <Modal title="Notifications" onClose={() => setNoticeOpen(false)}>
          <div className="space-y-3">
            <Notice
              icon={PackageCheck}
              title="New order received"
              detail="FL-1048 · Ada Okafor · Paid"
              time="10:18 am"
            />
            <Notice
              icon={Flower2}
              title="Custom bouquet request"
              detail="CB-208 · Amara Johnson · Needs review"
              time="9:56 am"
            />
            <Notice
              icon={Inbox}
              title="New customer enquiry"
              detail="EN-031 · Delivery or pickup"
              time="9:12 am"
            />
            <p className="pt-2 text-xs text-[var(--muted)]">
              These notifications are part of the local preview.
            </p>
          </div>
        </Modal>
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#173b39] px-4 py-3 text-sm font-semibold text-white shadow-xl lg:bottom-7"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
export default App;

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="Flowers by Lara staff workspace"
      className={`flex items-center ${compact ? "" : "px-2"}`}
    >
      <img
        src="/brand/flowers-by-lara-navbar.png"
        alt="Flowers by Lara NG"
        className="h-10 w-auto max-w-[190px] object-contain"
      />
    </Link>
  );
}
function NavLink({
  to,
  label,
  icon: Icon,
  active,
  count,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  count?: number;
}) {
  return (
    <Link
      to={to}
      className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-semibold transition-colors ${active ? "bg-[#eaf2ec] text-[var(--teal)]" : "text-[#596a64] hover:bg-[#f4f7f3] hover:text-[var(--ink)]"}`}
    >
      <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
      <span className="flex-1">{label}</span>
      {count ? (
        <span
          className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white text-[var(--teal)]" : "bg-[#f0f3ef] text-[#687772]"}`}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
function MobileLink({
  to,
  label,
  icon: Icon,
  active,
  count,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  count?: number;
}) {
  return (
    <Link
      to={to}
      className={`relative flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-[var(--teal)]" : "text-[#788680]"}`}
    >
      <Icon size={19} />
      <span>{label}</span>
      {count ? (
        <i className="absolute right-[calc(50%-20px)] top-0 grid size-4 place-items-center rounded-full bg-[var(--rose)] text-[9px] not-italic text-white">
          {count}
        </i>
      ) : null}
    </Link>
  );
}

function PageRouter({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (message: string) => void;
}) {
  const path = useLocation().pathname;
  if (path === "/products/new")
    return <ProductEditor data={data} update={update} notify={notify} />;
  const editProduct = path.match(/^\/products\/([^/]+)\/edit$/);
  if (editProduct) {
    const product = data.products.find((item) => item.id === editProduct[1]);
    return product ? (
      <ProductEditor
        product={product}
        data={data}
        update={update}
        notify={notify}
      />
    ) : (
      <EmptyState
        icon={Flower2}
        title="Product not found"
        detail="It may have been removed from the catalog."
        action={
          <Link to="/products" className="text-sm font-bold text-[var(--teal)]">
            Back to products
          </Link>
        }
      />
    );
  }
  switch (path) {
    case "/orders":
      return <OrdersPage data={data} update={update} notify={notify} />;
    case "/requests":
      return <RequestsPage data={data} update={update} notify={notify} />;
    case "/enquiries":
      return <EnquiriesPage data={data} update={update} notify={notify} />;
    case "/products":
      return <ProductsLanding data={data} />;
    case "/products/flowers":
      return <ProductsPage data={data} update={update} notify={notify} />;
    case "/products/categories":
      return <CategoriesPage data={data} update={update} notify={notify} />;
    case "/products/add-ons":
      return <AddonManager data={data} update={update} notify={notify} />;
    case "/delivery":
      return <DeliveryPage data={data} update={update} notify={notify} />;
    case "/announcements":
      return <AnnouncementsPage data={data} update={update} notify={notify} />;
    case "/promotions":
      return <PromotionsPage data={data} update={update} notify={notify} />;
    case "/reviews":
      return <ReviewsPage data={data} update={update} notify={notify} />;
    case "/website":
      return <WebsitePage data={data} update={update} notify={notify} />;
    case "/staff":
      return <StaffPage data={data} update={update} notify={notify} />;
    default:
      return <Dashboard data={data} />;
  }
}

function SignIn({ onPreview }: { onPreview: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-[#07555a] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-20 top-24 size-[440px] rounded-full border border-white/10" />
        <div className="absolute -right-4 top-40 size-[320px] rounded-full border border-white/10" />
        <div className="relative inline-flex w-fit rounded-xl bg-white px-3 py-2">
          <img
            src="/brand/flowers-by-lara-navbar.png"
            alt="Flowers by Lara NG"
            className="h-9 w-auto object-contain"
          />
        </div>
        <div className="relative max-w-xl pb-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/85">
            <Flower2 size={14} /> Made for the team behind every thoughtful gift
          </p>
          <h1 className="text-5xl font-semibold leading-[1.06] tracking-[-.055em] xl:text-6xl">
            A calmer way to care for every order.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/75">
            Keep bouquets, deliveries, and customer conversations moving in one
            place.
          </p>
        </div>
        <p className="relative text-xs text-white/55">
          Flowers by Lara NG · Staff workspace
        </p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[410px]">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>
          <div className="mb-8">
            <p className="text-sm font-semibold text-[var(--teal)]">
              Welcome back
            </p>
            <h2 className="mt-2 text-[32px] font-semibold tracking-[-.04em]">
              Sign in to your workspace
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Use your Flowers by Lara staff account to continue.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onPreview();
            }}
            className="space-y-5"
          >
            <label className="block text-sm font-semibold">
              Email address
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your staff email"
                className="mt-2 h-12 w-full rounded-xl border border-[#dce4dd] bg-white px-3.5 outline-none focus:border-[#4d928b] focus:ring-4 focus:ring-[#e0efeb]"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <span className="relative mt-2 block">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-[#dce4dd] bg-white px-3.5 pr-16 outline-none focus:border-[#4d928b] focus:ring-4 focus:ring-[#e0efeb]"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-[var(--teal)]"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </span>
            </label>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-[var(--teal)]"
              >
                Forgot password?
              </button>
            </div>
            <button className="h-12 w-full rounded-xl bg-[var(--teal)] text-sm font-bold text-white shadow-sm hover:bg-[var(--teal-dark)]">
              Sign in <ArrowRight size={16} className="ml-1 inline" />
            </button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-[#a3aea8]">
            <span className="h-px flex-1 bg-[var(--line)]" />
            OR
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>
          <button
            onClick={onPreview}
            className="h-12 w-full rounded-xl border border-[#dce4dd] bg-white text-sm font-bold hover:bg-[#f4f7f3]"
          >
            Preview admin
          </button>
        </div>
      </section>
    </main>
  );
}

function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-.04em] sm:text-[30px]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}
function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "quiet" | "danger";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)]",
    outline:
      "border border-[#dce4dd] bg-white text-[#354d45] hover:bg-[#f5f7f4]",
    quiet: "bg-transparent text-[#53635d] hover:bg-[#f1f4f0]",
    danger: "bg-[#fbebed] text-[#9e3549] hover:bg-[#f7dfe4]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[var(--line)] bg-white ${className}`}
    >
      {children}
    </section>
  );
}
function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "gold" | "rose" | "blue";
}) {
  const tones = {
    neutral: "bg-[#f0f3ef] text-[#52635c]",
    green: "bg-[#e8f3e9] text-[#397343]",
    gold: "bg-[#fbf3e3] text-[#8a641d]",
    rose: "bg-[#f9e9ee] text-[#a23f66]",
    blue: "bg-[#eaf0f7] text-[#42617d]",
  };
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-full px-2.5 text-[11px] font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
function IconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Search;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg text-[#63716c] hover:bg-[#f0f4f0]"
    >
      <Icon size={17} />
    </button>
  );
}
function SearchBox({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex h-10 min-w-[180px] items-center gap-2 rounded-xl border border-[#dce4dd] bg-white px-3 text-[#85928c] focus-within:border-[#78a79c]">
      <Search size={16} />
      <input
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[#9aa6a0]"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search">
          <X size={15} />
        </button>
      )}
    </label>
  );
}
function Select({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="relative inline-flex h-10 items-center rounded-xl border border-[#dce4dd] bg-white px-3">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[160px] appearance-none bg-transparent pr-5 text-sm font-semibold text-[#52635c] outline-none"
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 text-[#84918a]"
      />
    </label>
  );
}
function EmptyState({
  icon: Icon,
  title,
  detail,
  action,
}: {
  icon: typeof Package;
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#edf3ee] text-[var(--teal)]">
        <Icon size={22} />
      </span>
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--muted)]">
        {detail}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={`mx-auto max-h-[92dvh] w-full overflow-hidden rounded-t-[24px] border-[var(--line)] bg-white p-0 text-[var(--ink)] sm:bottom-1/2 sm:translate-y-1/2 sm:rounded-2xl ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"}`}
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--line)] bg-white px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold tracking-[-.02em]">{title}</h2>
          <SheetClose
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full hover:bg-[#f1f4f0]"
          >
            <X size={18} />
          </SheetClose>
        </header>
        <div className="overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {children}
      <span className="mt-1.5 block">
        {hint && (
          <span className="text-xs font-normal leading-5 text-[var(--muted)]">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
function TextInput({
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-2 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm font-normal outline-none focus:border-[#579289] focus:ring-4 focus:ring-[#e2efeb]"
    />
  );
}
function TextArea({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="mt-2 w-full resize-y rounded-xl border border-[#dce4dd] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#579289] focus:ring-4 focus:ring-[#e2efeb]"
    />
  );
}
function Notice({
  icon: Icon,
  title,
  detail,
  time,
}: {
  icon: typeof Package;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-[var(--line)] p-3.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf3ee] text-[var(--teal)]">
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{detail}</p>
      </div>
      <span className="shrink-0 text-[10px] text-[#87938d]">{time}</span>
    </div>
  );
}

function Dashboard({ data }: { data: AdminData }) {
  const todayOrders = data.orders.filter((o) =>
    o.date.toLowerCase().includes("today"),
  );
  const pending = data.requests.filter((r) => r.status === "New").length;
  const paid = data.orders
    .filter((o) => o.payment === "Paid")
    .reduce((n, o) => n + o.total, 0);
  return (
    <>
      <PageHeader
        title="Good morning"
        subtitle={`${dateLabel} · Here’s what needs your team’s attention today.`}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Metric
          icon={PackageCheck}
          label="New orders"
          value={String(data.orders.filter((o) => o.status === "New").length)}
          note="Need a first look"
          tone="teal"
        />
        <Metric
          icon={Truck}
          label="Today’s handoffs"
          value={String(todayOrders.length)}
          note="Deliveries and pickups"
          tone="leaf"
        />
        <Metric
          icon={WalletCards}
          label="Awaiting payment"
          value={String(
            data.orders.filter((o) => o.payment === "Awaiting payment").length,
          )}
          note="Payment status updates automatically"
          tone="gold"
        />
        <Metric
          icon={Flower2}
          label="Custom requests"
          value={String(pending)}
          note="Need a reply"
          tone="rose"
        />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,.8fr)]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-bold">Today’s orders</h2>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                A quick look at what’s moving
              </p>
            </div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--teal)]"
            >
              All orders <ArrowRight size={14} />
            </Link>
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-[#f8faf7] text-[11px] font-bold text-[#7a8881]">
                <tr>
                  <th className="px-5 py-3">ORDER</th>
                  <th className="px-4 py-3">CUSTOMER</th>
                  <th className="px-4 py-3">HANDOFF</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-5 py-3 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {todayOrders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="border-t border-[#eef1ed]">
                    <td className="px-5 py-3.5 text-xs font-bold text-[var(--teal)]">
                      {order.id}
                      <span className="mt-1 block font-normal text-[#78857f]">
                        {order.created}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold">
                      {order.name}
                      <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
                        {order.city} · {order.area}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      {order.fulfillment}
                      <span className="mt-1 block text-[#78857f]">
                        {order.date.split("·")[1] || "Today"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <OrderPills order={order} />
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-bold">
                      {money(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-[#eef1ed] md:hidden">
            {todayOrders.slice(0, 4).map((order) => (
              <Link key={order.id} to="/orders" className="block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[var(--teal)]">
                      {order.id}
                      <span className="ml-2 font-normal text-[var(--muted)]">
                        {order.created}
                      </span>
                    </p>
                    <p className="mt-1 text-sm font-bold">{order.name}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {order.fulfillment} · {order.city} · {order.area}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{money(order.total)}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <OrderPills order={order} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold">Custom requests</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Quote before payment
                </p>
              </div>
              <span className="grid size-9 place-items-center rounded-xl bg-[#faedf2] text-[var(--rose)]">
                <Flower2 size={18} />
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {data.requests
                .filter((r) => ["New", "Reviewing"].includes(r.status))
                .slice(0, 2)
                .map((r) => (
                  <Link
                    key={r.id}
                    to="/requests"
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#f8faf7] p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        {r.id} · {r.flowers.join(", ")}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-[#87938d]"
                    />
                  </Link>
                ))}
              {!pending && (
                <p className="text-sm text-[var(--muted)]">
                  All new requests are up to date.
                </p>
              )}
            </div>
            <Link
              to="/requests"
              className="mt-4 inline-flex text-xs font-bold text-[var(--teal)]"
            >
              View request queue <ArrowRight size={14} className="ml-1" />
            </Link>
          </Card>
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Sales snapshot</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Recent paid orders
                </p>
              </div>
              <span className="grid size-9 place-items-center rounded-xl bg-[#edf3ee] text-[var(--leaf)]">
                <WalletCards size={18} />
              </span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight">
              {money(paid)}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {data.orders.filter((o) => o.payment === "Paid").length} paid
              orders shown
            </p>
          </Card>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <QuickLink
          to="/products"
          icon={Flower2}
          title="Update the shop"
          detail="Products, sizes and availability"
        />
        <QuickLink
          to="/delivery"
          icon={Truck}
          title="Set delivery fees"
          detail={
            data.zones.length
              ? `${data.zones.length} areas configured`
              : "Add delivery areas and fees"
          }
        />
        <QuickLink
          to="/enquiries"
          icon={Inbox}
          title="Customer enquiries"
          detail={`${data.enquiries.filter((e) => e.status === "New").length} new messages`}
        />
      </div>
    </>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  note,
  tone,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  note: string;
  tone: "teal" | "leaf" | "gold" | "rose";
}) {
  const colors = {
    teal: "bg-[#eaf2ec] text-[var(--teal)]",
    leaf: "bg-[#edf3e9] text-[#517448]",
    gold: "bg-[#fbf3e4] text-[#946b1f]",
    rose: "bg-[#f9eaf0] text-[var(--rose)]",
  };
  return (
    <Card className="min-h-[134px] p-3.5 sm:min-h-[150px] sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#697971] sm:text-xs">
          {label}
        </span>
        <span
          className={`grid size-8 shrink-0 place-items-center rounded-lg ${colors[tone]}`}
        >
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-[25px] font-bold leading-none tracking-[-.04em] sm:text-[30px]">
        {value}
      </p>
      <p className="mt-2 text-[10px] leading-4 text-[var(--muted)] sm:text-[11px]">
        {note}
      </p>
    </Card>
  );
}
function QuickLink({
  to,
  icon: Icon,
  title,
  detail,
}: {
  to: string;
  icon: typeof Package;
  title: string;
  detail: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 hover:border-[#a9c4b1]"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-[#edf3ee] text-[var(--teal)]">
        <Icon size={17} />
      </span>
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-0.5 block text-xs text-[var(--muted)]">
          {detail}
        </span>
      </span>
      <ChevronRight size={16} className="ml-auto text-[#9aa59f]" />
    </Link>
  );
}
function OrderPills({ order }: { order: Order }) {
  const statusTone: Record<
    OrderStatus,
    "neutral" | "green" | "gold" | "rose" | "blue"
  > = {
    New: "rose",
    Preparing: "gold",
    "Ready for pickup": "green",
    "Out for delivery": "blue",
    Completed: "neutral",
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      <Pill tone={statusTone[order.status]}>{order.status}</Pill>
      <Pill
        tone={
          order.payment === "Paid"
            ? "green"
            : order.payment === "Payment failed"
              ? "rose"
              : "gold"
        }
      >
        {order.payment}
      </Pill>
    </div>
  );
}

function OrdersPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [city, setCity] = useState("All cities");
  const [fulfillment, setFulfillment] = useState("Any handoff");
  const [selected, setSelected] = useState<Order | null>(null);
  const tabs = ["All", "New", "Today", "Upcoming"];
  const filtered = useMemo(
    () =>
      data.orders.filter((o) => {
        const q = query.toLowerCase();
        const matches =
          !q ||
          `${o.id} ${o.name} ${o.phone} ${o.email} ${o.area}`
            .toLowerCase()
            .includes(q);
        return (
          matches &&
          (tab === "All" ||
            (tab === "New" && o.status === "New") ||
            (tab === "Today" && o.date.toLowerCase().includes("today")) ||
            (tab === "Upcoming" && !o.date.toLowerCase().includes("today"))) &&
          (city === "All cities" || o.city === city) &&
          (fulfillment === "Any handoff" || o.fulfillment === fulfillment)
        );
      }),
    [data.orders, query, tab, city, fulfillment],
  );
  const setStatus = (id: string, status: OrderStatus) => {
    update({
      orders: data.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });
    setSelected((s) => (s?.id === id ? { ...s, status } : s));
    notify(`Order moved to ${status.toLowerCase()}`);
  };
  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Follow each order from payment through delivery or pickup."
      />
      <Card className="overflow-hidden">
        <div className="flex gap-1 overflow-x-auto border-b border-[var(--line)] px-3 pt-2.5 sm:px-5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative shrink-0 px-3 py-3 text-xs font-bold sm:text-sm ${tab === t ? "text-[var(--teal)]" : "text-[#79867f] hover:text-[var(--ink)]"}`}
            >
              {t}
              {t === "New" && (
                <span className="ml-1.5 rounded-full bg-[#f9e9ee] px-1.5 py-0.5 text-[10px] text-[var(--rose)]">
                  {data.orders.filter((o) => o.status === "New").length}
                </span>
              )}
              {tab === t && (
                <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[var(--teal)]" />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:p-4">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search order, customer or phone"
          />
          <div className="flex gap-2 overflow-x-auto">
            <Select value={city} onChange={setCity} label="Filter by city">
              <option>All cities</option>
              <option>Lagos</option>
              <option>Abuja</option>
            </Select>
            <Select
              value={fulfillment}
              onChange={setFulfillment}
              label="Filter by handoff"
            >
              <option>Any handoff</option>
              <option>Delivery</option>
              <option>Pickup</option>
            </Select>
          </div>
          <span className="ml-auto hidden whitespace-nowrap text-xs text-[var(--muted)] sm:block">
            {filtered.length} orders
          </span>
        </div>
        {!filtered.length ? (
          <EmptyState
            icon={PackageCheck}
            title="No orders match these filters"
            detail="Try another search or clear a filter to see more orders."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setTab("All");
                  setCity("All cities");
                  setFulfillment("Any handoff");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="border-y border-[var(--line)] bg-[#f8faf7] text-[10px] font-bold uppercase tracking-[.05em] text-[#7d8a84]">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Delivery / pickup</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Order progress</th>
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelected(o)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelected(o)}
                      className="cursor-pointer border-b border-[#eef1ed] hover:bg-[#fbfcfa]"
                    >
                      <td className="px-5 py-4 text-sm font-bold text-[var(--teal)]">
                        {o.id}
                        <span className="mt-1 block text-[11px] font-normal text-[var(--muted)]">
                          {o.created}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold">
                        {o.name}
                        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
                          {o.phone}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs">
                        {o.fulfillment} · {o.city}
                        <span className="mt-1 block text-[var(--muted)]">
                          {o.area} · {o.date}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Pill
                          tone={
                            o.payment === "Paid"
                              ? "green"
                              : o.payment === "Payment failed"
                                ? "rose"
                                : "gold"
                          }
                        >
                          {o.payment}
                        </Pill>
                      </td>
                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={o.status}
                          label={`Order progress for ${o.id}`}
                          onChange={(v) => setStatus(o.id, v as OrderStatus)}
                        >
                          {[
                            "New",
                            "Preparing",
                            "Ready for pickup",
                            "Out for delivery",
                            "Completed",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold">
                        {money(o.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2 p-3 md:hidden">
              {filtered.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="block w-full rounded-xl border border-[#e8ede8] p-3.5 text-left hover:border-[#bdd0c2]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-[var(--teal)]">
                        {o.id}
                      </span>
                      <span className="ml-2 text-[10px] text-[var(--muted)]">
                        {o.created}
                      </span>
                      <p className="mt-1 text-sm font-bold">{o.name}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        {o.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{money(o.total)}</p>
                      <p className="mt-1 text-[10px] text-[var(--muted)]">
                        {o.fulfillment} · {o.city}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <OrderPills order={o} />
                    <span className="text-[10px] font-medium text-[#65746e]">
                      {o.date} <ChevronRight size={14} className="inline" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
        <div className="border-t border-[var(--line)] px-4 py-3 text-xs text-[var(--muted)]">
          Showing {filtered.length} of {data.orders.length} orders
        </div>
      </Card>
      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onStatus={(s) => setStatus(selected.id, s)}
        />
      )}
    </>
  );
}
function OrderDetail({
  order,
  onClose,
  onStatus,
}: {
  order: Order;
  onClose: () => void;
  onStatus: (s: OrderStatus) => void;
}) {
  return (
    <Modal title={`Order ${order.id}`} onClose={onClose} wide>
      <div className="flex flex-wrap items-center gap-2">
        <Pill
          tone={
            order.status === "New"
              ? "rose"
              : order.status === "Completed"
                ? "neutral"
                : "blue"
          }
        >
          {order.status}
        </Pill>
        <Pill tone={order.payment === "Paid" ? "green" : "gold"}>
          {order.payment}
        </Pill>
        <span className="ml-auto text-lg font-bold">{money(order.total)}</span>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#7d8a84]">
            Customer
          </h3>
          <p className="mt-2 font-bold">{order.name}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{order.email}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{order.phone}</p>
          <div className="mt-3 flex gap-2">
            <a
              href={`tel:${order.phone.replaceAll(" ", "")}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 text-xs font-bold text-[var(--teal)]"
            >
              <Phone size={14} />
              Call
            </a>
            <a
              href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 text-xs font-bold text-[var(--teal)]"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
          </div>
        </section>
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#7d8a84]">
            {order.fulfillment}
          </h3>
          <p className="mt-2 font-semibold">
            {order.fulfillment === "Pickup" ? "Ikoyi store" : order.area}
          </p>
          <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
            {order.fulfillment === "Pickup"
              ? "Pickup location to be confirmed from store details."
              : `${order.address}, ${order.city}`}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#52635c]">
            <CalendarDays size={14} />
            {order.date}
          </p>
        </section>
      </div>
      <div className="mt-5 border-t border-[var(--line)] pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#7d8a84]">
          In this order
        </h3>
        <ul className="mt-2 divide-y divide-[#eef1ed]">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-3 py-2.5 text-sm">
              <span>{item}</span>
              {i === 0 && (
                <span className="font-semibold">{money(order.total)}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-[#f5f8f4] p-3.5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#77857d]">
          Gift message / delivery note
        </p>
        <p className="mt-1.5 text-sm leading-6">
          {order.note || "No note added."}
        </p>
      </div>
      <div className="mt-5">
        <label className="text-xs font-bold uppercase tracking-wide text-[#7d8a84]">
          Update order progress
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            "New",
            "Preparing",
            order.fulfillment === "Pickup"
              ? "Ready for pickup"
              : "Out for delivery",
            "Completed",
          ].map((s) => (
            <button
              key={s}
              onClick={() => onStatus(s as OrderStatus)}
              className={`min-h-10 rounded-lg border px-2 text-xs font-bold ${order.status === s ? "border-[var(--teal)] bg-[#eaf2ec] text-[var(--teal)]" : "border-[var(--line)] text-[#5c6d66] hover:bg-[#f7f9f6]"}`}
            >
              {order.status === s && (
                <Check size={13} className="mr-1 inline" />
              )}
              {s}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
        Payment updates automatically. Paid orders cannot be cancelled from this
        screen.
      </p>
    </Modal>
  );
}

function RequestsPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BouquetRequest | null>(null);
  const filtered = data.requests.filter((r) =>
    `${r.id} ${r.name} ${r.flowers.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const move = (
    id: string,
    status: BouquetRequest["status"],
    quote?: number,
  ) => {
    update({
      requests: data.requests.map((r) =>
        r.id === id ? { ...r, status, quote: quote ?? r.quote } : r,
      ),
    });
    setSelected((s) =>
      s?.id === id ? { ...s, status, quote: quote ?? s.quote } : s,
    );
    notify(
      status === "Quote sent"
        ? "Quote recorded as sent"
        : `Request moved to ${status.toLowerCase()}`,
    );
  };
  return (
    <>
      <PageHeader
        title="Custom bouquet requests"
        subtitle="Review the flowers customers have in mind and prepare a quote before payment."
      />
      {data.settings.customStartingPrice === null ? (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#f0dfbd] bg-[#fff9eb] p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#755c2b]">
            <strong>Custom bouquet starting price not set.</strong> Add the
            approved amount before displaying this offer to customers.
          </p>
          <Link
            to="/website"
            className="shrink-0 text-xs font-bold text-[var(--teal)]"
          >
            Set starting price <ArrowRight size={13} className="ml-1 inline" />
          </Link>
        </div>
      ) : (
        <div className="mb-4 rounded-xl bg-[#edf4ec] px-3.5 py-2.5 text-sm text-[#426a49]">
          Custom bouquet requests start at{" "}
          <strong>{money(data.settings.customStartingPrice)}</strong>. Final
          quotes can vary based on the request.
        </div>
      )}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            "New",
            "Reviewing",
            "Quote sent",
            "Paid / Order created",
            "Closed",
          ].map((s) => (
            <Pill key={s} tone={s === "New" ? "rose" : "neutral"}>
              {s} · {data.requests.filter((r) => r.status === s).length}
            </Pill>
          ))}
        </div>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search requests"
        />
      </div>
      <Card className="overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="bg-[#f8faf7] text-[10px] font-bold uppercase tracking-wide text-[#7d8a84]">
              <tr>
                <th className="px-5 py-3">Request</th>
                <th className="px-4 py-3">Flowers requested</th>
                <th className="px-4 py-3">Delivery / pickup</th>
                <th className="px-4 py-3">Preferred date</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-5 py-3 text-right">Quote</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer border-t border-[#eef1ed] hover:bg-[#fbfcfa]"
                >
                  <td className="px-5 py-4 text-sm font-bold text-[var(--teal)]">
                    {r.id}
                    <span className="mt-1 block text-xs font-semibold text-[var(--ink)]">
                      {r.name}
                    </span>
                  </td>
                  <td className="max-w-[220px] px-4 py-4 text-sm">
                    {r.flowers.join(", ")}
                    <span className="mt-1 block truncate text-xs text-[var(--muted)]">
                      {r.notes}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {r.city} · {r.area}
                  </td>
                  <td className="px-4 py-4 text-sm">{r.date}</td>
                  <td className="px-4 py-4">
                    <Pill
                      tone={
                        r.status === "New"
                          ? "rose"
                          : r.status === "Quote sent"
                            ? "blue"
                            : "gold"
                      }
                    >
                      {r.status}
                    </Pill>
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-bold">
                    {r.quote ? money(r.quote) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 p-3 md:hidden">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className="w-full rounded-xl border border-[#e8ede8] p-3.5 text-left"
            >
              <div className="flex justify-between">
                <span className="text-xs font-bold text-[var(--teal)]">
                  {r.id} · {r.date}
                </span>
                <Pill tone={r.status === "New" ? "rose" : "blue"}>
                  {r.status}
                </Pill>
              </div>
              <p className="mt-2 text-sm font-bold">{r.name}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {r.flowers.join(", ")} · {r.city}
              </p>
              {r.quote > 0 && (
                <p className="mt-2 text-sm font-bold">
                  Quote: {money(r.quote)}
                </p>
              )}
            </button>
          ))}
        </div>
        {!filtered.length && (
          <EmptyState
            icon={Flower2}
            title="No requests found"
            detail="Try a different search."
          />
        )}
        <div className="border-t border-[var(--line)] px-4 py-3 text-xs text-[var(--muted)]">
          {filtered.length} requests
        </div>
      </Card>
      {selected && (
        <RequestDetail
          request={selected}
          onClose={() => setSelected(null)}
          onMove={move}
          notify={notify}
        />
      )}
    </>
  );
}
function RequestDetail({
  request,
  onClose,
  onMove,
  notify,
}: {
  request: BouquetRequest;
  onClose: () => void;
  onMove: (
    id: string,
    status: BouquetRequest["status"],
    quote?: number,
  ) => void;
  notify: (m: string) => void;
}) {
  const [quote, setQuote] = useState(
    request.quote ? String(request.quote) : "",
  );
  return (
    <Modal title={`Custom request · ${request.id}`} onClose={onClose} wide>
      <div className="flex items-center justify-between">
        <Pill tone={request.status === "New" ? "rose" : "blue"}>
          {request.status}
        </Pill>
        <span className="text-xs text-[var(--muted)]">
          Preferred date · {request.date}
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7d8a84]">
            Customer
          </p>
          <p className="mt-2 font-bold">{request.name}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{request.email}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{request.phone}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7d8a84]">
            Fulfilment
          </p>
          <p className="mt-2 font-semibold">
            {request.city} · {request.area}
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-[#f5f8f4] p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#7d8a84]">
          Flowers they’d love
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {request.flowers.map((f) => (
            <Pill key={f} tone="green">
              {f}
            </Pill>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6">{request.notes}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <FormField label="Quote amount">
          <TextInput
            type="number"
            value={quote}
            onChange={setQuote}
            placeholder="Enter the amount in naira"
          />
        </FormField>
        <Button
          className="self-end"
          onClick={() => {
            if (!quote || Number(quote) <= 0) {
              notify("Enter a quote amount greater than zero");
              return;
            }
            onMove(request.id, "Quote sent", Number(quote));
          }}
        >
          Record quote sent <ArrowRight size={15} />
        </Button>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        After the quote is shared, keep the request updated here until it
        becomes an order.
      </p>
      <div className="mt-5 border-t border-[var(--line)] pt-4">
        <p className="text-xs font-bold text-[#7d8a84]">REQUEST PROGRESS</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              "New",
              "Reviewing",
              "Quote sent",
              "Paid / Order created",
              "Closed",
            ] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() =>
                onMove(
                  request.id,
                  s,
                  s === "Quote sent"
                    ? Number(quote) || request.quote
                    : undefined,
                )
              }
              className={`min-h-9 rounded-lg border px-3 text-xs font-bold ${request.status === s ? "border-[var(--teal)] bg-[#eaf2ec] text-[var(--teal)]" : "border-[var(--line)] text-[#586962]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function EnquiriesPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [tab, setTab] = useState("New");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const filtered = data.enquiries.filter(
    (e) =>
      (tab === "All" || e.status === tab) &&
      `${e.id} ${e.name} ${e.topic} ${e.message}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const setStatus = (id: string, status: Enquiry["status"]) => {
    update({
      enquiries: data.enquiries.map((e) =>
        e.id === id ? { ...e, status } : e,
      ),
    });
    setSelected((s) => (s?.id === id ? { ...s, status } : s));
    notify(`Enquiry marked ${status.toLowerCase()}`);
  };
  return (
    <>
      <PageHeader
        title="Enquiries"
        subtitle="Reply to customer questions about orders, custom bouquets, delivery, and more."
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-[#eaf0eb] p-1">
          {["New", "Replied", "Closed", "All"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${tab === t ? "bg-white text-[var(--teal)] shadow-sm" : "text-[#6e7b75]"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search messages"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
        {filtered.length ? (
          <Card className="divide-y divide-[#edf1ed] overflow-hidden">
            {filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="w-full p-4 text-left hover:bg-[#fbfcfa] sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 size-2 shrink-0 rounded-full ${e.status === "New" ? "bg-[var(--rose)]" : "bg-transparent"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold">
                        {e.name}
                        <span className="ml-2 text-[11px] font-normal text-[var(--muted)]">
                          {e.id}
                        </span>
                      </p>
                      <span className="text-[10px] text-[var(--muted)]">
                        {e.created}
                      </span>
                    </div>
                    <Pill tone="neutral">{e.topic}</Pill>
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#5c6d65]">
                      {e.message}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon={Inbox}
              title="No enquiries in this view"
              detail="New messages from the contact form will appear here."
            />
          </Card>
        )}
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <CircleHelp size={18} className="text-[var(--teal)]" />
            <h2 className="font-bold">Reply from here</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Open a message to see the customer’s contact details and send a
            reply. The preview opens your email app and keeps a reply status
            here.
          </p>
          <div className="mt-5 rounded-xl bg-[#f5f8f4] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#78857f]">
              Common topics
            </p>
            <p className="mt-2 text-sm leading-6">
              Existing order
              <br />
              Custom bouquet
              <br />
              Delivery or pickup
              <br />
              Something else
            </p>
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
            General enquiries are separate from custom bouquet requests, which
            have their own quote tracking.
          </p>
        </Card>
      </div>
      {selected && (
        <Modal
          title={`${selected.topic} · ${selected.id}`}
          onClose={() => setSelected(null)}
        >
          <Pill tone={selected.status === "New" ? "rose" : "neutral"}>
            {selected.status}
          </Pill>
          <h3 className="mt-4 text-lg font-bold">{selected.name}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {selected.email} · {selected.phone}
          </p>
          <p className="mt-5 rounded-xl bg-[#f5f8f4] p-4 text-sm leading-6">
            {selected.message}
          </p>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Received {selected.created}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.topic}`)}`}
              onClick={() => setStatus(selected.id, "Replied")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--teal)] px-3 text-sm font-bold text-white"
            >
              <MessageCircle size={15} />
              Reply by email
            </a>
            <a
              href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line)] text-sm font-bold text-[var(--teal)]"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
          <div className="mt-4 flex gap-2">
            {(["New", "Replied", "Closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(selected.id, s)}
                className={`min-h-9 rounded-lg border px-3 text-xs font-bold ${selected.status === s ? "border-[var(--teal)] bg-[#eaf2ec] text-[var(--teal)]" : "border-[var(--line)] text-[#596b63]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

function ProductsLanding({ data }: { data: AdminData }) {
  const sections = [
    {
      to: "/products/flowers",
      title: "Flowers",
      detail: "Manage bouquets, photos, sizes, prices and availability.",
      count: `${data.products.length} products`,
      icon: Flower2,
      tone: "bg-[#edf5ee]",
      iconTone: "bg-white text-[#497752]",
    },
    {
      to: "/products/categories",
      title: "Categories",
      detail: "Organize the groups customers browse on the shop.",
      count: `${data.categories.length} categories`,
      icon: Tag,
      tone: "bg-[#f4eff8]",
      iconTone: "bg-white text-[#765f8d]",
    },
    {
      to: "/products/add-ons",
      title: "Add-ons",
      detail: "Manage shared extras such as chocolate, teddy bears and wine.",
      count: `${data.addons.filter((a) => a.active).length} available`,
      icon: Package,
      tone: "bg-[#fff5e8]",
      iconTone: "bg-white text-[#a47839]",
    },
  ];
  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Choose what you’d like to manage."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(
          ({ to, title, detail, count, icon: Icon, tone, iconTone }) => (
            <Link
              key={to}
              to={to}
              className={`group flex min-h-44 flex-col rounded-2xl border border-white p-5 transition hover:-translate-y-0.5 hover:shadow-md ${tone}`}
            >
              <span
                className={`grid size-11 place-items-center rounded-xl ${iconTone}`}
              >
                <Icon size={21} />
              </span>
              <div className="mt-4 flex w-full items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{title}</h2>
                  <p className="mt-1 max-w-sm text-sm leading-5 text-[var(--muted)]">
                    {detail}
                  </p>
                </div>
                <ChevronRight
                  className="mt-1 shrink-0 text-[var(--muted)] transition group-hover:translate-x-1"
                  size={19}
                />
              </div>
              <span className="mt-auto pt-4 text-xs font-semibold text-[var(--muted)]">
                {count}
              </span>
            </Link>
          ),
        )}
      </div>
    </>
  );
}
function CategoriesPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Manage the groups customers browse on the shop."
        action={
          <Link
            to="/products"
            className="text-sm font-semibold text-[var(--teal)]"
          >
            Back to products
          </Link>
        }
      />
      <Card className="max-w-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Product categories</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Changes here also update the category on each bouquet.
            </p>
          </div>
          <Pill>{data.categories.length}</Pill>
        </div>
        <CategoryEditor data={data} update={update} notify={notify} />
      </Card>
    </>
  );
}

function ProductsPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const navigate = useNavigate();
  const filtered = data.products.filter(
    (p) =>
      (category === "All categories" || p.category === category) &&
      `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const toggle = (product: Product, sizeName: string) => {
    const products = data.products.map((p) =>
      p.id === product.id
        ? {
            ...p,
            sizes: p.sizes.map((s) =>
              s.name === sizeName ? { ...s, inStock: !s.inStock } : s,
            ),
          }
        : p,
    );
    update({ products });
    notify(
      `${sizeName} size marked ${product.sizes.find((s) => s.name === sizeName)?.inStock ? "sold out" : "in stock"}`,
    );
  };
  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Keep bouquet details, sizes, prices, and availability current."
        action={
          <Button onClick={() => navigate("/products/new")}>
            <Plus size={16} />
            Add product
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search products"
        />
        <Select
          value={category}
          onChange={setCategory}
          label="Filter products by category"
        >
          <option>All categories</option>
          {data.categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>
      <Card className="overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="bg-[#f8faf7] text-[10px] font-bold uppercase tracking-wide text-[#7d8a84]">
              <tr>
                <th className="px-5 py-3">Bouquet</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Sizes in stock</th>
                <th className="px-4 py-3">Shop status</th>
                <th className="px-5 py-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[#eef1ed] hover:bg-[#fbfcfa]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || p.image}
                        alt=""
                        className="size-11 rounded-lg bg-[#edf2ed] object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="mt-0.5 line-clamp-1 max-w-[260px] text-xs text-[var(--muted)]">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {money(Math.min(...p.sizes.map((s) => s.price)))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.sizes.map((s) => (
                        <button
                          key={s.name}
                          onClick={() => toggle(p, s.name)}
                          title={`${s.name}: ${s.inStock ? "In stock" : "Sold out"}`}
                          className={`rounded-md px-2 py-1 text-[10px] font-bold ${s.inStock ? "bg-[#edf4ec] text-[#417247]" : "bg-[#fae9ed] text-[#a3405d]"}`}
                        >
                          {s.name.slice(0, 1)}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--muted)]">
                      Tap size to change stock
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={p.status === "Published" ? "green" : "gold"}>
                      {p.status}
                    </Pill>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="quiet"
                      onClick={() => navigate(`/products/${p.id}/edit`)}
                    >
                      <Pencil size={15} />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid min-w-0 gap-3 p-3 md:hidden">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="min-w-0 overflow-hidden rounded-xl border border-[#e8ede8] p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={p.images?.[0] || p.image}
                  alt=""
                  className="size-14 shrink-0 rounded-lg bg-[#edf2ed] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <h3 className="min-w-0 flex-1 break-words text-sm font-bold leading-5">
                      {p.name}
                    </h3>
                    <Pill tone={p.status === "Published" ? "green" : "gold"}>
                      {p.status}
                    </Pill>
                  </div>
                  <p className="mt-1 truncate text-xs text-[var(--muted)]">
                    {p.category} · from{" "}
                    {money(Math.min(...p.sizes.map((s) => s.price)))}
                  </p>
                </div>
              </div>
              <div className="mt-3 border-t border-[#eef1ed] pt-3">
                <p className="text-[10px] font-bold text-[#78857f]">
                  SIZE AVAILABILITY · TAP TO CHANGE
                </p>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {p.sizes.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => toggle(p, s.name)}
                      aria-label={`${s.name}: ${s.inStock ? "In stock" : "Sold out"}. Tap to change.`}
                      className={`min-w-0 rounded-lg px-1 py-2 text-center text-[10px] font-semibold ${s.inStock ? "bg-[#edf4ec] text-[#417247]" : "bg-[#fae9ed] text-[#a3405d]"}`}
                    >
                      <span className="block truncate">{s.name}</span>
                      <span className="mt-0.5 block">
                        {s.inStock ? "In" : "Out"}
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-2.5 w-full justify-center"
                  onClick={() => navigate(`/products/${p.id}/edit`)}
                >
                  <Pencil size={14} />
                  Edit product
                </Button>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && (
          <EmptyState
            icon={Flower2}
            title="No matching products"
            detail="Add a bouquet or change your search."
            action={
              <Button onClick={() => navigate("/products/new")}>
                <Plus size={16} />
                Add product
              </Button>
            }
          />
        )}
        <div className="border-t border-[var(--line)] px-4 py-3 text-xs text-[var(--muted)]">
          {filtered.length} products
        </div>
      </Card>
    </>
  );
}

function ProductEditor({
  product,
  data,
  update,
  notify,
}: {
  product?: Product;
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const navigate = useNavigate();
  const initial = product
    ? {
        ...product,
        images: product.images ?? (product.image ? [product.image] : []),
      }
    : {
        id: `p-${Date.now()}`,
        name: "",
        category: data.categories[0] ?? "Bouquets",
        price: 0,
        image: "",
        images: [],
        description: "",
        status: "Draft" as const,
        addOnIds: [],
        sizes: ["Small", "Medium", "Large", "XL"].map((name) => ({
          name,
          price: 0,
          inStock: true,
        })),
      };
  const [form, setForm] = useState<Product>(initial);
  const change = (key: keyof Product, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));
  const setSize = (
    name: string,
    key: "price" | "inStock",
    value: number | boolean,
  ) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.map((s) => (s.name === name ? { ...s, [key]: value } : s)),
    }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cover = form.images?.[0] || form.image;
    const saved = { ...form, image: cover };
    const products = product
      ? data.products.map((p) => (p.id === product.id ? saved : p))
      : [saved, ...data.products];
    update({ products });
    notify(
      form.status === "Published"
        ? "Product published"
        : "Product saved as draft",
    );
    navigate("/products");
  };
  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = Math.max(0, 8 - (form.images?.length ?? 0));
    const selected = Array.from(files).slice(0, remaining);
    if (files.length > remaining) notify("A product can have up to 8 images");
    const encoded = await Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const image = new Image();
              image.onload = () => {
                const scale = Math.min(
                  1,
                  1400 / Math.max(image.width, image.height),
                );
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(image.width * scale);
                canvas.height = Math.round(image.height * scale);
                canvas
                  .getContext("2d")
                  ?.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.8));
              };
              image.onerror = () => reject(new Error("Could not read image"));
              image.src = String(reader.result);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );
    setForm((f) => ({
      ...f,
      images: [...(f.images ?? []), ...encoded],
      image: f.images?.[0] ?? encoded[0] ?? f.image,
    }));
  };
  return (
    <>
      <PageHeader
        title={product ? "Edit product" : "Add product"}
        subtitle="Add bouquet details, photos, sizes and availability."
        action={
          <Button variant="outline" onClick={() => navigate("/products")}>
            Back to products
          </Button>
        }
      />
      <form
        onSubmit={submit}
        className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]"
      >
        <div className="space-y-4">
          <Card className="space-y-4 p-4 sm:p-5">
            <h2 className="font-bold">Product details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Product name">
                <TextInput
                  value={form.name}
                  onChange={(v) => change("name", v)}
                  placeholder="e.g. Garden rose bouquet"
                  required
                />
              </FormField>
              <FormField label="Category">
                <select
                  value={form.category}
                  onChange={(e) => change("category", e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm"
                >
                  {data.categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                  {!data.categories.length && <option>Bouquets</option>}
                </select>
              </FormField>
            </div>
            <FormField label="Description">
              <TextArea
                value={form.description}
                onChange={(v) => change("description", v)}
                placeholder="Describe the bouquet for customers."
                rows={3}
              />
            </FormField>
          </Card>
          <Card className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">Product photos</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Add up to 8 images. The first image is the main photo.
                </p>
              </div>
              <ImagePlus className="shrink-0 text-[var(--teal)]" size={19} />
            </div>
            <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#b9cbc0] bg-[#f8faf7] px-4 text-center">
              <span className="text-sm font-semibold text-[var(--teal)]">
                Choose photos
              </span>
              <span className="mt-1 text-xs text-[var(--muted)]">
                Select multiple images from your device
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  void addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            {(form.images?.length ?? 0) > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.images?.map((src, i) => (
                  <div
                    key={`${i}-${src.slice(0, 24)}`}
                    className="relative aspect-square overflow-hidden rounded-xl bg-[#edf2ed]"
                  >
                    <img
                      src={src}
                      alt={`Product photo ${i + 1}`}
                      className="size-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-1 text-[9px] font-bold text-white">
                      {i === 0 ? "Main" : `Photo ${i + 1}`}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove photo ${i + 1}`}
                      onClick={() =>
                        setForm((f) => {
                          const images = (f.images ?? []).filter(
                            (_, n) => n !== i,
                          );
                          return { ...f, images, image: images[0] ?? "" };
                        })
                      }
                      className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-white/95 text-[#6c4a52] shadow"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="p-4 sm:p-5">
            <h2 className="font-bold">Size, price and availability</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Set a separate price and stock status for each size.
            </p>
            <div className="mt-4 space-y-2">
              {form.sizes.map((s) => (
                <div
                  key={s.name}
                  className="grid grid-cols-[70px_1fr_auto] items-center gap-2 rounded-xl bg-[#f7f9f6] p-2.5 sm:grid-cols-[100px_1fr_150px_auto]"
                >
                  <span className="text-sm font-bold">{s.name}</span>
                  <label className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                      ₦
                    </span>
                    <input
                      aria-label={`${s.name} price`}
                      type="number"
                      min="0"
                      value={s.price || ""}
                      onChange={(e) =>
                        setSize(s.name, "price", Number(e.target.value))
                      }
                      placeholder="Price"
                      className="h-9 w-full rounded-lg border border-[#dce4dd] bg-white pl-7 pr-2 text-sm outline-none"
                    />
                  </label>
                  <label className="col-span-2 flex items-center gap-2 text-xs font-semibold sm:col-span-1">
                    <input
                      type="checkbox"
                      checked={s.inStock}
                      onChange={(e) =>
                        setSize(s.name, "inStock", e.target.checked)
                      }
                      className="size-4 accent-[#07555a]"
                    />
                    In stock
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <h2 className="font-bold">Shop status</h2>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Draft products stay hidden from customers.
            </p>
            <select
              value={form.status}
              onChange={(e) => change("status", e.target.value)}
              className="mt-4 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm"
            >
              <option>Draft</option>
              <option>Published</option>
            </select>
          </Card>
          <Card className="p-4 sm:p-5">
            <details>
              <summary className="cursor-pointer text-sm font-bold">
                Add-ons available with this bouquet
              </summary>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.addons
                  .filter((a) => a.active)
                  .map((a) => (
                    <label
                      key={a.id}
                      className="flex items-center gap-2 rounded-lg bg-[#f4f7f3] px-3 py-2 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={(
                          form.addOnIds ??
                          data.addons.filter((x) => x.active).map((x) => x.id)
                        ).includes(a.id)}
                        onChange={(e) => {
                          const ids =
                            form.addOnIds ??
                            data.addons
                              .filter((x) => x.active)
                              .map((x) => x.id);
                          change(
                            "addOnIds",
                            e.target.checked
                              ? [...ids, a.id]
                              : ids.filter((id) => id !== a.id),
                          );
                        }}
                        className="accent-[#07555a]"
                      />
                      {a.name}{" "}
                      {a.price ? `· ${money(a.price)}` : "· price not set"}
                    </label>
                  ))}
              </div>
            </details>
          </Card>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button type="submit">
              {form.status === "Published"
                ? "Save and publish"
                : "Save as draft"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

function CategoryEditor({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [value, setValue] = useState("");
  const rename = (oldName: string, newName: string) => {
    const clean = newName.trim();
    if (!clean || clean === oldName) return;
    if (data.categories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      notify("That category already exists");
      return;
    }
    update({
      categories: data.categories.map((c) => (c === oldName ? clean : c)),
      products: data.products.map((p) =>
        p.category === oldName ? { ...p, category: clean } : p,
      ),
    });
    notify("Category updated");
  };
  return (
    <div className="mt-3">
      <div className="mb-3 space-y-2">
        {data.categories.map((c) => (
          <div key={c} className="flex items-center gap-2">
            <input
              key={c}
              defaultValue={c}
              aria-label={`Category ${c}`}
              onBlur={(e) => rename(c, e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              className="h-9 min-w-0 flex-1 rounded-lg border border-[#dce4dd] bg-white px-2.5 text-sm outline-none focus:border-[#579289]"
            />
            <button
              type="button"
              disabled={data.products.some((p) => p.category === c)}
              title={
                data.products.some((p) => p.category === c)
                  ? "Move products to another category before removing this one"
                  : "Remove category"
              }
              onClick={() => {
                update({ categories: data.categories.filter((x) => x !== c) });
                notify("Category removed");
              }}
              className="grid size-9 place-items-center rounded-lg text-[#89948e] hover:bg-[#f8e9ed] hover:text-[var(--rose)] disabled:opacity-35"
              aria-label={`Remove ${c}`}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), e.currentTarget.blur())
          }
          placeholder="New category"
          className="h-9 min-w-0 flex-1 rounded-lg border border-[#dce4dd] px-2.5 text-sm outline-none"
        />
        <Button
          onClick={() => {
            if (!value.trim()) return;
            if (
              data.categories.some(
                (c) => c.toLowerCase() === value.trim().toLowerCase(),
              )
            ) {
              notify("That category already exists");
              return;
            }
            update({ categories: [...data.categories, value.trim()] });
            notify("Category added");
            setValue("");
          }}
        >
          <Plus size={15} />
          Add
        </Button>
      </div>
    </div>
  );
}
function AddonManager({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  return (
    <>
      <PageHeader
        title="Add-ons"
        subtitle="Manage shared extras and their prices."
        action={
          <Link
            to="/products"
            className="text-sm font-semibold text-[var(--teal)]"
          >
            Back to products
          </Link>
        }
      />
      <Card className="max-w-3xl p-4 sm:p-5">
        <p className="text-sm leading-6 text-[var(--muted)]">
          Manage extras once, then choose which ones appear with each bouquet.
        </p>
        <div className="mt-4 divide-y divide-[#edf1ed] rounded-xl border border-[var(--line)]">
          {data.addons.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#edf3ee] text-[var(--teal)]">
                <Flower2 size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <input
                  aria-label="Add-on name"
                  value={a.name}
                  onChange={(e) =>
                    update({
                      addons: data.addons.map((x) =>
                        x.id === a.id ? { ...x, name: e.target.value } : x,
                      ),
                    })
                  }
                  className="w-full bg-transparent text-sm font-bold outline-none"
                />
                <p className="text-xs text-[var(--muted)]">
                  {a.price ? money(a.price) : "Price not set"}
                </p>
              </div>
              <input
                aria-label={`${a.name} price`}
                type="number"
                min="0"
                value={a.price || ""}
                onChange={(e) =>
                  update({
                    addons: data.addons.map((x) =>
                      x.id === a.id
                        ? { ...x, price: Number(e.target.value) }
                        : x,
                    ),
                  })
                }
                placeholder="Price ₦"
                className="h-9 min-w-0 flex-1 rounded-lg border border-[#dce4dd] px-2 text-xs sm:w-28 sm:flex-none"
              />
              <button
                onClick={() =>
                  update({
                    addons: data.addons.map((x) =>
                      x.id === a.id ? { ...x, active: !x.active } : x,
                    ),
                  })
                }
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${a.active ? "bg-[#e8f3e9] text-[#397343]" : "bg-[#f0f3ef] text-[#687772]"}`}
              >
                {a.active ? "Available" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
        <form
          className="mt-4 grid grid-cols-[minmax(0,1fr)_100px_auto] gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            update({
              addons: [
                ...data.addons,
                {
                  id: `a-${Date.now()}`,
                  name: name.trim(),
                  price: Number(price) || 0,
                  active: true,
                },
              ],
            });
            setName("");
            setPrice("");
            notify("Add-on created");
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add-on name"
            className="h-10 min-w-0 rounded-lg border border-[#dce4dd] px-2 text-sm"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="Price ₦"
            className="h-10 min-w-0 rounded-lg border border-[#dce4dd] px-2 text-sm"
          />
          <Button type="submit">
            <Plus size={14} />
          </Button>
        </form>
      </Card>
    </>
  );
}

function DeliveryPage({data,update,notify}:{data:AdminData;update:(change:Partial<AdminData>)=>void;notify:(m:string)=>void}) {
  const locations = nigerianLocations as {name:string;towns:string[]}[];
  const [selectedState,setSelectedState]=useState("");
  const [newFee,setNewFee]=useState("");
  const [expanded,setExpanded]=useState<string|null>(data.zones[0]?.state??null);
  const [search,setSearch]=useState<Record<string,string>>({});
  const configured=new Set(data.zones.map(zone=>zone.state));
  const addState=(event:FormEvent)=>{
    event.preventDefault();
    if(!selectedState||!newFee||configured.has(selectedState))return;
    const location=locations.find(item=>item.name===selectedState);
    if(!location)return;
    const zone:Zone={id:`zone-${Date.now()}`,state:selectedState,fee:Number(newFee),towns:location.towns.map(name=>({name,deliverable:true}))};
    update({zones:[...data.zones,zone]});setExpanded(zone.id);setSelectedState("");setNewFee("");notify(`${selectedState} added with all ${zone.towns.length} LGAs selected`);
  };
  const updateZone=(id:string,change:Partial<Zone>)=>update({zones:data.zones.map(zone=>zone.id===id?{...zone,...change}:zone)});
  const label=(state:string)=>state==="Federal Capital Territory"?"FCT (Abuja)":state;
  return <>
    <PageHeader title="Delivery areas" subtitle="Choose the states you deliver to, set each state’s fee, and switch off any LGAs you don’t serve."/>
    <Card className="mb-4 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#edf3ee] text-[var(--teal)]"><Plus size={18}/></span><div><h2 className="font-bold">Add a delivery state</h2><p className="mt-0.5 text-xs text-[var(--muted)]">All LGAs start selected. You can turn off the areas you don’t cover.</p></div></div>
      <form onSubmit={addState} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_auto] sm:items-end">
        <label className="block text-sm font-semibold">State<select value={selectedState} onChange={event=>setSelectedState(event.target.value)} required className="mt-2 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm"><option value="">Choose a state</option>{locations.filter(item=>!configured.has(item.name)).map(item=><option key={item.name} value={item.name}>{label(item.name)}</option>)}</select></label>
        <label className="block text-sm font-semibold">Delivery fee<input type="number" min="0" step="1" required value={newFee} onChange={event=>setNewFee(event.target.value)} placeholder="Amount in naira" className="mt-2 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm"/></label>
        <Button type="submit" disabled={!selectedState||!newFee}><Plus size={16}/>Add state</Button>
      </form>
    </Card>
    {data.zones.length===0?<Card><EmptyState icon={Truck} title="No delivery states yet" detail="Choose a state and set its delivery fee to get started."/></Card>:<div className="space-y-3">{data.zones.map(zone=>{
      const available=zone.towns.filter(town=>town.deliverable).length;
      const query=(search[zone.id]??"").trim().toLowerCase();
      const visible=zone.towns.filter(town=>town.name.toLowerCase().includes(query));
      const allVisibleSelected=visible.length>0&&visible.every(town=>town.deliverable);
      const setTown=(name:string,deliverable:boolean)=>updateZone(zone.id,{towns:zone.towns.map(town=>town.name===name?{...town,deliverable}:town)});
      return <Card key={zone.id} className="overflow-hidden p-0">
        <div className="flex items-center gap-3 p-4 sm:p-5">
          <button type="button" onClick={()=>setExpanded(expanded===zone.id?null:zone.id)} aria-expanded={expanded===zone.id} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf3ee] text-[var(--teal)]"><MapMarker/></span><span className="min-w-0"><span className="block truncate font-bold">{label(zone.state)}</span><span className="mt-0.5 block text-xs text-[var(--muted)]">{available} of {zone.towns.length} LGAs covered</span></span><ChevronDown size={17} className={`ml-auto shrink-0 transition-transform ${expanded===zone.id?"rotate-180":""}`}/></button>
          <label className="hidden w-44 shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)] sm:block">Delivery fee<div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">₦</span><input aria-label={`${label(zone.state)} delivery fee`} type="number" min="0" value={zone.fee??""} onChange={event=>updateZone(zone.id,{fee:event.target.value===""?null:Number(event.target.value)})} className="h-10 w-full rounded-lg border border-[#dce4dd] bg-white pl-7 pr-2 text-sm font-semibold"/></div></label>
          <button type="button" onClick={()=>{update({zones:data.zones.filter(item=>item.id!==zone.id)});notify(`${label(zone.state)} removed from delivery areas`);}} className="grid size-9 shrink-0 place-items-center rounded-lg text-[#89948e] hover:bg-[#f8e9ed] hover:text-[var(--rose)]" aria-label={`Remove ${label(zone.state)}`}><X size={16}/></button>
        </div>
        {expanded===zone.id&&<div className="border-t border-[var(--line)] bg-[#fcfdfb] p-4 sm:p-5">
          <label className="mb-3 block text-[10px] font-bold uppercase tracking-wide text-[var(--muted)] sm:hidden">Delivery fee<input aria-label={`${label(zone.state)} delivery fee`} type="number" min="0" value={zone.fee??""} onChange={event=>updateZone(zone.id,{fee:event.target.value===""?null:Number(event.target.value)})} className="mt-1.5 h-10 w-full rounded-lg border border-[#dce4dd] bg-white px-3 text-sm font-semibold"/></label>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><label className="relative block w-full sm:max-w-xs"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84918b]"/><input value={search[zone.id]??""} onChange={event=>setSearch(current=>({...current,[zone.id]:event.target.value}))} placeholder="Find an LGA or town" className="h-10 w-full rounded-xl border border-[#dce4dd] bg-white pl-9 pr-3 text-sm"/></label><button type="button" onClick={()=>{const next=!allVisibleSelected;updateZone(zone.id,{towns:zone.towns.map(town=>town.name.toLowerCase().includes(query)?{...town,deliverable:next}:town)});}} className="self-start text-xs font-bold text-[var(--teal)]">{allVisibleSelected?"Unselect visible":"Select visible"}</button></div>
          <div className="grid max-h-[360px] grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">{visible.map(town=><label key={town.name} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[#f1f6f1]"><input type="checkbox" checked={town.deliverable} onChange={event=>setTown(town.name,event.target.checked)} className="size-4 accent-[#07555a]"/><span className="min-w-0 flex-1 truncate">{town.name}</span></label>)}</div>
          {visible.length===0&&<p className="py-6 text-center text-sm text-[var(--muted)]">No matching LGAs or towns.</p>}
          <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs leading-5 text-[var(--muted)]">Unchecked LGAs won’t be offered for delivery in the customer checkout.</p>
        </div>}
      </Card>;
    })}</div>}
    <Card className="mt-4 p-4 sm:p-5"><h2 className="font-bold">Pickup</h2><p className="mt-1 text-sm text-[var(--muted)]">Shop pickup is available. Set the store address under Website information.</p><Link to="/website" className="mt-3 inline-flex text-xs font-bold text-[var(--teal)]">Update pickup details <ArrowRight size={14} className="ml-1"/></Link></Card>
  </>;
}
function visibleAnnouncementLength(value:string){return value.replace(/\*\*|__/g,"").replace(/\*|_/g,"").length;}
function formatAnnouncement(value:string){return value.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part,index)=>part.startsWith("**")&&part.endsWith("**")?<strong key={index}>{part.slice(2,-2)}</strong>:part.startsWith("*")&&part.endsWith("*")?<em key={index}>{part.slice(1,-1)}</em>:<span key={index}>{part}</span>);}
function AnnouncementsPage({data,update,notify}:{data:AdminData;update:(change:Partial<AdminData>)=>void;notify:(m:string)=>void}){
  const [editing,setEditing]=useState<string|null>(null);const [message,setMessage]=useState("");const [showForm,setShowForm]=useState(false);const textarea=useRef<HTMLTextAreaElement>(null);
  const reset=()=>{setEditing(null);setMessage("");setShowForm(false);};
  const startEdit=(announcement?:Announcement)=>{setEditing(announcement?.id??null);setMessage(announcement?.message??"");setShowForm(true);};
  const insertFormat=(marker:"**"|"*")=>{const input=textarea.current;if(!input)return;const start=input.selectionStart,end=input.selectionEnd;const selected=message.slice(start,end)|| (marker==="**"?"bold text":"italic text");const next=`${message.slice(0,start)}${marker}${selected}${marker}${message.slice(end)}`;if(visibleAnnouncementLength(next)>ANNOUNCEMENT_LIMIT){notify(`Announcements can be up to ${ANNOUNCEMENT_LIMIT} characters`);return;}setMessage(next);requestAnimationFrame(()=>{input.focus();const selectionStart=start+marker.length;input.setSelectionRange(selectionStart,selectionStart+selected.length);});};
  const save=(event:FormEvent)=>{event.preventDefault();const clean=message.trim();if(!clean||visibleAnnouncementLength(clean)>ANNOUNCEMENT_LIMIT)return;const announcements=editing?data.announcements.map(item=>item.id===editing?{...item,message:clean}:item):[{id:`announcement-${Date.now()}`,message:clean,active:true},...data.announcements];update({announcements});notify(editing?"Announcement updated":"Announcement added");reset();};
  const updateOne=(id:string,change:Partial<Announcement>)=>update({announcements:data.announcements.map(item=>item.id===id?{...item,...change}:item)});
  return <><PageHeader title="Announcements" subtitle="Manage the short messages shown in the announcement bar on the customer website." action={<Button onClick={()=>startEdit()}><Plus size={16}/>Add announcement</Button>}/>
    {showForm&&<Card className="mb-4 max-w-3xl p-4 sm:p-5"><form onSubmit={save}><div className="flex items-center justify-between gap-3"><div><h2 className="font-bold">{editing?"Edit announcement":"New announcement"}</h2><p className="mt-1 text-xs text-[var(--muted)]">Keep it short so it fits across phone screens.</p></div><Pill tone={visibleAnnouncementLength(message)>ANNOUNCEMENT_LIMIT?"rose":"neutral"}>{visibleAnnouncementLength(message)}/{ANNOUNCEMENT_LIMIT}</Pill></div><div className="mt-4 flex items-center gap-1 rounded-t-xl border border-b-0 border-[#dce4dd] bg-[#f8faf7] p-1.5"><button type="button" onClick={()=>insertFormat("**")} title="Bold selected text" aria-label="Bold selected text" className="grid size-9 place-items-center rounded-lg font-serif font-bold hover:bg-white">B</button><button type="button" onClick={()=>insertFormat("*")} title="Italic selected text" aria-label="Italic selected text" className="grid size-9 place-items-center rounded-lg font-serif italic hover:bg-white">I</button><span className="ml-2 text-xs text-[var(--muted)]">Select text, then apply formatting.</span></div><textarea ref={textarea} value={message} onChange={event=>{const value=event.target.value;if(visibleAnnouncementLength(value)<=ANNOUNCEMENT_LIMIT)setMessage(value);}} maxLength={ANNOUNCEMENT_LIMIT+4} placeholder="e.g. Same-day delivery in Lagos & Abuja" rows={3} className="w-full resize-y rounded-b-xl border border-[#dce4dd] px-3 py-2.5 text-sm outline-none focus:border-[#579289] focus:ring-4 focus:ring-[#e2efeb]"/><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-h-8 flex-1 rounded-lg bg-[#f4f7f3] px-3 py-2 text-sm" aria-label="Announcement preview">{message?formatAnnouncement(message):<span className="text-[var(--muted)]">Your message preview</span>}</div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={reset}>Cancel</Button><Button type="submit" disabled={!message.trim()||visibleAnnouncementLength(message)>ANNOUNCEMENT_LIMIT}>{editing?"Save changes":"Add announcement"}</Button></div></div></form></Card>}
    <div className="grid max-w-3xl gap-3">{data.announcements.map((item)=><Card key={item.id} className="p-4 sm:p-5"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#edf3ee] text-[var(--teal)]"><MessageCircle size={17}/></span><div className="min-w-0 flex-1"><p className="text-sm leading-6">{formatAnnouncement(item.message)}</p><p className="mt-1 text-xs text-[var(--muted)]">{visibleAnnouncementLength(item.message)} of {ANNOUNCEMENT_LIMIT} characters</p></div><button type="button" onClick={()=>updateOne(item.id,{active:!item.active})} className={`rounded-full px-3 py-1.5 text-xs font-bold ${item.active?"bg-[#e8f3e9] text-[#397343]":"bg-[#f0f3ef] text-[#687772]"}`}>{item.active?"Shown":"Hidden"}</button></div><div className="mt-3 flex justify-end gap-2 border-t border-[#edf1ed] pt-3"><Button variant="quiet" onClick={()=>startEdit(item)}><Pencil size={14}/>Edit</Button><Button variant="quiet" onClick={()=>{update({announcements:data.announcements.filter(value=>value.id!==item.id)});notify("Announcement removed")}}><X size={14}/>Remove</Button></div></Card>)}{!data.announcements.length&&<Card><EmptyState icon={MessageCircle} title="No announcements yet" detail="Add a short message to show in the announcement bar." action={<Button onClick={()=>startEdit()}><Plus size={15}/>Add announcement</Button>}/></Card>}</div>
    <p className="mt-4 max-w-3xl text-xs leading-5 text-[var(--muted)]">Formatting uses the B and I buttons. Hidden messages are saved but won’t appear in the announcement bar.</p>
  </>;
}

function MapMarker() {
  return <Truck size={17} />;
}

function PromotionsPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Promotion>({
    id: "",
    name: "",
    type: "Percentage",
    amount: 0,
    starts: "",
    ends: "",
    product: "All products",
    active: false,
  });
  const save = (e: FormEvent) => {
    e.preventDefault();
    update({
      promotions: [
        { ...form, id: `promo-${Date.now()}`, active: true },
        ...data.promotions,
      ],
    });
    setOpen(false);
    notify("Promotion created");
  };
  return (
    <>
      <PageHeader
        title="Promotions"
        subtitle="Offer automatic discounts for a set time, with no code for customers to enter."
        action={
          <Button
            onClick={() => {
              setForm({
                id: "",
                name: "",
                type: "Percentage",
                amount: 0,
                starts: "",
                ends: "",
                product: "All products",
                active: false,
              });
              setOpen(true);
            }}
          >
            <Plus size={16} />
            Create promotion
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Metric
          icon={Tag}
          label="Running now"
          value={String(data.promotions.filter((p) => p.active).length)}
          note="Automatic discounts"
          tone="leaf"
        />
        <Metric
          icon={CalendarDays}
          label="Scheduled"
          value={String(data.promotions.filter((p) => !p.active).length)}
          note="Starts on a future date"
          tone="teal"
        />
        <Metric
          icon={Package}
          label="Products"
          value={String(data.products.length)}
          note="Available to include"
          tone="gold"
        />
      </div>
      <Card>
        {data.promotions.length ? (
          <div className="divide-y divide-[#edf1ed]">
            {data.promotions.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-3 p-4 sm:px-5"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-[#f9eaf0] text-[var(--rose)]">
                  <Tag size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{p.name}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {p.product} · {p.starts || "No start date"} –{" "}
                    {p.ends || "No end date"}
                  </p>
                </div>
                <strong className="text-sm">
                  {p.type === "Percentage"
                    ? `${p.amount}% off`
                    : money(p.amount) + " off"}
                </strong>
                <button
                  onClick={() => {
                    update({
                      promotions: data.promotions.map((x) =>
                        x.id === p.id ? { ...x, active: !x.active } : x,
                      ),
                    });
                    notify(p.active ? "Promotion paused" : "Promotion resumed");
                  }}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${p.active ? "bg-[#e8f3e9] text-[#397343]" : "bg-[#f0f3ef] text-[#687772]"}`}
                >
                  {p.active ? "Active" : "Paused"}
                </button>
                <IconButton
                  icon={X}
                  label={`Remove ${p.name}`}
                  onClick={() => {
                    update({
                      promotions: data.promotions.filter((x) => x.id !== p.id),
                    });
                    notify("Promotion removed");
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Tag}
            title="No promotions yet"
            detail="Create an automatic discount, choose which products it applies to, and set the dates it should run."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus size={16} />
                Create promotion
              </Button>
            }
          />
        )}
      </Card>
      {open && (
        <Modal title="Create promotion" onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-4">
            <FormField label="Promotion name">
              <TextInput
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Weekend flowers"
                required
              />
            </FormField>
            <div className="grid grid-cols-[1fr_130px] gap-3">
              <FormField label="Discount type">
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value as Promotion["type"],
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm"
                >
                  <option>Percentage</option>
                  <option>Fixed amount</option>
                </select>
              </FormField>
              <FormField
                label={form.type === "Percentage" ? "Percent" : "Amount in ₦"}
              >
                <TextInput
                  type="number"
                  value={form.amount ? String(form.amount) : ""}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, amount: Number(v) }))
                  }
                  required
                />
              </FormField>
            </div>
            <FormField label="Applies to">
              <select
                value={form.product}
                onChange={(e) =>
                  setForm((f) => ({ ...f, product: e.target.value }))
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm"
              >
                <option>All products</option>
                {data.products.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Starts">
                <TextInput
                  type="date"
                  value={form.starts}
                  onChange={(v) => setForm((f) => ({ ...f, starts: v }))}
                  required
                />
              </FormField>
              <FormField label="Ends">
                <TextInput
                  type="date"
                  value={form.ends}
                  onChange={(v) => setForm((f) => ({ ...f, ends: v }))}
                  required
                />
              </FormField>
            </div>
            <p className="rounded-lg bg-[#f5f8f4] p-3 text-xs leading-5 text-[var(--muted)]">
              Discount applies automatically. Customers do not need a code.
            </p>
            <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save promotion</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function ReviewsPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [tab, setTab] = useState("Pending");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    product: "",
    rating: 5,
    text: "",
  });
  const reviews = data.reviews.filter((r) => tab === "All" || r.status === tab);
  const moderate = (id: string, status: Review["status"]) => {
    update({
      reviews: data.reviews.map((r) => (r.id === id ? { ...r, status } : r)),
    });
    notify(
      status === "Published"
        ? "Review approved and published"
        : "Review declined",
    );
  };
  return (
    <>
      <PageHeader
        title="Reviews"
        subtitle="Approve customer reviews before they appear on the website."
        action={
          <Button variant="outline" onClick={() => setOpen(true)}>
            <Plus size={16} />
            Add existing testimonial
          </Button>
        }
      />
      <div className="mb-4 flex gap-1 rounded-xl bg-[#eaf0eb] p-1">
        {["Pending", "Published", "Declined", "All"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-2 text-xs font-bold ${tab === t ? "bg-white text-[var(--teal)] shadow-sm" : "text-[#6e7b75]"}`}
          >
            {t}
            {t === "Pending" && (
              <span className="ml-1.5">
                ({data.reviews.filter((r) => r.status === "Pending").length})
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {reviews.map((r) => (
          <Card key={r.id} className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f9eaf0] text-[var(--rose)]">
                <Star size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold">{r.name}</h2>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      {r.product} · {r.date}
                    </p>
                  </div>
                  <Pill
                    tone={
                      r.status === "Published"
                        ? "green"
                        : r.status === "Pending"
                          ? "gold"
                          : "neutral"
                    }
                  >
                    {r.status}
                  </Pill>
                </div>
                <p className="mt-3 text-sm leading-6">{r.text}</p>
                <div className="mt-2 text-sm tracking-wide text-[#a8782b]">
                  {"★".repeat(r.rating)}
                  <span className="text-[#d8dcd5]">
                    {"★".repeat(5 - r.rating)}
                  </span>
                </div>
              </div>
            </div>
            {r.status === "Pending" && (
              <div className="mt-4 flex justify-end gap-2 border-t border-[#edf1ed] pt-3">
                <Button
                  variant="outline"
                  onClick={() => moderate(r.id, "Declined")}
                >
                  Decline
                </Button>
                <Button onClick={() => moderate(r.id, "Published")}>
                  <Check size={15} />
                  Approve review
                </Button>
              </div>
            )}
            {r.status === "Published" && (
              <div className="mt-4 flex justify-end border-t border-[#edf1ed] pt-3">
                <Button
                  variant="outline"
                  onClick={() => moderate(r.id, "Declined")}
                >
                  Remove from website
                </Button>
              </div>
            )}
          </Card>
        ))}
        {!reviews.length && (
          <Card className="lg:col-span-2">
            <EmptyState
              icon={Star}
              title={
                tab === "Pending"
                  ? "No reviews waiting for approval"
                  : `No ${tab.toLowerCase()} reviews`
              }
              detail={
                tab === "Pending"
                  ? "New customer reviews will appear here for your team to approve or decline."
                  : "Add existing testimonials provided by the Flowers by Lara team."
              }
              action={
                tab === "Pending" ? (
                  <Button variant="outline" onClick={() => setOpen(true)}>
                    <Plus size={15} />
                    Add existing testimonial
                  </Button>
                ) : undefined
              }
            />
          </Card>
        )}
      </div>
      {open && (
        <Modal title="Add existing testimonial" onClose={() => setOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update({
                reviews: [
                  {
                    id: `rv-${Date.now()}`,
                    ...form,
                    date: "Added today",
                    status: "Published",
                  },
                  ...data.reviews,
                ],
              });
              setOpen(false);
              setForm({ name: "", product: "", rating: 5, text: "" });
              notify("Testimonial added to the website");
            }}
            className="space-y-4"
          >
            <FormField label="Customer name">
              <TextInput
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                required
              />
            </FormField>
            <FormField label="Bouquet (optional)">
              <TextInput
                value={form.product}
                onChange={(v) => setForm((f) => ({ ...f, product: v }))}
                placeholder="Product name"
              />
            </FormField>
            <FormField label="Rating">
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: Number(e.target.value) }))
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#dce4dd] bg-white px-3 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} out of 5 stars
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Testimonial">
              <TextArea
                value={form.text}
                onChange={(v) => setForm((f) => ({ ...f, text: v }))}
                required
                placeholder="Enter the approved customer testimonial."
              />
            </FormField>
            <p className="text-xs leading-5 text-[var(--muted)]">
              Use the customer’s wording as supplied. New customer-submitted
              reviews still need approval.
            </p>
            <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add testimonial</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function WebsitePage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const [form, setForm] = useState(data.settings);
  const [saved, setSaved] = useState(false);
  useEffect(() => setForm(data.settings), [data.settings]);
  const save = (e: FormEvent) => {
    e.preventDefault();
    update({ settings: form });
    notify("Website information saved");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2300);
  };
  return (
    <>
      <PageHeader
        title="Website information"
        subtitle="Update practical details customers see on the website."
      />
      <form
        onSubmit={save}
        className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]"
      >
        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Store size={18} className="text-[var(--teal)]" />
              <h2 className="font-bold">Contact and store details</h2>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              These details appear on the customer website and pickup
              information.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Phone number">
                <TextInput
                  value={form.phone}
                  onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                  placeholder="Add store phone number"
                />
              </FormField>
              <FormField label="Email address">
                <TextInput
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                  placeholder="Add store email"
                />
              </FormField>
              <FormField label="Shop address">
                <TextInput
                  value={form.address}
                  onChange={(v) => setForm((s) => ({ ...s, address: v }))}
                  placeholder="Add pickup address"
                />
              </FormField>
              <FormField label="Opening hours">
                <TextInput
                  value={form.hours}
                  onChange={(v) => setForm((s) => ({ ...s, hours: v }))}
                  placeholder="e.g. 9am–7pm"
                />
              </FormField>
            </div>
          </Card>
          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-[var(--teal)]" />
              <h2 className="font-bold">Custom bouquet starting price</h2>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Set the fixed starting price shown to customers. The team can
              still send a tailored quote for each request.
            </p>
            <FormField label="Starting price">
              <TextInput
                type="number"
                value={
                  form.customStartingPrice === null
                    ? ""
                    : String(form.customStartingPrice)
                }
                onChange={(v) =>
                  setForm((s) => ({
                    ...s,
                    customStartingPrice: v ? Number(v) : null,
                  }))
                }
                placeholder="Enter the approved amount in naira"
              />
            </FormField>
          </Card>
          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <CircleHelp size={18} className="text-[var(--teal)]" />
              <h2 className="font-bold">Frequently asked questions</h2>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Add one question and answer per line. Use “ — ” between the
              question and answer.
            </p>
            <TextArea
              value={form.faqs}
              onChange={(v) => setForm((s) => ({ ...s, faqs: v }))}
              placeholder="Do you deliver same day? — Same-day delivery is available 9am–7pm."
              rows={6}
            />
          </Card>
          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Settings2 size={18} className="text-[var(--teal)]" />
              <h2 className="font-bold">Policies</h2>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Keep the information consistent with your current store policy.
            </p>
            <TextArea
              value={form.policies}
              onChange={(v) => setForm((s) => ({ ...s, policies: v }))}
              rows={5}
            />
          </Card>
          <div className="flex justify-end">
            <Button type="submit">
              <Check size={15} />
              {saved ? "Saved" : "Save website information"}
            </Button>
          </div>
        </div>
        <aside className="space-y-4">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[var(--teal)]" />
              <h2 className="font-bold">Delivery and pickup</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Delivery is available in Lagos and Abuja, with fees based on the
              customer’s area. Same-day delivery is available during shop hours,
              9am–7pm. Shop pickup is available.
            </p>
            <Link
              to="/delivery"
              className="mt-4 inline-flex items-center text-xs font-bold text-[var(--teal)]"
            >
              Manage delivery areas <ArrowRight size={14} className="ml-1" />
            </Link>
          </Card>
          <Card className="bg-[#f0f5f0] p-4 sm:p-5">
            <h3 className="text-sm font-bold">Business details to complete</h3>
            <ul className="mt-3 space-y-2 text-xs text-[#5f7067]">
              {[
                [form.phone, "Store phone number"],
                [form.email, "Store email address"],
                [form.address, "Pickup address"],
              ].map(([v, l]) => (
                <li key={l} className="flex items-center gap-2">
                  <span
                    className={`grid size-4 place-items-center rounded-full ${v ? "bg-[#4e8057] text-white" : "border border-[#c6d1c8]"}`}
                  >
                    {v && <Check size={11} />}
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4 sm:p-5">
            <h3 className="text-sm font-bold">Policies customers can see</h3>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              The current information says there are no refunds or returns, and
              an order cannot be cancelled after payment. Update this only when
              the store policy changes.
            </p>
          </Card>
        </aside>
      </form>
    </>
  );
}

function StaffPage({
  data,
  update,
  notify,
}: {
  data: AdminData;
  update: (change: Partial<AdminData>) => void;
  notify: (m: string) => void;
}) {
  const staff = data.staff;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <>
      <PageHeader
        title="Staff access"
        subtitle="Manage the three people who can use this workspace."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            Add staff member
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <div className="border-b border-[var(--line)] p-4 sm:p-5">
          <h2 className="font-bold">Team members</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Everyone has the same access in this first version.
          </p>
        </div>
        <div className="divide-y divide-[#edf1ed]">
          {staff.map((s) => (
            <div
              key={s.initials}
              className="flex items-center gap-3 p-4 sm:px-5"
            >
              <span className="grid size-10 place-items-center rounded-full bg-[#e4eee6] text-xs font-bold text-[var(--teal)]">
                {s.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{s.name}</p>
                <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                  {s.email || "Email not added"}
                </p>
              </div>
              <Pill tone={s.status === "Active" ? "green" : "gold"}>
                {s.status}
              </Pill>
              <span className="hidden rounded-lg bg-[#f2f5f1] px-3 py-1.5 text-[10px] font-bold text-[#65736c] sm:block">
                Same access
              </span>
              <IconButton
                icon={Settings2}
                label={`Manage ${s.name}`}
                onClick={() =>
                  notify("Staff access settings are not available yet")
                }
              />
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--line)] bg-[#fafbf9] p-4 text-xs leading-5 text-[var(--muted)]">
          Each team member will use their own account, and everyone has the same
          access.
        </div>
      </Card>
      <Card className="mt-4 p-4 sm:p-5">
        <h2 className="font-bold">Access at a glance</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            [PackageCheck, "Orders and requests"],
            [Flower2, "Products and availability"],
            [Settings2, "Store information and settings"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof Package;
            return (
              <div
                key={String(label)}
                className="flex items-center gap-3 rounded-xl bg-[#f5f8f4] p-3"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-white text-[var(--teal)]">
                  <I size={16} />
                </span>
                <span className="text-xs font-semibold">{String(label)}</span>
              </div>
            );
          })}
        </div>
      </Card>
      {open && (
        <Modal title="Add staff member" onClose={() => setOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update({
                staff: [
                  ...staff,
                  {
                    name,
                    email,
                    status: "Invite pending",
                    initials: name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase(),
                  },
                ],
              });
              setOpen(false);
              setName("");
              setEmail("");
              notify("Staff invitation added to preview");
            }}
            className="space-y-4"
          >
            <FormField label="Name">
              <TextInput value={name} onChange={setName} required />
            </FormField>
            <FormField label="Email address">
              <TextInput
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
            </FormField>
            <p className="rounded-lg bg-[#f5f8f4] p-3 text-xs leading-5 text-[var(--muted)]">
              This saves the staff details. Access can be set up later.
            </p>
            <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add team member</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
