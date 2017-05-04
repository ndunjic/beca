$(function () {
    /////////////////////////////////////////////////////////////////////////////

    function hendluj_selekciju_jezika() {
        var langs =
        [['Afrikaans', ['af-ZA']],
         ['Bahasa Indonesia', ['id-ID']],
         ['Bahasa Melayu', ['ms-MY']],
         ['Català', ['ca-ES']],
         ['Čeština', ['cs-CZ']],
         ['Deutsch', ['de-DE']],
         ['English', ['en-AU', 'Australia'],
                             ['en-CA', 'Canada'],
                             ['en-IN', 'India'],
                             ['en-NZ', 'New Zealand'],
                             ['en-ZA', 'South Africa'],
                             ['en-GB', 'United Kingdom'],
                             ['en-US', 'United States']],
         ['Español', ['es-AR', 'Argentina'],
                             ['es-BO', 'Bolivia'],
                             ['es-CL', 'Chile'],
                             ['es-CO', 'Colombia'],
                             ['es-CR', 'Costa Rica'],
                             ['es-EC', 'Ecuador'],
                             ['es-SV', 'El Salvador'],
                             ['es-ES', 'España'],
                             ['es-US', 'Estados Unidos'],
                             ['es-GT', 'Guatemala'],
                             ['es-HN', 'Honduras'],
                             ['es-MX', 'México'],
                             ['es-NI', 'Nicaragua'],
                             ['es-PA', 'Panamá'],
                             ['es-PY', 'Paraguay'],
                             ['es-PE', 'Perú'],
                             ['es-PR', 'Puerto Rico'],
                             ['es-DO', 'República Dominicana'],
                             ['es-UY', 'Uruguay'],
                             ['es-VE', 'Venezuela']],
         ['Euskara', ['eu-ES']],
         ['Français', ['fr-FR']],
         ['Galego', ['gl-ES']],
         ['Hrvatski', ['hr_HR']],
         ['IsiZulu', ['zu-ZA']],
         ['Íslenska', ['is-IS']],
         ['Italiano', ['it-IT', 'Italia'],
                             ['it-CH', 'Svizzera']],
         ['Magyar', ['hu-HU']],
         ['Nederlands', ['nl-NL']],
         ['Norsk bokmål', ['nb-NO']],
         ['Polski', ['pl-PL']],
         ['Português', ['pt-BR', 'Brasil'],
                             ['pt-PT', 'Portugal']],
         ['Română', ['ro-RO']],
         ['Slovenčina', ['sk-SK']],
         ['Suomi', ['fi-FI']],
         ['Svenska', ['sv-SE']],
         ['Türkçe', ['tr-TR']],
         ['български', ['bg-BG']],
         ['Pусский', ['ru-RU']],
         ['Српски', ['sr-RS']],
         ['한국어', ['ko-KR']],
         ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
                             ['cmn-Hans-HK', '普通话 (香港)'],
                             ['cmn-Hant-TW', '中文 (台灣)'],
                             ['yue-Hant-HK', '粵語 (香港)']],
         ['日本語', ['ja-JP']],
         ['ภาษาไทย', ['th-TH']],
         ['Lingua latīna', ['la']]];

        var select_dialect = $("#select_dialect")[0],
            select_language = $("#select_language")[0];

        for (var i = 0; i < langs.length; i++) {
            select_language.options[i] = new Option(langs[i][0], i);
        }

        select_language.selectedIndex = 27; // SRB
        // updateCountry();
        select_dialect.selectedIndex = 0;

        hendluj_selekciju_jezika = function /*updateCountry*/ () {
            for (var i = select_dialect.options.length - 1; i >= 0; i--) {
                select_dialect.remove(i);
            }
            var list = langs[select_language.selectedIndex];
            for (var i = 1; i < list.length; i++) {
                select_dialect.options.add(new Option(list[i][1], list[i][0]));
            }
            select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
        }
        info("Language set to: " + select_language.options[select_language.selectedIndex].text);
        return hendluj_selekciju_jezika();
    }
    // ova linija na prvi poziv uradi init i vrati verziju funkcije za koriscenje
    $("#select_language").change(hendluj_selekciju_jezika());

function kreni_speech_recognition() {

    if (!('webkitSpeechRecognition' in window)) {
        danger('\nwebkitSpeechRecognition\n\nNot found?');
        upgrade();
        return null;
    }
        // start_button.style.display = 'inline-block';
        var recognition = new webkitSpeechRecognition();
        // alert("webkitSpeechRecognition = " + recognition);

        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
            recognizing = true;
            info('Please speak now');
            start_img.src = './beca/slike/mic-capture.gif'; // CRVENI MIKROFON - CAPTURE VOICE to TEXT
        };

        recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                start_img.src = './beca/slike/mic.gif';  // SIVI MIKROFON - NO SPEECH TIME OUT
                info('Time out: No speech');
                ignore_onend = true;
                //DBJ: startButton();  // AUTO START
            }
            if (event.error == 'audio-capture') {
                start_img.src = './beca/slike/mic.gif';  // SIVI MIKROFON - NO MICROPHONE
                info('No microphone found');
                ignore_onend = true;
                //DBJ: startButton(0);  // AUTO START 
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    info('Blocked');
                } else {
                    info('Denied');
                }
                ignore_onend = true;
            }
        };

        recognition.onend = function () {
            recognizing = false;
            if (ignore_onend) {
                startButton(0);  // AUTO START
                return;
            }
            start_img.src = './beca/slike/mic.gif'; // SIVI MIKROFON - START

            if (!final_transcript) {
                info('Start');
                // startButton(0);  // AUTO START
                return;
            }
            info(' ');

            if (document.getSelection) {
                document.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(document.getElementById('final_span'));
                document.getSelection().addRange(range);
                document.getElementById('final_span').focus();

                //startButton(0); // AUTO START  JOVO NANOVO
            }
        };

        recognition.onresult = function (event) {
            var interim_transcript = '';
            if (typeof (event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                upgrade();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            if (final_transcript) {
                start_img.src = './beca/slike/mic-txt.gif'; // PLAVI MIKROFON - TEXT READY

                startButton(0);  // AUTO START
            }
            final_transcript = capitalize(final_transcript);
            final_span.innerHTML = linebreak(final_transcript);
            interim_span.innerHTML = linebreak(interim_transcript);
        }

        kreni_speech_recognition = function () { return recognition; };
        return kreni_speech_recognition();
}

function upgrade() {
    $("#start_button").hide();
    info('Please upgrade');
}

function linebreak(s) {
    var two_line = /\n\n/g, one_line = /\n/g;
    linebreak = function (s) { s.replace(two_line, '<p></p>').replace(one_line, '<br>'); }
    return linebreak(s);
}

function capitalize(s) {
    var first_char = /\S/;
    return capitalize = function (s) { s.replace(first_char, function (m) { return m.toUpperCase(); }); }
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
// DBJ made global
startButton = function (event) {
    // copy the selection 
    // OVDE JE COPY TO CLIPBOARD
    var succeed;
    var recognition = kreni_speech_recognition();
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    try {
        recognition.start();
    } catch (x) {
        danger("recognition.start() exception: " + x); // DBJ added
    }
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = './beca/slike/mic-slash.gif'; // NEMA MIKROFONA
    info('Allow');

    start_timestamp = event.timeStamp;
}

$("#start_button").click(startButton);
info('Ready');

    // DBJ
function danger(s_) {
    var $ad = $(".alert-danger");
    $ad.click(function () { $ad.hide(); });
    danger = function (s) { if (s_) $ad.show().text(s_); };
    return danger(s_);
}
function info(s_) {
    var $ad = $(".alert-info");
    $ad.click(function () { $ad.hide(); });
    info = function (s) { if (s_) $ad.show().text(s_); };
    return info(s_);
}
    // DBJ
function assert(x_) {
    if (!x_) {
        danger("Assertion failed!");
        throw "Assertion failed!";
    }
}
/////////////////////////////////////////////////////////////////////////////
})
