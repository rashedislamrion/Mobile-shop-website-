# Mock/Test Data Audit — September 29, 2026

> **Audit Type**: READ-ONLY Database Inspection (Dry Run)  
> **Target Database**: PostgreSQL `novamobile` (Localhost Port 5432)  
> **Modifications Made**: **ZERO** rows modified, updated, or deleted.

---

## 1. Summary Table

| Model | Total Rows | Suspected Test/Mock Rows | Suspected Duplicate Groups | Primary Test Patterns Identified |
|---|---|---|---|---|
| **Product** | 74 | 64 (86.5%) | 5 groups | `"Test Product"`, `"FixPass19 Test Screen OLED"`, `"Audit Sync Device"`, `"Sync Audit Product"`, timestamp suffixes |
| **ProductVariant** | 77 | 69 (89.6%) | 5 groups | SKUs matching `TEST-PROD-*`, `TEST-PHONE-*`, `SYNC-AUDIT-*` |
| **PhoneUnit** | 13 | 10 (76.9%) | 1 group | Synthetic IMEIs starting with `86178...` and `87178...` assigned to `"Test iPhone 15 Pro"` |
| **ServiceJob** | 86 | 34 (39.5%) | 11 groups | Repeated device `"Pixel 7 Pro"` with issue `"Screen flickering audit test"` across invoices `INV-0006` to `INV-0038` |
| **Customer** | 1,130 | 1,124 (99.5%) | 7 groups | Automated stress/e2e test customers (`cust1787424...`, `guest8@test.com`, `Verification Customer`) |
| **Order** | 195 | 145 (74.4%) | 4 groups | Automated test orders from POS/Website checkout verification suites |
| **OrderItem** | 133 | 87 (65.4%) | 4 groups | Snapshots containing test product names |
| **Supplier** | 14 | 14 (100%) | 2 groups | `"Prime Component Supplies Ltd <timestamp>"` (11 copies), `"Client Scenario Vendor"` (2 copies), `"Supplier_Pass10_..."` |
| **ProductRequest** | 2 | 2 (100%) | 1 group | Requests `PR-0001` and `PR-0002` created specifically for `"Test Product"` during inter-branch module verification |
| **Staff** | 45 | 35 (77.8%) | 3 groups | Automated verification staff accounts (`test.tech.*`, `test.sales.*`, `staff.*`) |

---

## 2. Model Detail Audit

### 2.1 Model: `Product`
- **Total Rows**: 74
- **Suspected Test/Mock Rows**: 64
- **Genuine / Seeded Products (10 Rows)**:
  - `cmsuo5krj0006urltxuugq7qo`: Apple Component 1 - Display (৳1,200)
  - `cmsuo5kro000curltmjill8es`: LG Component 14 - Display (৳4,250)
  - `cmsuo5krt000iurlt973ty1nm`: HUAWEI Component 27 - Display (৳2,500)
  - `cmsuo5kry000ourltxhkv3yq8`: HONOR Component 40 - Display (৳5,950)
  - `cmt3gexhp000ytajmwt39v4in`: Samsung Galaxy S22 Ultra Display Panel 6825 (৳18,500)
  - `cmt3gen3s000itajmf6rgsu6o`: iPhone 13 Display OLED (৳12,000)
  - `cmu1nojr1021uk041jgcmz7oq`: Apple iPhone 15 Pro Max (256GB) (৳155,000)
  - `cmu1nojr90222k04148pferqt`: Samsung Galaxy S24 Ultra 5G (৳142,000)
  - `cmu1nojrb0228k041ji22k7rw`: Anker 735 65W GaNPrime Charger (৳3,800)
  - `cmu4gfl67000fhhzdf466nb1h`: Samsung Galaxy S22 Ultra Display Panel 6018 (৳18,500)

- **Suspected Duplicate Groups**:
  1. **"Audit Sync Device"** (31 records):
     - *Pattern*: Timestamped sync devices generated during automated audit runs.
     - *Sample IDs*: `cmu8b34xj001a8w0mw276s5jt`, `cmu8b4gd5002d8w0mc4g5kmq3`, `cmu8hgeek006y8w0m9y5yupgp`, `cmu8hgyy9007f8w0mtn9x47c2`, `cmu8i502j000o9qioebp5j6y0`, `cmu8i6dth000ofcs7x66a6b57`, `cmu8i73qe002nfcs7062o2rfa`, `cmu8mn0el000ubujb3r4m5j11`, `cmu8mnyll0025bujbw4hffw2m`, `cmu8ndbka004ebujbdy8owdhh` (and 21 more).
  2. **"Sync Audit Product"** (12 records):
     - *Pattern*: `Sync Audit Product <timestamp>`
     - *Sample IDs*: `cmtuc8qcb000oorigoeymnc5g`, `cmtuc9pno000w2rmlskg8z2n1`, `cmtucabft002d2rml3b5vjz69`, `cmtucbhuk0001bsdy101f2f01`, `cmtucc78y0024bsdytj2e97sz`, `cmtuccnt2003ybsdyf741n2n7`, `cmtuccvxo005sbsdy5gce7eey`, `cmtucd97c007mbsdyp0t01d9f`, `cmtucdpto009gbsdy5rpll5g7`, `cmtucdwaw00babsdyu7z83q2i`, `cmtuce3tz00d4bsdyf5d6eb07`, `cmu07jn5j002f77oq0e4r587m`.
  3. **"Test iPhone 15 Pro"** (12 records):
     - *Pattern*: `Test iPhone 15 Pro <timestamp>`
     - *Sample IDs*: `cmtuc8pzi0004origue64uo01`, `cmtuc9pag00042rmlbboulqva`, `cmtucab32001e2rml21f48c57`, `cmtucbhsw0000bsdydyffgq86`, `cmtucc7720023bsdyyg9s9zch`, `cmtuccns8003xbsdy1n3h127f`, `cmtuccvwu005rbsdyx9a36msh`, `cmtucd963007lbsdyt2uaf9b2`, `cmtucdpsp009fbsdyi89g6m2f`, `cmtucdw9y00b9bsdyr1o623m4`, `cmtuce3sv00d3bsdyk33bpt6p`, `cmu07jmq7001d77oqh9s60k6b`.
  4. **"FixPass19 Test Screen OLED"** (5 records):
     - *Pattern*: `FixPass19 Test Screen OLED <timestamp>`
     - *IDs*: `cmtrgbpfu00041kqhvvv3fyus`, `cmtrgf99m001cm6uu0vy7yeyq`, `cmtrgfjx50032m6uu95ebyw3s`, `cmtsq53010004osxnap7qu6v9`, `cmtsq5v2g000kosxnkqfg6r9f`.
  5. **"Test Product"** (2 records):
     - *Pattern*: Explicit fixture named `"Test Product"` referenced in Fix Passes.
     - *IDs*: `cmt3cp2dv0003n0zm32yhn24g`, `cmt3cpqf10003cxclmcg76tkl`.

---

### 2.2 Model: `ProductVariant`
- **Total Rows**: 77
- **Suspected Test/Mock Rows**: 69
- **Suspected Duplicate Groups / Suffix Clusters**:
  - `TEST-SKU-1787341052412` (Belongs to `"Test Product"`)
  - `TEST-PHONE-<timestamp>-V1` (12 variant rows for `"Test iPhone 15 Pro"`)
  - `SYNC-AUDIT-<timestamp>-V1` (12 variant rows for `"Sync Audit Product"`)
  - `TEST-PROD-*-WHT-OEM` / `TEST-PROD-*-BLK-OEM` (10 variant rows for `"FixPass19 Test Screen OLED"`)
  - `AUDIT-SYNC-PHONE-<timestamp>-DEFAULT` (31 variant rows for `"Audit Sync Device"`)

---

### 2.3 Model: `PhoneUnit`
- **Total Rows**: 13
- **Suspected Test/Mock Rows**: 10 (76.9%)
- **Test Units List**:
  1. `cmtucab3m001p2rmlh6vizyth`: IMEI1: `861788972919462`, IMEI2: `871788972919462` (Product: Test iPhone 15 Pro 1788972919451, Status: IN_STOCK)
  2. `cmtucbhvr000fbsdyw3csewt3`: IMEI1: `861788972974905`, IMEI2: `871788972974905` (Product: Test iPhone 15 Pro 1788972974889, Status: SOLD)
  3. `cmtucc79g0029bsdyserqx3lh`: IMEI1: `861788973007801`, IMEI2: `871788973007801` (Product: Test iPhone 15 Pro 1788973007793, Status: SOLD)
  4. `cmtuccnv40043bsdyun4cfovb`: IMEI1: `861788973029316`, IMEI2: `871788973029316` (Product: Test iPhone 15 Pro 1788973029305, Status: SOLD)
  5. `cmtuccvzs005xbsdyq6s4iocp`: IMEI1: `861788973039854`, IMEI2: `871788973039854` (Product: Test iPhone 15 Pro 1788973039847, Status: SOLD)
  6. `cmtucd98v007rbsdy12u0pskk`: IMEI1: `861788973057030`, IMEI2: `871788973057030` (Product: Test iPhone 15 Pro 1788973057020, Status: SOLD)
  7. `cmtucdpv6009lbsdyel2jper3`: IMEI1: `861788973078568`, IMEI2: `871788973078568` (Product: Test iPhone 15 Pro 1788973078561, Status: SOLD)
  8. `cmtucdwcb00bfbsdyz0wpup94`: IMEI1: `861788973086963`, IMEI2: `871788973086963` (Product: Test iPhone 15 Pro 1788973086956, Status: SOLD)
  9. `cmtuce3vd00d9bsdyahpakv46`: IMEI1: `861788973096716`, IMEI2: `871788973096716` (Product: Test iPhone 15 Pro 1788973096705, Status: SOLD)
  10. `cmu07jmr8001g77oq1xko26re`: IMEI1: `861789327753443`, IMEI2: `871789327753443` (Product: Test iPhone 15 Pro 1789327753429, Status: SOLD)
- **Potential Seed/Catalog Inventory (3 Rows)**:
  - `cmu1nojr5021yk041vu91qboj`: Apple iPhone 15 Pro Max (256GB), IMEI1: `358912345678901`, IMEI2: `358912345678902` (Status: IN_STOCK)
  - `cmu1nojr80220k041t31eyvdp`: Apple iPhone 15 Pro Max (256GB), IMEI1: `358912345678903`, IMEI2: `358912345678904` (Status: IN_STOCK)
  - `cmu1nojra0226k041icoqq392`: Samsung Galaxy S24 Ultra 5G, IMEI1: `354890123456781`, IMEI2: `354890123456782` (Status: IN_STOCK)

---

### 2.4 Model: `ServiceJob`
- **Total Rows**: 86
- **Suspected Test/Mock Rows**: 34
- **Suspected Duplicate Groups**:
  1. **"Pixel 7 Pro — Screen flickering audit test"** (32 records):
     - Device: `Pixel 7 Pro`, Issue: `Screen flickering audit test`, Status: `PENDING`.
     - Invoices: `INV-0006`, `INV-0007`, `INV-0008`, `INV-0011`, `INV-0012`, `INV-0013`, `INV-0014`, `INV-0015`, `INV-0016`, `INV-0017`, `INV-0018`, `INV-0020`, `INV-0021`, `INV-0022`, `INV-0023`, `INV-0024`, `INV-0025`, `INV-0026`, `INV-0027`, `INV-0028`, `INV-0029`, `INV-0030`, `INV-0031`, `INV-0032`, `INV-0033`, `INV-0034`, `INV-0035`, `INV-0036`, `INV-0037`, `INV-0038`.
     - Sample IDs: `cmu8b01x300068w0m6a4kggxi`, `cmu8b34it000t8w0mp12f2pd3`, `cmu8b4fym001r8w0mf8usofgr`.
  2. **"Apple iPhone 15 Pro Max — Pass 25 Verification"** (2 records):
     - IDs: `cmuiue64000d912onikek0rle` (INV-0083), `cmuiuh95700do12on8al6sw2k` (INV-0084).
     - Customer: `Pass 25 Verification Customer` (`01712999888`).
  3. **"Samsung Galaxy S23 Ultra"** (9 records):
     - Sample IDs: `cmtap8fkr000uk4w5x6m3xeiq`, `cmu07iinw000677oq352rrrnc`, `cmu07hytf0007d1fw09nwf992`.
  4. **"iPhone 14 Pro Max"** (8 records):
     - Sample IDs: `cmug0xvxp000lj5mwvb940r3g`, `cmug0yihf001qj5mwt4l8unxg`, `cmug0zme6000k95iakgcue1i8`.

---

### 2.5 Model: `Customer`
- **Total Rows**: 1,130
- **Suspected Test/Mock Rows**: 1,124 (99.5%)
- **Identified Legitimate / Manual Customers (6 Rows)**:
  - `cmtb9aj5f000345m7od7lrsbo`: `Rion` (`admin@arstudioss.com`, `01343424236`)
  - `cmte6d1ct0002abciy7ewsi1a`: `Riyad Mama ❤️‍🩹` (`adminx@arstudioss.com`, `01753301195`)
  - `cmubm1pgo000o13jax8moalfj`: `Mohammad Rion` (`mohammed@gmail.com`, `017896794`)
  - `cmu07hyt70003d1fw53k8ax2a`: `Md. Tanvir Hossain` (`01711998877`)
  - `cmudtr3an0007r0cv43e9kha0`: `Rahim Chowdhury` (`01799887766`)
  - `cmug0xvxk000hj5mweezh6eyc`: `Multi-Source Customer` (`01799222333`)
- **Suspected Test Rows Sample (1,124 records)**:
  - `cmt3cpqgk0001g0g9b75iejv9`: `Test User` (`test@example.com`, `01700000000`)
  - `cmt4q3ml00000ocwdenzwx7jc`: `Test Customer P8` (`cust1787424001751@test.com`, `01724001751`)
  - `cmt4q3mo60004ocwdzedyg4p8`: `Guest Shopper P8` (`guest8@test.com`, `01924001924`)
  - Over 1,100 automated batch records with timestamped emails matching `cust<timestamp>@test.com`.

---

### 2.6 Model: `Order` and `OrderItem`
- **Total Orders**: 195 | **Suspected Test Orders**: 145 (74.4%)
- **Total OrderItems**: 133 | **Suspected Test OrderItems**: 87 (65.4%)
- **Test Order Clusters**:
  1. `ORD-260821-2681`: Placed for `"Test Product"` by `"Test User"` (`test@example.com`).
  2. Orders for `"Phase 6 Test Phone Ultra"`: `EM548748353`, `EM548768784`, `EM548809654`, `EM548829727`, `EM549155615`, `EM549149346`.
  3. Orders for `"FixPass19 Test Screen OLED"`: `EM470395260`, `EM477791584`, `EM484180885`.
  4. Automated COD checkout orders from `test-pass4-e2e.mjs`, `test-pass5-e2e.mjs`, and `master-audit-runner.mjs`.

---

### 2.7 Model: `Supplier`
- **Total Rows**: 14
- **Suspected Test/Mock Rows**: 14 (100%)
- **Suspected Duplicate Groups**:
  1. **"Prime Component Supplies Ltd <timestamp>"** (11 rows):
     - `cmt4n3joz00cgk8x1wzanmi54`: Prime Component Supplies Ltd 1787418959217 (`supplier.1787418959217@components.test`, `01817017623`)
     - `cmt4n5mtm00opk8x1u4e8ht0x`: Prime Component Supplies Ltd 1787419056581 (`supplier.1787419056581@components.test`, `01811949168`)
     - `cmt4n6wh500cgd6a7deoob5vc`: Prime Component Supplies Ltd 1787419115751 (`supplier.1787419115751@components.test`, `01811935159`)
     - `cmt4n88ki00cgv2w0ciuh5mnr`: Prime Component Supplies Ltd 1787419178080 (`supplier.1787419178080@components.test`, `01813465787`)
     - `cmt4n9niu00cgs5t61zbgho1f`: Prime Component Supplies Ltd 1787419244116 (`supplier.1787419244116@components.test`, `01815236034`)
     - `cmt4na94u00cgjuf2osktkupp`: Prime Component Supplies Ltd 1787419272124 (`supplier.1787419272124@components.test`, `01819678159`)
     - `cmt4naoca00oxjuf25i6zmmhj`: Prime Component Supplies Ltd 1787419291833 (`supplier.1787419291833@components.test`, `01819745471`)
     - `cmt4nb8ki0119juf2viax2ow9`: Prime Component Supplies Ltd 1787419318049 (`supplier.1787419318049@components.test`, `01814491113`)
     - `cmt4ncatv00cg13ieeg6lc3n8`: Prime Component Supplies Ltd 1787419367633 (`supplier.1787419367633@components.test`, `01818880284`)
     - `cmt4ndaoy00cgk6elfb3qjjvk`: Prime Component Supplies Ltd 1787419414112 (`supplier.1787419414112@components.test`, `01817862046`)
     - `cmu4ghlxf00j2hhzdpakitn1w`: Prime Component Supplies Ltd 1789584640316 (`supplier.1789584640316@components.test`, `01818600058`)
  2. **"Client Scenario Vendor <timestamp>"** (2 rows):
     - `cmtadx38j001712l78gc7z0eh`: Client Scenario Vendor 1787766338465 (`01799434676`)
     - `cmtap8ilr001ek4w5q1hc7igx`: Client Scenario Vendor 1787785347372 (`01799334660`)
  3. **"Supplier_Pass10"** (1 row):
     - `cmthqof8w0002oq5v3c11kb7k`: Supplier_Pass10_1788211032362 (`01780810838`)

---

### 2.8 Model: `ProductRequest` & `ProductRequestItem`
- **Total Rows**: 2 ProductRequests, 2 ProductRequestItems
- **Suspected Test/Mock Rows**: 2 (100%)
- **Records**:
  1. `cmuk8b7y6000smpxqnted5398` (`PR-0001`):
     - Requesting: Dhaka Main → Fulfilling: Chittagong Outlet
     - Item: `"Test Product"` (5 units)
     - Note: `"Urgent transfer request for VIP customer"` (Status: COMPLETED)
  2. `cmuk8b7z80011mpxqr5ryym2d` (`PR-0002`):
     - Requesting: Dhaka Main → Fulfilling: Chittagong Outlet
     - Item: `"Test Product"` (5 units)
     - Note: `"Request 5 units"` (Status: APPROVED)

---

### 2.9 Model: `Staff`
- **Total Rows**: 45
- **Operational / Demo System Accounts (10 Rows)**:
  - `admin@mobilehubbd.test`: Super Admin (Role: Admin, Scope: GLOBAL, Branch: All Branches)
  - `demo.admin@mobilehubbd.test`: Demo Global Admin (Role: Admin, Scope: GLOBAL, Branch: All Branches)
  - `seo@mobilehubbd.test`: SEO Specialist (Role: SEO, Scope: GLOBAL, Branch: All Branches)
  - `bradmin.dhaka@mobilehubbd.test`: Dhaka Branch Admin (Role: Branch Admin, Scope: OWN_BRANCH, Branch: Dhaka Main)
  - `demo.branchadmin@mobilehubbd.test`: Demo Branch Admin (Role: Branch Admin, Scope: OWN_BRANCH, Branch: Dhaka Main)
  - `ctg.manager@mobilehubbd.test`: CTG Branch Manager (Role: Branch Manager, Scope: OWN_BRANCH, Branch: Chittagong Outlet)
  - `sylhet.manager@mobilehubbd.test`: Sylhet Branch Manager (Role: Branch Manager, Scope: OWN_BRANCH, Branch: Sylhet Warehouse)
  - `demo.technician@mobilehubbd.test`: Rajib Paul (Role: Technician, Scope: OWN_BRANCH, Branch: Dhaka Main)
  - `sales@mobilehubbd.test`: Counter Sales Staff (Role: Salesperson, Scope: OWN_BRANCH, Branch: Dhaka Main)
  - `demo.auditor@mobilehubbd.test`: Demo Inventory Auditor (Role: Inventory Auditor, Scope: OWN_BRANCH, Branch: Dhaka Main)

- **Automated Test Staff Accounts (35 Rows)**:
  - 11 rows: `test.tech.<timestamp>@mobilehubbd.test` (Role: Technician, Branch: Chittagong Outlet)
  - 11 rows: `test.sales.<timestamp>@mobilehubbd.test` (Role: Salesperson, Branch: Chittagong Outlet)
  - 12 rows: `staff.<timestamp>@mobilehubbd.test` (Role: Custom Staff <timestamp>, Branch: Chittagong Outlet)
  - 1 row: `emp_test_1788382868500@example.com` (Role: Branch Admin, Branch: Uttara Hub Outlet 6849)

---

## 3. Demo Credentials Verification & Analysis

### 3.1 Confirmation of `Admin@12345` Active Credentials
- **Finding**: **CONFIRMED ACTIVE**.
- Exactly **15 Staff Accounts** actively authenticate with password **`Admin@12345`**:
  1. `admin@mobilehubbd.test` (Super Admin, Global)
  2. `demo.admin@mobilehubbd.test` (Demo Global Admin)
  3. `bradmin.dhaka@mobilehubbd.test` (Dhaka Branch Admin)
  4. `demo.branchadmin@mobilehubbd.test` (Demo Branch Admin)
  5. `ctg.manager@mobilehubbd.test` (CTG Branch Manager)
  6. `sylhet.manager@mobilehubbd.test` (Sylhet Branch Manager)
  7. `demo.technician@mobilehubbd.test` (Rajib Paul, Senior Technician)
  8. `sales@mobilehubbd.test` (Counter Sales Staff)
  9. `demo.auditor@mobilehubbd.test` (Demo Inventory Auditor)
  10. `seo@mobilehubbd.test` (SEO Specialist)
  11. `test.tech.1787418958846@mobilehubbd.test` (Technician)
  12. `test.tech.1787419056211@mobilehubbd.test` (Technician)
  13. `test.tech.1787419115303@mobilehubbd.test` (Technician)
  14. `test.sales.1787418958911@mobilehubbd.test` (Salesperson)
  15. `test.sales.1787419056275@mobilehubbd.test` (Salesperson)

- **Additional Default Password Discovered**:
  - Exactly **12 custom test staff accounts** (`staff.<timestamp>@mobilehubbd.test`) authenticate with password **`Staff@12345`**.

---

### 3.2 Breakdown of `@mobilehubbd.test` Domain Accounts

Total accounts on `@mobilehubbd.test`: **44 accounts**

| Role Category | Total Accounts | Distinct Email / Phone Pattern |
|---|---|---|
| **Admin** | 2 | `admin@mobilehubbd.test`, `demo.admin@mobilehubbd.test` |
| **Branch Admin** | 2 | `bradmin.dhaka@mobilehubbd.test`, `demo.branchadmin@mobilehubbd.test` |
| **Branch Manager** | 2 | `ctg.manager@mobilehubbd.test`, `sylhet.manager@mobilehubbd.test` |
| **Inventory Auditor** | 1 | `demo.auditor@mobilehubbd.test` |
| **SEO** | 1 | `seo@mobilehubbd.test` |
| **Technician** | 12 | 1 seeded (`demo.technician@mobilehubbd.test`) + 11 e2e test accounts (`test.tech.<timestamp>@mobilehubbd.test`) |
| **Salesperson** | 12 | 1 seeded (`sales@mobilehubbd.test`) + 11 e2e test accounts (`test.sales.<timestamp>@mobilehubbd.test`) |
| **Custom Staff** | 12 | 12 e2e test accounts (`staff.<timestamp>@mobilehubbd.test`) created during HRM custom role testing |
