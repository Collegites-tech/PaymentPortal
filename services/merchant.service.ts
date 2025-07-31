// /services/merchant.service.ts

export const merchantService = {
  // Dashboard
  async getDashboardData() {
    const res = await fetch("/api/merchant/dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    return res.json();
  },

  // Payments
  async createPayment(payload: any) {
    const res = await fetch("/api/merchant/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create payment");
    return res.json();
  },

  async getPayments() {
    const res = await fetch("/api/merchant/payments");
    if (!res.ok) throw new Error("Failed to fetch payments");
    return res.json();
  },

  // Stats for dashboard
  async getStats() {
    const res = await fetch("/api/merchant/stats");
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },

  // Requests from Super Admin
  async getRequests() {
    const res = await fetch("/api/merchant/requests");
    if (!res.ok) throw new Error("Failed to fetch requests");
    return res.json();
  },

  // API Keys
  async getMerchantApiKey() {
    const res = await fetch("/api/merchant/api-key");
    if (!res.ok) throw new Error("Failed to fetch API key");
    return res.json();
  },

  async regenerateMerchantApiKey() {
    const res = await fetch("/api/merchant/api-key/regenerate", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to regenerate API key");
    return res.json();
  },

  // Webhooks
  async getMerchantWebhooks() {
    const res = await fetch("/api/merchant/webhooks");
    if (!res.ok) throw new Error("Failed to fetch webhooks");
    return res.json();
  },

  async addMerchantWebhook(url: string) {
    const res = await fetch("/api/merchant/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error("Failed to add webhook");
    return res.json();
  },

  async deleteMerchantWebhook(id: string) {
    const res = await fetch(`/api/merchant/webhooks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete webhook");
    return res.json();
  },
};
