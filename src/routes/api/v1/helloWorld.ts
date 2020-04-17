import { Request, Response } from "../../../trainstation";

export default function helloWorld(req: Request, res: Response) {
  res.send("Hello " + req.query.name);
}
