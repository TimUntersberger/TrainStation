import { Request, Response } from "trainstation";
import * as t from "io-ts";
import * as v from "io-ts-validations";

export const querySchema = t.type({
  name: v.isString,
  age: v.required,
});

export default function helloWorld(
  req: Request<typeof querySchema>,
  res: Response
) {
  res.send(
    "Hello " + req.query.name + ". You are " + req.query.age + " years old."
  );
}
