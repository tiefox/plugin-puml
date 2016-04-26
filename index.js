var plantumlEncoder = require('plantuml-encoder');
var fs = require('fs');
var tmp = require('tmp');
var shell = require('shelljs');
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

    getPlantUMLOutput: function(data) {
        if(!this.jarPath) {
            this.jarPath = this.getPlantUMLJarPath();
        }
        var output = '';
        if (this.writeUMLDataToTempFile(data) && this.tmpFile.name && this.jarPath) {
            try {
                var command = 'cat ' + this.tmpFile.name + ' | java -Dapple.awt.UIElement=true -jar ' + this.jarPath + ' -nbthread auto -tsvg -pipe';
                var commandOutput = shell.exec(command);
                output = commandOutput.stdout.trim();
            } catch (e) {
                console.error(err);
            }
        } else {
            console.error("temp file or jarpath not found");
        }
        return output;
    },

    blocks: {
        plantuml: {
            process: function(block) {
                return this.getPlantUMLOutput(block.body);
            }
        }
    },
    // Hook process during build
    hooks: {
        // For all the hooks, this represent the current generator

        // This is called before the book is generated
        "init": function() {
            this.jarPath = this.getPlantUMLJarPath();
        },

        // This is called after the book generation
        "finish": function() {

        }
    }
};
