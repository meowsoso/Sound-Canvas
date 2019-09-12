$("div.monetBackground").hide();
$("div.vincentBackground").hide();

$("a#monetLink").hover(
  function() {
    $("div.vincentBackground").fadeOut(3000)
    $("div.monetBackground").fadeIn(4000);
  },
  function() {
  }
);

$("a#vincentLink").hover(
  function() {
    $("div.monetBackground").fadeOut(3000)
    $("div.vincentBackground").fadeIn(4000);
  },
  function() {
  }
);
