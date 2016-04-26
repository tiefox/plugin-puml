var puml = require('./lib/puml');

module.exports = {

    blocks: {
        plantuml: {
            process: function(block) {
                var defaultFormat = this.generator == 'ebook'? 'png' : 'svg';
                var format = block.kwargs.format || defaultFormat;
                return puml.getPlantUMLOutput(format,block.body);
            }
        }
    },

};
