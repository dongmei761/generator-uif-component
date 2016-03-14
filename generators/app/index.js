'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.log(yosay(
      'Welcome to the ' + chalk.red('UI component') + ' generator!'
    ));
  },

  prompting: function () {
    var done = this.async();
    var prompts = [{
      type: 'list',
      name: 'projectType',
      choices: ['simple component', 'component with model', 'new grid'],
      message: 'Choose a template that will be used',
      default: 0
    }, {
      type: 'input',
      name: 'gridName',
      message: 'Please input a name for your new grid~',
      default: this.user.git.name(),
      when: function(answers) {
        return answers.projectType === 'new grid';
      }
    }, {
      type: 'input',
      name: 'componentName',
      message: 'Please input a name for your new component~',
      default: this.user.git.name(),
      when: function(answers) {
        return (answers.projectType === 'simple component' || answers.projectType === 'component with model');
      }
    }];

    this.prompt(prompts, function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },

  writing: function () {
    var componentTemplate = '';
    var componentName = '';
    var filesToCreate = ['component', 'action', 'reducer', 'model'];
    var fileType = '';
    var projectType = this.answers.projectType;

    componentName = projectType === 'new grid' ? this.answers.gridName : this.answers.componentName;

    filesToCreate.map(function(item) {
      if ((item !== 'component' && projectType !== 'simple component') || item === 'component') {
        fileType = item === 'component' ? '.jsx' : '.js';
        componentTemplate = (item === 'component' && projectType === 'new grid') ? 'grid.txt' : item + '.txt';
        this.fs.copyTpl(
          this.templatePath(componentTemplate),
          this.destinationPath(componentName + '/' + item + '/' + componentName + '_' + item + fileType),
          {
            name: componentName,
            projectType: projectType
          }
        );
      }
    }.bind(this));
  }
});
