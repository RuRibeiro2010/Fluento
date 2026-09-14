import { IDomainEvent } from './domain-event';

export abstract class Entity<TProps> {
  protected readonly _id: string;
  protected readonly _props: TProps;
  private readonly _domainEvents: IDomainEvent[] = [];

  constructor(id: string, props: TProps) {
    this._id = id;
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get domainEvents(): ReadonlyArray<IDomainEvent> {
    return this._domainEvents;
  }

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }

  public equals(other?: Entity<TProps>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    if (!(other instanceof Entity)) {
      return false;
    }
    return this._id === other._id;
  }
}
