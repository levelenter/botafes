import path from "path";
import express from "express";
import compression from "compression";
import config from "config";
import { AddressInfo } from "net";

// Expressアプリケーションの開始
export const app = express();
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(compression({ level: 6 }));

app.use("/app/", express.static(path.resolve("docs")));

export const server = app.listen(config.get<number>("server_port"), () => {
  const address: AddressInfo = server.address() as AddressInfo;
  console.info("BOTAFES APPはPORT:" + address.port + "をリッスンしています。");
});
