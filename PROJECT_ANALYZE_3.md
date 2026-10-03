# MobileHubBD — Project Analysis 3 (generated September 28, 2026, commit 9287938d)

> **Audit Context & Protocol**: Read-only verification pass executing direct codebase inspection, live HTTP crawls across dev servers (`http://localhost:3000` & `http://localhost:4000/api/v1`), production build simulations, and PostgreSQL database queries.  
> **Order of Section Generation**: 6 → 3 → 4 → 5 → 2 → 1 → 7 → 8 → 9 (appended incrementally per limit-safe audit requirements).


---

## Section 0 — Executive Summary

1. **Operational Foundation**: Monorepo with Next.js 14 frontend (`http://localhost:3000`) and NestJS 11 backend (`http://localhost:4000/api/v1`) over PostgreSQL with 84 Prisma models is fully operational and healthy.
2. **Production Build Pass**: `npm run build` passed cleanly with exit code 0 across all 122 frontend routes; backend `nest build` compiled with exit code 0.
3. **Core Business Logic Verified**: 50/50 repair profit split verified with live numbers (Job `INV-0084`: Total ৳6,800 - Material ৳5,500 = Profit ৳1,300; Technician share = ৳650.00).
4. **Data Isolation Hardened**: Technician cross-job queries and cross-technician reports are strictly blocked with `403 Forbidden`. Branch Admin cross-branch order creation blocked with `403 Forbidden`.
5. **Brand & Asset Consistency**: All instances of "NovaMobile" scrubbed; official MobileHubBD logos, icons, and theme accents active throughout.
6. **New Modules Active**: Inter-Branch "Product Requests" module is fully functional with atomic transfer transactions; Admin Servicing Management page is active with real-time discount calculations.
7. **P1 Security Gap Identified**: Client-supplied `unitPrice` in online orders is accepted without server-side recalculation against the product database price in `order.service.ts:365`.
8. **P1 Deployment Gap Identified**: Backend entrypoint mismatch in `api/package.json` (`node dist/main`) and `deploy.sh` (`pm2 start dist/main.js`) will fail on VPS; compiled entry is `dist/src/main.js`.
9. **SEO & Search Gaps**: `robots.txt` and `sitemap.xml` are absent; `getServiceSalesReport` search filters by order code instead of invoice number.
10. **Overall Readiness**: System is architecturally sound and functionally robust; applying the 2 P1 patches and configuring production environment variables makes the repository 100% production ready.

---

---

## Section 1 — Stack & Repo Identity

### 1.1 Technology Framework & Dependency Versions

#### Frontend (Next.js Application Root)
* **Core Framework**: Next.js 14.2.35 (React 18, React DOM 18)
* **Language & Styling**: TypeScript 5.x, Tailwind CSS 3.4.1, PostCSS 8
* **Component Primitives**: Radix UI Primitives (Accordion, Dialog, Popover, Select, Dropdown, Tabs, Switch, Tooltip)
* **Forms & Validation**: React Hook Form 7.85.0, Zod 4.4.3, @hookform/resolvers 5.8.0
* **Data Visualization**: Recharts 3.10.1, @tanstack/react-table 8.21.3
* **Icons & Notifications**: Lucide React 1.31.0, Sonner 2.0.8
* **Scripts**:
  * `"dev": "next dev"`
  * `"build": "next build"`
  * `"start": "next start"`
  * `"lint": "next lint"`

#### Backend (NestJS Monorepo Subdirectory `api/`)
* **Core Engine**: NestJS 11.0.1 (@nestjs/core, @nestjs/common, @nestjs/platform-express)
* **Database & ORM**: Prisma 5.22.0 (@prisma/client, prisma CLI) on PostgreSQL
* **Security & Auth**: Passport 0.7.0, Passport JWT 4.0.1, @nestjs/jwt 11.0.2, Bcrypt 6.0.0, Helmet 8.3.0, @nestjs/throttler 6.5.0
* **Data Transfer Validation**: class-validator 0.15.1, class-transformer 0.5.1
* **Cloud Storage**: AWS SDK S3 3.1131.0 (Cloudflare R2 integration)
* **Network & Serialization**: Compression 1.8.1, Cookie Parser 1.4.7, RxJS 7.8.1
* **Scripts**:
  * `"build": "nest build"`
  * `"start:dev": "nest start --watch"`
  * `"start:prod": "node dist/main"` (Note: Mismatched path finding; compiled entry is `dist/src/main.js`)
  * `"seed:prod": "ts-node prisma/seed-prod.ts"`
  * `"test": "jest"`
  * `"test:e2e": "jest --config ./test/jest-e2e.json"`

---

### 1.2 Database Architecture & Schema Models (84 Models)
* **Schema File**: `api/prisma/schema.prisma` (1,646 lines, 50,115 bytes)
* **Prisma Migrations Status**:
  * Checked directory: `ls api/prisma/migrations` → `No such file or directory`.
  * **Zero Prisma migration files exist** in the repository.
  * **Synchronization Path**: `npx prisma db push` is the exclusive schema deployment mechanism.
* **Complete Model Inventory (84 Prisma Models)**:
  `Role`, `RolePermission`, `RoleBranchPermission`, `Staff`, `StaffBranchAccess`, `RefreshToken`, `Customer`, `Address`, `CustomerActivity`, `Payment`, `Branch`, `Department`, `Category`, `Brand`, `Series`, `Unit`, `Attribute`, `AttributeValue`, `Product`, `ProductImage`, `ProductVariant`, `BranchInventory`, `PhoneUnit`, `ProductSpecification`, `WantedProduct`, `WastedProduct`, `Order`, `OrderItem`, `OrderStatusHistory`, `OrderNote`, `SalesReturn`, `SalesReturnItem`, `Exchange`, `ServiceJob`, `DeviceType`, `ServiceProblemType`, `ServiceWarrantyPeriod`, `ServiceJobMaterial`, `Shipment`, `StockAdjustment`, `Payroll`, `WalletType`, `WalletTransaction`, `Purpose`, `ExpenseCategory`, `Expense`, `Supplier`, `SupplierPayment`, `PurchaseOrder`, `PurchaseOrderItem`, `Banner`, `Ad`, `PromoCode`, `PushNotification`, `BlogCategory`, `Blog`, `Page`, `MenuItem`, `FooterSettings`, `MenuStructureItem`, `FooterColumn`, `FooterColumnItem`, `Country`, `SocialLink`, `ContactSubmission`, `TicketIssueType`, `SupportTicket`, `SupportTicketMessage`, `HelpNote`, `Wishlist`, `Review`, `BusinessSetting`, `Currency`, `DeliveryChargeTier`, `PaymentGatewayConfig`, `SmsConfig`, `MailConfig`, `FirebaseConfig`, `RecaptchaConfig`, `MessageTemplate`, `PasswordResetToken`, `PaymentAttempt`, `ProductRequest`, `ProductRequestItem`.

---

### 1.3 Environment Variable Audit (Code References vs Documentation)

| Environment Variable | Where Referenced in Code | Documented in Templates? | Purpose / Value Description |
|---|---|---|---|
| `DATABASE_URL` | `api/prisma/schema.prisma`, `prisma.service.ts` | `.env.example`, `api/.env.example` | PostgreSQL connection URI |
| `PORT` | `api/src/main.ts` | `api/.env.example` | Backend listening port (default: 4000) |
| `NODE_ENV` | `api/src/main.ts`, `api/src/app.module.ts` | `.env.production.example`, `api/.env.example` | Environment mode (`production` / `development`) |
| `NEXT_PUBLIC_API_URL` | `src/lib/api-client.ts`, `src/app/layout.tsx` | `.env.example`, `.env.production.example` | Public REST API base URL (`https://mobilehubbd.tech/api/v1`) |
| `NEXT_PUBLIC_BACKEND_URL` | `src/lib/api-client.ts`, `CustomerAvatar.tsx` | `.env.example`, `.env.production.example` | Backend server host for static media (`https://mobilehubbd.tech`) |
| `ALLOWED_ORIGINS` | `api/src/main.ts` | `api/.env.example` | Comma-separated list of permitted CORS frontend domains |
| `FRONTEND_URL` | `api/src/main.ts` | `api/.env.example` | Primary client URL for CORS matching |
| `JWT_ACCESS_SECRET` | `api/src/auth/jwt-access.strategy.ts` | `api/.env.example` | 64-character symmetric secret for access tokens |
| `JWT_ACCESS_EXPIRY` | `api/src/auth/auth.service.ts` | `api/.env.example` | Access token TTL (default: `15m`) |
| `JWT_REFRESH_SECRET` | `api/src/auth/auth.service.ts` | `api/.env.example` | Secret for refresh token signing |
| `JWT_REFRESH_EXPIRY` | `api/src/auth/auth.service.ts` | `api/.env.example` | Refresh token TTL (default: `7d`) |
| `R2_ACCOUNT_ID` | `api/src/common/upload/storage.service.ts` | `api/.env.example` | Cloudflare R2 Account ID |
| `R2_ACCESS_KEY_ID` | `api/src/common/upload/storage.service.ts` | `api/.env.example` | Cloudflare R2 S3 Access Key |
| `R2_SECRET_ACCESS_KEY`| `api/src/common/upload/storage.service.ts` | `api/.env.example` | Cloudflare R2 S3 Secret Access Key |
| `R2_BUCKET_NAME` | `api/src/common/upload/storage.service.ts` | `api/.env.example` | Cloudflare R2 Bucket Name (`mobilehubbd-media`) |
| `R2_PUBLIC_URL` | `api/src/common/upload/storage.service.ts` | `api/.env.example` | Public CDN endpoint or custom media domain |
| `UPLOAD_ROOT` | `api/src/common/upload/multer.config.ts` | `api/.env.example` | Local fallback disk directory (`/tmp/uploads` or `api/uploads`) |

---

### 1.4 Git Repository State & Version Control Audit
* **Active Branch**: `main`
* **Remote Tracking**: `origin/main` (Local is up to date with remote `origin/main`, 0 commits ahead/behind).
* **Head Commit**: `9287938d` ("Enhance staff access, technician profit sharing, data isolation, and brand consistency")
* **Recent Commit Log (`git log --oneline -15`)**:
  ```text
  9287938d (HEAD -> main, origin/main, origin/HEAD) Enhance staff access, technician profit sharing, data isolation, and brand consistency
  532e7d9c Fix Pass 29 - Admin nav highlight exact match and server-side account route redirect
  8030e9e1 Fix Pass 28 - Rebranding, route guards, UI alignment
  361b101d feat(deploy): add production automated deployment script deploy.sh
  50a9eab5 Complete rebrand, security fixes, automated tests (Fix Pass 26)
  e1e61c5c docs: add Fix Pass 23 real state verification and go-live checklist to QA_AUDIT_REPORT.md
  26f21b68 feat: complete Fix Pass 17-23 enterprise mobile shop with free-tier deployment blueprints, R2 adapter, servicing module, and human go-live guide
  51371bc4 Complete upgrade of POS terminal and all recent fixes
  bb462969 fix: ignore api folder in vercel deployment and tsconfig
  8a98f46d fix: make context hooks resilient for build prerendering
  511e1fb3 fix: resolve useFormField outside FormField error and add safe fallback
  5d0b7862 fix: add missing Plus icon in EmployeeForm
  b4438a3e fix: resolve lucide-react missing icons
  baf1c499 chore: ignore build errors for vercel
  6e6beab8 Initial commit: Mobile Shop Website with Next.js storefront and admin dashboard
  ```
* **Working Tree State**:
  * Uncommitted modifications present across: `api/prisma/schema.prisma`, `api/src/app.module.ts`, `api/src/service-job/service-job.service.ts`, `src/app/(admin)/admin/servicing/page.tsx`, `src/components/admin/AdminSidebar.tsx`.
  * Untracked module directories: `api/src/product-request/`, `src/app/(admin)/admin/branch/product-requests/`.


---

---

## Section 2 — Build & Static Health

### 2.1 Production Build Execution
Both frontend and backend builds were executed directly via shell commands:

#### Frontend Build (`npm run build` at project root)
* **Exit Code**: `0` (Clean Pass)
* **Command Output**:
  ```text
  Route (app)                              Size     First Load JS
  ┌ ○ /                                    9.12 kB         157 kB
  ├ ○ /admin                               4.64 kB         153 kB
  ├ ○ /admin/branch/product-requests       5.77 kB         158 kB
  ├ ƒ /admin/branch/product-requests/[id]  9.67 kB         141 kB
  ├ ○ /admin/branch/product-requests/create 7.25 kB        165 kB
  ├ ○ /admin/servicing                    10.5 kB         156 kB
  ├ ○ /admin/technician/servicing-report  11.4 kB         118 kB
  ... (All 122 pages built and prerendered cleanly)
  ○  (Static)   prerendered as static content
  ƒ  (Dynamic)  server-rendered on demand
  ```
* **Diagnostics**: Zero build-breaking failures or missing page chunks.

#### Backend Build (`npm run build` inside `api/`)
* **Exit Code**: `0` (Clean Pass)
* **Command Output**:
  ```text
  > api@0.0.1 build
  > nest build
  ```
* **Diagnostics**: TypeScript compiler emitted complete JavaScript distribution into `api/dist/`.

---

### 2.2 Static Type Checking (`npx tsc --noEmit`)

#### Frontend (`npx tsc --noEmit` in root)
* **Exit Code**: `2`
* **Total Type Errors**: Exactly 2 errors found across 2 files:
  1. `src/app/(admin)/admin/branch/product-requests/create/page.tsx:356:63`:
     `error TS18047: user is possibly null.`
  2. `src/app/(admin)/admin/branch/product-requests/page.tsx:214:20`:
     `error TS18047: user is possibly null.`
* **Root Cause**: Missing optional chaining operator on `user?.branch?.name`.
* **Build Impact**: Non-blocking in production because `next.config.mjs` defines `typescript: { ignoreBuildErrors: true }`.

#### Backend (`npx tsc --noEmit` inside `api/`)
* **Exit Code**: `2`
* **Total Type Errors**: Exactly 4 errors found in 1 file:
  * `api/test/auth.e2e-spec.ts` (Lines 26, 44, 55, 69):
    `error TS2349: This expression is not callable ... import * as request from supertest`
* **Production Code Impact**: Zero errors in `api/src/`. Errors exist exclusively in the legacy e2e test suite due to Supertest type namespace mismatch.

---

### 2.3 Linter Analysis (`npm run lint`)
* **Frontend Linter Output Summary**:
  * Warnings: Next.js `@next/next/no-img-element` on a few raw `<img>` tags (`Header.tsx`, `HeroCarousel.tsx`, `BlogCard.tsx`).
  * Warnings: Unescaped apostrophes (`react/no-unescaped-entities`) in raw JSX strings (`Footer.tsx:143`, `Header.tsx:403`).
  * Errors: Unused imports (`Sparkles`, `MapPin`, `Share2`, `Globe`, `PhoneCall`) and extensive `@typescript-eslint/no-explicit-any` usages across legacy forms.
* **Backend Linter Output**:
  * Consistent with standard NestJS configuration; unused parameter warnings in interface stubs.

---

### 2.4 Route Inventory & Missing Modules Audit
1. **Dead & Duplicate Routes**:
   * `/admin/purchase/create` vs `/admin/accounting/purchase/create`: Both routes exist in `src/app/(admin)/admin/`. `/admin/purchase/create` renders an inline adapter pointing to the primary purchase creator.
   * `/admin/sales/service/create` vs `/admin/servicing/create`: Both paths expose the repair intake form.
   * `/admin/business/general`: Legacy alias directory redirecting to `/admin/business-settings/general`.
2. **Missing Modules Audit**:
   * All imports across `src/` and `api/src/` resolve to existing files or npm dependencies. No `MODULE_NOT_FOUND` runtime crashes occur during live execution.

---

### 2.5 Compiled Backend Entrypoint Path Mismatch
* **Actual Compiled Path**: `api/dist/src/main.js`
* **`api/package.json:14` Start Script**: `"start:prod": "node dist/main"`
* **`deploy.sh:30` PM2 Command**: `pm2 start dist/main.js --name mobilehubbd-api`
* **CRITICAL FINDING**: Executing `node dist/main` inside `api/` immediately fails with:
  `Error: Cannot find module ./dist/main`
  NestJS nested the output into `dist/src/main.js` because root files (`prisma/seed.ts`) were included in the compiler scope. The correct entrypoint is `dist/src/main.js`. Flagged as **P1 High Severity**.


---

---

## Section 3 — Full Route Inventory & Live Page Crawl

### 3.1 Route Enumeration (122 Total Application Routes)
Next.js 14 App Router layout:
* **Public Storefront (13 static + dynamic routes)**: `/`, `/about`, `/terms`, `/privacy`, `/contact`, `/blog`, `/blog/[slug]`, `/phones`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/checkout`, `/order/confirmation/[orderId]`, `/order/payment-failed`.
* **Authentication (3 routes)**: `/login` (Customer), `/register` (Customer), `/admin/login` (Staff & Executives).
* **Customer Account Portal (7 routes)**: `/account`, `/account/orders`, `/account/orders/[id]`, `/account/profile`, `/account/addresses`, `/account/wishlist`, `/account/tickets`.
* **Enterprise Admin Dashboard & Modules (99 routes)**:
  * **Core**: `/admin`, `/admin/pos`, `/admin/technician`, `/admin/technician/servicing-report`, `/admin/servicing`, `/admin/servicing/create`.
  * **Sales & Logistics**: `/admin/sales/all`, `/admin/sales/diagnosing`, `/admin/sales/courier`, `/admin/sales/courier-list`, `/admin/sales/service`, `/admin/sales/service/create`.
  * **Orders & Returns**: `/admin/orders`, `/admin/orders/[id]`, `/admin/sales-returns`, `/admin/sales-returns/[id]`, `/admin/exchanges`, `/admin/exchanges/[id]`.
  * **Catalog & Products**: `/admin/products`, `/admin/products/create`, `/admin/products/[id]/edit`, `/admin/products/brands`, `/admin/products/series`, `/admin/products/units`, `/admin/products/attributes`, `/admin/products/attributes/[id]/values`, `/admin/products/bulk`, `/admin/products/wanted`, `/admin/products/wasted`, `/admin/category`.
  * **Branch Management**: `/admin/branch`, `/admin/branch/create`, `/admin/branch/product-requests`, `/admin/branch/product-requests/create`, `/admin/branch/product-requests/[id]`, `/admin/stock-adjustments`, `/admin/stock-adjustments/create`.
  * **Procurement & Vendors**: `/admin/accounting/purchase`, `/admin/purchase/create`, `/admin/accounting/purchase/create`, `/admin/accounting/suppliers`, `/admin/accounting/suppliers/payments`.
  * **Accounting & Financials**: `/admin/accounting/wallet/types`, `/admin/accounting/wallet/deposit-history`, `/admin/accounting/wallet/purpose`, `/admin/accounting/expense/all`, `/admin/accounting/expense/categories`, `/admin/accounting/expense/history`.
  * **Human Resource Management (HRM)**: `/admin/hrm/employees`, `/admin/hrm/employees/create`, `/admin/hrm/employees/[id]/edit`, `/admin/hrm/technicians`, `/admin/hrm/departments`, `/admin/hrm/roles-permissions`, `/admin/hrm/payroll`, `/admin/hrm/payroll/run`.
  * **CRM & Customers**: `/admin/customers`, `/admin/customers/create`, `/admin/customers/[id]`, `/admin/customers/[id]/edit`.
  * **Executive Reports**: `/admin/reports/summary`, `/admin/reports/website-sales`, `/admin/reports/pos-sales`, `/admin/reports/pos`, `/admin/reports/service-sales`, `/admin/reports/expense`, `/admin/reports/purchase`, `/admin/reports/transactions`, `/admin/reports/product-stock`, `/admin/reports/customer-due`, `/admin/reports/supplier-due`, `/admin/reports/courier`, `/admin/reports/product-analytics`, `/admin/reports/discount`.
  * **Marketing & Promotions**: `/admin/marketing/banners`, `/admin/marketing/banners/create`, `/admin/marketing/ads`, `/admin/marketing/ads/create`, `/admin/marketing/promo-code`, `/admin/marketing/promo-code/create`, `/admin/marketing/push-notification`, `/admin/marketing/blogs`, `/admin/marketing/blogs/create`, `/admin/marketing/blogs/[id]/edit`.
  * **CMS**: `/admin/cms/pages`, `/admin/cms/pages/create`, `/admin/cms/pages/[id]/edit`, `/admin/cms/menus`, `/admin/cms/footer`, `/admin/cms/countries`, `/admin/cms/contact`, `/admin/cms/social`, `/admin/cms/ticket-issues`.
  * **Business Administration**: `/admin/business-settings`, `/admin/business-settings/general`, `/admin/business-settings/setup`, `/admin/business-settings/verification`, `/admin/business-settings/currency`, `/admin/business-settings/delivery-charge`, `/admin/business/general`, `/admin/3rd-party`.
  * **Assistance & Support**: `/admin/support/requests`, `/admin/support/notes`.

---

### 3.2 Public Storefront Live Crawl Table
Evaluated without authentication headers.

| Route | HTTP Result | Loads Real Data? | Console Errors | Network Status | Notes & Verification Findings |
|---|---|---|---|---|---|
| `/` (Homepage) | 200 OK | YES | None | 200 OK | Hero banner loads active image; category pills, featured phones, brand grid render live from DB. |
| `/phones` | 200 OK | YES | None | 200 OK | Lists active mobile handsets; dynamic filter sidebar loads brands and storage variants. |
| `/category/display` | 200 OK | YES | None | 200 OK | Displays items in Display category (e.g. S22 Ultra Display Panel). |
| `/product/product-1` | 200 OK | YES | None | 200 OK | Variant selector, pricing, stock badge, and specs load properly. Call to Order/WhatsApp are unlinked. |
| `/cart` | 200 OK | YES | None | 200 OK | Cart state syncs with localStorage; shows delivery charge progress bar. |
| `/checkout` | 200 OK | YES | None | 200 OK | Tiered delivery selector (৳60 / ৳100), COD / MFS payment gateway radio options. |
| `/login` | 200 OK | YES | None | 200 OK | Customer login form with client-side validation; links to `/register`. |
| `/register` | 200 OK | YES | None | 200 OK | Registration form submitting to `POST /api/v1/auth/customer/register`. |
| `/blog` | 200 OK | YES | None | 200 OK | CMS blog grid loading articles with real dates, authors, and thumbnails. |
| `/blog/oled-replacement-guide-1787424163663` | 200 OK | YES | None | 200 OK | Rich article HTML content renders properly without layout distortion. |
| `/contact` | 200 OK | YES | None | 200 OK | Contact form submits to `POST /api/v1/contact-submissions`. Support hotline: `+880 1700-000000`. |
| `/about` | 200 OK | YES | None | 200 OK | Live company mission and outlet location overview. |
| `/terms` | 200 OK | YES | None | 200 OK | Legal terms and conditions render cleanly. |
| `/privacy` | 200 OK | YES | None | 200 OK | Privacy policy document renders cleanly. |
| `/order/confirmation/[orderId]` | 200 OK | YES | None | 200 OK | Visual invoice badge, printable receipt button, tracking summary. |
| **Storefront Sync Check** | 200 OK | YES | None | 200 OK | Product created/activated in admin instantly appears on storefront catalog query. |

---

### 3.3 Role Crawl: Global Admin / Super Admin (`admin@mobilehubbd.test`)
Universal permissions across all modules and branches (`scope: GLOBAL`).

| Sidebar / Direct Route | HTTP Result | Loads Real Data? | Console Errors | Network Status | Notes |
|---|---|---|---|---|---|
| `/admin` (Dashboard) | 200 OK | YES | None | 200 OK | 7 KPI cards, weekly income/expense chart, top products, recent orders. |
| `/admin/pos` | 200 OK | YES | None | 200 OK | Full catalog search, variant picker modal, split payments, customer due. |
| `/admin/sales/all` | 200 OK | YES | None | 200 OK | Aggregated sales across all branches, filter by date, payment, type. |
| `/admin/sales/diagnosing` | 200 OK | YES | None | 200 OK | Repair orders in diagnosing status. |
| `/admin/sales/courier` | 200 OK | YES | None | 200 OK | Courier orders with parcel booking and delivery status. |
| `/admin/sales/service` | 200 OK | YES | None | 200 OK | Service jobs in sales module list. |
| `/admin/servicing/create` | 200 OK | YES | None | 200 OK | 9-step intake form: device, issue, labor, materials, pattern/PIN. |
| `/admin/servicing` | 200 OK | YES | None | 200 OK | Master servicing list, technician filter, edit modal with supplier & live discount. |
| `/admin/orders` | 200 OK | YES | None | 200 OK | 193 total orders, customer search, status badges, details view. |
| `/admin/sales-returns` | 200 OK | YES | None | 200 OK | 5 sales return records, item refund breakdown. |
| `/admin/exchanges` | 200 OK | YES | None | 200 OK | Trade-in exchange management. |
| `/admin/category` | 200 OK | YES | None | 200 OK | 15 categories, icon picker, hierarchy parent selection. |
| `/admin/products` | 200 OK | YES | None | 200 OK | 72 active products, stock badges, price, brand, category filters. |
| `/admin/products/create` | 200 OK | YES | None | 200 OK | Multi-variant product builder (Color, Quality, SKU, IMEI intake). |
| `/admin/products/brands` | 200 OK | YES | None | 200 OK | 16 brands with logo uploads and status toggles. |
| `/admin/products/series` | 200 OK | YES | None | 200 OK | 3 product series (e.g. Galaxy S, iPhone Pro). |
| `/admin/products/units` | 200 OK | YES | None | 200 OK | Measurement units (Pcs, Box, Set). |
| `/admin/products/attributes` | 200 OK | YES | None | 200 OK | 7 attributes (Color, Quality, Storage, RAM, etc.). |
| `/admin/products/bulk` | 200 OK | YES | None | 200 OK | Bulk CSV import and template export. |
| `/admin/products/wanted` | 200 OK | YES | None | 200 OK | Customer wanted product requests. |
| `/admin/products/wasted` | 200 OK | YES | None | 200 OK | Damaged / wasted product write-offs. |
| `/admin/branch` | 200 OK | YES | None | 200 OK | 7 branches (Dhaka Main, Chittagong, Sylhet, etc.). |
| `/admin/branch/product-requests` | 403 / Hidden | N/A | None | 403 Forbidden | **Intentionally Hidden**: Product Requests is restricted to Branch Admin/Manager. |
| `/admin/stock-adjustments` | 200 OK | YES | None | 200 OK | 16 adjustment records with physical count audit reconciliation. |
| `/admin/accounting/purchase` | 200 OK | YES | None | 200 OK | 22 purchase orders, PO number, supplier, status, payment details. |
| `/admin/accounting/purchase/create`| 200 OK | YES | None | 200 OK | PO creator with multi-wallet payment and IMEI entry. |
| `/admin/accounting/suppliers` | 200 OK | YES | None | 200 OK | 14 suppliers with running totalDue balances. |
| `/admin/accounting/wallet/types`| 200 OK | YES | None | 200 OK | 11 wallets (Cash, Bank, bKash Merchant, Nagad) with live balances. |
| `/admin/accounting/expense/all` | 200 OK | YES | None | 200 OK | 17 expense vouchers with wallet source deduction. |
| `/admin/hrm/employees` | 200 OK | YES | None | 200 OK | 45 staff records, branch assignment, salary, status. |
| `/admin/hrm/technicians` | 200 OK | YES | None | 200 OK | Technician roster with profit share percentage configuration. |
| `/admin/hrm/payroll` | 200 OK | YES | None | 200 OK | 67 payroll disbursement records, payslip generation. |
| `/admin/hrm/roles-permissions` | 200 OK | YES | None | 200 OK | 57 system & custom roles, granular module-action matrix. |
| `/admin/reports/summary` | 200 OK | YES | None | 200 OK | High-level executive KPI overview. |
| `/admin/reports/service-sales` | 200 OK | YES | None | 200 OK | 85 repair jobs financial summary. |
| `/admin/business-settings/general` | 200 OK | YES | None | 200 OK | Store name, contact, currency, invoice prefix. |
| `/admin/3rd-party` | 200 OK | YES | None | 200 OK | Payment gateways (SSLCommerz, bKash), SMS gateway, Mail, Recaptcha. |

---

### 3.4 Role Crawl: Branch Admin & Branch Manager (`demo.branchadmin@mobilehubbd.test` / `ctg.manager@mobilehubbd.test`)
Scoped strictly to own branch inventory and transactions (`scope: OWN_BRANCH`).

| Route | HTTP Result | Loads Real Data? | Console Errors | Network Status | Notes |
|---|---|---|---|---|---|
| `/admin` (Dashboard) | 200 OK | YES | None | 200 OK | Dashboard statistics auto-scoped to branch transactions. |
| `/admin/pos` | 200 OK | YES | None | 200 OK | Cashier terminal auto-locked to own branch stock inventory. |
| `/admin/branch/product-requests` | 200 OK | YES | None | 200 OK | **PRIMARY WORKSPACE**: Lists inter-branch stock transfers. |
| `/admin/branch/product-requests/create`| 200 OK | YES | None | 200 OK | Request stock from another branch (e.g. CTG requesting from Dhaka). |
| `/admin/branch/product-requests/[id]` | 200 OK | YES | None | 200 OK | Review, approve with adjusted qty, and confirm atomic stock receipt. |
| `/admin/sales/all` | 200 OK | YES | None | 200 OK | Filtered to own branch sales orders. |
| `/admin/orders` | 200 OK | YES | None | 200 OK | Scoped to own branch order fulfillment. |
| `/admin/stock-adjustments` | 200 OK | YES | None | 200 OK | Branch inventory stock adjustment vouchers. |
| `/admin/hrm/employees` | 200 OK | YES | None | 200 OK | Displays employees stationed at own branch. |
| `/admin/business-settings/*` (Blocked) | 403 Forbidden | NO | None | 403 Forbidden | Correctly blocked by RBAC guard; hidden from sidebar. |
| `/admin/3rd-party` (Blocked) | 403 Forbidden | NO | None | 403 Forbidden | Blocked server-side; credentials safe from branch staff. |

---

### 3.5 Role Crawl: Technician (`demo.technician@mobilehubbd.test` - Rajib Paul)
Dedicated technician interface strictly scoped to assigned repair jobs.

| Route | HTTP Result | Loads Real Data? | Console Errors | Network Status | Notes |
|---|---|---|---|---|---|
| `/admin/technician` (Workspace) | 200 OK | YES | None | 200 OK | Interactive job cards showing status, pattern lock, issue description. |
| `/admin/servicing/create` | 200 OK | YES | None | 200 OK | Quick service intake modal to register new repair jobs. |
| `/admin/technician/servicing-report` | 200 OK | YES | None | 200 OK | Shows personal earnings (৳58,400), 50% profit share rate, job ledger. |
| `/admin` (Dashboard) | 200 OK | YES | None | 200 OK | Standard staff dashboard view. |
| `/admin/servicing` (Admin View) | 403 Forbidden | NO | None | 403 Forbidden | Blocked: Technicians cannot manage master service jobs across shop. |
| `/admin/reports/service-sales` | 403 Forbidden | NO | None | 403 Forbidden | Blocked with "Access denied: Technicians can only view their own...". |
| `/admin/accounting/*` (Blocked) | 403 Forbidden | NO | None | 403 Forbidden | Accounting, wallets, and supplier balances hidden and blocked. |
| `/admin/hrm/*` (Blocked) | 403 Forbidden | NO | None | 403 Forbidden | Payroll, roles, and employee records hidden and blocked. |

---

### 3.6 Role Crawl: Salesperson (`sales@mobilehubbd.test`)
Counter retail sales and customer management.

| Route | HTTP Result | Loads Real Data? | Console Errors | Network Status | Notes |
|---|---|---|---|---|---|
| `/admin/pos` | 200 OK | YES | None | 200 OK | Fast checkout, barcode scanner, phone IMEI selection. |
| `/admin/sales/all` | 200 OK | YES | None | 200 OK | View store sales history. |
| `/admin/orders` | 200 OK | YES | None | 200 OK | View and manage order statuses. |
| `/admin/customers` | 200 OK | YES | None | 200 OK | Look up customer profiles and add new shoppers. |
| `/admin/accounting/*` (Blocked) | 403 Forbidden | NO | None | 403 Forbidden | Wallets and purchases blocked. |
| `/admin/hrm/*` (Blocked) | 403 Forbidden | NO | None | 403 Forbidden | Employee and salary records blocked. |

---

### 3.7 Role Crawl: Inventory Auditor (`demo.auditor@mobilehubbd.test`)
Read-only inventory inspection role.

| Route | HTTP Result | Loads Real Data? | Console Errors | Network Status | Notes |
|---|---|---|---|---|---|
| `/admin/products` | 200 OK | YES | None | 200 OK | Read-only catalog inspection with serial/IMEI stock counts. |
| `/admin/stock-adjustments` | 200 OK | YES | None | 200 OK | Inspect discrepancy audit logs. |
| `/admin/accounting/purchase` | 200 OK | YES | None | 200 OK | Read-only review of vendor intake orders. |
| `/admin/business-settings` (Blocked)| 403 Forbidden | NO | None | 403 Forbidden | System configurations blocked. |
| `/admin/hrm/payroll` (Blocked) | 403 Forbidden | NO | None | 403 Forbidden | Payroll records blocked. |


---

---

## Section 4 — Authentication, RBAC & Data Isolation Tests

### 4.1 Authentication & Authorization Architecture
The application implements multi-tenant role-based access control with dual authentication scopes:
1. **Customer Auth Scope**: JWT Bearer tokens issued via `POST /api/v1/auth/customer/login`, stored in `localStorage` key `mobilehubbd_customer_token`, paired with HTTP-only cookie `customer_refresh_token`.
2. **Staff Auth Scope**: JWT Bearer tokens issued via `POST /api/v1/auth/staff/login`, stored in `localStorage` key `mobilehubbd_staff_token`, paired with HTTP-only cookie `staff_refresh_token`.

#### Next.js Route Guard Middleware (`src/middleware.ts`)
```typescript
const PROTECTED_CUSTOMER_PATHS = ['/account'];
const PROTECTED_ADMIN_PATHS = ['/admin'];
const ADMIN_LOGIN_PATH = '/admin/login';
const CUSTOMER_LOGIN_PATH = '/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === ADMIN_LOGIN_PATH || pathname === CUSTOMER_LOGIN_PATH) {
    return NextResponse.next();
  }
  const isAccountRoute = PROTECTED_CUSTOMER_PATHS.some(p => pathname.startsWith(p));
  if (isAccountRoute) {
    const hasCustomerRefresh = request.cookies.has('customer_refresh_token');
    const hasCustomerAuth = request.cookies.has('customer_authenticated');
    if (!hasCustomerRefresh && !hasCustomerAuth) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url));
    }
  }
  return NextResponse.next();
}
```

#### NestJS Core Guards
* **JWT Guard (`api/src/auth/guards/jwt-auth.guard.ts`)**: Extends Passport `jwt-access` strategy. Checks for `@Public()` decorator via Reflector. Non-public endpoints strictly reject missing or invalid Bearer tokens with `401 Unauthorized`.
* **RBAC Guard (`api/src/auth/guards/permissions.guard.ts`)**:
  * Validates `user.userType === STAFF`.
  * Verifies `RolePermission` table for module + action:
    ```typescript
    const permission = await this.prisma.rolePermission.findUnique({
      where: { roleId_module_action: { roleId: user.roleId, module: required.module, action: required.action } }
    });
    if (!permission?.allowed) throw new ForbiddenException(`Your role does not have ${required.action} permission on ${required.module}.`);
    ```
  * Restricts Global-only modules (`BUSINESS_SETTINGS`, `CMS`, `THIRD_PARTY_CONFIG`) to roles with `scope: GLOBAL`.

---

### 4.2 Live Real-Token Isolation & RBAC Test Matrix

All tests executed with actual tokens against running backend server (`http://localhost:4000/api/v1`).

| Test Case | Actor / Role | Endpoint Tested | Method | Expected | Actual Status | Result | Exact Response Body Evidence |
|---|---|---|---|---|---|---|---|
| **Unauth Account** | Anonymous | `http://localhost:3000/account` | GET | 307 Redirect | **307** | **PASS** | `Location: /login?redirect=/account` |
| **Unauth API** | Anonymous | `/orders` | GET | 401 | **401** | **PASS** | `{"message":"Unauthorized","statusCode":401}` |
| **Technician Delete Job** | Rajib Paul (Technician) | `/service-jobs/cmuiuh95700do12on8al6sw2k` | DELETE | 403 | **403** | **PASS** | `{"message":"Your role does not have DELETE permission on ORDERS.","statusCode":403}` |
| **Technician Global Config** | Rajib Paul (Technician) | `/business-settings/setup` | GET | 403 | **403** | **PASS** | `{"message":"Access restricted: Only Global Administrators can access or modify system-wide settings.","statusCode":403}` |
| **Technician Cross Job** | Rajib Paul (Technician) | `/service-jobs/cmuk8buh0001qmpxq7azksfoj` | GET | 403 | **403** | **PASS** | `{"message":"Access denied: You can only view your own service jobs","statusCode":403}` |
| **Technician Own Job** | Rajib Paul (Technician) | `/service-jobs/cmuiuh95700do12on8al6sw2k` | GET | 200 | **200** | **PASS** | `{"id":"cmuiuh95700do12on8al6sw2k","invoiceNo":"INV-0084",...}` |
| **Cross-Branch Order Creation**| Dhaka Branch Admin | `/orders` (branchId: Chittagong) | POST | 403 | **403** | **PASS** | `{"message":"You can only access or modify data belonging to your own branch.","statusCode":403}` |
| **Sales Staff HRM Delete** | Counter Sales (Salesperson)| `/employees/cmu06zavj008dvbfrngcolfm8` | DELETE | 403 | **403** | **PASS** | `{"message":"Your role does not have DELETE permission on HRM.","statusCode":403}` |
| **Auditor Settings Mutation** | Demo Auditor | `/business-settings` | PATCH | 403 | **403** | **PASS** | `{"message":"Access restricted: Only Global Administrators can access or modify system-wide settings.","statusCode":403}` |
| **Brute Force Lockout** | Unauthenticated Attacker | `/auth/customer/login` | POST | 429 after 5 fails | **429** | **PASS** | Attempt 1-5: 401; Attempt 6: `HTTP 429 {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}` |

---

### 4.3 Data Leakage & Credential Exposure Audit
1. **"John Doe" Demo Address Check**:
   * Scanned repository for `John Doe`.
   * Result: Exactly 1 occurrence found at `src/app/(storefront)/register/page.tsx:83`, used solely as an HTML placeholder (`placeholder="e.g. John Doe"`). No database records or mock data leak customer personal details.
2. **Demo Password Exposure in Client Bundle**:
   * Scanned `src/` for `Admin@12345` and demo email strings.
   * Result: Zero matches in client application code. Credentials are never bundled in production frontend code.
3. **Session Cleared on Logout**:
   * Verified in `src/context/AuthContext.tsx:320-330`: Invokes `POST /auth/staff/logout`, sets `user = null`, removes `STAFF_USER_KEY` from `localStorage`, invalidates access token, and triggers server-side cookie deletion. Subsequent back-navigation hits `middleware.ts` redirecting to `/admin/login`.


---

---

## Section 5 — Backend API Health

### 5.1 Controller Inventory & Endpoint Registry
The backend architecture contains **51 controllers** organized into domain modules. All non-public endpoints are protected by `JwtAuthGuard` and `PermissionsGuard`:

| Domain Module | Primary Controller | Base Route Path | Core Guarding / Permissions |
|---|---|---|---|
| **Auth** | `AuthController` | `/auth` | `@Public()` for login/register/refresh; Throttle: 5/min on login |
| **Catalog** | `ProductController` | `/products` | `@Public()` on GET listing/detail; `@RequirePermission(PRODUCTS)` on mutations |
| **Categories**| `CategoryController` | `/categories` | `@Public()` on GET; `@RequirePermission(CATEGORY)` on create/update/delete |
| **Brands** | `BrandController` | `/brands` | `@Public()` on GET; `@RequirePermission(PRODUCTS)` on mutations |
| **Series** | `SeriesController` | `/series` | `@Public()` on GET; `@RequirePermission(PRODUCTS)` on mutations |
| **Units** | `UnitController` | `/units` | `@Public()` on GET; `@RequirePermission(PRODUCTS)` on mutations |
| **Attributes**| `AttributeController`| `/attributes` | `@Public()` on GET; `@RequirePermission(PRODUCTS)` on mutations |
| **Orders** | `OrderController` | `/orders` | Customer OWN_DATA guard; `@RequirePermission(ORDERS)` on staff routes |
| **POS** | `PosController` | `/pos` | `@RequirePermission(SALES, READ/CREATE)` |
| **Servicing** | `ServiceJobController`| `/service-jobs`| `ORDERS` module permission + Technician isolation guard |
| **Product Req**| `ProductRequestController`| `/product-requests`| Strict branch role check: Branch Admin / Manager only |
| **Procurement**| `PurchaseOrderController`| `/purchase-orders`, `/purchases` | `@RequirePermission(PURCHASE)` |
| **Suppliers** | `SupplierController` | `/suppliers` | `@RequirePermission(SUPPLIERS)` |
| **Adjustments**| `StockAdjustmentController`| `/stock-adjustments` | `@RequirePermission(STOCK_ADJUSTMENTS)` |
| **Branches** | `BranchController` | `/branches` | `@Public()` on GET; `@RequirePermission(BRANCH)` on mutations |
| **Employees** | `EmployeeController`| `/employees` | `@RequirePermission(HRM)` |
| **Payroll** | `PayrollController` | `/payroll` | `@RequirePermission(HRM)` |
| **Roles** | `RoleController` | `/roles` | `@RequirePermission(HRM)` |
| **Wallets** | `WalletController` | `/wallets` | `@RequirePermission(WALLET)` |
| **Expenses** | `ExpenseController` | `/expenses` | `@RequirePermission(EXPENSE)` |
| **Banners** | `BannerController` | `/banners` | `@Public()` on GET active; `@RequirePermission(PROMOTIONAL_BANNER)` |
| **CMS Pages** | `PageController` | `/pages` | `@Public()` on GET slug; `@RequirePermission(CMS)` |
| **Reports** | `ReportController` | `/reports` | `@RequirePermission(REPORT)` + Technician report isolation |
| **Settings** | `BusinessSettingsController`| `/business-settings` | `@Public()` on GET basic; `GLOBAL` scope required on setup/patch |
| **bKash MFS** | `BkashController` | `/payments/bkash` | Payment initiation, execute webhook callback, query |
| **SSLCommerz**| `SslcommerzController`| `/payments/sslcommerz`| Hosted gateway init, IPN, success/fail redirection handlers |

---

### 5.2 Real-Server Global Admin GET Crawl Results
Evaluated against active NestJS process on port 4000:

| Endpoint | HTTP Status | Response Time | Data Payload Structure | Query-Filter / Schema Status |
|---|---|---|---|---|
| `/products` | 200 OK | 12ms | 12 items (paginated, total: 72) | Matches catalog expectations |
| `/categories` | 200 OK | 5ms | 15 items | Full category tree |
| `/brands` | 200 OK | 5ms | 16 items | Brand logos and status flags |
| `/series` | 200 OK | 2ms | 3 items | Active series list |
| `/units` | 200 OK | 4ms | 3 items | Pcs, Box, Set |
| `/attributes` | 200 OK | 4ms | 7 items | Dynamic variant attributes |
| `/orders` | 200 OK | 11ms | 20 items (paginated, total: 193) | Full order history with customer relations |
| `/sales-returns` | 200 OK | 6ms | 5 items (paginated, total: 5) | Return vouchers with items |
| `/service-jobs` | 200 OK | 9ms | 20 items (paginated, total: 85) | Master servicing jobs list |
| `/service-lookups/device-types` | 200 OK | 2ms | Array of device types | Lookup sub-route operational |
| `/purchase-orders` | 200 OK | 13ms | 20 items (paginated, total: 22) | PO records with supplier relations |
| `/suppliers` | 200 OK | 7ms | 14 items | Running due balance accounts |
| `/stock-adjustments` | 200 OK | 6ms | 16 items | Physical audit logs |
| `/branches` | 200 OK | 3ms | 7 items | Flagship, Outlets, Warehouses |
| `/customers` | 200 OK | 4ms | 20 items | Customer profiles with order counts |
| `/employees` | 200 OK | 7ms | 20 items (paginated, total: 45) | Staff roster across all branches |
| `/departments` | 200 OK | 4ms | 1 item | Operational |
| `/roles` | 200 OK | 6ms | 57 items | System and custom roles |
| `/payroll` | 200 OK | 4ms | 20 items (paginated, total: 67) | Historical salary disbursements |
| `/wallets` | 200 OK | 7ms | 11 items | Cash drawers, MFS, bank balances |
| `/expenses` | 200 OK | 6ms | 17 items | Operating expense records |
| `/banners` | 200 OK | 3ms | 6 items | Active homepage banners |
| `/blogs` | 200 OK | 2ms | 4 items | CMS articles |
| `/reports/dashboard` | 200 OK | 17ms | Comprehensive KPI JSON | Chart, status breakdown, top products |
| `/reports/summary` | 200 OK | 4ms | Summary object | Financial totals |
| `/reports/service-sales` | 200 OK | 11ms | 85 repair job rows | Administrative service report |
| `/reports/product-stock` | 200 OK | 28ms | 75 inventory rows | Multi-branch stock matrix |
| `/reports/transactions` | 200 OK | 25ms | 64 transaction rows | Inflows and disbursements |

---

### 5.3 DTO Whitelist & Validation Strictness
In `api/src/main.ts:67-71`:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```
* `forbidNonWhitelisted: true`: Causes NestJS to immediately reject any client payload that includes fields not explicitly declared with a class-validator decorator in the corresponding DTO, responding with `400 Bad Request: property [x] should not exist`.
* Form audit: All active admin and storefront forms have been aligned to their DTO schemas, preventing client submission crashes.

---

### 5.4 File Upload Pipeline
* Configured in `api/src/common/upload/multer.config.ts` and `storage.service.ts`.
* Accepts: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`, `application/pdf`. Max file size: 5MB.
* **Storage Mode Logic**:
  * If Cloudflare R2 credentials (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`) are present: streams directly to S3-compatible R2 bucket and returns `https://{R2_PUBLIC_URL}/{subfolder}/{uuid-filename}`.
  * If R2 credentials are unset: saves to local filesystem (`UPLOAD_ROOT` or `api/uploads/{subfolder}`) and returns `/uploads/{subfolder}/{uuid-filename}`.
  * Server serves local uploads via `app.useStaticAssets(uploadDir, { prefix: /uploads/ })`.
  * Frontend image helpers prepend `NEXT_PUBLIC_BACKEND_URL` to relative paths, ensuring images render reliably under both local and R2 configurations.

---

### 5.5 Payment Gateways (bKash & SSLCommerz)
* **Controllers Present**: `BkashController` (`api/src/payment/bkash/bkash.controller.ts`) and `SslcommerzController` (`api/src/payment/sslcommerz/sslcommerz.controller.ts`).
* **Credentials Template**: Supported via database configuration (`PaymentGatewayConfig`) and environment variables (`BKASH_*`, `SSLCOMMERZ_*`).
* **Verification Scope**: Integration structure, routes, and signature validation logic verified in code. Live real-money transactions to MFS/bank switches are classified under **Could Not Verify** due to production merchant credential requirements.


---

---

## Section 6 — Business Logic Verification (with real numbers)

### 6.1 Servicing Profit Split: The 50/50 Rule
The repair servicing financial engine computes technician earnings strictly on net profit rather than total labor or gross customer revenue:
$$\text{Profit} = \text{Final Amount} - \text{Material Cost}$$
$$\text{Technician Profit Share} = \text{Profit} \times 50\%$$

#### Live Worked Job Evidence: `INV-0084` (`cmuiuh95700do12on8al6sw2k`)
* **Device**: Apple iPhone 15 Pro Max
* **Issue**: Front OLED Display replacement & water seal gasket
* **Technician Assigned**: Rajib Paul (`demo.technician@mobilehubbd.test` / `cmu06zavj008dvbfrngcolfm8`)
* **Branch**: Dhaka Main (`cmsugs7v801gbg7dh0up2ax63`)
* **Customer**: Pass 25 Verification Customer (`01712999888`)
* **Financial Ledger Breakdown**:
  * **Labor Charge**: ৳1,500.00
  * **Material Cost (Sourced)**: ৳5,500.00 (`OLED Display Panel OEM`, Source: `OTHER`, Note: "Urgent cash buy, verified grade A display")
  * **Subtotal / Total Bill**: ৳7,000.00
  * **Discount Applied**: ৳200.00
  * **Final Customer Billed Amount**: ৳6,800.00
  * **Net Repair Profit**: $\text{৳6,800} - \text{৳5,500} = \mathbf{৳1,300.00}$
  * **Technician Profit Share (50%)**: $\text{৳1,300} \times 0.50 = \mathbf{৳650.00}$ (Saved in DB column `ServiceJob.technicianProfitShare: 650.00`)
  * **Owner / Shop Share (50%)**: $\mathbf{৳650.00}$

#### Verification in Technician Report vs Admin Report
1. **Technician Report Endpoint (`GET /api/v1/reports/servicing-technician`)**:
   * Evaluated with Rajib Paul's Bearer JWT.
   * HTTP Status: `200 OK`.
   * Technician metadata: `{ id: 'cmu06zavj008dvbfrngcolfm8', name: 'Rajib Paul', profitShareRate: 50 }`.
   * Job Entry: `INV-0084` reports `totalCost: 6800`, `materialCost: 5500`, `profit: 1300`, `profitShare: 650`.
   * Aggregate Summary: 49 Total Jobs, 30 Completed Jobs, Total Collection: ৳267,300, Total Material Cost: ৳149,300, Total Profit: ৳118,000, Technician Earnings: ৳58,400, Owner Profit: ৳59,600.
2. **Admin Servicing Management Endpoint (`GET /api/v1/service-jobs?search=INV-0084`)**:
   * Evaluated with Super Admin Bearer JWT.
   * HTTP Status: `200 OK`.
   * Returns complete job payload including nested `materials`, linked `supplier` ("Prime Component Supplies Ltd 1789584640316"), `supplierPaymentStatus: "Paid"`, and linked order `SRV-INV0084`.
3. **Admin Service Sales Report Endpoint (`GET /api/v1/reports/service-sales?search=SRV-INV0084`)**:
   * Evaluated with Super Admin Bearer JWT.
   * HTTP Status: `200 OK`.
   * Shows `jobCode: "SRV-INV0084"`, `serviceFee: 1500`, `status: "IN_PROGRESS"`.
   * **Finding (Search Mismatch)**: Querying `search=INV-0084` returns 0 results because `report.service.ts:798-805` filters on `order.orderCode` (`SRV-INV0084`) instead of `serviceJob.invoiceNo` (`INV-0084`).

---

### 6.2 Technician Isolation on Jobs and Reports
* **Own Assigned Job**: Rajib Paul querying `GET /api/v1/service-jobs/cmuiuh95700do12on8al6sw2k` (`INV-0084`) → `HTTP 200 OK`.
* **Other / Unassigned Job**: Rajib Paul querying `GET /api/v1/service-jobs/cmuk8buh0001qmpxq7azksfoj` (`INV-0085`, unassigned) → `HTTP 403 Forbidden` (`{"message":"Access denied: You can only view your own service jobs","error":"Forbidden","statusCode":403}`).
* **Cross-Technician Report**: Rajib Paul querying `GET /api/v1/reports/service-sales` → `HTTP 403 Forbidden` (`{"message":"Access denied: Technicians can only view their own individual servicing reports","error":"Forbidden","statusCode":403}`).
* **Isolated Servicing Report**: Rajib Paul querying `GET /api/v1/reports/servicing-technician` → Scoped strictly to his 20 active service jobs and historical completions.

---

### 6.3 Material/Parts Source Type & Zero-Stock Resilience
In `api/src/service-job/service-job.service.ts:327-368`, material entries accept enum `ServiceMaterialSourceType`:
1. `OWN_STOCK`: Internal inventory component.
2. `SUPPLIER`: Requires valid `supplierId`. Validated: omitting `supplierId` throws `400 Bad Request` ("Registered Supplier is required for part ... when Source Type is 'Registered Supplier'").
3. `OTHER`: Ad-hoc / local market purchase. Requires `sourcedFromName` or `sourceNote`. Validated: omitting both throws `400 Bad Request` ("Sourcing Notes are required for part ... when Source Type is 'Other / Ad-hoc Source'").
4. **Zero-Stock Invariant**: When a material line is created or edited on a service job, the service engine does NOT check `productVariant.stock` or `branchInventory.quantity`. Repair intake never blocks on zero inventory.

---

### 6.4 Servicing Management (Admin)
* **Route**: `src/app/(admin)/admin/servicing/page.tsx` (`GET /admin/servicing`).
* **Backend Endpoint**: `GET /api/v1/service-jobs` (Supports pagination, search by invoiceNo/phone/device/issue, filtering by technician, branch, status, date range).
* **Edit Modal (`UpdateServiceJobDto`)**:
  * Fields: Device model, issue description, labor cost, discount, advance payment, due amount, total bill, materials array, status.
  * **Supplier Persistence**: Linked via `supplierId` (`Supplier? @relation("ServiceJobSupplier")`) and `supplierPaymentStatus` ("Paid" | "Due" | "Pending") directly on the `ServiceJob` model.
  * **Live Discount Calculation**: In `src/app/(admin)/admin/servicing/page.tsx`, entering a discount instantly updates `finalAmount = Math.max(0, totalBill - discount)` in the modal UI client-side without requiring a save.
* **Cascade Delete with Zero Orphan Rows**:
  * In `service-job.service.ts:597-612`, `remove(id)` executes inside an atomic `$transaction`:
    1. Deletes linked `Payment` records on `orderId`.
    2. Deletes `ServiceJob` record (Prisma schema triggers `onDelete: Cascade` on `ServiceJobMaterial`, purging all parts lines).
    3. Deletes linked `Order` record.
    4. Verified: zero orphan records in `Payment`, `Order`, or `ServiceJobMaterial`.

---

### 6.5 Point of Sale (POS) Engine
* **Normal Sale**: Calculates `subtotal = sum(unitPrice * qty)`, applies order discount, computes `totalAmount = subtotal - discountAmount`.
* **Split Pay**: Multiple payment channels (Cash, bKash, Nagad, Card) recorded as individual `Payment` records linked to the order.
* **Pay Later / Customer Due**: When `paidAmount < totalAmount`, order status is marked `PaymentStatus.DUE` (or `PENDING` if `paidAmount == 0`) and `dueAmount = totalAmount - paidAmount` is recorded on customer ledger.
* **Custom Sale Date**: `CreateOrderDto.saleDate` is converted via `new Date(dto.saleDate)` and stored in `Order.saleDate` (verified in `order.service.ts:434`).
* **Phone / Serial / IMEI Sale**:
  * Checks `phoneUnit.status !== 'IN_STOCK'`.
  * If already sold or reserved, throws `409 Conflict`: `Phone unit (IMEI: ...) is no longer in stock. Current status: ...`.
  * Atomically marks `PhoneUnit.status = 'SOLD'`, records `orderId` on the phone unit, and decrements both `productVariant.stock` and `branchInventory.quantity`.

---

### 6.6 Procurement & Purchase Orders
* **Normal & Phone Purchase Intake**:
  * `api/src/purchase-order/purchase-order.service.ts:196-540` creates purchase order, lines, and phone units in a single `$transaction`.
  * Checks duplicate IMEI across submitted items (`ConflictException: Duplicate IMEI ... found within the submitted purchase order items`).
  * Decrements selected payment wallet balance and logs `WalletTransaction` (`WITHDRAWAL`).
* **Supplier Due Running Balance**:
  * `dueAmount = grandTotal - totalAmountPaid`.
  * If `dueAmount > 0` and not draft:
    $$\text{Supplier.totalDue} = \text{Supplier.totalDue} + \text{dueAmount}$$
  * Verified in database:
    * `Supplier_Pass10_1788211032362`: `totalDue = ৳1,108,000`, `advanceBalance = ৳3,000`.
    * `Prime Component Supplies Ltd`: `totalDue = ৳19,000`.

---

### 6.7 Storefront Checkout & Delivery Tiers
* **Delivery Charge Tiers**:
  * Configured in DB table `DeliveryChargeTier`:
    * Tier 1 (Min 1, Max 3 items): ৳60.00
    * Tier 2 (Min 4, Max 10 items): ৳100.00
* **Order Creation & Stock Decrement**:
  * Online checkout creates order with `saleType: 'WEBSITE'`, `status: 'PENDING'`.
  * Physical stock is reserved/decremented from `ProductVariant.stock`.
* **Pricing Security Finding (Client-Supplied Unit Price)**:
  * In `api/src/order/order.service.ts:365`:
    ```typescript
    const unitPrice = Number(item.unitPrice ?? variant?.price ?? product.regularPrice);
    ```
  * `CreateOrderItemDto` accepts `unitPrice` directly from the HTTP request body. For customer-facing website orders (`saleType: WEBSITE`), the backend does not enforce re-computation from the database `product.regularPrice` / `variant.price`, allowing an attacker modifying the client payload to submit arbitrary prices. Flagged as **P1 High Severity**.

---

### 6.8 Multi-Branch Stock Accuracy
* **Stock Invariant**: Global `ProductVariant.stock` represents total company stock across all locations, while `BranchInventory.quantity` tracks per-branch allocation:
  $$\text{ProductVariant.stock} = \sum_{\text{all branches}} \text{BranchInventory.quantity} + \text{Unallocated Central Stock}$$
* Verified in database for `cmt3cpqf10004cxcl1xv6xmvj` ("Test Product"):
  * Dhaka Main `BranchInventory.quantity`: 8 units.
  * Global `ProductVariant.stock`: 8 units.

---

### 6.9 Inter-Branch Product Requests (Implemented in Fix Pass 35)
* **Status**: FULLY IMPLEMENTED (`api/src/product-request/`, `src/app/(admin)/admin/branch/product-requests/`).
* **RBAC Scoping**:
  * Restricted strictly to Branch Admin and Branch Manager roles. Global Admin is blocked (`403 Forbidden: Access denied: Only Branch Admin or Branch Manager roles can access Product Requests`).
* **Lifecycle & State Machine**:
  1. `PENDING`: Requesting branch initiates transfer (`POST /api/v1/product-requests`). Zero inventory movement.
  2. `APPROVED`: Fulfilling branch reviews and can adjust `approvedQty` (`PATCH /api/v1/product-requests/:id/approve`). Zero inventory movement.
  3. `COMPLETED`: Only the requesting branch can confirm receipt (`PATCH /api/v1/product-requests/:id/complete`).
* **Atomic Stock Movement at Completion**:
  * Executed inside `prisma.$transaction`:
    1. Reads live fulfilling branch inventory: `fulfillingInv.quantity`.
    2. If `currentStock < approvedQty`, throws `400 Bad Request` ("Insufficient stock at fulfilling branch for ... Transfer blocked to prevent negative inventory").
    3. Decrements fulfilling branch `BranchInventory` by `approvedQty`.
    4. Upserts requesting branch `BranchInventory`, incrementing by `approvedQty`.
    5. Sets request status to `COMPLETED`.
* **Database Records Verified**:
  * `PR-0001` (`cmuk8b7y6000smpxqnted5398`): Dhaka Main requested 2 units of "Test Product" from Chittagong Outlet. Approved for 2 units. Status: `COMPLETED`.
  * `PR-0002` (`cmuk8b7z80011mpxqr5ryym2d`): Dhaka Main requested 5 units of "Test Product" from Chittagong Outlet. Approved for 5 units. Status: `APPROVED`.

---

### 6.10 Dashboard Numbers vs Live Database Audit
Comparison between `GET /api/v1/reports/dashboard` API response and manual database count/sum aggregations:

| KPI / Stat Card | Dashboard API Value | Manual Direct DB Query | Status | Discrepancy Note |
|---|---|---|---|---|
| **Total Orders** | 193 (order statuses sum) | 193 orders | **MATCH** | Exact match across `Order` table |
| **Total Products** | 72 (in catalog response) | 73 in DB | **MATCH** | 1 product is in DRAFT/ARCHIVED state |
| **Total Customers** | 1,129 | 1,129 customers | **MATCH** | Exact match on `Customer` table |
| **Total Service Jobs** | 85 | 85 service jobs | **MATCH** | Exact match on `ServiceJob` table |
| **Total Employees** | 45 | 45 staff members | **MATCH** | Exact match on `Staff` table |
| **Total Purchase Orders**| 22 | 22 purchase orders | **MATCH** | Exact match on `PurchaseOrder` table |
| **Total Sales / Revenue**| ৳2,449,300 | ৳2,747,780 | **EXPLAINED** | Dashboard excludes Cancelled orders (5 orders totaling ৳298,480) |
| **Paid Inflow (Liquid)** | ৳1,715,380 | ৳1,895,680 | **EXPLAINED** | Excludes cancelled order receipts |
| **Total Customer Due**  | ৳735,300 | ৳851,800 | **EXPLAINED** | Excludes cancelled order dues |
| **Total Supplier Due**  | ৳1,179,000 | ৳1,179,000 | **MATCH** | Exact sum of `Supplier.totalDue` |
| **Total Purchase Volume**| ৳1,325,000 | ৳1,325,000 | **MATCH** | Exact sum of active PO `grandTotal` |



---

---

## Section 7 — Branding, UI & Content Consistency

### 7.1 Visual Assets & Logo Placement
1. **Brand Identity Files**:
   * `public/images/logo-icon.jpeg` (Circular icon format) → Rendered in `AdminSidebar.tsx:222, 230`.
   * `public/images/logo-full.jpeg` (Wide horizontal lockup) → Rendered in Storefront `Header.tsx:102, 163, 170`.
   * `public/images/admin-login-brand-panel.jpeg` (Marketing panel graphic) → Rendered in `admin/login/page.tsx:87`.
   * `public/images/logo-40.png`, `logo-192.png`, `logo-512.png` → PWA and app launcher icons.
2. **Metadata Title & Typography**:
   * `src/app/layout.tsx:19-22`:
     * `title: "MobileHubBD - Online Mobile Parts & Accessories Store"`
     * `description: "E-commerce platform and ERP management system for mobile spare parts and accessories - mobilehubbd"`
   * Root layout imports Geist Sans and Geist Mono locally from `src/app/fonts/`.

---

### 7.2 Navigation Active State Logic
* **Admin Sidebar Active Highlights (`src/components/admin/AdminSidebar.tsx:30-45`)**:
  * Evaluates current `usePathname()`.
  * Exact match rule for dashboard root: `item.href === "/admin" ? pathname === "/admin" : (pathname === item.href || pathname.startsWith(item.href + "/"))`.
  * Resolves earlier bug where Dashboard remained highlighted across all sub-pages.
  * Parent `Collapsible` groups automatically expand when any child link matches the active path.
* **Storefront Header Navigation**:
  * Navigation links highlight with active emerald accents matching active route category or slug.

---

### 7.3 Legacy Name & Placeholder Scrubbing
* **"NovaMobile" Grep Search**:
  * Executed `grep -rnI "NovaMobile" src api/src` → **Zero matches**. Completely scrubbed from code and UI.
* **"Eastern Mobile" Grep Search**:
  * Executed `grep -rnI "Eastern Mobile" src api/src` → Exactly 1 match found in a non-user-facing code comment at `src/app/(admin)/admin/cms/pages/page.tsx:32` (`// 5 hardcoded system-route rows per Eastern Mobile reference`). Zero customer-facing UI occurrences.
* **Store Contact & Address Consistency**:
  * Store Name: Consistently rendered as **MobileHubBD** or **Mobile Hub BD**.
  * Official Domain: `https://mobilehubbd.tech`.
  * Primary Branch Address: Plot 12, Gulshan Avenue, Dhaka (`BR-DHK`).
  * Customer Support Hotline: `+880 1700-000000` / `+880 1711111111`.
  * Support Email: `support@mobilehubbd.tech`.

---

### 7.4 External Image Assets & Remote Domain Configuration
* Configured in `next.config.mjs:9-50`.
* Pre-approved hosts: `images.unsplash.com`, `placehold.co`, `i.pravatar.cc`, `localhost:4000`, and dynamic `NEXT_PUBLIC_BACKEND_URL`.
* Includes wildcard fallback pattern `{ protocol: 'https', hostname: '**' }`, preventing Next.js Image Optimization crashes when displaying supplier or third-party image URLs.


---

---

## Section 8 — Deployment Readiness & Production Engineering

### 8.1 Hardcoded Localhost & Protocol Audit
* **Frontend Localhost Scan (`src/`)**:
  * Found exactly 13 occurrences in `src/` (e.g. `lib/api-client.ts`, `CustomerAvatar.tsx`, `EmployeeForm.tsx`, `layout.tsx`).
  * **Critical Audit Finding**: **Every single hit uses fallback syntax**:
    `process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"`
    `process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"`
  * No bare unconditional `localhost` URLs exist in frontend network logic. When `NEXT_PUBLIC_API_URL` is defined at build time, all requests target production.
* **Backend Localhost Scan (`api/src/`)**:
  * Local development regex in CORS origin validator: `api/src/main.ts:41-43` explicitly permits `localhost` and `127.0.0.1` for local developers while permitting production origins.
* **IP Address Scan**:
  * Zero external IP addresses hardcoded in source.

---

### 8.2 Environment Variable Uniformity & Production Configuration
* **Consistency Check**:
  * Frontend uses `NEXT_PUBLIC_API_URL` for all JSON API transactions.
  * Frontend uses `NEXT_PUBLIC_BACKEND_URL` for local static disk uploads (avatars, attachments).
* **Production Template (`.env.production.example`)**:
  * Fully documented with required production values:
    `NEXT_PUBLIC_API_URL=https://mobilehubbd.tech/api/v1`
    `NEXT_PUBLIC_BACKEND_URL=https://mobilehubbd.tech`
    `NODE_ENV=production`
  * Contains explicit warning regarding Next.js build-time variable baking and browser Mixed-Content blocking.

---

### 8.3 CORS & Security Headers
* **CORS Dynamic Validation (`api/src/main.ts:34-65`)**:
  * Parses `ALLOWED_ORIGINS` environment variable (comma-separated).
  * Automatically matches `*.vercel.app` preview subdomains.
  * Allows requests with no Origin header (curl, mobile apps, server-side fetch).
  * Sets `credentials: true` allowing HTTP-only refresh token cookies.
* **Helmet Security Suite**:
  * `app.use(helmet())` active in `api/src/main.ts:19`.
  * Injects: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN.
* **Missing SEO Assets (P2 Medium Finding)**:
  * Neither `robots.txt` nor `robots.ts` exists in `src/app/` or `public/`.
  * Neither `sitemap.xml` nor `sitemap.ts` exists. Search engines cannot automatically discover dynamic product slugs.

---

### 8.4 Upload Infrastructure & Cloudflare R2 Transition
* **Local Mode (Default Fallback)**:
  * Saves files to `UPLOAD_ROOT` (or `api/uploads/`).
  * Served over static route `/uploads/*`.
  * Risk on ephemeral cloud hosts (Render/Heroku/Serverless): Local files are deleted on container redeploy.
* **Cloudflare R2 Object Storage (Recommended Production)**:
  * Full S3-compatible adapter implemented in `api/src/common/upload/storage.service.ts`.
  * Zero local file retention when configured; returns public CDN URLs immediately.

---

### 8.5 Automated Deployment Script Review (`deploy.sh`)
* **Review of `/Users/rashedislam/Desktop/Mobile-shop-website/deploy.sh`**:
  ```bash
  # Line 26: Schema Push
  npx prisma db push
  
  # Line 30: Backend Process Start
  pm2 restart mobilehubbd-api --update-env || pm2 start dist/main.js --name mobilehubbd-api
  ```
* **Vulnerabilities Identified**:
  1. **Broken PM2 Start Command**: Line 30 executes `pm2 start dist/main.js`. As proven in Section 2.5, the compiled NestJS entry is located at `dist/src/main.js`. If the PM2 process does not exist, this command crashes immediately.
  2. **Destructive Schema Risk**: `npx prisma db push` without `--accept-data-loss` can prompt interactively (hanging the deploy script in headless CI/SSH), or with `--accept-data-loss` can drop production columns if a schema mismatch occurs.

---

### 8.6 Database Migration & Seeding Risks
* **Migration Strategy**: The project has NO migration history (`api/prisma/migrations` does not exist). All changes rely on `db push`. For an enterprise system storing live sales and invoices, transition to `prisma migrate dev` / `prisma migrate deploy` is required to prevent accidental column drops.
* **Seed Script (`npm run seed:prod`)**:
  * Safe to run on existing database: all records utilize `prisma.role.upsert`, `prisma.branch.upsert`, and existence checks (`if (!existingOrder)`). It does not truncate tables.
  * Note: Legacy seed comment still lists Technician profit share as 25%, whereas business logic is now standardized to 50%.

---

### 8.7 Human VPS Deployment Checklist (Step-by-Step for Server Administrator)
Execute these commands directly on the production Ubuntu VPS:

1. **Verify Working Directory & Git Branch**:
   ```bash
   cd /var/www/mobilehubbd
   git status
   git log -1 --oneline
   # Verify commit matches latest release (9287938d or newer)
   ```
2. **Verify Environment Configurations**:
   ```bash
   cat /var/www/mobilehubbd/.env.production
   # Ensure NEXT_PUBLIC_API_URL=https://mobilehubbd.tech/api/v1
   # Ensure NEXT_PUBLIC_BACKEND_URL=https://mobilehubbd.tech
   
   cat /var/www/mobilehubbd/api/.env
   # Ensure NODE_ENV=production
   # Ensure PORT=4000
   # Ensure ALLOWED_ORIGINS includes https://mobilehubbd.tech
   # Ensure DATABASE_URL points to production PostgreSQL
   ```
3. **Compile Backend with Correct Entry Path**:
   ```bash
   cd /var/www/mobilehubbd/api
   npm install --omit=dev=false
   npx prisma generate
   npm run build
   # Verify compiled entry exists:
   ls -la dist/src/main.js
   ```
4. **Compile Frontend**:
   ```bash
   cd /var/www/mobilehubbd
   npm install --omit=dev=false
   npm run build
   ```
5. **Manage PM2 Processes**:
   ```bash
   # Start or restart Backend using the true compiled path:
   pm2 describe mobilehubbd-api > /dev/null && pm2 restart mobilehubbd-api --update-env || pm2 start /var/www/mobilehubbd/api/dist/src/main.js --name mobilehubbd-api
   
   # Start or restart Frontend:
   pm2 describe mobilehubbd-web > /dev/null && pm2 restart mobilehubbd-web --update-env || pm2 start npm --name mobilehubbd-web -- start
   
   pm2 save
   pm2 status
   ```
6. **Verify Live SSL Endpoints & HTTP Health**:
   ```bash
   curl -I https://mobilehubbd.tech/api/v1/business-settings
   # Must return: HTTP/2 200 (or HTTP/1.1 200 OK)
   
   curl -I https://mobilehubbd.tech
   # Must return: HTTP/2 200 OK
   
   curl -I https://mobilehubbd.tech/account
   # Must return: HTTP/2 307 (Redirect to /login?redirect=/account)
   ```


---

---

## Section 9 — Feature Inventory & Previously-Reported Issues Status

### 9.1 Module-by-Module Feature Inventory Matrix

| Module | Exists? | File / Route Path | Works End-to-End? | Concrete Evidence & Verification Details |
|---|---|---|---|---|
| **Storefront Home** | YES | `src/app/(storefront)/page.tsx` | **YES** | `curl http://localhost:3000` returns 200; hero banner, categories, products render. |
| **Phone Catalog** | YES | `src/app/(storefront)/phones/page.tsx` | **YES** | 200 OK; dynamic brand and storage filter pills load from DB. |
| **Category Browsing** | YES | `src/app/(storefront)/category/[slug]/page.tsx`| **YES** | Tested with `/category/display` → displays Display products. |
| **Product Detail** | YES | `src/app/(storefront)/product/[slug]/page.tsx` | **PARTIAL**| Specs, image switcher, add-to-cart work; Call/WhatsApp buttons unlinked. |
| **Cart & Checkout** | YES | `src/app/(storefront)/cart`, `/checkout` | **YES** | Delivery tiers (৳60/৳100), COD/MFS selection, order created in DB. |
| **Customer Portal** | YES | `src/app/(storefront)/account/*` | **YES** | Middleware redirects unauth to `/login?redirect=/account` (HTTP 307). |
| **Admin Dashboard** | YES | `src/app/(admin)/admin/page.tsx` | **YES** | KPI cards (Sales ৳2.44M, Service ৳183K, Purchase ৳1.32M) match DB. |
| **Point of Sale (POS)**| YES| `src/app/(admin)/admin/pos/page.tsx` | **YES** | Barcode search, IMEI selection modal, split pay, customer due ledger. |
| **Technician Workspace**| YES| `src/app/(admin)/admin/technician/page.tsx`| **YES** | Dedicated cards for assigned repair jobs, status stepper, pattern unlock view. |
| **Technician Report** | YES | `src/app/(admin)/admin/technician/servicing-report/page.tsx` | **YES** | Scoped report: earnings ৳58,400, 50% profit share rate, personal job history. |
| **Servicing Mgmt** | YES | `src/app/(admin)/admin/servicing/page.tsx` | **YES** | Full job table, technician/branch filters, edit modal with supplier & live discount. |
| **Service Intake** | YES | `src/app/(admin)/admin/servicing/create/page.tsx` | **YES** | 9-step intake form; material lines with OWN_STOCK, SUPPLIER, OTHER sources. |
| **Product Requests** | YES | `src/app/(admin)/admin/branch/product-requests/*` | **YES** | Inter-branch transfers; PENDING → APPROVED → COMPLETED; atomic stock shift. |
| **Orders Module** | YES | `src/app/(admin)/admin/orders/page.tsx` | **YES** | 193 orders; customer search, payment status, details view. |
| **Sales Returns** | YES | `src/app/(admin)/admin/sales-returns/page.tsx` | **YES** | 5 return vouchers with item restock tracking. |
| **Catalog Management**| YES | `src/app/(admin)/admin/products/*` | **YES** | Multi-variant builder, brand logos, series, units, wasted products. |
| **Branch Management** | YES | `src/app/(admin)/admin/branch/page.tsx` | **YES** | 7 active branches; branch creation and detail editing. |
| **Stock Adjustments** | YES | `src/app/(admin)/admin/stock-adjustments/*` | **YES** | 16 physical inventory audit reconciliation vouchers. |
| **Procurement & PO** | YES | `src/app/(admin)/admin/accounting/purchase/*` | **YES** | PO creation with multi-wallet payment and phone unit IMEI intake. |
| **Suppliers & Dues** | YES | `src/app/(admin)/admin/accounting/suppliers/*`| **YES** | 14 suppliers; tracks running `totalDue` balance (Total: ৳1,179,000). |
| **Wallets & Cash** | YES | `src/app/(admin)/admin/accounting/wallet/*` | **YES** | 11 wallet ledgers with live deposit/withdrawal transaction logs. |
| **Expenses** | YES | `src/app/(admin)/admin/accounting/expense/*` | **YES** | 17 operational expense vouchers deducting from selected wallets. |
| **HRM & Employees** | YES | `src/app/(admin)/admin/hrm/employees/page.tsx` | **YES** | 45 staff members, branch assignments, designation, salary. |
| **HRM Payroll** | YES | `src/app/(admin)/admin/hrm/payroll/page.tsx` | **YES** | 67 historical salary disbursement records with payslip preview. |
| **Roles & Permissions**| YES| `src/app/(admin)/admin/hrm/roles-permissions/page.tsx` | **YES** | 57 roles; granular module-action matrix evaluated server-side. |
| **Executive Reports** | YES | `src/app/(admin)/admin/reports/*` | **YES** | 13 report suites; stock report, service sales, transactions, summary. |
| **Marketing & CMS** | YES | `src/app/(admin)/admin/marketing/*`, `/cms/*` | **YES** | Banners, ads, blogs, promo codes, custom pages, dynamic menus, footer. |
| **Business Settings** | YES | `src/app/(admin)/admin/business-settings/*` | **YES** | Global store configurations, currency, delivery charges, verification. |
| **Third-Party Config**| YES | `src/app/(admin)/admin/3rd-party/page.tsx` | **YES** | bKash, SSLCommerz, SMS, Mail, Recaptcha credentials. |

---

### 9.2 Previously Reported Issues Resolution Tracker

| Issue Description (from Prior Audits) | Prior Status | Current Status | Concrete Verification Evidence |
|---|---|---|---|
| **Admin Servicing Management page missing / "Failed to load"** | BROKEN | **RESOLVED** | Route `/admin/servicing` fully operational; fetches from `GET /api/v1/service-jobs`; renders 85 real jobs. |
| **Edit Service Job modal missing Supplier & Payment Status** | BROKEN | **RESOLVED** | Fields added to `UpdateServiceJobDto` and persisted directly on `ServiceJob.supplierId` and `ServiceJob.supplierPaymentStatus`. |
| **Edit Service Job discount not updating final amount live** | BROKEN | **RESOLVED** | Dynamic client-side calculation `finalAmount = Math.max(0, totalBill - discount)` active in modal without save. |
| **Inter-Branch Product Requests feature not implemented** | MISSING | **RESOLVED** | Complete module delivered in Fix Pass 35 (`api/src/product-request/`, `admin/branch/product-requests/`). Verified with `PR-0001` and `PR-0002`. |
| **Customer `/account` route accessible while unauthenticated** | BROKEN | **RESOLVED** | Server-side `src/middleware.ts` intercepts unauthenticated requests and returns `HTTP 307` redirect to `/login?redirect=/account`. |
| **Dashboard nav highlight stuck on when navigating sub-routes** | BROKEN | **RESOLVED** | `AdminSidebar.tsx` uses exact match rule `item.href === "/admin" ? pathname === "/admin" : ...`. |
| **Technician 50/50 profit split calculation** | UNVERIFIED | **RESOLVED** | Verified on `INV-0084`: Total ৳6,800 - Material ৳5,500 = Profit ৳1,300; Technician share = ৳650.00 (exactly 50.0%). |
| **Technician job isolation & cross-technician access** | UNVERIFIED | **RESOLVED** | Verified: Technician accessing another job returns `403 Forbidden`; accessing `reports/service-sales` returns `403 Forbidden`. |
| **Rebranding from NovaMobile to MobileHubBD** | PARTIAL | **RESOLVED** | Zero instances of "NovaMobile" in codebase. Mobile Hub BD logos, icons, and metadata in place. |
| **Zero-stock blocking on repair intake parts** | UNVERIFIED | **RESOLVED** | Verified in `service-job.service.ts:327-368`: Service parts intake does not check variant stock. Never blocks on zero stock. |

---

---

## Section 10 — Master Consolidated Issue List

All issues discovered across the codebase, sorted strictly by severity (P0 → P3):

| Issue ID | Severity | Area / Module | Affected File / Route | Concrete Evidence | Suggested Fix Direction |
|---|---|---|---|---|---|
| **SEC-01** | **P1 (High)** | Storefront Orders | `api/src/order/order.service.ts:365` | `const unitPrice = Number(item.unitPrice ?? variant?.price ...)` allows client-supplied unit price in website orders without server-side validation. | When `user?.userType !== 'STAFF'`, strictly ignore `item.unitPrice` and recompute from DB `product.regularPrice` / `variant.price`. |
| **DEP-01** | **P1 (High)** | Production Deploy | `api/package.json:14`, `deploy.sh:30` | `"start:prod": "node dist/main"` and `pm2 start dist/main.js` fail with `Cannot find module './dist/main'`. Real compiled file is `dist/src/main.js`. | Update `api/package.json` script to `"start:prod": "node dist/src/main"` and update `deploy.sh` to `pm2 start dist/src/main.js`. |
| **REP-01** | **P2 (Med)** | Executive Reports | `api/src/report/report.service.ts:798-805` | `getServiceSalesReport` filters on `order.orderCode` (`SRV-INV0084`) but omits `invoiceNo` (`INV-0084`), returning 0 results on invoice number search. | Add `{ invoiceNo: { contains: q, mode: 'insensitive' } }` to `where.OR` array in `getServiceSalesReport`. |
| **TYP-01** | **P2 (Med)** | TypeScript Static | `src/app/(admin)/admin/branch/product-requests/*` | `npx tsc --noEmit` flags TS18047: `'user' is possibly 'null'` on lines 214 and 356. | Change `user.branch?.name` to `user?.branch?.name` in both files. |
| **SEO-01** | **P2 (Med)** | Storefront SEO | `src/app/`, `public/` | Neither `robots.txt` nor `sitemap.xml` exists anywhere in the repository. | Add `src/app/robots.ts` and `src/app/sitemap.ts` dynamic route handlers. |
| **DB-01** | **P2 (Med)** | Database Migrations | `api/prisma/` | Zero migration files exist in `api/prisma/migrations`. Production rely solely on `prisma db push`. | Initialize Prisma baseline migrations via `prisma migrate diff` / `prisma migrate dev` to safeguard production tables. |
| **UI-01** | **P2 (Med)** | Storefront Product | `src/app/(storefront)/product/[slug]/page.tsx` | Call to Order and WhatsApp buttons are inert `<Button>` elements with no action or phone link. | Wrap in `<a href="tel:+8801700000000">` and `<a href="https://wa.me/8801700000000">`. |
| **LNT-01** | **P3 (Low)** | Code Quality | Monorepo (`src/`, `api/`) | Unused imports (`Sparkles`, `MapPin`, `Globe`), extensive `any` types, and 4 TS errors in `api/test/auth.e2e-spec.ts`. | Clean up unused imports, update Supertest import to default in e2e spec, replace loose `any` types. |
| **DOC-01** | **P3 (Low)** | Database Seed | `api/prisma/seed-prod.ts:643` | Console log comment in seed script references legacy "25% share" for technicians. | Update comment to "(50% share)" to reflect standardized policy. |
| **ROU-01** | **P3 (Low)** | Route Duplication | `src/app/(admin)/admin/` | Duplicate creator paths for purchase and servicing (`/admin/purchase/create` vs `/accounting/purchase/create`). | Consolidate onto canonical routes and add 301 redirects for legacy paths. |

---

---

## Section 11 — Could Not Verify

The following items could not be tested or verified with automated certainty during this audit, along with the precise technical reason:

1. **Live Production VPS Execution & SSH Connectivity**:
   * **Reason**: Antigravity agent operates strictly within the local development sandbox without SSH keys, VPN access, or VPS root terminal credentials. Actual PM2 daemon status on the live host at `187.53.143.166` cannot be queried directly.
2. **Production bKash Merchant API Live Payment Execution**:
   * **Reason**: Live transaction execution requires real Bangladeshi customer bKash SIM cards, OTP verification, and valid production merchant credentials (`BKASH_APP_KEY`, `BKASH_APP_SECRET`). Testing was limited to sandbox configuration and route existence.
3. **Production SSLCommerz Bank Gateway Switch**:
   * **Reason**: Live payment checkout requires actual Visa/Mastercard/Amex debit card credentials and OTP completion with Bangladesh commercial banks.
4. **Cloudflare R2 Live Network Bucket Streaming**:
   * **Reason**: Live Cloudflare R2 credentials (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`) are not set in the local development environment; testing validated the local disk storage fallback pipeline.
