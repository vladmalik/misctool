# Various smaller tools and scripts

## Project more traffic in Abba A/B Test calculator

// ==UserScript==
// @name        Abba
// @namespace   abba
// @include     https://www.thumbtack.com/labs/abba*
// @version     1
// @grant       none
// ==/UserScript==

$(".submit-button").before('<div style="margin-bottom: 20px; padding: 20px; border: 1px solid #ccc"><label>Project </labe><input class="more-input" style="width:50px" type="text" value=50> % more traffic if effect size were to hold <button class="more-button" type="button" style="background: #888; color: white;border:0">View result</button></div>');
$(".more-button").click(function() { $(".num-samples-input, .num-successes-input").each(function() { $(this).val(parseInt($(this).val() * (1+$(".more-input").val()/100))) }); $(this).parents("form").submit() });
