const chalk = require("chalk");
const fs = require("fs");

const init = async () => {
  //check if this is a .gdhub project
  await fs.access(__dirname + "/.gdhub", async function (error) {
    if (error) {
      await fs.mkdirSync(__dirname + "/.gdhub");
      await fs.writeFile(__dirname + "/.gdhub/auth.json", "{}", () => {
        console.log(
          chalk.green("Awesome..! A new gdhub project is initialized")
        );
        return false;
      });
    } else {
      console.log(chalk.red("You already have a gdhub project initialized"));
      return false;
    }
  });
};

module.exports = init;
