import { Subjects, Publisher, OrderCancelledEvent } from '@itsme33/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
