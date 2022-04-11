const express = require("express");
const chalk = require("chalk");
const open = require("open");
const fs = require("fs");
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_API_SECRET,
  process.env.REDIRECT_URI
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
