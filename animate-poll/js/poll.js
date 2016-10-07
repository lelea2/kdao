$(window).load(function(){

  $('body').on('click', '.results-trigger', function() {
    console.log('Fade out result');
    $('.poll-vote-list').fadeOut(500);
    $('.poll-results-list').delay(500).fadeIn(500);
    $(this).hide();
    $('.poll-results-list li .percentage').each(function() {
      var value = $(this).text();

      $(this).closest('li').find('.nul').removeClass('inner-bar null').addClass('voted');
      $(this).closest('li').find('.inner-bar').animate({width: value}, 1000);
      $(this).closest('li').find('.voted').delay('1000').animate({width: value}, 1000);
      $('.percentage').delay('2000').fadeIn('fast');
    });
    return false;
  });

});
