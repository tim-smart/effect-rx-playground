/* eslint-disable require-yield */
import * as Runner from "@effect/platform/WorkerRunner"
import * as BrowserRunner from "@effect/platform-browser/BrowserWorkerRunner"
import { Requests } from "./schema"
import { Effect, Layer } from "effect"

Runner.layerSerialized(Requests, {
  InitialMessage: () =>
    Effect.gen(function* () {
      console.log("Hello from worker")
    }),
  GetId: ({ id }) => Effect.succeed(id).pipe(Effect.delay(1000)),
}).pipe(Layer.provide(BrowserRunner.layer), Layer.launch, Effect.runPromise)
