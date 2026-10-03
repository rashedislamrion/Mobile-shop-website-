# MobileHubBD — Master Ground-Truth Project Analysis & Architecture Blueprint

> **Authoritative Technical Documentation & Implementation Catalog**  
> **Last Updated**: Fix Pass 34 (September 2026)  
> **Repository**: `Mobile-shop-website` (MobileHubBD Enterprise Monorepo)  
> **Frontend**: Next.js 14.2.35 (React 18, TypeScript 5, Tailwind CSS, Radix UI) → `http://localhost:3000`  
> **Backend API**: NestJS 11.0.1 (Prisma 5.22, PostgreSQL, Passport JWT) → `http://localhost:4000/api/v1`  
> **Universal Demo Password**: `Admin@12345`

---

## Table of Contents
1. [Executive Summary & Business Domain](#1-executive-summary--business-domain)
2. [Technology Stack & Repository Layout](#2-technology-stack--repository-layout)
3. [Database Architecture & Core Domain Models](#3-database-architecture--core-domain-models)
4. [Complete Frontend Page Inventory (Every Page & Route)](#4-complete-frontend-page-inventory-every-page--route)
   - [4.1 Point of Sale (POS) & Cashier Desk](#41-point-of-sale-pos--cashier-desk)
   - [4.2 Device Servicing & Repair Center](#42-device-servicing--repair-center)
   - [4.3 Technician Workspace & Reports](#43-technician-workspace--reports)
   - [4.4 Sales & Order Management](#44-sales--order-management)
   - [4.5 Sales Returns & Trade-In Exchanges](#45-sales-returns--trade-in-exchanges)
   - [4.6 Product Catalog & Inventory Management](#46-product-catalog--inventory-management)
   - [4.7 Stock Auditing & Adjustments](#47-stock-auditing--adjustments)
   - [4.8 Procurement, Vendors & Suppliers](#48-procurement-vendors--suppliers)
   - [4.9 Accounting, Wallets & Operational Expenses](#49-accounting-wallets--operational-expenses)
   - [4.10 HRM, Employees & Multi-Line Payroll](#410-hrm-employees--multi-line-payroll)
   - [4.11 Customer Relationship Management (CRM)](#411-customer-relationship-management-crm)
   - [4.12 Executive Reports & Business Intelligence](#412-executive-reports--business-intelligence)
   - [4.13 Marketing & Content Management System (CMS)](#413-marketing--content-management-system-cms)
   - [4.14 Business Settings, Branch Administration & 3rd-Party Config](#414-business-settings-branch-administration--3rd-party-config)
   - [4.15 Customer Support & Staff Notes](#415-customer-support--staff-notes)
   - [4.16 Storefront E-Commerce Pages](#416-storefront-e-commerce-pages)
5. [Complete Backend API Endpoints & Controller Map (All 51 Controllers)](#5-complete-backend-api-endpoints--controller-map-all-51-controllers)
6. [Detailed Work Changelog (Fix Passes 20–34)](#6-detailed-work-changelog-fix-passes-2034)
7. [Core Business Logic, Financial Formulas & Invariants](#7-core-business-logic-financial-formulas--invariants)
8. [Role-Based Access Control (RBAC) & Verified Credentials](#8-role-based-access-control-rbac--verified-credentials)
9. [Local Execution & Production Deployment Guide](#9-local-execution--production-deployment-guide)

---

## 1. Executive Summary & Business Domain

### 1.1 What is MobileHubBD?
**MobileHubBD** (formerly NovaMobile) is an enterprise-grade omnichannel retail, repair servicing, and back-office management platform built specifically for multi-branch mobile phone chain stores, smartphone repair workshops, and gadget e-commerce operations in Bangladesh.

The platform unites four major systems into a cohesive application:
1. **Public E-Commerce Storefront**: Modern responsive customer portal featuring multi-criteria smartphone filtering, product comparison, dynamic cart, Cash on Delivery (COD) / MFS online payment gateways (bKash & SSLCommerz), customer account dashboard, order tracking, and support ticketing.
2. **Point of Sale (POS) Terminal**: High-speed cashier desk designed for retail counters. Supports physical barcode scanning, IMEI/Serial number assignment for mobile handsets, warranty tier selection, multi-channel split payments (Cash, bKash, Nagad, Bank Card), customer due tracking, pixel-accurate Color/Quality attribute variant picker modal, and a dedicated **POS Technician Mode** for instant repair intake.
3. **Device Repair & Servicing Center**: Full 9-section repair intake workflow (device condition, problem tags, security pattern/PIN, accessories checklist, labor charge, material sourcing history with `OWN_STOCK`, `SUPPLIER`, and `OTHER` sources), Global Admin Servicing management with multi-criteria filtering, dedicated **Technician Workspace** with interactive job cards, and automated **50/50 technician profit sharing**.
4. **Enterprise Back-Office ERP**: Multi-branch inventory tracking, serial/IMEI auditing, vendor procurement and supplier due running balances, double-entry expense and wallet accounting, dynamic custom role-based access control (RBAC), HRM & unified multi-line payroll, automated financial auditing, and CMS/marketing management.

---

## 2. Technology Stack & Repository Layout

### 2.1 Monorepo Structure
```
Mobile-shop-website/
├── src/                                  # Next.js 14 Frontend Application
│   ├── app/                              # Next.js App Router (135 Page Routes)
│   │   ├── (admin)/admin/                # 111 Admin & Back-Office Page Routes
│   │   └── (storefront)/                 # 24 Customer Storefront Page Routes
│   ├── components/                       # Shared UI & Admin Components
│   │   ├── admin/                        # Admin sidebars, topbar, modals, data tables
│   │   │   ├── hrm/                      # AddSalaryPayrollModal.tsx (Fix Pass 22)
│   │   │   ├── pos/                      # PosProductModal.tsx (Fix Pass 21), PosInvoiceModal.tsx
│   │   │   ├── servicing/                # ServiceMaterialHistoryPicker.tsx (Fix Pass 33)
│   │   │   ├── AdminSidebar.tsx          # Responsive navigation sidebar
│   │   │   └── AdminTopbar.tsx           # Global search, branch switcher, notification bell
│   │   ├── storefront/                   # Storefront header, footer, product grid, banners
│   │   └── ui/                           # Radix UI primitives & design tokens
│   ├── context/                          # React Contexts (AuthContext, AdminPageContext)
│   ├── hooks/                            # Custom React Hooks
│   ├── lib/                              # Utilities & Centralized API Client (`api-client.ts`)
│   └── types/                            # TypeScript interfaces & types
├── api/                                  # NestJS 11 Backend API Application
│   ├── prisma/                           # Database Schema & Seed Scripts
│   │   ├── schema.prisma                 # 82 PostgreSQL Data Models & 46 Enums
│   │   ├── seed.ts                       # Development seed script (Admin@12345)
│   │   └── seed-prod.ts                  # Production initial seed
│   ├── src/                              # 51 Feature Modules (Controller-Service-DTO)
│   ├── uploads/                          # Static file uploads directory
│   ├── docker-compose.yml                # Local PostgreSQL container definition
│   ├── .env                              # Backend environment configuration
│   └── package.json                      # NestJS Dependencies
├── public/                               # Static images, icons, and placeholder assets
├── scratch/                              # Audit runners & verification suites (MJS)
├── PROJECT_ANALYZE.md                    # Single authoritative project blueprint
└── package.json                          # Next.js Dependencies
```

### 2.2 Framework & Dependency Versions
- **Frontend Framework**: Next.js `14.2.35` (App Router)
- **Frontend Stack**: React `18.x`, TypeScript `5.x`, Tailwind CSS `3.4.1`, Radix UI Suite, Lucide React (`^1.31.0`), Sonner (Toasts)
- **Backend Framework**: NestJS `11.0.1` (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`)
- **Database & ORM**: PostgreSQL, Prisma ORM `5.22.0`
- **Authentication**: Passport.js, `@nestjs/passport`, `passport-jwt`, `@nestjs/jwt`, `bcrypt`
- **Security**: Helmet `8.3.0`, Compression, Cookie-Parser, `@nestjs/throttler`
- **Client Communication**: `src/lib/api-client.ts` centralizes `apiGet`, `apiPost`, `apiPatch`, `apiDelete` handling tokens, scopes, and direct JSON parsing.

---

## 3. Database Architecture & Core Domain Models

The database schema in `api/prisma/schema.prisma` contains **82 models** and **46 enums**:

| Domain | Key Models | Core Purpose |
| :--- | :--- | :--- |
| **Authentication & RBAC** | `Role`, `RolePermission`, `RoleBranchPermission`, `Staff`, `StaffBranchAccess`, `RefreshToken`, `PasswordResetToken` | Multi-branch staff login, dynamic permissions (Narrow Roles), JWT refresh rotation. |
| **Organization & Branches** | `Branch`, `Department` | Flagship, Outlet, and Warehouse branches; department hierarchy. |
| **Product Catalog & Specs** | `Product`, `ProductVariant`, `ProductImage`, `Category`, `Brand`, `Series`, `Unit`, `Attribute`, `AttributeValue`, `ProductSpecification` | Hierarchical categories, brands, series, color/quality attributes, and specs. |
| **Inventory & IMEI Tracking** | `BranchInventory`, `PhoneUnit`, `WantedProduct`, `WastedProduct`, `StockAdjustment`, `StockAdjustmentItem` | Stock counts per branch, unit-level IMEI tracking (`ACTIVE`, `SOLD`, `REPAIRED`, `DEFECTIVE`), physical inventory audits. |
| **Orders & Point of Sale** | `Order`, `OrderItem`, `OrderStatusHistory`, `OrderNote`, `Payment`, `PaymentAttempt` | In-store POS sales, online orders, split payments, cash/MFS/card reconciliation, customer dues. |
| **Repair & Servicing Center** | `ServiceJob`, `DeviceType`, `ServiceProblemType`, `ServiceWarrantyPeriod`, `ServiceJobMaterial` | 9-section repair intake, technician assignments, stock-independent parts history (`OWN_STOCK`, `SUPPLIER`, `OTHER`), 50/50 profit split. |
| **Returns & Exchanges** | `SalesReturn`, `SalesReturnItem`, `Exchange` | Product returns, customer refunds, device trade-ins and exchanges. |
| **Procurement & Vendors** | `Supplier`, `SupplierPayment`, `PurchaseOrder`, `PurchaseOrderItem` | Purchase orders from suppliers, payment logs, running supplier due ledger. |
| **Accounting & Wallets** | `WalletType`, `WalletTransaction`, `Purpose`, `ExpenseCategory`, `Expense` | Double-entry cash/bank wallets, internal money transfers, categorized operational expenses. |
| **HRM & Payroll** | `Payroll`, `Staff` | Salary calculation, commission tracking, bonus/deduction records, monthly payroll execution, multi-line wallet ledger dispatches. |
| **Customer Engagement** | `Customer`, `Address`, `CustomerActivity`, `Wishlist`, `Review`, `SupportTicket`, `SupportTicketMessage`, `HelpNote` | Customer CRM, 12 stat cards, order history, support ticket conversations. |
| **Marketing & CMS** | `Banner`, `Ad`, `PromoCode`, `PushNotification`, `BlogCategory`, `Blog`, `Page`, `MenuItem`, `FooterSettings`, `SocialLink`, `ContactSubmission` | Home sliders, promo codes, blog articles, custom CMS pages, header/footer navigation builders. |
| **Business Configurations** | `BusinessSetting`, `Currency`, `DeliveryChargeTier`, `PaymentGatewayConfig`, `SmsConfig`, `MailConfig`, `FirebaseConfig`, `RecaptchaConfig`, `MessageTemplate` | Global settings, currencies (BDT ৳), courier delivery tiers, SMS gateways (SSL Wireless/Greenweb), bKash/Nagad/SSLCommerz credentials. |

---

## 4. Complete Frontend Page Inventory (Every Page & Route)

Below is the complete, exhaustive index of every single page in the application, including file paths, operational responsibilities, connected backend APIs, and access requirements.

### 4.1 Point of Sale (POS) & Cashier Desk
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/pos` | `src/app/(admin)/admin/pos/page.tsx` | High-speed POS terminal. Barcode scan, product search, cart summary, discount, customer selection, split payments (Cash, bKash, Card), Color/Quality modal, IMEI assignment, and POS Technician Mode. | `GET /pos/products`, `POST /pos/sales`, `GET /pos/services`, `POST /pos/service-jobs`, `GET /customers`, `GET /phone-units/available` | `SALES:CREATE` |

### 4.2 Device Servicing & Repair Center
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/servicing` | `src/app/(admin)/admin/servicing/page.tsx` | **Admin Servicing Management Page**. Lists all repair jobs across branches. Filters: by technician, by branch, by status, by date range. Search bar (invoice, customer, phone, device). View modal, edit job details/pricing, hard delete with cascade removal. | `GET /service-jobs`, `GET /branches`, `GET /employees/technicians`, `PATCH /service-jobs/:id`, `DELETE /service-jobs/:id` | `SALES:READ` (Global & Branch Admin only; Technicians blocked) |
| `/admin/servicing/create` | `src/app/(admin)/admin/servicing/create/page.tsx` | **9-Section Repair Intake**. Customer info, device specs, condition, problem tags, lock PIN/pattern, accessories checklist, labor charge, material history (`OWN_STOCK`, `SUPPLIER`, `OTHER`), advance payment. | `GET /service-jobs/next-invoice-number`, `GET /service-lookups/*`, `GET /suppliers`, `POST /service-jobs/repair` | `SALES:CREATE` |
| `/admin/sales/service` | `src/app/(admin)/admin/sales/service/page.tsx` | Sales service list view showing service jobs originating from sales channels with status transitions. | `GET /service-jobs`, `PATCH /service-jobs/:id/status` | `SALES:READ` |
| `/admin/sales/service/create` | `src/app/(admin)/admin/sales/service/create/page.tsx` | Quick intake link directing to the comprehensive service intake form. | `GET /service-jobs/next-invoice-number` | `SALES:CREATE` |

### 4.3 Technician Workspace & Reports
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/technician` | `src/app/(admin)/admin/technician/page.tsx` | **Technician Personal Workspace**. Job cards filtered to logged-in technician only (`/service-jobs/my`). Status updates (`IN_PROGRESS`, `READY_FOR_PICKUP`, `DELIVERED`), interactive Job Detail modal with full diagnostics. | `GET /service-jobs/my`, `GET /service-jobs/:id`, `PATCH /service-jobs/:id/status` | `SALES:READ` (Technician Scope) |
| `/admin/technician/servicing-report` | `src/app/(admin)/admin/technician/servicing-report/page.tsx` | **Personal Servicing Financial Report**. Displays Total Repaired, Material Cost, Total Profit, and **"Your Profit" (50% share)**. Detail table with date filter and source badges. | `GET /reports/technician-servicing` | `REPORT:READ` (Technician Scope) |

### 4.4 Sales & Order Management
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/orders` | `src/app/(admin)/admin/orders/page.tsx` | Master order ledger. Filter by channel (Storefront, POS), payment status, fulfillment status, branch, date range. Invoice print trigger. | `GET /orders`, `GET /branches` | `ORDERS:READ` |
| `/admin/orders/[id]` | `src/app/(admin)/admin/orders/[id]/page.tsx` | Single order deep dive. Customer profile, itemized line items, assigned IMEI serials, payment split logs, delivery notes, status updater. | `GET /orders/:id`, `PATCH /orders/:id/status`, `POST /orders/:id/notes` | `ORDERS:READ`, `ORDERS:UPDATE` |
| `/admin/sales/all` | `src/app/(admin)/admin/sales/all/page.tsx` | Omnichannel sales list (POS + E-commerce). Search by invoice number, customer phone, date filtering, payment breakdown. | `GET /orders?type=all` | `SALES:READ` |
| `/admin/sales/courier` | `src/app/(admin)/admin/sales/courier/page.tsx` | Courier consignment assignment. Assign orders to Steadfast, Pathao, or RedX, track consignment numbers. | `GET /orders?fulfillment=COURIER`, `POST /shipments` | `SALES:UPDATE` |
| `/admin/sales/courier-list` | `src/app/(admin)/admin/sales/courier-list/page.tsx` | Dispatched courier tracking ledger with delivery status reconciliation. | `GET /shipments` | `SALES:READ` |
| `/admin/sales/diagnosing` | `src/app/(admin)/admin/sales/diagnosing/page.tsx` | Device diagnosing requests submitted via storefront or in-store counter. | `GET /service-jobs?type=diagnosing` | `SALES:READ` |

### 4.5 Sales Returns & Trade-In Exchanges
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/sales-returns` | `src/app/(admin)/admin/sales-returns/page.tsx` | Sales returns list. Restocked quantity, refund method (Cash/Wallet), return reason, invoice reference. | `GET /sales-returns` | `SALES_RETURN:READ` |
| `/admin/sales-returns/[id]` | `src/app/(admin)/admin/sales-returns/[id]/page.tsx` | Return voucher detail view with inspection notes and financial ledger adjustments. | `GET /sales-returns/:id` | `SALES_RETURN:READ` |
| `/admin/exchanges` | `src/app/(admin)/admin/exchanges/page.tsx` | Device trade-in and exchange list. Customer old device valuation vs new purchase adjustment. | `GET /exchanges` | `EXCHANGE:READ` |
| `/admin/exchanges/[id]` | `src/app/(admin)/admin/exchanges/[id]/page.tsx` | Exchange voucher details, inspection condition, IMEI of old vs new phone. | `GET /exchanges/:id` | `EXCHANGE:READ` |

### 4.6 Product Catalog & Inventory Management
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/products` | `src/app/(admin)/admin/products/page.tsx` | Master product catalog table. Stock status badges, price, category, brand, active status toggles. | `GET /products`, `PATCH /products/:id/toggle` | `PRODUCTS:READ` |
| `/admin/products/create` | `src/app/(admin)/admin/products/create/page.tsx` | Multi-tab product creation: basic info, categories, brand, variants (Color, Storage, Quality), IMEI tracking flag, images, SEO meta. | `GET /categories`, `GET /brands`, `GET /attributes`, `POST /products` | `PRODUCTS:CREATE` |
| `/admin/products/[id]/edit` | `src/app/(admin)/admin/products/[id]/edit/page.tsx` | Product editor: modify specs, update prices, add variants, manage media gallery. | `GET /products/:id`, `PATCH /products/:id` | `PRODUCTS:UPDATE` |
| `/admin/products/brands` | `src/app/(admin)/admin/products/brands/page.tsx` | Brand directory (Apple, Samsung, Xiaomi, etc.). Logo upload, website link, status. | `GET /brands`, `POST /brands`, `PATCH /brands/:id`, `DELETE /brands/:id` | `PRODUCTS:READ` |
| `/admin/products/series` | `src/app/(admin)/admin/products/series/page.tsx` | Product series hierarchy (e.g. iPhone 15 Series, Galaxy S Series). | `GET /series`, `POST /series`, `PATCH /series/:id` | `PRODUCTS:READ` |
| `/admin/category` | `src/app/(admin)/admin/category/page.tsx` | Hierarchical category builder with parent-child tree, icons, banners. | `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id` | `CATEGORY:READ` |
| `/admin/products/attributes` | `src/app/(admin)/admin/products/attributes/page.tsx` | Global attribute definitions (Color, Storage, RAM, Display Quality). | `GET /attributes`, `POST /attributes`, `DELETE /attributes/:id` | `PRODUCTS:READ` |
| `/admin/products/attributes/[id]/values` | `src/app/(admin)/admin/products/attributes/[id]/values/page.tsx` | Value management for an attribute (e.g., Color values: Deep Purple, Titanium). | `GET /attributes/:id/values`, `POST /attributes/:id/values` | `PRODUCTS:READ` |
| `/admin/products/units` | `src/app/(admin)/admin/products/units/page.tsx` | Measurement units (Pcs, Box, Set). | `GET /units`, `POST /units`, `DELETE /units/:id` | `PRODUCTS:READ` |
| `/admin/products/bulk` | `src/app/(admin)/admin/products/bulk/page.tsx` | Bulk CSV import/export for product catalog and initial inventory. | `POST /products/bulk-upload` | `PRODUCTS:CREATE` |
| `/admin/products/wanted` | `src/app/(admin)/admin/products/wanted/page.tsx` | Customer-requested out-of-stock items tracker. | `GET /wanted-products`, `POST /wanted-products` | `PRODUCTS:READ` |
| `/admin/products/wasted` | `src/app/(admin)/admin/products/wasted/page.tsx` | Damaged, defective, or scrapped inventory logging with reason codes. | `GET /wasted-products`, `POST /wasted-products` | `PRODUCTS:READ` |

### 4.7 Stock Auditing & Adjustments
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/stock-adjustments` | `src/app/(admin)/admin/stock-adjustments/page.tsx` | Physical stock audit history across branches. Discrepancy logs (excess vs shortage). | `GET /stock-adjustments`, `GET /branches` | `STOCK_ADJUSTMENT:READ` |
| `/admin/stock-adjustments/create` | `src/app/(admin)/admin/stock-adjustments/create/page.tsx` | Audit reconciliation intake. Scan existing products/IMEIs, enter actual physical count, auto-calculate variance. | `GET /branches`, `GET /products`, `POST /stock-adjustments` | `STOCK_ADJUSTMENT:CREATE` |

### 4.8 Procurement, Vendors & Suppliers
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/accounting/purchase` | `src/app/(admin)/admin/accounting/purchase/page.tsx` | Purchase order ledger. Track purchase date, supplier name, total amount, paid amount, and due balance. | `GET /purchases`, `GET /suppliers` | `PURCHASE:READ` |
| `/admin/accounting/purchase/create` | `src/app/(admin)/admin/accounting/purchase/create/page.tsx` | New Purchase Order creator. Supplier selection, line-item products, buying price, batch IMEI entry, payment draw from wallet. | `GET /suppliers`, `GET /products`, `GET /wallets`, `POST /purchases` | `PURCHASE:CREATE` |
| `/admin/accounting/purchase/[id]` | `src/app/(admin)/admin/accounting/purchase/[id]/page.tsx` | Purchase invoice deep dive showing received inventory, IMEI units registered, and payment receipts. | `GET /purchases/:id` | `PURCHASE:READ` |
| `/admin/purchase/create` | `src/app/(admin)/admin/purchase/create/page.tsx` | Redirect alias pointing to `/admin/accounting/purchase/create`. | - | `PURCHASE:CREATE` |
| `/admin/accounting/suppliers` | `src/app/(admin)/admin/accounting/suppliers/page.tsx` | Supplier directory. Contact person, phone, address, and live running due balance card. | `GET /suppliers` | `SUPPLIERS:READ` |
| `/admin/accounting/suppliers/create` | `src/app/(admin)/admin/accounting/suppliers/create/page.tsx` | Add new vendor/supplier form. | `POST /suppliers` | `SUPPLIERS:CREATE` |
| `/admin/accounting/suppliers/[id]` | `src/app/(admin)/admin/accounting/suppliers/[id]/page.tsx` | Supplier 360° ledger: all purchase history, payment logs, and current payable due balance. | `GET /suppliers/:id`, `GET /suppliers/:id/purchases`, `GET /suppliers/:id/payments` | `SUPPLIERS:READ` |
| `/admin/accounting/suppliers/[id]/edit` | `src/app/(admin)/admin/accounting/suppliers/[id]/edit/page.tsx` | Edit supplier contact details and company terms. | `GET /suppliers/:id`, `PATCH /suppliers/:id` | `SUPPLIERS:UPDATE` |
| `/admin/accounting/suppliers/payments` | `src/app/(admin)/admin/accounting/suppliers/payments/page.tsx` | Supplier payment history ledger with "Disburse Supplier Payment" modal drawing from cash/bank wallets. | `GET /suppliers/payments`, `POST /suppliers/payments`, `GET /wallets` | `SUPPLIERS:UPDATE` |

### 4.9 Accounting, Wallets & Operational Expenses
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/accounting/wallet` | `src/app/(admin)/admin/accounting/wallet/page.tsx` | Master Wallet dashboard. Live balance cards for Cash in Hand, Bank Accounts, bKash/Nagad merchant wallets. Filterable transaction ledger. | `GET /wallets`, `GET /wallet-transactions` | `WALLET:READ` |
| `/admin/accounting/wallet/types` | `src/app/(admin)/admin/accounting/wallet/types/page.tsx` | Configuration of wallet accounts (Cash Register, City Bank, bKash Merchant). | `GET /wallet-types`, `POST /wallet-types`, `PATCH /wallet-types/:id` | `WALLET:UPDATE` |
| `/admin/accounting/wallet/purposes` | `src/app/(admin)/admin/accounting/wallet/purposes/page.tsx` | Transaction categorization purposes (Salary, Utility, Vendor Payment). | `GET /wallet-purposes`, `POST /wallet-purposes` | `WALLET:READ` |
| `/admin/accounting/wallet/purpose` | `src/app/(admin)/admin/accounting/wallet/purpose/page.tsx` | Purpose management view alias. | `GET /wallet-purposes` | `WALLET:READ` |
| `/admin/accounting/wallet/transfers` | `src/app/(admin)/admin/accounting/wallet/transfers/page.tsx` | Internal fund transfers between wallets (e.g. Counter Cash to Bank Deposit). | `GET /wallet-transfers`, `POST /wallet-transfers` | `WALLET:UPDATE` |
| `/admin/accounting/wallet/deposits` | `src/app/(admin)/admin/accounting/wallet/deposits/page.tsx` | Capital injection and external deposit form. | `POST /wallet-deposits`, `GET /wallets` | `WALLET:UPDATE` |
| `/admin/accounting/wallet/deposit-history` | `src/app/(admin)/admin/accounting/wallet/deposit-history/page.tsx` | Historical record of external deposits. | `GET /wallet-deposits` | `WALLET:READ` |
| `/admin/accounting/wallet/lookup-types` | `src/app/(admin)/admin/accounting/wallet/lookup-types/page.tsx` | Financial lookup types directory. | `GET /wallet-lookup-types` | `WALLET:READ` |
| `/admin/accounting/expense/all` | `src/app/(admin)/admin/accounting/expense/all/page.tsx` | Operational expense management. Add expense modal with receipt upload, wallet deduction, category selector. | `GET /expenses`, `POST /expenses`, `GET /wallets`, `GET /expense-categories` | `EXPENSE:READ` |
| `/admin/accounting/expense/categories` | `src/app/(admin)/admin/accounting/expense/categories/page.tsx` | Expense categories directory (Rent, Electricity, Tea/Snacks, Marketing). | `GET /expense-categories`, `POST /expense-categories` | `EXPENSE:READ` |
| `/admin/accounting/expense/history` | `src/app/(admin)/admin/accounting/expense/history/page.tsx` | Filtered historical expense logs by date, branch, and category. | `GET /expenses/history` | `EXPENSE:READ` |

### 4.10 HRM, Employees & Multi-Line Payroll
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/hrm/employees` | `src/app/(admin)/admin/hrm/employees/page.tsx` | Staff directory table. Photo, Employee ID, designation, branch, base salary, status. | `GET /employees` | `HRM:READ` |
| `/admin/hrm/employees/create` | `src/app/(admin)/admin/hrm/employees/create/page.tsx` | Add employee form: personal details, role, branch assignment, salary breakdown (basic, allowances), technician flags. | `GET /roles`, `GET /branches`, `GET /departments`, `POST /employees` | `HRM:CREATE` |
| `/admin/hrm/employees/[id]/edit` | `src/app/(admin)/admin/hrm/employees/[id]/edit/page.tsx` | Employee profile editor: update compensation, status, branch permissions. | `GET /employees/:id`, `PATCH /employees/:id` | `HRM:UPDATE` |
| `/admin/hrm/departments` | `src/app/(admin)/admin/hrm/departments/page.tsx` | Department hierarchy (Sales, Technical, Accounts, Logistics). | `GET /departments`, `POST /departments`, `PATCH /departments/:id` | `HRM:READ` |
| `/admin/hrm/roles-permissions` | `src/app/(admin)/admin/hrm/roles-permissions/page.tsx` | **Custom Role Builder & Permission Matrix**. Matrix of all system modules vs CRUD actions. Branch scoping toggles. | `GET /roles`, `POST /roles`, `PATCH /roles/:id`, `GET /roles/:id/permissions`, `PUT /roles/:id/permissions` | `HRM:UPDATE` (Global Admin only) |
| `/admin/hrm/technicians` | `src/app/(admin)/admin/hrm/technicians/page.tsx` | Specialized technician list showing assigned branch, profit share rate (50%), active repair jobs count, completed jobs count. | `GET /employees/technicians` | `HRM:READ` |
| `/admin/hrm/payroll` | `src/app/(admin)/admin/hrm/payroll/page.tsx` | **Payroll Ledger & Payment History**. Summary cards: Total Paid, Monthly Budget. Search bar, wallet filter, date filter. Unified **"Add Salary / Payroll" modal** (`AddSalaryPayrollModal.tsx`). | `GET /payroll`, `GET /employees`, `GET /wallets`, `POST /wallet-transactions/disburse-staff-payment` | `HRM:READ`, `HRM:UPDATE` |
| `/admin/hrm/payroll/run` | `src/app/(admin)/admin/hrm/payroll/run/page.tsx` | Bulk monthly payroll runner. Computes net payable for all active staff, previews total wallet deductions, executes batch disbursement. | `GET /payroll/preview-monthly`, `POST /payroll/execute-monthly` | `HRM:UPDATE` |

### 4.11 Customer Relationship Management (CRM)
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/customers` | `src/app/(admin)/admin/customers/page.tsx` | Customer CRM directory. Customer name, phone, total orders, total spent, current due balance, loyalty points. | `GET /customers` | `CUSTOMERS:READ` |
| `/admin/customers/create` | `src/app/(admin)/admin/customers/create/page.tsx` | Add customer form with address, alternative phone, and initial opening balance. | `POST /customers` | `CUSTOMERS:CREATE` |
| `/admin/customers/[id]` | `src/app/(admin)/admin/customers/[id]/page.tsx` | **Customer 360° Profile with 12 Stat Cards**. Order history, repair jobs, due payments ledger, activity logs, address book. "Receive Due Payment" modal. | `GET /customers/:id`, `GET /customers/:id/summary`, `GET /customers/:id/orders`, `POST /customers/:id/payments` | `CUSTOMERS:READ` |
| `/admin/customers/[id]/edit` | `src/app/(admin)/admin/customers/[id]/edit/page.tsx` | Edit customer information and addresses. | `GET /customers/:id`, `PATCH /customers/:id` | `CUSTOMERS:UPDATE` |

### 4.12 Executive Reports & Business Intelligence
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` | `src/app/(admin)/admin/page.tsx` | **Executive Admin Dashboard**. 4 primary KPI cards (Total Sales, Revenue, Profits, Dues adhering to section 5 formulas), Sales trend chart, recent orders, fast action shortcuts. | `GET /reports/dashboard-stats`, `GET /orders/recent` | `REPORT:READ` |
| `/admin/reports/summary` | `src/app/(admin)/admin/reports/summary/page.tsx` | High-level financial reconciliation summary. Income vs COGS vs Expenses vs Net Profit. | `GET /reports/summary` | `REPORT:READ` |
| `/admin/reports/pos-sales` | `src/app/(admin)/admin/reports/pos-sales/page.tsx` | Detailed breakdown of in-store POS transactions by cashier, branch, and payment method. | `GET /reports/pos-sales` | `REPORT:READ` |
| `/admin/reports/pos` | `src/app/(admin)/admin/reports/pos/page.tsx` | Fast alias view for POS sales analytics. | `GET /reports/pos-sales` | `REPORT:READ` |
| `/admin/reports/website-sales` | `src/app/(admin)/admin/reports/website-sales/page.tsx` | E-commerce storefront sales performance: conversion rate, COD vs MFS gateway volumes. | `GET /reports/website-sales` | `REPORT:READ` |
| `/admin/reports/service-sales` | `src/app/(admin)/admin/reports/service-sales/page.tsx` | **Global Admin Service Sales Report**. High-level repair metrics: billings, material costs, gross servicing profit. | `GET /reports/service-sales` | `REPORT:READ` |
| `/admin/reports/purchase` | `src/app/(admin)/admin/reports/purchase/page.tsx` | Procurement expenditure report by supplier, product category, and payment method. | `GET /reports/purchase` | `REPORT:READ` |
| `/admin/reports/expense` | `src/app/(admin)/admin/reports/expense/page.tsx` | Operational expense breakdown with category distribution and monthly comparisons. | `GET /reports/expense` | `REPORT:READ` |
| `/admin/reports/transactions` | `src/app/(admin)/admin/reports/transactions/page.tsx` | Centralized financial audit trail. Every credit and debit across all wallets. | `GET /reports/transactions` | `REPORT:READ` |
| `/admin/reports/customer-due` | `src/app/(admin)/admin/reports/customer-due/page.tsx` | Aging report of all outstanding customer dues with quick WhatsApp/SMS reminder triggers. | `GET /reports/customer-due` | `REPORT:READ` |
| `/admin/reports/supplier-due` | `src/app/(admin)/admin/reports/supplier-due/page.tsx` | Supplier payable dues report with aging breakdown and payment scheduling. | `GET /reports/supplier-due` | `REPORT:READ` |
| `/admin/reports/courier` | `src/app/(admin)/admin/reports/courier/page.tsx` | Courier consignment reconciliation: COD collection, courier charges, return ratios. | `GET /reports/courier` | `REPORT:READ` |
| `/admin/reports/product-stock` | `src/app/(admin)/admin/reports/product-stock/page.tsx` | Live inventory valuation and stock levels across all branches. Low-stock warnings. | `GET /reports/product-stock` | `REPORT:READ` |
| `/admin/reports/product-analytics` | `src/app/(admin)/admin/reports/product-analytics/page.tsx` | Best-selling products, profit margin per item, dead-stock inventory identification. | `GET /reports/product-analytics` | `REPORT:READ` |
| `/admin/reports/discount` | `src/app/(admin)/admin/reports/discount/page.tsx` | Discount analytics: staff-applied manual discounts vs promo code deductions. | `GET /reports/discount` | `REPORT:READ` |

### 4.13 Marketing & Content Management System (CMS)
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/marketing/banners` | `src/app/(admin)/admin/marketing/banners/page.tsx` | Storefront hero carousel banners. Target URL, display order, active status. | `GET /banners`, `PATCH /banners/:id` | `PROMOTIONAL_BANNER:READ` |
| `/admin/marketing/banners/create` | `src/app/(admin)/admin/marketing/banners/create/page.tsx` | Banner upload form with desktop and mobile image crops. | `POST /banners` | `PROMOTIONAL_BANNER:CREATE` |
| `/admin/marketing/ads` | `src/app/(admin)/admin/marketing/ads/page.tsx` | Mid-page promotional popup and banner advertisements. | `GET /ads`, `PATCH /ads/:id` | `ADS:READ` |
| `/admin/marketing/ads/create` | `src/app/(admin)/admin/marketing/ads/create/page.tsx` | Create promotional advertisement form. | `POST /ads` | `ADS:CREATE` |
| `/admin/marketing/promo-code` | `src/app/(admin)/admin/marketing/promo-code/page.tsx` | Discount voucher codes directory. Percentage vs flat amount, minimum order, validity dates. | `GET /promo-codes`, `DELETE /promo-codes/:id` | `PROMO_CODE:READ` |
| `/admin/marketing/promo-code/create` | `src/app/(admin)/admin/marketing/promo-code/create/page.tsx` | Promo code creator. | `POST /promo-codes` | `PROMO_CODE:CREATE` |
| `/admin/marketing/push-notification` | `src/app/(admin)/admin/marketing/push-notification/page.tsx` | Broadcast push notification sender to registered mobile and web users. | `POST /push-notifications/send` | `CMS:UPDATE` |
| `/admin/marketing/blogs` | `src/app/(admin)/admin/marketing/blogs/page.tsx` | Blog articles management. Category, publication status, view count. | `GET /blogs`, `DELETE /blogs/:id` | `BLOGS:READ` |
| `/admin/marketing/blogs/create` | `src/app/(admin)/admin/marketing/blogs/create/page.tsx` | Blog authoring form with rich text content, thumbnail upload, SEO tags. | `GET /blog-categories`, `POST /blogs` | `BLOGS:CREATE` |
| `/admin/marketing/blogs/[id]/edit` | `src/app/(admin)/admin/marketing/blogs/[id]/edit/page.tsx` | Blog post editor. | `GET /blogs/:id`, `PATCH /blogs/:id` | `BLOGS:UPDATE` |
| `/admin/cms/pages` | `src/app/(admin)/admin/cms/pages/page.tsx` | Custom static pages directory (About Us, Warranty Policy, Privacy, Terms). | `GET /pages` | `CMS:READ` |
| `/admin/cms/pages/create` | `src/app/(admin)/admin/cms/pages/create/page.tsx` | Create static CMS page form. | `POST /pages` | `CMS:CREATE` |
| `/admin/cms/pages/[id]/edit` | `src/app/(admin)/admin/cms/pages/[id]/edit/page.tsx` | Edit static CMS page content. | `GET /pages/:id`, `PATCH /pages/:id` | `CMS:UPDATE` |
| `/admin/cms/menus` | `src/app/(admin)/admin/cms/menus/page.tsx` | Storefront header navigation menu tree builder. | `GET /menus`, `POST /menus`, `PUT /menus/order` | `CMS:UPDATE` |
| `/admin/cms/footer` | `src/app/(admin)/admin/cms/footer/page.tsx` | Storefront footer columns, legal links, and payment method icons. | `GET /footer`, `PATCH /footer` | `CMS:UPDATE` |
| `/admin/cms/social` | `src/app/(admin)/admin/cms/social/page.tsx` | Social media profiles configuration (Facebook, YouTube, Instagram, WhatsApp). | `GET /social-links`, `POST /social-links` | `CMS:UPDATE` |
| `/admin/cms/ticket-issues` | `src/app/(admin)/admin/cms/ticket-issues/page.tsx` | Support ticket issue categories directory (Order Issue, Return, Servicing). | `GET /ticket-issue-types`, `POST /ticket-issue-types` | `CMS:READ` |
| `/admin/cms/countries` | `src/app/(admin)/admin/cms/countries/page.tsx` | Permitted countries and phone dialing codes directory. | `GET /countries`, `POST /countries` | `CMS:READ` |
| `/admin/cms/contact` | `src/app/(admin)/admin/cms/contact/page.tsx` | Customer messages submitted via storefront `/contact` page. | `GET /contact-submissions`, `PATCH /contact-submissions/:id` | `CMS:READ` |

### 4.14 Business Settings, Branch Administration & 3rd-Party Config
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/business-settings` | `src/app/(admin)/admin/business-settings/page.tsx` | Settings landing directory. | - | `BUSINESS_SETTINGS:READ` |
| `/admin/business-settings/general` | `src/app/(admin)/admin/business-settings/general/page.tsx` | Company name, logo, favicon, address, VAT/BIN registration number, timezone. | `GET /business-settings`, `PATCH /business-settings` | `BUSINESS_SETTINGS:UPDATE` |
| `/admin/business-settings/currency` | `src/app/(admin)/admin/business-settings/currency/page.tsx` | Store currency configuration (BDT ৳ default, symbol position, decimals). | `GET /currencies`, `PATCH /currencies/:id` | `BUSINESS_SETTINGS:UPDATE` |
| `/admin/business-settings/delivery-charge` | `src/app/(admin)/admin/business-settings/delivery-charge/page.tsx` | Delivery charge tiers (Inside Dhaka ৳60, Outside Dhaka ৳120, Express). | `GET /delivery-charges`, `POST /delivery-charges` | `BUSINESS_SETTINGS:UPDATE` |
| `/admin/business-settings/setup` | `src/app/(admin)/admin/business-settings/setup/page.tsx` | Initial system setup wizard and feature toggle switches. | `GET /business-settings/setup`, `PATCH /business-settings/setup` | `BUSINESS_SETTINGS:UPDATE` |
| `/admin/business-settings/verification` | `src/app/(admin)/admin/business-settings/verification/page.tsx` | OTP verification settings (SMS OTP login, email verification). | `GET /business-settings/verification` | `BUSINESS_SETTINGS:UPDATE` |
| `/admin/business/general` | `src/app/(admin)/admin/business/general/page.tsx` | General business profile alias view. | `GET /business-settings` | `BUSINESS_SETTINGS:READ` |
| `/admin/branch` | `src/app/(admin)/admin/branch/page.tsx` | Branch directory (Flagship, Outlets, Warehouses). Address, manager, contact. | `GET /branches` | `BRANCHES:READ` |
| `/admin/branch/create` | `src/app/(admin)/admin/branch/create/page.tsx` | New branch creation form. | `POST /branches` | `BRANCHES:CREATE` |
| `/admin/branch/[id]/edit` | `src/app/(admin)/admin/branch/[id]/edit/page.tsx` | Edit branch details and type. | `GET /branches/:id`, `PATCH /branches/:id` | `BRANCHES:UPDATE` |
| `/admin/3rd-party` | `src/app/(admin)/admin/3rd-party/page.tsx` | Third-party integrations: SMS Gateways (Greenweb, SSL Wireless), Mail SMTP, Google Recaptcha, Firebase. | `GET /sms-config`, `PATCH /sms-config`, `GET /mail-config`, `PATCH /mail-config`, `GET /payment-gateways` | `THIRD_PARTY_CONFIG:UPDATE` |

### 4.15 Customer Support & Staff Notes
| Route | File Path | Description & Features | Connected APIs | RBAC / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/support/requests` | `src/app/(admin)/admin/support/requests/page.tsx` | Help requests and tickets submitted by storefront customers. Reply thread and priority tags. | `GET /support-tickets`, `POST /support-tickets/:id/messages` | `HELP_REQUESTS:READ` |
| `/admin/support/notes` | `src/app/(admin)/admin/support/notes/page.tsx` | Internal staff help notes and task checklist. | `GET /help-notes`, `POST /help-notes`, `DELETE /help-notes/:id` | `HELP_NOTES:READ` |
| `/admin/login` | `src/app/(admin)/admin/login/page.tsx` | **Staff Portal Login**. Email and password authentication. Sets staff JWT token and role context. | `POST /auth/staff/login` | Public (Staff Only) |

### 4.16 Storefront E-Commerce Pages
| Route | File Path | Description & Features | Connected APIs |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/(storefront)/page.tsx` | Homepage. Hero banner slider, brand logos, featured smartphones, new arrivals, promotional grids, customer testimonials. | `GET /banners`, `GET /products?featured=true`, `GET /brands` |
| `/phones` | `src/app/(storefront)/phones/page.tsx` | **Smartphones Catalog Multi-Filter**. Filter by brand, price range, storage, RAM, operating system, condition. Sorting options. | `GET /products`, `GET /brands`, `GET /attributes` |
| `/product/[slug]` | `src/app/(storefront)/product/[slug]/page.tsx` | **Product Detail Page (PDP)**. Image gallery with zoom, variant selector (Color/Storage), live stock badge, full specs table, customer reviews. | `GET /products/:slug`, `GET /products/:slug/reviews` |
| `/category/[slug]` | `src/app/(storefront)/category/[slug]/page.tsx` | Category listing page with breadcrumbs and subcategory chips. | `GET /categories/:slug`, `GET /products?category=:slug` |
| `/cart` | `src/app/(storefront)/cart/page.tsx` | Shopping cart. Item quantity stepper, subtotal calculation, delivery estimator, proceed to checkout button. | Local Cart Context |
| `/checkout` | `src/app/(storefront)/checkout/page.tsx` | **Checkout Flow**. Delivery address form, courier charge selection, promo code validation, payment method selector (COD, bKash, SSLCommerz). | `POST /orders`, `POST /promo-codes/validate`, `GET /delivery-charges` |
| `/order/confirmation/[orderId]` | `src/app/(storefront)/order/confirmation/[orderId]/page.tsx` | Order success page displaying order tracking code, items purchased, and delivery timeline. | `GET /orders/public/:orderId` |
| `/order/payment-failed` | `src/app/(storefront)/order/payment-failed/page.tsx` | Payment failure handling with retry payment button. | - |
| `/account` | `src/app/(storefront)/account/page.tsx` | Customer dashboard overview: recent orders, reward points, default shipping address. | `GET /customers/me` |
| `/account/profile` | `src/app/(storefront)/account/profile/page.tsx` | Edit customer name, phone number, and avatar. | `GET /customers/me`, `PATCH /customers/me` |
| `/account/orders` | `src/app/(storefront)/account/orders/page.tsx` | Customer order history with live delivery status tracker and PDF invoice download. | `GET /customers/me/orders` |
| `/account/address` | `src/app/(storefront)/account/address/page.tsx` | Saved address book (Home, Office). Add, edit, or delete shipping addresses. | `GET /customers/me/addresses`, `POST /customers/me/addresses` |
| `/account/wishlist` | `src/app/(storefront)/account/wishlist/page.tsx` | Customer saved wishlist items with quick "Move to Cart" button. | `GET /wishlist`, `DELETE /wishlist/:id` |
| `/account/support` | `src/app/(storefront)/account/support/page.tsx` | Customer support ticket list and interactive messaging conversation thread. | `GET /support-tickets/my`, `POST /support-tickets` |
| `/account/change-password` | `src/app/(storefront)/account/change-password/page.tsx` | Update customer account password. | `POST /auth/customer/change-password` |
| `/blog` | `src/app/(storefront)/blog/page.tsx` | Tech news, phone unboxing articles, and repair guides directory. | `GET /blogs` |
| `/blog/[slug]` | `src/app/(storefront)/blog/[slug]/page.tsx` | Full blog article view with social sharing links and related articles. | `GET /blogs/:slug` |
| `/about` | `src/app/(storefront)/about/page.tsx` | About MobileHubBD company story, mission, and physical branch locations. | `GET /pages/about-us` |
| `/contact` | `src/app/(storefront)/contact/page.tsx` | Customer contact form, customer care hotline, Google Maps branch locations. | `POST /contact-submissions` |
| `/terms` | `src/app/(storefront)/terms/page.tsx` | Terms and conditions of service. | `GET /pages/terms` |
| `/privacy` | `src/app/(storefront)/privacy/page.tsx` | Privacy and data protection policy. | `GET /pages/privacy` |
| `/login` | `src/app/(storefront)/login/page.tsx` | Customer login with phone/email and password, or SMS OTP. | `POST /auth/customer/login` |
| `/register` | `src/app/(storefront)/register/page.tsx` | Customer account registration form. | `POST /auth/customer/register` |

---

## 5. Complete Backend API Endpoints & Controller Map (All 51 Controllers)

The NestJS backend application exposes RESTful endpoints across **51 controllers** mounted at prefix `/api/v1`:

| Controller | Base Path | Key HTTP Endpoints | Description | Auth / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `AuthController` | `/auth` | `POST /auth/staff/login`<br>`POST /auth/staff/refresh`<br>`POST /auth/customer/login`<br>`POST /auth/customer/register` | Authenticates staff and customers; issues JWT tokens and refreshes them. | Public |
| `ServiceJobController` | `/service-jobs` | `GET /service-jobs`<br>`GET /service-jobs/my`<br>`GET /service-jobs/:id`<br>`GET /service-jobs/next-invoice-number`<br>`POST /service-jobs/repair`<br>`PATCH /service-jobs/:id`<br>`PATCH /service-jobs/:id/status`<br>`DELETE /service-jobs/:id` | Core repair job engine: listing, intake, status transition, technician private view, admin editing and cascade hard deletion. | `JwtAuthGuard`, `PermissionsGuard` (`SALES`) |
| `ServiceLookupController` | `/service-lookups` | `GET /service-lookups/device-types`<br>`GET /service-lookups/problem-types`<br>`GET /service-lookups/warranty-periods` | Provides lookup options for repair intake dropdowns. | `JwtAuthGuard` |
| `EmployeeController` | `/employees` | `GET /employees`<br>`GET /employees/technicians`<br>`GET /employees/eligible-for-technician`<br>`POST /employees`<br>`PATCH /employees/:id`<br>`DELETE /employees/:id` | Staff management: listing, technician filtering, employee profile creation and modification. | `JwtAuthGuard`, `PermissionsGuard` (`HRM`) |
| `PosController` | `/pos` | `GET /pos/products`<br>`POST /pos/sales`<br>`GET /pos/services`<br>`POST /pos/service-jobs` | Ultra-fast in-store cashier endpoints for product catalog search and immediate sales checkout. | `JwtAuthGuard`, `PermissionsGuard` (`SALES`) |
| `OrderController` | `/orders` | `GET /orders`<br>`GET /orders/:id`<br>`POST /orders`<br>`PATCH /orders/:id/status`<br>`POST /orders/:id/notes`<br>`DELETE /orders/:id` | Master orders processing: e-commerce checkout, status updates, fulfillment and invoice generation. | `JwtAuthGuard`, `PermissionsGuard` (`ORDERS`) |
| `ProductController` | `/products` | `GET /products`<br>`GET /products/:id`<br>`POST /products`<br>`PATCH /products/:id`<br>`PATCH /products/:id/toggle`<br>`DELETE /products/:id` | Product catalog administration: creation, specification updates, variant management, and deletion. | `JwtAuthGuard`, `PermissionsGuard` (`PRODUCTS`) |
| `PhoneUnitController` | `/phone-units` | `GET /phone-units`<br>`GET /phone-units/available`<br>`GET /phone-units/check-imei`<br>`POST /phone-units` | Unit-level physical mobile phone IMEI/Serial inventory tracking and status validation. | `JwtAuthGuard`, `PermissionsGuard` (`PRODUCTS`) |
| `StockAdjustmentController` | `/stock-adjustments` | `GET /stock-adjustments`<br>`GET /stock-adjustments/:id`<br>`POST /stock-adjustments`<br>`POST /stock-adjustments/batch` | Physical inventory audit reconciliations and stock balance corrections. | `JwtAuthGuard`, `PermissionsGuard` (`STOCK_ADJUSTMENT`) |
| `WastedProductController` | `/wasted-products` | `GET /wasted-products`<br>`POST /wasted-products`<br>`DELETE /wasted-products/:id` | Defective, damaged, or scrapped stock logging. | `JwtAuthGuard`, `PermissionsGuard` (`PRODUCTS`) |
| `PurchaseOrderController` | `['/purchase-orders', '/purchases']` | `GET /purchases`<br>`GET /purchases/:id`<br>`POST /purchases`<br>`PATCH /purchases/:id` | Vendor procurement orders, receiving inventory, and logging supplier dues. | `JwtAuthGuard`, `PermissionsGuard` (`PURCHASE`) |
| `SupplierController` | `/suppliers` | `GET /suppliers`<br>`GET /suppliers/:id`<br>`POST /suppliers`<br>`PATCH /suppliers/:id`<br>`GET /suppliers/payments`<br>`POST /suppliers/payments` | Vendor directory and supplier payment disbursement ledger. | `JwtAuthGuard`, `PermissionsGuard` (`SUPPLIERS`) |
| `WalletController` | `/wallets` | `GET /wallets`<br>`GET /wallet-types`<br>`GET /wallet-transactions`<br>`POST /wallet-transactions/disburse-staff-payment`<br>`POST /wallet-transfers`<br>`POST /wallet-deposits` | Double-entry wallet system: cash, banks, MFS balances, multi-line salary dispatches, and transfers. | `JwtAuthGuard`, `PermissionsGuard` (`WALLET`) |
| `ExpenseController` | `/expenses` | `GET /expenses`<br>`POST /expenses`<br>`GET /expense-categories`<br>`POST /expense-categories` | Operational expenditures tracking with wallet balance decrement. | `JwtAuthGuard`, `PermissionsGuard` (`EXPENSE`) |
| `PayrollController` | `/payroll` | `GET /payroll`<br>`POST /payroll/disburse`<br>`GET /payroll/preview-monthly`<br>`POST /payroll/execute-monthly` | Monthly employee payroll calculations and historical disbursement tracking. | `JwtAuthGuard`, `PermissionsGuard` (`HRM`) |
| `CustomerController` | `/customers` | `GET /customers`<br>`GET /customers/:id`<br>`GET /customers/:id/summary`<br>`GET /customers/:id/orders`<br>`POST /customers`<br>`PATCH /customers/:id`<br>`POST /customers/:id/payments` | Customer CRM: 12 stat cards, due collections, order history, and address book. | `JwtAuthGuard`, `PermissionsGuard` (`CUSTOMERS`) |
| `ReportController` | `/reports` | `GET /reports/dashboard-stats`<br>`GET /reports/summary`<br>`GET /reports/pos-sales`<br>`GET /reports/service-sales`<br>`GET /reports/technician-servicing`<br>`GET /reports/customer-due`<br>`GET /reports/supplier-due` | Executive BI, financial reconciliations, and technician 50/50 profit reports. | `JwtAuthGuard`, `PermissionsGuard` (`REPORT`) |
| `BranchController` | `/branches` | `GET /branches`<br>`GET /branches/:id`<br>`POST /branches`<br>`PATCH /branches/:id` | Multi-branch management (Dhaka Flagship, Chittagong Outlet, Sylhet Warehouse). | `JwtAuthGuard`, `PermissionsGuard` (`BRANCHES`) |
| `RoleController` | `/roles` | `GET /roles`<br>`POST /roles`<br>`PATCH /roles/:id`<br>`GET /roles/:id/permissions`<br>`PUT /roles/:id/permissions` | Custom role builder and granular CRUD permissions assignment. | `JwtAuthGuard` (Global Admin only) |
| `CategoryController` | `/categories` | `GET /categories`<br>`GET /categories/:slug`<br>`POST /categories`<br>`PATCH /categories/:id`<br>`DELETE /categories/:id` | Hierarchical category builder with slug routing. | `Public` / `PermissionsGuard` (`CATEGORY`) |
| `BrandController` | `/brands` | `GET /brands`<br>`POST /brands`<br>`PATCH /brands/:id`<br>`DELETE /brands/:id` | Brand directory and logo management. | `Public` / `PermissionsGuard` (`PRODUCTS`) |
| `SeriesController` | `/series` | `GET /series`<br>`POST /series`<br>`PATCH /series/:id` | Product series hierarchy. | `Public` / `PermissionsGuard` (`PRODUCTS`) |
| `AttributeController` | `/attributes` | `GET /attributes`<br>`POST /attributes`<br>`GET /attributes/:id/values`<br>`POST /attributes/:id/values` | Attribute definition and value management (Color, Storage, Display Quality). | `JwtAuthGuard`, `PermissionsGuard` (`PRODUCTS`) |
| `UnitController` | `/units` | `GET /units`<br>`POST /units`<br>`DELETE /units/:id` | Measurement unit options. | `JwtAuthGuard`, `PermissionsGuard` (`PRODUCTS`) |
| `SalesReturnController` | `/sales-returns` | `GET /sales-returns`<br>`GET /sales-returns/:id`<br>`POST /sales-returns` | Customer product returns and refund processing. | `JwtAuthGuard`, `PermissionsGuard` (`SALES_RETURN`) |
| `ExchangeController` | `/exchanges` | `GET /exchanges`<br>`GET /exchanges/:id`<br>`POST /exchanges` | Trade-in exchange valuations and swap vouchers. | `JwtAuthGuard`, `PermissionsGuard` (`EXCHANGE`) |
| `ShipmentController` | `/shipments` | `GET /shipments`<br>`POST /shipments`<br>`PATCH /shipments/:id/status` | Courier dispatch management (Steadfast, Pathao, RedX). | `JwtAuthGuard`, `PermissionsGuard` (`SALES`) |
| `BannerController` | `/banners` | `GET /banners`<br>`POST /banners`<br>`PATCH /banners/:id`<br>`DELETE /banners/:id` | Storefront carousel banner management. | `Public` / `PermissionsGuard` (`PROMOTIONAL_BANNER`) |
| `AdController` | `/ads` | `GET /ads`<br>`POST /ads`<br>`PATCH /ads/:id` | Promotional advertisements and popup banners. | `Public` / `PermissionsGuard` (`ADS`) |
| `PromoCodeController` | `/promo-codes` | `GET /promo-codes`<br>`POST /promo-codes`<br>`POST /promo-codes/validate`<br>`DELETE /promo-codes/:id` | Promotional voucher codes and checkout validation. | `Public` / `PermissionsGuard` (`PROMO_CODE`) |
| `BlogController` | `/blogs` | `GET /blogs`<br>`GET /blogs/:slug`<br>`POST /blogs`<br>`PATCH /blogs/:id`<br>`DELETE /blogs/:id` | Blog articles and news management. | `Public` / `PermissionsGuard` (`BLOGS`) |
| `BlogCategoryController` | `/blog-categories` | `GET /blog-categories`<br>`POST /blog-categories` | Blog post categorization. | `Public` / `PermissionsGuard` (`BLOGS`) |
| `PageController` | `/pages` | `GET /pages`<br>`GET /pages/:slug`<br>`POST /pages`<br>`PATCH /pages/:id` | Custom CMS pages (About, Terms, Privacy). | `Public` / `PermissionsGuard` (`CMS`) |
| `MenuController` | `/menus` | `GET /menus`<br>`POST /menus`<br>`PUT /menus/order` | Header navigation menu builder. | `Public` / `PermissionsGuard` (`CMS`) |
| `FooterController` | `/footer` | `GET /footer`<br>`PATCH /footer` | Footer columns, legal text, and payment badges. | `Public` / `PermissionsGuard` (`CMS`) |
| `FooterSettingsController`| `/footer-settings` | `GET /footer-settings`<br>`PATCH /footer-settings` | Granular footer configurations. | `Public` / `PermissionsGuard` (`CMS`) |
| `SocialLinkController` | `/social-links` | `GET /social-links`<br>`POST /social-links` | Social media profile URLs. | `Public` / `PermissionsGuard` (`CMS`) |
| `SupportTicketController` | `/support-tickets` | `GET /support-tickets`<br>`GET /support-tickets/my`<br>`POST /support-tickets`<br>`POST /support-tickets/:id/messages` | Customer support ticketing and messaging threads. | `JwtAuthGuard` |
| `HelpNoteController` | `/help-notes` | `GET /help-notes`<br>`POST /help-notes`<br>`DELETE /help-notes/:id` | Staff internal memo notes. | `JwtAuthGuard` |
| `TicketIssueTypeController`| `/ticket-issue-types` | `GET /ticket-issue-types`<br>`POST /ticket-issue-types` | Categorization for support ticket topics. | `Public` / `PermissionsGuard` (`CMS`) |
| `ContactSubmissionController`| `/contact-submissions` | `GET /contact-submissions`<br>`POST /contact-submissions` | Storefront contact form message submissions. | `Public` / `PermissionsGuard` (`CMS`) |
| `PushNotificationController` | `/push-notifications` | `POST /push-notifications/send` | Broadcast push notification sender. | `JwtAuthGuard`, `PermissionsGuard` (`CMS`) |
| `BusinessSettingsController`| `/business-settings` | `GET /business-settings`<br>`PATCH /business-settings` | Global store settings, company identity, VAT/BIN. | `JwtAuthGuard`, `PermissionsGuard` (`BUSINESS_SETTINGS`) |
| `CurrencyController` | `/currencies` | `GET /currencies`<br>`POST /currencies`<br>`PATCH /currencies/:id` | Currency symbols and formatting. | `JwtAuthGuard`, `PermissionsGuard` (`BUSINESS_SETTINGS`) |
| `DeliveryChargeController` | `/delivery-charges` | `GET /delivery-charges`<br>`POST /delivery-charges`<br>`DELETE /delivery-charges/:id` | Shipping charge tiers by location. | `Public` / `PermissionsGuard` (`BUSINESS_SETTINGS`) |
| `DepartmentController` | `/departments` | `GET /departments`<br>`POST /departments`<br>`PATCH /departments/:id` | Staff department hierarchy. | `JwtAuthGuard`, `PermissionsGuard` (`HRM`) |
| `CountryController` | `/countries` | `GET /countries`<br>`POST /countries` | Dialing codes and countries directory. | `Public` / `PermissionsGuard` (`CMS`) |
| `BkashController` | `/payments/bkash` | `POST /payments/bkash/initiate`<br>`POST /payments/bkash/callback` | bKash online payment gateway integration. | `Public` |
| `SslcommerzController` | `/payments/sslcommerz` | `POST /payments/sslcommerz/initiate`<br>`POST /payments/sslcommerz/success`<br>`POST /payments/sslcommerz/fail` | SSLCommerz multi-card/MFS online checkout gateway. | `Public` |
| `ThirdPartyConfigController`| `/` | `GET /sms-config`<br>`PATCH /sms-config`<br>`GET /mail-config`<br>`PATCH /mail-config`<br>`GET /payment-gateways` | Credentials for SMS gateways, SMTP mail, and payment providers. | `JwtAuthGuard` (Global Admin only) |
| `AppController` | `/` | `GET /health` | Health check probe returning server uptime and status. | `Public` |

---

## 6. Detailed Work Changelog (Fix Passes 20–34)

### Fix Pass 21 — POS "Add to Cart" Product Modal Rebuild (`PosProductModal.tsx`)
- Separated variants into distinct **COLOR** and **QUALITY** sections with horizontal wrapped pill buttons.
- Styled selected pill with emerald outline (`ring-2 ring-emerald-500/20`, `border-emerald-600`, `bg-emerald-50`).
- Displayed zero-stock combinations as disabled with clear indicator (`(0 in stock)`).
- Single-attribute products omit redundant section headers.
- Quantity stepper (`−` / input / `+`) and editable **Override Price (৳)** aligned on the same row.
- Retained Fix Pass 20 physical phone unit IMEI selection and warranty selection.

### Fix Pass 22 — HRM Unified "Add Salary / Payroll" Modal (`AddSalaryPayrollModal.tsx`)
- Rebuilt single-entry payment form into a comprehensive multi-line salary disbursement modal.
- Row 1: Employee selector + Salary Month picker (`YYYY-MM`).
- Row 2: Source Wallet dropdown (with live balance indicator) + Salary Base Amount.
- Row 3: Bonus Amount + Allowance Amount (with frequency selector and auto-fill badge).
- Row 4: Deduction Amount (reduces employee net payout without reducing wallet draw) + Notes.
- Dynamic calculation banner: Gross Wallet Draw vs Deductions vs Net Payout.
- Atomically dispatches distinct `WalletTransaction` records (`SALARY`, `BONUS`, `ALLOWANCE`) while updating `Payroll` table records.

### Fix Pass 32 & 33 — Servicing Report, Job Detail Modal & Sourcing
- Built dedicated Servicing Report at `src/app/(admin)/admin/technician/servicing-report/page.tsx`.
- Summary metrics: Material Cost, Total Profit, and **"Your Profit" (50% technician share)**.
- Per-job servicing details table with source badges.
- Material sourcing history with `sourceType` (`OWN_STOCK`, `SUPPLIER`, `OTHER`) and notes.
- Kept repaired materials strictly **stock-independent** (no branch inventory decrement).
- POS Technician Mode quick repair intake automatically creates `DELIVERED` service jobs with 50/50 profit sharing.

### Fix Pass 34 — Admin "Servicing Management" Page & Bug Fix
- **New Admin Page**: Created `src/app/(admin)/admin/servicing/page.tsx` accessible from the sidebar.
- **Filter Suite**: Filter jobs by technician, by branch (Global Admin), by status, and by custom date range (`startDate`, `endDate`).
- **Live Search**: Instant search by invoice number, customer name, phone number, device, and issue.
- **Job Editing**: Edit modal allows modifying device, issue description, labor cost, total bill, discount, advance payment, due amount, and status.
- **Hard Deletion**: Cascade-deletes `ServiceJob` along with its associated `ServiceJobMaterial`, `Payment`, and `Order` records without leaving orphan rows.
- **Bug Fix ("Failed to load service jobs")**:
  - *Root Cause*: `src/app/(admin)/admin/servicing/page.tsx` was checking `res.success`, but `apiGet` from `src/lib/api-client.ts` directly returns the backend JSON body (`{ data: [...], meta: {...} }`). Because `res.success` was undefined, execution fell into the error handler.
  - *Fix Applied*: Updated response parsing to verify `Array.isArray(res.data)`. Updated dropdown routes to `/employees/technicians` (fixing 404 on `/staff`), and corrected profit calculation from `finalAmount - materialCost`.

---

## 7. Core Business Logic, Financial Formulas & Invariants

Any engineer or AI agent working on this codebase **must strictly honor** these established business rules:

### 7.1 Dashboard Financial Formulas
1. **Total Sales Reconciliation**:
   $$\text{Total Sales} = \text{Phone Sales} + \text{Display Sales} + \text{Gadget Sales} + \text{Service Sales}$$
   Every dashboard widget and financial report adheres strictly to this formula.
2. **Profit Sanity Rule**:
   $$\text{Profit} \le \text{Total Sales}$$
   Profit is calculated using real purchase costs (`buyingPrice` on variants or `cost` on service materials). Under no circumstance may profit exceed total revenue.
3. **Supplier Due Balance**:
   $$\text{Supplier Due} \ge 0$$
   Running balances are computed from real purchase orders minus completed supplier payments.

### 7.2 Repair Servicing & Technician Rules
1. **Technician 50/50 Profit Share**:
   $$\text{Labor Profit} = \text{Total Service Bill} - \text{Material Cost}$$
   $$\text{Technician Profit Share} = 0.50 \times \text{Labor Profit}$$
   Default share is strictly 50%, guaranteed by backend fallbacks in `ReportService` and `ServiceJobService`.
2. **Stock-Independent Parts & Sourcing**:
   - Repair technicians are free to add any material or spare part to a service job **without any branch inventory stock decrement or stock availability checks**.
   - Each material row features a **Source Type** selector (`OWN_STOCK`, `SUPPLIER`, `OTHER`):
     - `OWN_STOCK`: From shop's own spare parts (informational tag; no inventory decrement).
     - `SUPPLIER`: Requires choosing a registered `Supplier`.
     - `OTHER`: Requires providing a free-text sourcing note (e.g., *"Bought urgent from local vendor"*).
3. **Technician Data Isolation**:
   - Technicians can only view their own assigned jobs. Accessing another technician's job returns a strict **HTTP 403 Forbidden**.
4. **POS Technician Mode Integration**:
   - Quick repair services recorded at the POS terminal automatically create a real `ServiceJob` record marked as `DELIVERED`, assigned to the technician with 50% profit sharing, feeding directly into the technician's Servicing Report.

### 7.3 Inventory & Phone Serial/IMEI Tracking
1. **Unit-Level Tracking**: Mobile phones have individual records in `PhoneUnit` mapped to an `IMEI` or `Serial Number`.
2. **Public API Privacy**: Raw IMEI numbers are strictly scrubbed and never exposed in customer-facing public APIs.
3. **Branch Scoping**: Products and inventory are tracked per branch via `BranchInventory`. Branch Admins can only view and manage stock belonging to their designated branch.

---

## 8. Role-Based Access Control (RBAC) & Verified Credentials

All demo accounts in development and staging environments are seeded with the universal password: **`Admin@12345`**

| Role | Email | Password | Scope & Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@mobilehubbd.test` | `Admin@12345` | **Unrestricted Global Access**: Full control over all 51 backend controllers, 111 admin pages, financial audits, settings, and branches. |
| **Demo Admin** | `demo.admin@mobilehubbd.test` | `Admin@12345` | Global admin profile for client demonstrations. |
| **Dhaka Branch Admin** | `demo.branchadmin@mobilehubbd.test` | `Admin@12345` | **Branch Scope**: Manages Dhaka Main branch operations, sales, local stock, and staff. Blocked from global business settings. |
| **Technician (Rajib Paul)** | `demo.technician@mobilehubbd.test` | `Admin@12345` | **Technician Scope**: Access to Technician Workspace (`/admin/technician`), Job Detail modal, and personal Servicing Report. Blocked from other technician jobs. |
| **Counter Sales Staff** | `sales@mobilehubbd.test` | `Admin@12345` | **POS & Sales**: Counter sales checkout, barcode scanning, customer receipts. |
| **Branch Manager** | `ctg.manager@mobilehubbd.test` | `Admin@12345` | **Branch Scope**: Manages Chittagong Outlet branch operations. |
| **Inventory Auditor** | `demo.auditor@mobilehubbd.test` | `Admin@12345` | **Stock Auditing**: Physical inventory counts, stock adjustments, wasted products. Blocked from financial settings. |
| **SEO Specialist** | `seo@mobilehubbd.test` | `Admin@12345` | **Marketing & CMS**: Banners, promo codes, blog articles, SEO metadata. |
| **Storefront Customer** | Registered via `/register` | User defined | **Storefront**: Orders, wishlist, profile, support tickets. |

---

## 9. Local Execution & Production Deployment Guide

### 9.1 Local Development Commands
The project runs locally across two terminal processes:

#### Terminal 1 — Backend API (Port 4000):
```bash
cd api
npm install
npx prisma db push
npm run start:dev
```
*Health probe:* `http://localhost:4000/api/v1/health`

#### Terminal 2 — Frontend Application (Port 3000):
```bash
# In project root
npm install
npm run dev
```
*Local URL:* `http://localhost:3000`  
*Admin Portal:* `http://localhost:3000/admin`

### 9.2 Automated Verification & Audit Scripts
Run these verification scripts from the root directory to confirm full system integrity:
```bash
# Full pre-deployment verification
npm run build                      # Next.js frontend compilation check
cd api && npm run build            # NestJS backend compilation check

# Automated verification test suites
node scratch/test-pass21-pos-modal.mjs
node scratch/test-pass22-payroll-modal.mjs
node scratch/verify-pass33.mjs
node scratch/verify-pass32.mjs
```

### 9.3 Production Deployment Blueprint (Ubuntu VPS)
- **Process Manager**: PM2 running `mobilehubbd-web` (port 3000) and `mobilehubbd-api` (port 4000)
- **Web Server & Reverse Proxy**: Nginx with Let's Encrypt SSL
- **Database**: PostgreSQL 15/16 on `localhost:5432`

#### Nginx Configuration Snippet (`/etc/nginx/sites-available/mobilehubbd`):
```nginx
server {
    server_name mobilehubbd.tech www.mobilehubbd.tech;
    client_max_body_size 50M;

    # Backend API Routing
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads Static Media
    location /uploads/ {
        proxy_pass http://127.0.0.1:4000/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend Next.js Routing
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
