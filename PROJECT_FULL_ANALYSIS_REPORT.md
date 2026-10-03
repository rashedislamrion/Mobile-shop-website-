# MobileHubBD — Master System Architecture & Full Project Analysis Report

> **Target Audience**: AI Coding Agents, Full-Stack Engineers, DevOps & Project Stakeholders  
> **Status**: Verified Ground-Truth (Updated September 2026 — Fix Pass 23 / Fix Pass 33)  
> **Repository**: `Mobile-shop-website` (Unified Monorepo)  
> **Active Running Services**: Frontend (`http://localhost:3000`), Backend API (`http://localhost:4000/api/v1`), PostgreSQL (`5432`)

---

## 1. Executive Overview & System Topology

**MobileHubBD** (formerly NovaMobile) is an enterprise omnichannel retail, repair servicing, and e-commerce management platform built specifically for mobile phone retail chains, repair centers, and online operations in Bangladesh.

The platform unifies 4 major core subsystems into a single cohesive architecture:
1. **Public E-Commerce Storefront**: Customer shopping, phone comparisons, specifications, cart, COD/MFS online checkout, customer portal, warranty tracking, and support ticketing.
2. **Point of Sale (POS) Terminal**: High-speed counter sales desk with barcode scanning, variant attribute selection (Color & Quality), IMEI/Serial physical device assignment, split payment processing (Cash, bKash, Nagad, Card, Bank), and a dedicated **POS Technician Mode** for quick repair intakes.
3. **Device Repair & Servicing Center**: Complete 9-section repair intake workflow, dedicated **Technician Workspace** with interactive job cards, stock-independent parts history (`OWN_STOCK`, `SUPPLIER`, `OTHER`), and an automated **50/50 technician profit sharing engine**.
4. **Enterprise Back-Office ERP**: Multi-branch inventory tracking, supplier procurement with running due balances, double-entry wallet & expense accounting, dynamic RBAC permission matrix, HRM & unified multi-line payroll dispatch, and CMS/Marketing builders.

```
Mobile-shop-website/ (Monorepo Root)
├── src/                                  # Next.js 14 Frontend Application
│   ├── app/                              # Next.js App Router
│   │   ├── (admin)/admin/                # 26 Enterprise Admin & ERP Modules
│   │   │   ├── accounting/               # Purchases, Suppliers, Expenses, Wallets
│   │   │   ├── branch/                   # Multi-Branch Administration
│   │   │   ├── business-settings/        # General, Delivery, Currency, 3rd-Party
│   │   │   ├── category/                 # Category Taxonomy Hierarchy
│   │   │   ├── cms/                      # Pages, Menus, Footer, Social, Support
│   │   │   ├── customers/                # Customer CRM (360° View & 12 Stat Cards)
│   │   │   ├── exchanges/                # Trade-In & Device Exchanges
│   │   │   ├── hrm/                      # Employees, Departments, Roles, Payroll
│   │   │   ├── login/                    # Staff Portal Login
│   │   │   ├── marketing/                # Banners, Promo Codes, Ads, Push, Blogs
│   │   │   ├── orders/                   # Orders Management & Invoicing
│   │   │   ├── pos/                      # POS Terminal Page
│   │   │   ├── products/                 # Products, Brands, Attributes, Units
│   │   │   ├── reports/                  # Financial Summaries, POS, Courier, Dues
│   │   │   ├── sales/                    # All Sales, Courier Consignments
│   │   │   ├── sales-returns/            # Sales Returns & Refunds
│   │   │   ├── servicing/                # 9-Section Service Job Intake
│   │   │   ├── stock-adjustments/        # Stock Reconciliations
│   │   │   └── technician/               # Technician Workspace & Servicing Report
│   │   ├── (storefront)/                 # Public Storefront & Customer Dashboard
│   │   │   ├── account/                  # Customer Profile, Orders, Wishlist, Tickets
│   │   │   ├── cart/                     # Shopping Cart
│   │   │   ├── category/                 # Category Browsing
│   │   │   ├── checkout/                 # Storefront Checkout
│   │   │   ├── login/                    # Customer Login
│   │   │   ├── phones/                   # Phones Catalog Multi-Filter
│   │   │   ├── product/                  # Product Details (PDP) & Reviews
│   │   │   ├── register/                 # Customer Registration
│   │   │   └── {about,terms,privacy,...} # CMS Static Pages
│   │   ├── layout.tsx                    # Root HTML Layout & Global Context Providers
│   │   └── globals.css                   # Tailwind CSS styling & Design Tokens
│   ├── components/                       # UI Components (Admin, Storefront, Radix UI)
│   │   ├── admin/                        # Admin sidebars, forms, tables, modals
│   │   │   ├── pos/                      # PosProductModal.tsx (Refined Pass 21 & 23), PosInvoiceModal.tsx
│   │   │   ├── hrm/                      # AddSalaryPayrollModal.tsx (Fix Pass 22)
│   │   │   ├── AdminSidebar.tsx          # Collapsible responsive sidebar
│   │   │   └── AdminTopbar.tsx           # Search, branch selector, notifications
│   │   ├── storefront/                   # Storefront headers, banners, product cards
│   │   └── ui/                           # Radix UI primitives & design tokens
│   ├── context/                          # AuthContext (Dual-Token), CartContext
│   ├── hooks/                            # Custom React Hooks
│   ├── lib/                              # API Client (api-client.ts), formatters, utils
│   └── types/                            # TypeScript interfaces & types
├── api/                                  # NestJS 11 Backend Application
│   ├── prisma/                           # Prisma ORM (schema.prisma, seed.ts)
│   │   └── schema.prisma                 # 82 PostgreSQL Models & 46 Enums
│   ├── src/                              # 50 NestJS Feature Domain Modules
│   │   ├── auth/                         # JWT Authentication, RBAC & Branch Guards
│   │   ├── order/                        # Order Engine & Checkout
│   │   ├── pos/                          # POS Barcode & Fast Counter Sales
│   │   ├── service-job/                  # Repair Jobs & Parts Sourcing
│   │   ├── phone-unit/                   # IMEI / Serial Physical Device Management
│   │   ├── report/                       # Financial Analytics & Technician 50/50 Share
│   │   ├── wallet/                       # Double-Entry Wallet Ledgers & Dispatches
│   │   ├── payroll/                      # Monthly Staff Payroll Engine
│   │   └── ...                           # Other business modules
│   └── uploads/                          # Local Static Media Uploads Directory
└── scratch/                              # Automated Verification Suites
    ├── master-audit-runner.mjs           # 44-point automated pre-deployment audit
    ├── test-pass23-pos-modal-layout.mjs  # Pass 23 POS Product Modal Layout audit
    ├── test-pass21-pos-modal.mjs         # Pass 21 POS Color/Quality split audit
    ├── test-pass22-payroll-modal.mjs     # Pass 22 Unified Payroll modal audit
    ├── verify-pass33.mjs                 # Pass 33 Sourcing & POS Mode audit
    └── verify-pass32.mjs                 # Pass 32 Technician Module audit
```

---

## 2. Technology Stack & Framework Specifications

### 2.1 Frontend Stack
* **Framework**: Next.js `14.2.35` (App Router)
* **Runtime & UI**: React `18.x`, TypeScript `5.x`
* **Styling**: Tailwind CSS `3.4.1`, PostCSS `8.x`, `tailwindcss-animate`
* **UI Components**: Radix UI Primitives (Dialog, Dropdown, Tabs, Accordion, Select, Switch, Popover, Tooltip), Lucide React (`^1.31.0`), Sonner (Toast notifications)
* **Data Presentation**: TanStack React Table `8.21.3`, Recharts `3.10.1` (Interactive charts)
* **Form & Validation**: React Hook Form `7.85.0`, Zod `4.4.3`
* **HTTP Client**: Custom fetch client with automatic token injection and silent refresh queuing (`src/lib/api-client.ts`)

### 2.2 Backend Stack
* **Framework**: NestJS `11.0.1` (`@nestjs/core`, `@nestjs/platform-express`)
* **ORM & Database**: Prisma ORM `5.22.0`, PostgreSQL (Port 5432, database `novamobile`)
* **Authentication**: Passport.js, `@nestjs/passport`, `passport-jwt`, `@nestjs/jwt`, `bcrypt`
* **Security & Utility**: Helmet `8.3.0`, Compression, Cookie-Parser, `@nestjs/throttler` (Rate Limiting)
* **Validation**: `class-validator` `0.15.1`, `class-transformer` `0.5.1`
* **Storage Provider**: Local disk storage fallback (`api/uploads`), compatible with AWS S3 / Cloudflare R2

---

## 3. Complete Frontend Page Catalog & Functional Behavior

### 3.1 Public Storefront Pages (`(storefront)/`)

| Route Path | Page Title / Purpose | Key Features & Functional Flow | Associated APIs Called |
| :--- | :--- | :--- | :--- |
| `/` | **Home Storefront** | Hero banner slider, brand showcase, featured phones, new arrivals, promotional grids, customer testimonials, blog section. | `GET /banners/active`, `GET /products`, `GET /brands`, `GET /categories`, `GET /blogs` |
| `/phones` | **Phones Multi-Filter Catalog** | Filter sidebar by Brand, Price Range, RAM, Storage, Condition, Camera, OS, Network. Sort by Price (Low/High), Popularity, Newest. Grid & List views. | `GET /products?type=PHONE`, `GET /brands`, `GET /attributes` |
| `/category/[slug]` | **Category Products Listing** | Displays products belonging to specific parent or sub-category with dynamic filter criteria. | `GET /categories`, `GET /products?category=[slug]` |
| `/product/[slug]` | **Product Details (PDP)** | Image zoom gallery, attribute selector pills (Color, Storage, RAM), real-time price & stock updates, EMI calculator, technical specs, customer reviews. | `GET /products/:slug`, `GET /products/:id/reviews`, `POST /products/:id/reviews` |
| `/cart` | **Shopping Cart** | Cart items table, quantity adjustments (`+`/`-`), promo code application, delivery calculation, order subtotal summary. | `POST /promo-codes/validate`, LocalStorage synchronization |
| `/checkout` | **Storefront Checkout** | Delivery address form (Name, Phone, Division, City, Address), Courier selection, Payment Method (COD, bKash, Nagad, Card), instant order placement. | `GET /delivery-charges`, `POST /orders/checkout`, `POST /payments/bkash/create` |
| `/order/confirmation/[orderId]` | **Order Success Invoice** | Visual order confirmation receipt, generated order code (`EM...`), tracking ID, estimated delivery time. | `GET /orders/:id` |
| `/order/payment-failed` | **Payment Failed Screen** | Displays failure reason from MFS gateway, retry payment button, links to support ticket. | `GET /orders/:id` |
| `/login` | **Customer Login** | Phone/Email + Password login, remember me, redirects to `/account` or checkout. | `POST /auth/customer/login` |
| `/register` | **Customer Registration** | Account creation with full name, phone number, email, and password. | `POST /auth/customer/register` |
| `/account` | **Customer Dashboard** | Overview of customer orders, account status, reward points, active support tickets. | `GET /auth/me`, `GET /orders/my` |
| `/account/orders` | **Customer Orders History** | List of all past orders, tracking timeline, invoice download button, re-order button. | `GET /orders/my` |
| `/account/address` | **Address Book** | Manage multiple delivery addresses (Home, Office), default address toggle. | `GET /customers/addresses`, `POST /customers/addresses` |
| `/account/wishlist` | **Saved Wishlist** | Items saved by customer, move-to-cart button. | `GET /wishlist`, `DELETE /wishlist/:id` |
| `/account/support` | **Customer Support Tickets** | Submit support ticket with issue category, view chat/message replies from staff. | `GET /support-tickets/my`, `POST /support-tickets` |
| `/account/change-password` | **Change Password** | Current password verification and new password confirmation. | `POST /auth/change-password` |
| `/about`, `/contact`, `/privacy`, `/terms` | **CMS Static Pages** | Dynamically rendered CMS articles managed from Admin CMS page editor. | `GET /pages/slug/:slug`, `POST /contact-submissions` |
| `/blog`, `/blog/[slug]` | **Blogs & Tech News** | Articles, category tags, author cards, comments. | `GET /blogs`, `GET /blogs/:slug` |

---

### 3.2 Enterprise Admin & Back-Office Pages (`(admin)/admin/`)

| Route Path | Module Name | Functional Behavior & User Actions | Key APIs & Methods |
| :--- | :--- | :--- | :--- |
| `/admin/login` | **Staff Portal Login** | Staff credential authentication. Issues `novamobile_staff_token`. Populates `Role`, `Permissions`, and assigned `Branch`. | `POST /auth/staff/login` |
| `/admin` | **Executive Dashboard** | 12 live KPI cards (Total Sales, Total Profit, Phone/Display/Gadget/Service Sales, Cash in Hand, Supplier Due, Customer Due). Recharts graphs for sales trends, recent orders table. | `GET /reports/dashboard?branch=...&period=...` |
| `/admin/pos` | **POS Terminal** | Cashier checkout desk. Barcode/IMEI scanning, Color/Quality variant modal (`PosProductModal.tsx`), multi-payment split (Cash, bKash, Nagad, Card, Bank), discount, customer due ledger entry, thermal invoice modal (`PosInvoiceModal.tsx`), **POS Technician Mode** toggle. | `GET /pos/products`, `POST /pos/sales`, `POST /pos/service-jobs`, `GET /phone-units/check-imei` |
| `/admin/servicing` | **Service Jobs List** | Master repair job tracker with branch filtering, status badges, technician assignment column, labor charge, and invoice generator. | `GET /service-jobs?status=...&branch=...`, `PATCH /service-jobs/:id/status` |
| `/admin/servicing/create` | **9-Section Repair Intake** | Full repair intake: 1) Customer Info, 2) Device Type, 3) Brand & Model, 4) Serial/IMEI, 5) Physical Condition Checklist, 6) Problem Tags, 7) Security Pattern/PIN, 8) Accessories, 9) Estimated Labor & Advance. | `GET /service-lookups/*`, `POST /service-jobs/repair` |
| `/admin/technician` | **Technician Workspace** | Technician-isolated dashboard. Interactive Job Cards, status progression (PENDING $\to$ IN_PROGRESS $\to$ WAITING_FOR_PARTS $\to$ READY $\to$ DELIVERED), material consumption modal with source selector (`OWN_STOCK`, `SUPPLIER`, `OTHER`). | `GET /service-jobs/my`, `PATCH /service-jobs/:id`, `PATCH /service-jobs/:id/status` |
| `/admin/technician/servicing-report` | **Servicing Financial Report** | Personal technician report. Calculates Material Cost, Total Bill, Gross Profit, and **"Your Profit" (strictly 50% labor share)**. Shows sourcing breakdown table. | `GET /reports/servicing-technician` |
| `/admin/products` | **Product Catalog** | Product inventory table with image preview, brand, category, retail price, stock level, status toggles (`isActive`, `isFeatured`), and action menus. | `GET /products/admin`, `PATCH /products/:id/toggle`, `DELETE /products/:id` |
| `/admin/products/create` & `/[id]/edit` | **Product Builder** | Comprehensive product form: Title, slug, SKU, brand, category, unit, warranty terms, variant builder (Color, RAM, Storage, Quality), buying & selling prices, image uploader, specifications. | `POST /products`, `PATCH /products/:id`, `POST /upload` |
| `/admin/products/attributes` & `[id]/values` | **Catalog Attributes** | Manage global attribute taxonomy (Color, Storage, RAM, Quality) and assign individual values with hex codes. | `GET /attributes`, `POST /attributes`, `POST /attributes/:id/values` |
| `/admin/products/brands` & `series` | **Brands & Series** | Brand logo uploads, brand hierarchy, smartphone model series (e.g., iPhone 15 Series, Galaxy S Series). | `GET/POST /brands`, `GET/POST /series` |
| `/admin/products/wanted` & `wasted` | **Wanted & Wasted Products** | Log customer-requested out-of-stock items; record damaged/wasted items with cost write-offs. | `GET/POST /wanted-products`, `GET/POST /wasted-products` |
| `/admin/stock-adjustments` & `/create` | **Stock Audit Reconciliations** | Physical inventory audit recording: Branch, product variant, previous system quantity, physical counted quantity, difference, and audit reason note. | `GET /stock-adjustments`, `POST /stock-adjustments/batch` |
| `/admin/orders` & `/[id]` | **Orders & Dispatch** | Order management: status filtering, shipping status updater, internal staff notes, customer details, split payment audit logs, and invoice printing. | `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status`, `POST /orders/:id/notes` |
| `/admin/sales/all` & `/sales/courier` | **Sales & Consignments** | All sales channels overview; courier shipment booking (Steadfast, Pathao) with consignment tracking code generation. | `GET /orders?saleType=...`, `POST /shipments` |
| `/admin/sales-returns` & `/[id]` | **Sales Returns & Refunds** | Product return requests, condition inspection, approval/rejection, stock restock, and customer wallet/cash refund. | `GET /sales-returns`, `PATCH /sales-returns/:id/approve`, `PATCH /sales-returns/:id/refund` |
| `/admin/exchanges` & `/[id]` | **Device Exchanges** | Trade-in valuation calculator: evaluates pre-owned phone, deducts trade-in value from new device purchase, computes payable balance. | `GET /exchanges`, `POST /exchanges`, `PATCH /exchanges/:id/complete` |
| `/admin/accounting/purchase` & `/create` | **Supplier Purchase Orders** | Vendor procurement: PO creation, variant line items, buying price input, received status toggle, and stock increment upon receipt. | `GET /purchase-orders`, `POST /purchase-orders`, `PATCH /purchase-orders/:id/receive` |
| `/admin/accounting/suppliers` & `payments` | **Suppliers & Dues** | Supplier database, running credit/due balances, payment disbursement logging, advance payments. | `GET /suppliers`, `POST /suppliers`, `POST /supplier-payments` |
| `/admin/accounting/expense/all` & `categories` | **Operational Expenses** | Expense ledger: categorizes utility bills, rent, refreshments, and branch expenses; deducts directly from chosen wallet. | `GET /expenses`, `POST /expenses`, `GET /expense-categories` |
| `/admin/accounting/wallet` & sub-pages | **Wallets & Cashflow** | Double-entry wallet system: Cash Drawers, bKash Merchant, Nagad Merchant, Bank Accounts. Inter-wallet balance transfers and deposit logs. | `GET /wallet-types/summary`, `POST /wallet-transactions/transfer` |
| `/admin/hrm/employees` & `create` | **Employee HRM** | Staff directory: profile details, branch assignment, base salary, commission percentage, role assignment, active/inactive toggle. | `GET /employees`, `POST /employees`, `PATCH /employees/:id` |
| `/admin/hrm/roles-permissions` | **Dynamic RBAC Matrix** | Custom role builder: assign granular permissions (`CREATE`, `READ`, `UPDATE`, `DELETE`) across all 26 modules; set role scope (`GLOBAL`, `OWN_BRANCH`, `OWN_DATA`). | `GET /roles`, `POST /roles`, `PATCH /roles/:id/permissions` |
| `/admin/hrm/payroll` & `/run` | **Staff Payroll Engine** | Monthly payroll execution. Unified **Add Salary / Payroll Modal** (`AddSalaryPayrollModal.tsx`) with Salary, Bonus, Allowance, Deductions, and multi-line wallet ledger dispatch. | `GET /payroll`, `POST /payroll/run`, `POST /wallet-transactions/staff-payment` |
| `/admin/branch` & `/create` | **Branch Administration** | Multi-branch setup: Flagship stores, outlets, warehouses, contact info, branch managers. | `GET /branches`, `POST /branches`, `PATCH /branches/:id` |
| `/admin/customers` & `/[id]` | **Customer CRM (360° View)** | Customer profile with 12 stat cards: total lifetime spend, orders count, total dues, return rate, support tickets, and address list. | `GET /customers`, `GET /customers/:id/summary`, `POST /reports/customer-due/payment` |
| `/admin/marketing/*` | **Marketing Management** | Sliders (`/banners`), Ad placements (`/ads`), Discount promo codes (`/promo-code`), Web Push Notifications (`/push-notification`), Blog articles (`/blogs`). | `GET/POST /banners`, `GET/POST /ads`, `GET/POST /promo-codes`, `GET/POST /push-notifications` |
| `/admin/cms/*` | **CMS & Navigation Builders** | Static page editor (`/cms/pages`), Drag-and-drop menu tree builder (`/cms/menus`), Dynamic multi-column footer builder (`/cms/footer`), Social links, Contact messages. | `GET/POST /pages`, `GET/PATCH /menus/builder`, `GET/PATCH /footer/builder` |
| `/admin/business-settings/*` | **System & 3rd-Party Settings** | General shop settings (Logo, Address, VAT, Currency), Courier delivery charge tiers (Inside/Outside Dhaka), Payment Gateways (bKash, Nagad, SSLCommerz), SMS Gateways (Greenweb, SSL Wireless). | `GET/PATCH /business-settings`, `GET/POST /delivery-charge-tiers`, `GET/PATCH /third-party-configs` |
| `/admin/reports/*` | **Enterprise Analytics Suite** | 12 dedicated reports: Summary, POS Sales, Website Sales, Service Sales, Courier Performance, Customer Due, Supplier Due, Expenses, Purchases, Discounts, Stock Analytics. | `GET /reports/*` |

---

## 4. Backend API Endpoints & Request/Response Contracts

The backend exposes **184 RESTful API routes** prefixed with `/api/v1`.

### 4.1 Authentication & Security (`/auth`)

| Method | Endpoint | Access Level | Description & Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/staff/login` | Public | Staff login. Body: `{ email, password }`. Returns: `{ accessToken, user: { id, name, role, permissions, branch } }`. Sets HTTP-only refresh cookie. |
| `POST` | `/auth/staff/refresh` | Public (Cookie) | Rotates staff refresh token and returns fresh `accessToken`. |
| `POST` | `/auth/staff/logout` | Staff | Invalidates refresh token in DB and clears cookie. |
| `POST` | `/auth/customer/login` | Public | Customer login. Body: `{ emailOrPhone, password }`. Returns `{ accessToken, user }`. |
| `POST` | `/auth/customer/register` | Public | Customer registration. Body: `{ name, phone, email, password }`. |
| `POST` | `/auth/customer/refresh` | Public (Cookie) | Rotates customer refresh token. |
| `GET` | `/auth/me` | Authenticated | Decodes JWT and returns current authenticated user profile and permissions. |
| `POST` | `/auth/change-password` | Authenticated | Updates password. Body: `{ oldPassword, newPassword }`. |

### 4.2 Orders & Checkout (`/orders`)

| Method | Endpoint | Access Level | Description & Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/orders` | Staff (`ORDERS:READ`) | List orders with pagination, status, branch, and date filters. Honors branch scoping. |
| `GET` | `/orders/:id` | Authenticated | Detailed order view with items, status history, notes, customer details, and shipment info. |
| `POST` | `/orders/checkout` | Customer / Public | Storefront checkout. Atomically verifies stock, creates order, reserves inventory, creates payment attempt. |
| `POST` | `/orders` | Staff (`ORDERS:CREATE`) | Back-office order creation. |
| `PATCH` | `/orders/:id/status` | Staff (`ORDERS:UPDATE`) | State machine transition (e.g. `PENDING` $\to$ `CONFIRMED` $\to$ `DELIVERED`). Writes to `OrderStatusHistory`. |
| `POST` | `/orders/:id/notes` | Staff (`ORDERS:UPDATE`) | Appends internal staff notes to `OrderNote`. |

### 4.3 Point of Sale (`/pos`)

| Method | Endpoint | Access Level | Description & Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/pos/products` | Staff (`POS:READ`) | Fast product search with branch stock counts, barcode lookup, and variant details. |
| `POST` | `/pos/sales` | Staff (`POS:CREATE`) | Counter sales checkout. Handles split payments (Cash + bKash + Card), customer dues, marks `PhoneUnit` as `SOLD`, updates `WalletTransaction`, and prints receipt. |
| `POST` | `/pos/service-jobs` | Staff (`POS:CREATE`) | POS Technician Mode quick intake. Creates `DELIVERED` `ServiceJob` with 50/50 technician profit share. |

### 4.4 Repair Servicing Center (`/service-jobs`)

| Method | Endpoint | Access Level | Description & Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/service-jobs` | Staff (`SALES:READ`) | Filterable list of repair jobs across branches. |
| `GET` | `/service-jobs/my` | Technician | Isolated list showing **only** the authenticated technician's assigned jobs. |
| `GET` | `/service-jobs/next-invoice-number` | Staff | Returns sequential invoice number (e.g. `SJ-10024`). |
| `POST` | `/service-jobs/repair` | Staff (`SALES:CREATE`) | Full 9-section repair job creation with checklist, PIN, and advance payment. |
| `GET` | `/service-jobs/:id` | Staff / Technician | Single job details. Returns **403 Forbidden** if a technician attempts to access another technician's job. |
| `PATCH` | `/service-jobs/:id/status` | Staff / Technician | Update repair lifecycle: `PENDING` $\to$ `IN_PROGRESS` $\to$ `READY` $\to$ `DELIVERED`. |
| `PATCH` | `/service-jobs/:id` | Staff / Technician | Updates labor charge, materials list (`OWN_STOCK`, `SUPPLIER`, `OTHER`), and sourcing notes. |

### 4.5 Financial Reports & Analytics (`/reports`)

| Method | Endpoint | Access Level | Description & Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports/dashboard` | Staff (`REPORTS:READ`) | Executive dashboard KPI aggregations (Sales, Profit, Dues, Cashflow, Stock alerts). |
| `GET` | `/reports/servicing-technician` | Technician / Admin | Personal technician servicing report. Computes Labor Profit and **strictly 50% technician profit share**. |
| `GET` | `/reports/customer-due` | Staff (`REPORTS:READ`) | Customer dues ledger with unpaid order breakdowns and payment modal support. |
| `GET` | `/reports/supplier-due` | Staff (`REPORTS:READ`) | Supplier procurement due balances (POs received minus supplier payments). |
| `GET` | `/reports/pos-sales` | Staff (`REPORTS:READ`) | Analytics on counter POS sales, cashier performance, and payment breakdown. |
| `GET` | `/reports/website-sales` | Staff (`REPORTS:READ`) | E-commerce sales metrics, conversion rates, and courier dispatch logs. |

### 4.6 Wallets & HRM Payroll (`/wallet-types`, `/wallet-transactions`, `/payroll`)

| Method | Endpoint | Access Level | Description & Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/wallet-types/summary` | Staff (`ACCOUNTING:READ`) | Current balances of all wallets (Cash counters, bKash, Nagad, Bank accounts). |
| `POST` | `/wallet-transactions/transfer` | Staff (`ACCOUNTING:CREATE`)| Inter-wallet money transfer with double-entry balance adjustment. |
| `POST` | `/wallet-transactions/staff-payment` | Staff (`HRM:CREATE`) | Unified payroll dispatch. Creates typed `WalletTransaction` entries (`SALARY`, `BONUS`, `ALLOWANCE`) and updates `Payroll`. |
| `GET` | `/payroll` | Staff (`HRM:READ`) | Monthly staff payroll history and payslips. |
| `POST` | `/payroll/run` | Staff (`HRM:CREATE`) | Batch salary computation for all employees in a branch or department. |

---

## 5. Logging, Auditing & Traceability Mechanisms

MobileHubBD incorporates comprehensive audit logging across application runtime, database events, and financial ledgers:

```mermaid
flowchart TD
    ClientReq[Client Request / User Action] --> Guard[JwtAuthGuard & PermissionsGuard]
    Guard --> Controller[NestJS Feature Controller]
    Controller --> Logger[NestJS Logger Service]
    Logger --> Service[Feature Service Layer]
    Service --> Tx[Prisma $transaction Isolation]
    Tx --> AuditDB[(Audit & History Tables)]
    
    subgraph AuditDB
        OSH[OrderStatusHistory]
        ON[OrderNote]
        CA[CustomerActivity]
        WT[WalletTransaction Ledger]
        SA[StockAdjustment Log]
        PA[PaymentAttempt Log]
        RFT[RefreshToken Store]
    end
```

### 5.1 Application-Level Logging
* **NestJS Logger**: Feature services (`OrderService`, `StorageService`, etc.) instantiate `new Logger(ServiceName.name)` to log critical operations (order placement, Cloudflare R2 / local uploads, gateway callbacks).
* **Console Traceability**: Frontend `api-client.ts` logs client initialization and token refresh events in browser devtools:
  ```ts
  console.log(`[MobileHubBD Client Init] API Base URL: ${API_BASE_URL}`);
  ```

### 5.2 Database-Level Audit Models & History Tracking

1. **`OrderStatusHistory` Model**:
   * Logs every status change for an order (`PENDING` $\to$ `CONFIRMED` $\to$ `DELIVERED`).
   * Captures: `orderId`, `status`, `notes`, `changedById` (staff member who performed the action), and `createdAt`.

2. **`OrderNote` Model**:
   * Stores internal administrative notes and customer communications.
   * Captures: `orderId`, `staffId`, `note`, `isCustomerVisible`, and `createdAt`.

3. **`CustomerActivity` Model**:
   * Real-time CRM event tracking.
   * Captures: `customerId`, `activityType` (`LOGIN`, `VIEW_PRODUCT`, `PLACE_ORDER`, `TICKET_OPEN`), `description`, and `ipAddress`.

4. **`WalletTransaction` (Double-Entry Financial Ledger)**:
   * Every monetary change in the system (Order payment, POS sale, Supplier disbursement, Expense, Payroll, Inter-wallet transfer) writes an immutable `WalletTransaction`.
   * Captures: `walletTypeId`, `type` (`INCOME`, `EXPENSE`, `TRANSFER_IN`, `TRANSFER_OUT`), `amount`, `balanceBefore`, `balanceAfter`, `sourceType` (`ORDER`, `PURCHASE`, `EXPENSE`, `SALARY`, `BONUS`), `referenceId`, `staffId`, and `note`.

5. **`StockAdjustment` Model**:
   * Physical inventory audit trail.
   * Captures: `branchId`, `variantId`, `previousQty`, `newQty`, `differenceQty`, `reason` (`PHYSICAL_COUNT`, `DAMAGED`, `THEFT`, `CORRECTION`), `staffId`, and `createdAt`.

6. **`PaymentAttempt` Model**:
   * Full traceability for MFS gateway callbacks (bKash & SSLCommerz).
   * Captures: `orderId`, `gateway`, `paymentId`, `trxID`, `amount`, `status` (`INITIATED`, `SUCCESS`, `FAILED`, `CANCELLED`), and raw JSON response payload.

7. **`RefreshToken` & `PasswordResetToken`**:
   * Tracks session tokens, client device user-agent, IP address, expiration timestamps, and revocation flags for strict security auditing.

---

## 6. Core Business Logic & Non-Negotiable Directives

### 6.1 Dashboard Financial Formulas
* **Total Sales Formula**:
  $$\text{Total Sales} = \text{Phone Sales} + \text{Display Sales} + \text{Gadget Sales} + \text{Service Sales}$$
* **Profit Sanity Check**:
  $$\text{Profit} \le \text{Total Sales}$$
  Profit is computed using verified buying costs (`buyingPrice` on variants or `cost` on service materials). Under no circumstance may profit exceed revenue.
* **Supplier Due Running Balance**:
  $$\text{Supplier Due} = \sum (\text{Received Purchase Orders}) - \sum (\text{Completed Supplier Payments}) \ge 0$$

### 6.2 Repair Servicing & 50/50 Profit Split
* **Technician Profit Formula**:
  $$\text{Labor Profit} = \text{Total Service Bill} - \text{Material Cost}$$
  $$\text{Technician Profit Share} = 0.50 \times \text{Labor Profit}$$
  Guaranteed with zero deviation in `ReportService` and `ServiceJobService`.
* **Stock-Independent Materials Sourcing**:
  * Technicians can record any spare part without triggering branch inventory decrement or stock availability errors.
  * Every part specifies a `sourceType`:
    * `OWN_STOCK`: Shop's existing spare parts (informational tag; no inventory decrement).
    * `SUPPLIER`: Linked to a registered supplier.
    * `OTHER`: Requires free-text sourcing note (e.g. *"Purchased urgently from local marketplace"*).
* **Technician Data Privacy**:
  * Technicians can **only** view their own assigned jobs. Accessing another technician's job returns a strict **HTTP 403 Forbidden**.

### 6.3 POS Terminal Mechanics
* **Product Variant Modal (`PosProductModal.tsx`)**:
  * Independent **COLOR** and **QUALITY** pill selectors.
  * Out-of-stock combinations stay visible with `(0 in stock)` and are disabled.
  * Preserves unit IMEI assignment and warranty selection.
* **POS Technician Mode**:
  * Quick repair intake directly from the POS screen automatically creates a `DELIVERED` `ServiceJob` assigned to the designated technician, feeding into their 50/50 profit share report.

### 6.4 IMEI & Physical Device Tracking
* Mobile phones are tracked at the individual unit level in `PhoneUnit` with unique `IMEI` or `Serial Number`.
* Status lifecycle: `ACTIVE` $\to$ `SOLD` $\to$ `REPAIRED` / `DEFECTIVE`.
* **Privacy Rule**: Raw IMEI numbers are strictly scrubbed in public storefront APIs.

---

## 7. Key Recent Implementation Changelog (Fix Passes 20–33)

### Fix Pass 20 — Physical Phone Unit (IMEI) Integration
- Automated physical phone unit selection (`PhoneUnit`) for items with `productCategory = PHONE`.
- Multi-IMEI support (`imei1`, `imei2`), physical condition tags (`NEW`, `LIKE_NEW`, `REFURBISHED`), serial number tracking.
- Outbound customer warranty selector (`7 Days Replacement`, `1 Month`, `6 Months`, `1 Year`, `No Warranty`) with automated start and end date calculation.

### Fix Pass 21 — POS "Add to Cart" Product Modal Rebuild (`PosProductModal.tsx`)
- Rebuilt variant picker to eliminate lumped strings ("White (Original OEM)").
- Divided attributes into independent **COLOR** and **QUALITY** pill rows.
- Selected pills receive emerald ring styling (`ring-2 ring-emerald-500/20`, `border-emerald-600`, `bg-emerald-50`).
- Zero-stock combinations stay visible but disabled with `(0 in stock)` indicator.
- Single-attribute products automatically omit the unused section.

### Fix Pass 22 — HRM Unified "Add Salary / Payroll" Modal (`AddSalaryPayrollModal.tsx`)
- Unified staff compensation dispatches into an atomic modal.
- Row 1: Employee dropdown + Salary Month picker (`YYYY-MM`).
- Row 2: Source Wallet dropdown (with real-time live balance) + Base Salary (auto-filled from employee profile).
- Row 3: Bonus Amount + Allowance Amount (with frequency selector and auto-fill badge).
- Row 4: Deduction Amount (reduces employee net payout without reducing wallet draw) + Notes.
- Real-time computation banner: Gross Wallet Draw vs Deductions vs Net Payout.
- Extended backend `WalletService` and `Payroll` to atomically dispatch typed `WalletTransaction` records (`SALARY`, `BONUS`, `ALLOWANCE`).

### Fix Pass 23 — POS Product Modal Layout Refinement (`PosProductModal.tsx`)
- **Top Label**: Added small uppercase, muted `"Product Details"` label above the product title.
- **Header Simplification**: Removed the redundant top banner (`SELECTED SKU` badge and `STOCK` status badge) from `DialogHeader`.
- **Inline Stock Placement**:
  - Moved the live stock indicator directly into the **COLOR** section header (top-right).
  - Displays dynamic status: `X in stock` with pulsing emerald dot when available, or `Out of stock` with rose dot.
  - Graceful fallback: If no colors exist, renders in the QUALITY section header; if neither exists, renders beside the SKU bar.
- **Repositioned SKU Code**:
  - Demoted the SKU code from the top header to a clean, muted, mono-spaced line positioned directly above the bottom action row.
- **Unified Single Bottom Action Row**:
  - Merged Quantity Stepper, Override Price, and Add to Cart into **ONE single horizontal row** (`[ - 1 + ] [ Price (৳) ] [ Add to Cart ]`).
  - Added an adaptive responsive wrap (`sm:` / 640px): on mobile screens ($< 640\text{px}$), Quantity and Override Price sit side-by-side on Row 1, and Add to Cart spans full-width on Row 2 to prevent squishing.
- **Line Total Placement**:
  - Positioned the detailed Line Total calculation breakdown (`Line Total: ৳... (৳Unit × Qty)`) neatly on the SKU bar, and embedded the total amount inside the Add to Cart button label.
- **Automated Verification**: Created `scratch/test-pass23-pos-modal-layout.mjs` verifying all 8 layout and responsive constraints.

### Fix Pass 24 — (A) Sitewide Rebrand Text Change & (B) Material History Dedicated "Sourced From Outside" Box
- **Part A (Sitewide Rebrand)**:
  - Replaced all occurrences of `"MobileHubBD ERP"` across `src/` with `"Mobile Hub BD"` (exact 3-word title).
  - Updated staff-facing `AdminSidebar.tsx` header branding and third-party configuration mocks.
  - Storefront branding and database/API identifiers remain completely untouched.
- **Part B (Material History Sourced From Outside Box)**:
  - Added additive/nullable column `sourcedFromName String?` to `ServiceJobMaterial` model in Prisma schema (`api/prisma/schema.prisma`) and synchronized with PostgreSQL via `prisma db push`.
  - Updated `ServiceJobMaterialDto` in `api/src/service-job/dto/create-service-job.dto.ts`.
  - Updated backend `service-job.service.ts` to persist `sourcedFromName` and enforce conditional validation: `OTHER` source type requires `sourcedFromName` or `sourceNote`.
  - Sourced materials continue to strictly maintain stock-independence (no branch inventory decrement).
  - In 9-Section Repair Intake (`/admin/servicing/create`, Section 5): Selecting `OTHER` dynamically reveals a dedicated, visually-separated bordered amber card beneath the row with required **Sourced From (Vendor/Person Name)** input and optional **Note / Description** textarea, while reusing the same Part Name, Cost, and Quantity inputs.
  - In Technician Workspace (`/admin/technician`): Implemented dedicated **Material Consumption Modal** allowing technicians to record hardware materials consumed on assigned jobs with the identical "Sourced From Outside" sub-panel, while updating `PATCH /service-jobs/:id` and recalculating live material costs and 50% profit shares.
  - In Technician Servicing Report (`/admin/technician/servicing-report`): Updated the sourcing breakdown table to display `Outside: [Vendor] ([Notes])`.
  - **Automated Verification**: Created `scratch/test-pass24-rebrand-and-material-sourcing.mjs` verifying all 10 checks (branding, schema, CRUD, validation rejection, reporting, UI).

### Fix Pass 25 — RETRY: Material History "Sourced From Outside" Box & Dropdown Options Refinement
- **Root Cause of Previous Client Impression**:
  - The dropdown option labels previously used `"Registered Supplier"` and `"Sourced Elsewhere / Outside"` instead of the exact requested strings `"From Supplier"` and `"Sourced From Outside"`.
  - The inline row grid had an extra indicator badge that made the row layout busy, and the sub-panel used negative margins (`-mx-3 -mb-3`) rather than a stand-alone distinct bordered box (`border border-amber-300 bg-amber-50 rounded-lg p-4 mt-2`).
- **Exact UI Implementations Completed**:
  - **Exact Dropdown Options**:
    - `"From Own Stock"` (value: `OWN_STOCK`)
    - `"From Supplier"` (value: `SUPPLIER`)
    - `"Sourced From Outside"` (value: `OTHER`)
  - **Dedicated Outside Sourcing Box**: Rendered reactively directly below the row whenever `row.sourceType === 'OTHER'`:
    - Distinct container styling: `border border-amber-300 bg-amber-50 rounded-lg p-4 mt-2 space-y-3`
    - `"Sourced From (Vendor/Person Name) *"` input (`placeholder="e.g. Anwar Hardware, Elephant Road"`), strictly marked as required.
    - `"Note / Description (Optional)"` textarea (`placeholder="e.g. Bought urgently, no warranty, cash payment"`).
    - Part Name, Unit Cost, and Qty remain on the main row and are NOT duplicated.
    - Switching back to `"From Own Stock"` or `"From Supplier"` cleanly resets `sourcedFromName` and `sourceNote`.
  - **Applied Symmetrically in Both Locations**:
    - Repair Intake: `src/app/(admin)/admin/servicing/create/page.tsx`
    - Technician Workspace Material Modal: `src/app/(admin)/admin/technician/page.tsx`
    - Admin Servicing Details Dialog: `src/app/(admin)/admin/servicing/page.tsx` now also presents the parts breakdown with outside vendor names.
  - **Automated Verification**: Created `scratch/test-pass25-material-sourcing-retry.mjs` verifying UI strings, API creation, database retrieval, and technician report surfacing.

### Fix Pass 32 & 33 — Servicing Report, Job Detail Modal & Sourcing
- Dedicated Technician Servicing Report at `src/app/(admin)/admin/technician/servicing-report/page.tsx`.
- Summary cards: Material Cost, Total Bill, and **"Your Profit" (50% labor share)**.
- Material sourcing history with `sourceType` (`OWN_STOCK`, `SUPPLIER`, `OTHER`) and notes.
- Repaired materials remain strictly **stock-independent** (no branch inventory decrement).
- POS Technician Mode quick repair intake automatically creates `DELIVERED` service jobs with 50/50 profit sharing.

---

## 8. Authentication, Token Management & Demo Credentials

### 8.1 Dual-Token Architecture
The system isolates staff and customer credentials:
* **Customer Token**: `novamobile_customer_token`
* **Staff Token**: `novamobile_staff_token`
* Token lifetimes:
  * Access Token: `15 minutes` (JWT)
  * Refresh Token: `7 days` (stored in database with rotation on refresh)
* Silent refresh is handled automatically via `src/lib/api-client.ts`.

### 8.2 Verified Demo Credentials
All staff and demo accounts share the uniform development password: **`Admin@12345`**

| Role | Demo Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Global Admin** | `demo.admin@mobilehubbd.test` | `Admin@12345` | Unrestricted full access to all 26 admin modules, settings, and branches. |
| **Branch Admin (Dhaka)** | `demo.branchadmin@mobilehubbd.test` | `Admin@12345` | Scoped to Dhaka Main branch. Manages local stock, sales, and staff. |
| **Technician** | `demo.technician@mobilehubbd.test` | `Admin@12345` | Scoped to Technician Workspace and personal Servicing Report. |
| **Salesperson** | `sales@mobilehubbd.test` | `Admin@12345` | Scoped to POS Terminal and counter sales checkout. |
| **Inventory Auditor** | `demo.auditor@mobilehubbd.test` | `Admin@12345` | Scoped to stock adjustments and physical inventory audits. |
| **Demo Customer** | Registered via `/register` | Custom | Customer portal, orders, wishlist, support tickets. |

---

## 9. Developer & AI Agent Execution Cheatsheet

### 9.1 Starting Local Servers

```bash
# 1. Start PostgreSQL (Port 5432)
# Ensure PostgreSQL is running locally with database `novamobile`

# 2. Start Backend API (Port 4000)
cd api
npm run start:dev
# Health check: curl http://localhost:4000/api/v1/health

# 3. Start Frontend Next.js (Port 3000)
# In monorepo root:
npm run dev
# Web link: http://localhost:3000
```

### 9.2 Complete Automated Verification Test Suite

Run these verification scripts from the repository root to verify zero regressions:

```bash
# 1. Master 44-point pre-deployment audit (must pass 44/44)
node scratch/master-audit-runner.mjs

# 2. Pass 25 Material Sourcing Retry verification
node scratch/test-pass25-material-sourcing-retry.mjs

# 3. Pass 24 Rebrand & Sourced From Outside verification (10/10 checks)
node scratch/test-pass24-rebrand-and-material-sourcing.mjs

# 3. Pass 23 POS Product Modal Layout verification (8/8 checks)
node scratch/test-pass23-pos-modal-layout.mjs

# 4. Pass 21 POS Color/Quality split verification
node scratch/test-pass21-pos-modal.mjs

# 4. Pass 22 Unified Payroll Modal verification
node scratch/test-pass22-payroll-modal.mjs

# 5. Pass 33 Sourcing & POS Technician Mode verification
node scratch/verify-pass33.mjs

# 6. Pass 32 Technician Module & 50/50 Profit Share verification
node scratch/verify-pass32.mjs

# 7. Production builds
npm run build         # in root (must compile 120/120 pages)
cd api && npm run build # in api/ (must compile NestJS with 0 errors)
```

### 9.3 Environment Variables Reference

#### Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

#### Backend API (`api/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/novamobile?schema=public"
JWT_ACCESS_SECRET="access-secret"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_SECRET="refresh-secret"
JWT_REFRESH_EXPIRY="7d"
PORT="4000"
CORS_ORIGIN="http://localhost:3000"
```
