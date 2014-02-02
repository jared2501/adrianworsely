// Add "loaded" class when a section has been loaded
$(window).scroll(function() { 
  var scrollTop = $(window).scrollTop();
  $(".section").each(function() {
    var elementTop = $(this).offset().top - $('#header').outerHeight();
    if(scrollTop >= elementTop) {
      $(this).addClass('loaded');
    }
  });
});
