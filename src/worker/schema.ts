import { Schema } from "effect"

export class InitialMessage extends Schema.TaggedRequest<InitialMessage>()(
  "InitialMessage",
  {
    failure: Schema.Never,
    success: Schema.Void,
    payload: {},
  }
) {}

export class GetId extends Schema.TaggedRequest<GetId>()(
  "GetId",
  {
    failure: Schema.Never,
    success: Schema.String,
    payload: { id: Schema.String }
  }
) {}

export const Requests = Schema.Union(InitialMessage, GetId)
export type Requests = Schema.Schema.Type<typeof Requests>
