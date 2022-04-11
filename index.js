#!/usr/bin/env node
const cli = require("commander");
const dotenv = require("dotenv");

//configure dot env
dotenv.config();

const auth = require("./auth");
const init = require("./init");
const push = require("./push");

cli.description("Google Drive Code Backup CLI");
cli.name("gdhub");

cli
  .command("init")
  .description("To initialize a local gdhub project")
  .action(init);

cli
  .command("auth")
  .description("Authintication with your google drive account.")
  .action(auth);

cli
  .command("push")
  .description(
    "This will send all the recent changed file to your authinticated google drive account"
  )
  .action(push);

cli.parse(process.argv);
