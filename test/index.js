var path = require('path');
var fs = require('fs');
var tester = require('gitbook-tester');
var assert = require('assert');
var plugin = require('../lib/puml.js');

describe('PlantUML', function() {
    
    it('should correctly find the path to the jar file', function() {
        assert.equal(plugin.getPlantUMLJarPath(),'/usr/local/Cellar/plantuml/8037/plantuml.8037.jar');        
    });

    it('should have UML data written to temp file', function() {
        assert.equal(plugin.writeUMLDataToTempFile("\nBob->Alice : hello\n"),true);
    });

    it('should return the SVG UML', function() {
        assert.equal(plugin.getPlantUMLOutput("\nBob->Alice : hello\n"),'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="126px" style="width:118px;height:126px;" version="1.1" viewBox="0 0 118 126" width="118px"><defs><filter height="300%" id="f1" width="300%" x="-1" y="-1"><feGaussianBlur result="blurOut" stdDeviation="2.0"/><feColorMatrix in="blurOut" result="blurOut2" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .4 0"/><feOffset dx="4.0" dy="4.0" in="blurOut2" result="blurOut3"/><feBlend in="SourceGraphic" in2="blurOut3" mode="normal"/></filter></defs><g><line style="stroke: #A80036; stroke-width: 1.0; stroke-dasharray: 5.0,5.0;" x1="30" x2="30" y1="38.4883" y2="87.7988"/><line style="stroke: #A80036; stroke-width: 1.0; stroke-dasharray: 5.0,5.0;" x1="87" x2="87" y1="38.4883" y2="87.7988"/><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="40" x="8" y="3"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="26" x="15" y="23.5352">Bob</text><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="40" x="8" y="86.7988"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="26" x="15" y="107.334">Bob</text><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="47" x="62" y="3"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="33" x="69" y="23.5352">Alice</text><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="47" x="62" y="86.7988"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="33" x="69" y="107.334">Alice</text><polygon fill="#A80036" points="75.5,65.4883,85.5,69.4883,75.5,73.4883,79.5,69.4883" style="stroke: #A80036; stroke-width: 1.0;"/><line style="stroke: #A80036; stroke-width: 1.0;" x1="30" x2="81.5" y1="69.4883" y2="69.4883"/><text fill="#000000" font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="31" x="37" y="65.0566">hello</text></g></svg>');
    });

    it('should correctly replace by img html tag', function() {
        return tester.builder()
            .withContent('This is a diagram:\n\n{% plantuml %}\nBob->Alice : hello\n{% endplantuml %}')
            .withBookJson({
                plugins: ['puml']
            })
            .withLocalPlugin(path.join(__dirname, '..'))
            .create()
            .then(function(result) {
                assert.equal(result[0].content, '<p>This is a diagram:</p>\n<p><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="126px" style="width:118px;height:126px;" version="1.1" viewbox="0 0 118 126" width="118px"><defs><filter height="300%" id="f1" width="300%" x="-1" y="-1"><fegaussianblur result="blurOut" stddeviation="2.0"><fecolormatrix in="blurOut" result="blurOut2" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .4 0"><feoffset dx="4.0" dy="4.0" in="blurOut2" result="blurOut3"><feblend in="SourceGraphic" in2="blurOut3" mode="normal"/></feoffset></fecolormatrix></fegaussianblur></filter></defs><g><line style="stroke: #A80036; stroke-width: 1.0; stroke-dasharray: 5.0,5.0;" x1="30" x2="30" y1="38.4883" y2="87.7988"/><line style="stroke: #A80036; stroke-width: 1.0; stroke-dasharray: 5.0,5.0;" x1="87" x2="87" y1="38.4883" y2="87.7988"/><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="40" x="8" y="3"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthadjust="spacingAndGlyphs" textlength="26" x="15" y="23.5352">Bob</text><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="40" x="8" y="86.7988"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthadjust="spacingAndGlyphs" textlength="26" x="15" y="107.334">Bob</text><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="47" x="62" y="3"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthadjust="spacingAndGlyphs" textlength="33" x="69" y="23.5352">Alice</text><rect fill="#FEFECE" filter="url(#f1)" height="30.4883" style="stroke: #A80036; stroke-width: 1.5;" width="47" x="62" y="86.7988"/><text fill="#000000" font-family="sans-serif" font-size="14" lengthadjust="spacingAndGlyphs" textlength="33" x="69" y="107.334">Alice</text><polygon fill="#A80036" points="75.5,65.4883,85.5,69.4883,75.5,73.4883,79.5,69.4883" style="stroke: #A80036; stroke-width: 1.0;"/><line style="stroke: #A80036; stroke-width: 1.0;" x1="30" x2="81.5" y1="69.4883" y2="69.4883"/><text fill="#000000" font-family="sans-serif" font-size="13" lengthadjust="spacingAndGlyphs" textlength="31" x="37" y="65.0566">hello</text></g></svg></p>');
            });
    });
});
