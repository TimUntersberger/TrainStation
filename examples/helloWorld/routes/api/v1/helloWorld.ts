import { Request, Response } from "trainstation";
import * as t from "io-ts";
import * as v from "io-ts-validations";

export const bodySchema = t.type({
  name: v.isString,
  age: v.required,
});

export const method = "post";

export default function helloWorld(
  req: Request<any, typeof bodySchema>,
  res: Response
) {
  res.send(
    "Hello " + req.body.name + ". You are " + req.body.age + " years old."
  );
}
