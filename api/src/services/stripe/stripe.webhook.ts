import Stripe from 'stripe';

import { adminService } from 'resources/admin';
import { subscriptionService } from 'resources/subscription';
import { emailService } from 'services';
import { additionalPackageService } from 'resources/additional-package';

export default function (event: Stripe.Event) {
  switch (event.type) {
    case 'customer.created':
      adminService.attachStripeCustomerId(event.data.object);
      return;
    case 'customer.subscription.updated':
      subscriptionService.updateSubscription(event.data.object);
      return;
    case 'customer.subscription.created':
      subscriptionService.updateSubscription(event.data.object);
      return;
    case 'invoice.upcoming':
      emailService.sendRenewalReminder(event.data.object as Stripe.Invoice);
      return;
    case 'customer.subscription.deleted':
      subscriptionService.deleteSubscription(event.data.object);
    case 'invoice.payment_succeeded':
      additionalPackageService.paymentIntent(event.data.object);
      return;
  }
}
