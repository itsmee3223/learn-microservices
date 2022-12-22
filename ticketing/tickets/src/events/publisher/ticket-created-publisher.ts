import { Publisher, Subjects, TicketCreatedEvent } from '@itsme33/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
