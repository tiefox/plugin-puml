var puml = require('./lib/puml');

module.exports = {

    blocks: {
        plantuml: {
            process: function(block) {
                return puml.getPlantUMLOutput(block.body);
            }
        }
    },

};
