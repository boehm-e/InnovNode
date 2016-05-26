var Mic = require('node-microphone');
var mic = new Mic();
var errorHandler = function ( error ) {
    console.log('received an error, stopping');
    mic.stopRecording();
}
var audioStream = function( audioData ) {
    console.log('received audio with length: ' + audioData.length );
}
var infoStream = function( infoData ) {
    console.log('received info' );
}
mic.startRecording( audioStream, infoStream );
