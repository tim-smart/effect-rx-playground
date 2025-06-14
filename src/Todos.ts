import { Rx } from "@effect-rx/rx-react"
import { Effect, Layer, Option, Schema, Stream } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"

export class Todo extends Schema.Class<Todo>("Todo")({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Boolean,
}) {
  static readonly array = Schema.Array(Todo)
  static readonly chunk = Schema.Chunk(Todo)
}

const make = Effect.gen(function* () {
  const defaultClient = yield* HttpClient.HttpClient
  const client = defaultClient.pipe(
    HttpClient.mapRequest(
      HttpClientRequest.prependUrl("https://jsonplaceholder.typicode.com"),
    ),
    HttpClient.filterStatusOk,
  )

  const getTodos = HttpClientRequest.get("/todos");
  const stream = (perPage: number) =>
    Stream.paginateChunkEffect(1, page =>
      getTodos.pipe(
        HttpClientRequest.setUrlParams({
          _page: page.toString(),
          _limit: perPage.toString(),
        }),
        client.execute,
        Effect.flatMap(HttpClientResponse.schemaBodyJson(Todo.chunk)),
        Effect.map(chunk => [
          chunk,
          Option.some(page + 1).pipe(
            Option.filter(() => chunk.length === perPage),
          ),
        ]),
      ),
    )
  const effect = getTodos.pipe(
    client.execute,
    Effect.flatMap(HttpClientResponse.schemaBodyJson(Todo.array)),
  )

  return { stream, effect } as const
})

export class Todos extends Effect.Tag("Todos")<
  Todos,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(Todos, make).pipe(Layer.provide(FetchHttpClient.layer))
}

// Rx exports

const todosRuntime = Rx.runtime(Todos.Live)

export const perPage = Rx.make(5)

export const stream = todosRuntime.pull(
  get => Stream.unwrap(Todos.stream(get(perPage))),
  // .pipe(
  //   // preload the next page
  //   Stream.bufferChunks({ capacity: 1 }),
  // ),
)

export const effect = todosRuntime.rx(Todos.effect)

export const streamIsDone = Rx.make(get => {
  const r = get(stream)
  return r._tag === "Success" && r.value.done
})
