const API_BASE = "http://localhost:4000/api/v1";
const FRONTEND_BASE = "http://localhost:3000";

const SEEDED_ACCOUNTS = [
  { role: "Global Admin", email: "admin@mobilehubbd.tech", expectedPath: "/admin", isTech: false },
  { role: "Demo Admin", email: "demo.admin@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Branch Admin", email: "demo.branchadmin@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Branch Manager", email: "demo.branchmanager@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Salesperson", email: "sales@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Purchase Manager", email: "demo.purchasemanager@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Product Uploader", email: "demo.productuploader@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Customer Service", email: "demo.customerservice@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Technician", email: "demo.technician@mobilehubbd.test", expectedPath: "/admin/technician", isTech: true },
  { role: "SEO", email: "demo.seo@mobilehubbd.test", expectedPath: "/admin", isTech: false },
  { role: "Inventory Auditor", email: "demo.auditor@mobilehubbd.test", expectedPath: "/admin", isTech: false },
];

const DEFAULT_PASS = "Admin@123456";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=== FIX PASS 43: VERIFICATION SUITE ===");

  // --- PART 1: Staff Roles Login & Routing Verification ---
  console.log("\n--- Part 1: Staff Roles Login & Routing Verification ---");
  const roleResults = [];

  let adminToken = "";

  for (const acc of SEEDED_ACCOUNTS) {
    try {
      const res = await fetch(`${API_BASE}/auth/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: acc.email, password: DEFAULT_PASS }),
      });

      const data = await res.json();
      if (!res.ok) {
        roleResults.push({
          role: acc.role,
          loginOk: false,
          landingPage: "N/A",
          sidebarOk: false,
          sidebarType: "N/A",
          error: data.message || `HTTP ${res.status}`,
        });
        continue;
      }

      if (acc.email === "admin@mobilehubbd.tech") {
        adminToken = data.accessToken;
      }

      const roleName = (data.user?.role?.name || "").toLowerCase();
      const actualPath = roleName.includes("technician") ? "/admin/technician" : "/admin";
      const pathMatch = actualPath === acc.expectedPath;
      const sidebarType = roleName.includes("technician") ? "Technician Nav" : "Admin Nav";

      // Verify token access to /auth/me
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const meOk = meRes.ok;

      roleResults.push({
        role: acc.role,
        loginOk: true,
        landingPage: actualPath,
        sidebarOk: pathMatch && meOk,
        sidebarType,
        error: meOk ? "None" : `Me HTTP ${meRes.status}`,
      });
    } catch (err) {
      roleResults.push({
        role: acc.role,
        loginOk: false,
        landingPage: "N/A",
        sidebarOk: false,
        sidebarType: "N/A",
        error: err.message,
      });
    }
  }

  console.table(roleResults);

  // --- PART 2: Customer Login & Token Isolation ---
  console.log("\n--- Part 2: Customer Login & Token Isolation ---");
  const custRes = await fetch(`${API_BASE}/auth/customer/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone: "customer@mobilehubbd.test", password: DEFAULT_PASS }),
  });
  const custData = await custRes.json();
  console.log(`Customer login: HTTP ${custRes.status}, token received: ${!!custData.accessToken}`);

  // Customer token attempting staff endpoint /employees
  const staffProbeRes = await fetch(`${API_BASE}/employees`, {
    headers: { Authorization: `Bearer ${custData.accessToken}` },
  });
  console.log(`Customer token accessing staff /employees: HTTP ${staffProbeRes.status} (Expected 401 or 403)`);
  const isolationOk = staffProbeRes.status === 401 || staffProbeRes.status === 403;
  console.log(`Token isolation verified: ${isolationOk ? "PASS" : "FAIL"}`);

  // --- PART 3: HRM Employee Lifecycle Test ---
  console.log("\n--- Part 3: HRM Employee Lifecycle Test ---");
  if (!adminToken) {
    throw new Error("Cannot run HRM test without admin token");
  }

  // Get roles
  const rolesRes = await fetch(`${API_BASE}/roles`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const roles = await rolesRes.json();
  if (!Array.isArray(roles)) {
    throw new Error(`Failed to fetch roles: ${JSON.stringify(roles)}`);
  }
  const techRole = roles.find((r) => r.name === "Technician");
  const salesRole = roles.find((r) => r.name === "Salesperson");

  console.log(`Found Technician role (${techRole?.id}) and Salesperson role (${salesRole?.id})`);

  // Get flagship branch
  const branchesRes = await fetch(`${API_BASE}/branches`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const branches = await branchesRes.json();
  const branchId = branches[0]?.id;

  const testTechEmail = `hrm.tech.${Date.now()}@mobilehubbd.test`;
  const testTechPhone = `017${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testPassword = "StrongTestPassword123!Aa";

  console.log(`Creating test technician employee: email=${testTechEmail}, phone=${testTechPhone}`);

  const createRes = await fetch(`${API_BASE}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: "Test Pass 43 Technician",
      email: testTechEmail,
      phone: testTechPhone,
      password: testPassword,
      roleId: techRole.id,
      branchId,
      adminPanelAccess: true,
      isTechnician: true,
      profitSharePercentage: 50,
    }),
  });
  const createdEmployee = await createRes.json();
  console.log(`Employee created: HTTP ${createRes.status}, id=${createdEmployee.id}`);

  // Login as test technician via email
  const techEmailLogin = await fetch(`${API_BASE}/auth/staff/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testTechEmail, password: testPassword }),
  });
  const techEmailData = await techEmailLogin.json();
  const techLanding = (techEmailData.user?.role?.name || "").toLowerCase().includes("technician")
    ? "/admin/technician"
    : "/admin";
  console.log(`Login by email: HTTP ${techEmailLogin.status}, Role=${techEmailData.user?.role?.name}, Landing=${techLanding}`);

  // Login as test technician via phone
  const techPhoneLogin = await fetch(`${API_BASE}/auth/staff/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone: testTechPhone, password: testPassword }),
  });
  const techPhoneData = await techPhoneLogin.json();
  console.log(`Login by phone: HTTP ${techPhoneLogin.status}, Role=${techPhoneData.user?.role?.name}`);

  // Change role to Salesperson
  console.log("Updating role to Salesperson...");
  const updateRoleRes = await fetch(`${API_BASE}/employees/${createdEmployee.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      roleId: salesRole.id,
      isTechnician: false,
    }),
  });
  console.log(`Role updated: HTTP ${updateRoleRes.status}`);

  // Log in again -> landing should change to /admin
  const salesLogin = await fetch(`${API_BASE}/auth/staff/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testTechEmail, password: testPassword }),
  });
  const salesData = await salesLogin.json();
  const salesLanding = (salesData.user?.role?.name || "").toLowerCase().includes("technician")
    ? "/admin/technician"
    : "/admin";
  console.log(`Login after role change: HTTP ${salesLogin.status}, Role=${salesData.user?.role?.name}, Landing=${salesLanding}`);

  // Deactivate employee
  console.log("Deactivating employee (setting status to INACTIVE)...");
  const deactivateRes = await fetch(`${API_BASE}/employees/${createdEmployee.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: "INACTIVE" }),
  });
  console.log(`Status update: HTTP ${deactivateRes.status}`);

  // Login attempt on deactivated employee -> must be rejected
  const deactLogin = await fetch(`${API_BASE}/auth/staff/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testTechEmail, password: testPassword }),
  });
  const deactData = await deactLogin.json();
  console.log(`Login while INACTIVE: HTTP ${deactLogin.status} (Expected 403), message="${deactData.message}"`);

  // Delete test employee
  console.log("Deleting test employee...");
  const delRes = await fetch(`${API_BASE}/employees/${createdEmployee.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`Delete employee: HTTP ${delRes.status}`);

  // Confirm technicians list and employees list still load
  const techList = await fetch(`${API_BASE}/employees/technicians`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const empList = await fetch(`${API_BASE}/employees`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`/employees/technicians status: HTTP ${techList.status}, /employees status: HTTP ${empList.status}`);

  // --- PART 4: Wrong Password & Rate Limiting Check ---
  console.log("\n--- Part 4: Wrong Password & Rate Limiting Verification ---");
  
  // Single wrong password
  const wrongPassRes = await fetch(`${API_BASE}/auth/staff/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@mobilehubbd.tech", password: "CompletelyWrongPassword!" }),
  });
  const wrongPassData = await wrongPassRes.json();
  console.log(`Wrong password test: HTTP ${wrongPassRes.status} -> ${JSON.stringify(wrongPassData)}`);

  // Rapid failed attempts
  console.log("Triggering 11 rapid failed login attempts on test identifier...");
  let rateLimitHit = false;
  let lastStatus = 0;
  let lastMsg = "";
  for (let i = 1; i <= 11; i++) {
    const r = await fetch(`${API_BASE}/auth/staff/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `lockout.${Date.now()}.${i}@example.com`, password: "BadPassword123!" }),
    });
    lastStatus = r.status;
    const body = await r.json();
    lastMsg = body.message;
    if (r.status === 429 || (body.message && body.message.toLowerCase().includes("too many"))) {
      rateLimitHit = true;
      console.log(`Attempt ${i}: Rate limit triggered with HTTP ${r.status}: ${JSON.stringify(body)}`);
      break;
    }
  }
  console.log(`Rate limit outcome: hit=${rateLimitHit}, final status=${lastStatus}, message="${lastMsg}"`);

  console.log("\n=== ALL PASS 43 TESTS COMPLETED ===");
}

run().catch((e) => {
  console.error("FATAL in test suite:", e);
  process.exit(1);
});
