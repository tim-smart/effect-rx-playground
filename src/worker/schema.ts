import * as Schema from "@effect/schema/Schema"

export class InitialMessage extends Schema.TaggedRequest<InitialMessage>()(
  "InitialMessage",
  Schema.Never,
  Schema.Void,
  {},
) {}

export class GetId extends Schema.TaggedRequest<GetId>()(
  "GetId",
  Schema.Never,
  Schema.String,
  { id: Schema.String },
) {}

export const Requests = Schema.Union(InitialMessage, GetId)
export type Requests = Schema.Schema.Type<typeof Requests>
