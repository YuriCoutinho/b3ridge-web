export class BrapiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'BrapiError';
    this.status = status;
  }
}
