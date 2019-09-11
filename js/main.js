$("div.portraitMonet").hide();

$("a#monetLink").hover(
  function() {
    $("div.portraitMonet").fadeIn(3000);
  },
  function() {
    $("div.portraitMonet").fadeOut(3000);
  }
);
