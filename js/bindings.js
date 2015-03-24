$(".rule-dropdown-open").click(function(){
  $(".rule-dropdown").fadeToggle("fast");
  $(this).toggleClass("dropdown-active");
});
$(".config-dropdown-open").click(function(){
  $(".config-dropdown").fadeToggle("fast");
  $(this).toggleClass("dropdown-active");
});

$('button.toggle-background').on('click', function () {
    $(this).toggleClass('light space');
});