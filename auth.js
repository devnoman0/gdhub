const express = require("express");
const chalk = require("chalk");
const open = require("open");
const fs = require("fs");
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  "845827732371-luohkejkcfoo8eiaku0qt31ruvalp5ja.apps.googleusercontent.com",
  "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",
  "http://localhost:2000/callback"
);

const auth = async (postId, options) => {
  //check if this is a gdhub project
  await fs.access(__dirname + "/.gdhub", function (error) {
    if (error) {
      console.log("Ok", __dirname);
      console.log(chalk.red("Sorry this is not a gdhub project!"));
      console.log(
        chalk.yellow("You can run 'gdhub init' to initialize a project")
      );
      return false;
    } else {
      const app = express();
      var server;

      app.get("/callback", async (req, res) => {
        server.close(function () {
          console.log(
            chalk.bold(
              "You have successfully authenticated your CLI application!"
            )
          );
        });

        const { tokens } = await oauth2Client.getToken(req.query.code);

        fs.readFile(__dirname + "/.gdhub/auth.json", function (err, data) {
          fs.writeFile(
            __dirname + "/.gdhub/auth.json",
            JSON.stringify(tokens),
            () => {
              return res.send({
                message: "Authintication is successfull",
              });
            }
          );
        });
      });

      server = app.listen(2000, function () {
        console.log(chalk.yellow("Authiticating...."));
      });

      const scopes = ["https://www.googleapis.com/auth/drive"];

      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
      });

      open(url);
    }
  });
};

module.exports = auth;
