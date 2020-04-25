$(function () {
    $('.menu li').click(function () {
        $(this).addClass('active').siblings('li').removeClass('active');
    });
    $('.header .login').hover(function () {
        $('.user-more-box').show();
        $('.triangle').show();
    },function () {
        $('.user-more-box').hide();
        $('.triangle').hide();
    })
});
