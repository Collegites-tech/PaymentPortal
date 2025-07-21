export class PaymentService {
  static async createPayment(paymentData: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const paymentId = `PAY_${Date.now()}`
    const paymentUrl = `${window.location.origin}/pay/${paymentId}`

    const payment = {
      id: paymentId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      description: paymentData.description,
      customerEmail: paymentData.customerEmail,
      customerName: paymentData.customerName,
      paymentUrl,
      qrCodeUrl: `${window.location.origin}/qr/${paymentId}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Store payment (simulate database)
    const existingPayments = this.getStoredPayments()
    existingPayments.push(payment)
    localStorage.setItem("payments", JSON.stringify(existingPayments))

    return payment
  }

  static async getPayments(filters?: any) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return this.getStoredPayments()
  }

  static async getPayment(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const payments = this.getStoredPayments()
    return payments.find((p: any) => p.id === id)
  }

  static async generateQRCode(paymentData: any) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const qrId = `QR_${Date.now()}`
    const qrData = {
      id: qrId,
      paymentId: paymentData.paymentId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      description: paymentData.description,
      qrCodeUrl: `/placeholder.svg?height=200&width=200&text=QR+Code+${qrId}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    return qrData
  }

  private static getStoredPayments() {
    const payments = localStorage.getItem("payments")
    return payments ? JSON.parse(payments) : []
  }
}
