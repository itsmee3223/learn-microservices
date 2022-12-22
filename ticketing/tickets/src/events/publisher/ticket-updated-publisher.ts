import { Publisher, Subjects, TicketUpdatedEvent } from '@itsme33/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
