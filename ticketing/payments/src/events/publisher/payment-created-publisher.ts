import { Subjects, Publisher, PaymentCreatedEvent } from '@itsme33/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
