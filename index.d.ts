import * as express from "express"

declare function restToGraphQL(
  req: express.Request,
  res: express.Response
): void
