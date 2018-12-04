import $ from 'jquery';
import {mainParser} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let input = $('#inputToFunc').val();
        let parsedCode = mainParser(codeToParse,input);
        $('#parsedCode').html(parsedCode);
    });
});
