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
    this.log(yosay(`Welcome to the ${chalk.red("sherman-nuxt")} generator!\n`));
    const prompts = [
      {
        type: "input",
        name: "name",
        message: "The name of your project?",
        default: this.appname
      },
      {
        type: "list",
        name: "version",
        message: "Which version and boilerplate of nuxt you wanna use?",
        default: "v2",
        choices: [
          {
            key: "v2",
            name: "Nuxt2.x + Webpack + JavaScript",
            value: "v2"
          },
          {
            key: "v3",
            name: "Nuxt3.x + Vite + TypeScript",
            value: "v3"
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

    if (this.props.version === "v2") {
      if (path.basename(this.destinationPath()) !== this.props.name) {
        mkdirp(this.props.name);
        this.log(
          `${chalk.bgGreen("[ Info ]")} create ${chalk.blue(
            this.destinationPath()
          )} director\n`
        );
        this.destinationRoot(this.destinationPath(this.props.name));
        this.log(
          `${chalk.bgYellow("[ Notice ]")} set destination path to ${chalk.blue(
            this.destinationPath()
          )}\n`
        );
      }
    }

    if (this.props.version === "v3") {
      this.log(
        `${chalk.bgGreen("[ Warning ]")} version3 is under construction\n`
      );
    }
  }

  writing() {
    const templatePath = path.normalize(
      this.templatePath() + "/" + this.props.version
    );
    this.log(
      `${chalk.bgGreen("[ Info ]")} target template director is ${chalk.blue(
        templatePath
      )}\n`
    );

    try {
      fs.accessSync(templatePath);
      const templateFiles = [];

      function fileMapper(filePath) {
        const files = fs.readdirSync(filePath);
        files.forEach(function (filename) {
          const fileDir = path.join(filePath, filename);
          const stats = fs.statSync(fileDir);
          if (stats.isFile()) {
            templateFiles.push(fileDir);
          }

          if (stats.isDirectory()) {
            fileMapper(fileDir);
          }
        });
      }

      fileMapper(templatePath);

      templateFiles.forEach(filePath => {
        const fileBarePath = filePath.replace(
          path.normalize(this.templatePath() + "/"),
          ""
        );
        this.fs.copyTpl(
          this.templatePath(fileBarePath),
          this.destinationPath(
            path.normalize(fileBarePath.replace(this.props.version, "./"))
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
