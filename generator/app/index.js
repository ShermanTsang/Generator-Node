const yosay = require("yosay");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const Generator = require("yeoman-generator");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.status = {
      templatePathExisted: true
    };
  }

  prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.red("sherman-node")} project generator!\n`)
    );
    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "The name of your project?"
      },
      {
        type: "input",
        name: "projectDescription",
        message: "The description of your project?"
      },
      {
        type: "list",
        name: "mode",
        message: "Which mode and boilerplate of node project you wanna use?",
        default: "mode1",
        choices: [
          {
            key: "mode1",
            name:
              "Lang(TypeScript) + ModuleStandard(esm)+ Builder(rollup) + DevServer(nodemon) + Runtime(ts-node)",
            value: "mode1"
          },
          {
            key: "mode2",
            name:
              "Lang(TypeScript) + ModuleStandard(esm)+ Builder(esbuild) + DevServer(nodemon) + Runtime(esno/tsx)",
            value: "mode2"
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  default() {
    this.log(
      `${chalk.bgGreen("[ Info ]")} default destination path is ${chalk.blue(
        this.destinationPath()
      )}\n`
    );
    this.log(
      `${chalk.bgGreen("[ Info ]")} generator templates path is ${chalk.blue(
        this.templatePath()
      )}\n`
    );

    if (this.props.mode === "mode1") {
      if (path.basename(this.destinationPath()) !== this.props.projectName) {
        console.log(1, this.props);
        mkdirp(this.props.projectName);
        console.log(2);
        this.log(
          `${chalk.bgGreen("[ Info ]")} create ${chalk.blue(
            this.destinationPath()
          )} director\n`
        );
        this.destinationRoot(this.destinationPath(this.props.projectName));
        console.log(3);
        this.log(
          `${chalk.bgYellow("[ Notice ]")} set destination path to ${chalk.blue(
            this.destinationPath()
          )}\n`
        );
      }
    }

    if (this.props.mode === "mode2") {
      this.log(`${chalk.bgGreen("[ Warning ]")} mode2 is under construction\n`);
    }
  }

  writing() {
    this.renderTplFile();
  }

  renderTplFile() {
    const templatePath = path.normalize(
      this.templatePath() + "/" + this.props.mode
    );
    this.log(
      `${chalk.bgGreen("[ Info ]")} target template director is ${chalk.blue(
        templatePath
      )}\n`
    );

    try {
      fs.accessSync(templatePath);
      const templateFiles = [];

      const fileMapper = filePath => {
        const files = fs.readdirSync(filePath);
        files.forEach(function(filename) {
          const fileDir = path.join(filePath, filename);
          const stats = fs.statSync(fileDir);
          if (stats.isFile()) {
            templateFiles.push(fileDir);
          }

          if (stats.isDirectory()) {
            fileMapper(fileDir);
          }
        });
      };

      fileMapper(templatePath);

      templateFiles.forEach(filePath => {
        const fileBarePath = filePath.replace(
          path.normalize(this.templatePath() + "/"),
          ""
        );
        this.fs.copyTpl(
          this.templatePath(fileBarePath),
          this.destinationPath(
            path.normalize(fileBarePath.replace(this.props.mode, "./"))
          ),
          this.props
        );
      });
    } catch (e) {
      console.log(e);
      this.log(
        `${chalk.bgRed("[ Error ]")} target template director is ${chalk.blue(
          templatePath
        )} not existed\n`
      );
      this.status.templatePathExisted = false;
    }
  }

  install() {
    if (this.status.templatePathExisted) {
      this.installDependencies();
    }
  }
};
