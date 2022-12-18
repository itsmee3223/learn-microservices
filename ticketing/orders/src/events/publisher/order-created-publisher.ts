import { Publisher, OrderCreatedEvent, Subjects } from '@itsme33/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
