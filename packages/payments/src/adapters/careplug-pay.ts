/**
 * CarePlug Pay adapter — stub.
 *
 * Conforms to the `PaymentAdapter` interface so the router can return it for
 * clinical-tier products. Every method throws until partner credentials and
 * API spec are in hand. The shape exists so swapping in the real implementation
 * later requires zero changes to consumers.
 *
 * Doctrine: high-risk product categories (peptides, hormones, controlled)
 * route through CarePlug Pay rather than Stripe.
 */

import type {
  CheckoutIntent,
  CheckoutSession,
  ConnectOnboardingLink,
  PaymentAdapter,
  PaymentEvent,
  RefundResult,
} from "../types";

class NotImplementedError extends Error {
  constructor(method: string) {
    super(
      `[CarePlug Pay] ${method} is not implemented. Sign a CarePlug Pay partner agreement and set CAREPLUG_PAY_API_KEY before routing clinical-tier products through this adapter.`,
    );
    this.name = "NotImplementedError";
  }
}

export class CarePlugPayAdapter implements PaymentAdapter {
  readonly kind = "careplug-pay" as const;

  async createCheckoutSession(_intent: CheckoutIntent): Promise<CheckoutSession> {
    throw new NotImplementedError("createCheckoutSession");
  }

  async createConnectOnboardingLink(_args: {
    operatorId: string;
    returnUrl: string;
    refreshUrl: string;
  }): Promise<ConnectOnboardingLink> {
    throw new NotImplementedError("createConnectOnboardingLink");
  }

  async refund(_args: {
    externalOrderId: string;
    amount?: number;
  }): Promise<RefundResult> {
    throw new NotImplementedError("refund");
  }

  async handleWebhook(_args: {
    rawBody: string;
    signature: string | null;
  }): Promise<PaymentEvent[]> {
    // Webhook receiver may fire this in mock mode; return empty rather than
    // throw so we don't 500 on a misconfigured but harmless probe.
    return [];
  }
}

export const carePlugPayAdapter = new CarePlugPayAdapter();
