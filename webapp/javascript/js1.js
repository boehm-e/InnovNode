var Socket = new WebSocket("ws://127.0.0.1:8080");
function voice(){
    (function($){

        if ('webkitSpeechRecognition' in window) {
            var recognition = new webkitSpeechRecognition();
            var text = '';

            recognition.lang = "fr-FR";
            recognition.continuous = false;
            recognition.interimResults = true;

            $('#forground').click(function(){
		recognition.abort();
                recognition.start();
                $('#result').text('Dites quelque chose');
                $('#forground').removeClass('passive').addClass('active');
            });
            $('#h1').hide();
            recognition.onresult = function (event) {
                $('#result').text('');
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {                 // si l'enregistrement est fini
                        $('#forground').removeClass('active').addClass('passive');
                    var transcript = event.results[i][0].transcript;
			recognition.abort();
			console.log(transcript);
			Socket.send(transcript);
			//                voice();
		    }else{
			$('#result').text($('#result').text() + event.results[i][0].transcript);
		    }
		}
	    };
	}else{
	    //                $('#btn').hide();
	}
	
	
    })(jQuery);
}
voice();
