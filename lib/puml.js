var fs = require('fs');
var tmp = require('tmp');
var shell = require('shelljs');
var datauri = require('datauri').sync;
shell.config.silent = true;

module.exports = {
    
    jarPath: "",
    tmpFile: "",

     getPlantUMLJarPath: function() {

        var jarPath = "";
        try {
            //We assume that plantuml was installed unsing homebrew
            //So we search the shell script that was installed by homebrew
            //To find the path to the plantuml jar file that can be used 
            //for creating the svgs
            var plantUmlPath = shell.exec('which plantuml').stdout.trim();
            jarPath = shell.cat(plantUmlPath).stdout.split(" ")[4];
        } catch (e) {}
        return jarPath;
    },

    writeUMLDataToTempFile: function(data) {
        this.tmpFile = tmp.fileSync();
        try {
            fs.writeFileSync(this.tmpFile.name, data, 'utf8');
        } catch (e) {}

        var fileData = shell.cat(this.tmpFile.name);
        return fileData.stdout !== "";
    },

    getPlantUMLOutput: function(format,data) {
        if(!this.jarPath) {
            this.jarPath = this.getPlantUMLJarPath();
        }
        var output = '';
        if (this.writeUMLDataToTempFile(data) && this.tmpFile.name && this.jarPath) {
            try {
                var outputPng = tmp.fileSync({ postfix: '.png' });
                var command = 'cat ' + this.tmpFile.name + ' | java -Djava.awt.headless=true -jar ' + this.jarPath + ' -nbthread auto -tpng -pipe > ' + outputPng.name;
                var commandOutput = shell.exec(command);
                output = commandOutput.stdout.trim();//replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>','');
                return '<img src="' + datauri(outputPng.name) + '">';
            } catch (e) {
                console.error(e);
            }
        } else {
            console.error("temp file or jarpath not found");
        }
        return output;
    },

};