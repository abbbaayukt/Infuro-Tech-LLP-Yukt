import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.REQUEST,
})
export class TenantContext {
  private schema!: string;

  setSchema(schema: string) {
    this.schema = schema;
  }

  getSchema(): string {
    return this.schema;
  }
}