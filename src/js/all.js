$(document).ready(function () {
  $('.productCard__icon').on('click', function (e) {
    const icon = $(this).find('i');
    if (icon.hasClass('far')) {
      icon.removeClass('far').addClass('fas');
    } else {
      icon.removeClass('fas').addClass('far');
    }
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(
    function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    },
    function (err) {
      // registration failed
      console.log('ServiceWorker registration failed: ', err);
    }
  );
}