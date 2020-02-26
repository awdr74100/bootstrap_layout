$(document).ready(function() {
  $('.productCard__icon').on('click', function(e) {
    const icon = $(this).find('i');
    if (icon.hasClass('far')) {
      icon.removeClass('far').addClass('fas');
    } else {
      icon.removeClass('fas').addClass('far');
    }
  });
});
