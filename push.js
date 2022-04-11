const chalk = require("chalk");
const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

const push = async () => {
  //check if this is a gdhub project
  await fs.access(__dirname + "/.gdhub", function (error) {
    if (error) {
      console.log(chalk.red("Sorry this is not a gdhub project!"));
      console.log(
        chalk.yellow("You can run 'gdhub init' to initialize a project")
      );
      return false;
    } else {
      pushFunction();
    }
  });

  const pushFunction = async () => {
    try {
      const authSetting = require(__dirname + "/.gdhub/auth.json");
      if (
        authSetting.refresh_token === undefined ||
        authSetting.refresh_token === "" ||
        authSetting.refresh_token === null
      ) {
        console.log(chalk.red("Sorry your not authorized to push code at.!"));
        console.log(
          chalk.yellow(
            "You can run 'gdhub auth' to authinticate and push code."
          )
        );
        return false;
      }

      //push file to google drive
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_API_SECRET,
        process.env.REDIRECT_URI
      );
      oauth2Client.setCredentials(authSetting);

      const uploadSingleFile = async (drive, fileName, filePath) => {
        const folderId = "1NnNrg_Ma6iOIUmdk33O42Fy5GBOOkfuq";

        //TODO:: Check the file or folder is id it existed and update or create depends upon the result;

        const { data: { id, name } = {} } = await drive.files.create({
          resource: {
            name: fileName,
            parents: [folderId],
          },
          media: {
            // mimeType: "*",
            body: fs.createReadStream(filePath),
          },
          fields: "id,name",
        });
        console.log(chalk.yellow(`file Pushed ~ ${name} ~ ${id}`));
      };

      const scanFolderForFiles = async (auth, folderPath) => {
        const folder = await fs.promises.opendir(folderPath);

        const driveService = google.drive({ version: "v3", auth });

        for await (const dirent of folder) {
          //TODO:: check the .gdigonre file to avoid upload
          //TODO: Folder lavel Recursion checker

          if (dirent.isFile()) {
            await uploadSingleFile(
              driveService,
              dirent.name,
              path.join(folderPath, dirent.name)
            );
          }
        }
      };

      scanFolderForFiles(oauth2Client, ".").then(() => {
        console.log(
          chalk.green("🔥 Project successfully backed-up to google drive")
        );
      });
    } catch (error) {
      console.log("error", error.response.data);

      console.log(chalk.red("Sorry your not authorized to push code at.!"));
      console.log(
        chalk.yellow("You can run 'gdhub auth' to authinticate and push code.")
      );
      return false;
    }
  };
};

module.exports = push;
