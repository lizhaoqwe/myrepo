function Auth() {

}
//点击登录按钮
Auth.prototype.header_login = function () {
    var self = this;
    $('.header-group .header .login .header-login').click(function () {
        $('.wrapper-group').css('display','block');
        $('.auth-group').css('height','265');
        $('.auth').css({'left':0});
        $('.auth-group .item .item-left').addClass('itemActive');
        $('.auth-group .item .item-right').removeClass('itemActive');
    });
};
//点击注册按钮
Auth.prototype.header_register = function () {
    var self = this;
    $('.header-group .header .login .header-register').click(function () {
        $('.wrapper-group').css('display','block');
        $('.auth-group').css('height','450');
        $('.auth').css({'left':-300});
        $('.auth-group .item .item-right').addClass('itemActive');
        $('.auth-group .item .item-left').removeClass('itemActive');
    });
};
//关闭模态对话框
Auth.prototype.click_close = function () {
    var self = this;
    $('.auth-header .close').click(function () {
        $('.wrapper-group').css('display','none');
    });
};
//模态对话框中点击注册
Auth.prototype.register_button = function () {
    var self = this;
    $('.item-right').click(function () {
        $('.auth').animate({'left':-300});
        $('.auth-group').css('height','450');
        $('.auth-group .item .item-right').addClass('itemActive');
        $('.auth-group .item .item-left').removeClass('itemActive');
    });
};
//模态对话框中点击登录
Auth.prototype.login_button = function () {
    $('.item-left').click(function () {
        $('.auth').animate({'left':0});
        $('.auth-group').css('height','265');
        $('.auth-group .item .item-left').addClass('itemActive');
        $('.auth-group .item .item-right').removeClass('itemActive');
    })
};

//获取用户输入的用户名密码
Auth.prototype.loginevent = function () {
    var auth = $('.auth .login');
    var telephoneInput = auth.find('input[name="telephone"]');
    var passwordInput = auth.find('input[name="password"]');
    var rememberInput = auth.find('input[name="remember"]');

    var submitbtn = auth.find('.submitbtn');
    submitbtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');
        xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember?1:0
            },
            'success': function (result) {
                if (result['code']==200){
                    $('.wrapper-group').css('display','none');
                    window.location.reload();
                }else {
                    var messageObject = result['message'];
                    if (typeof messageObject == 'string' || messageObject.constructor == String) {
                        window.messageBox.show(messageObject)
                    }else {
                        for (i in messageObject) {
                            window.messageBox.show(messageObject[i][0]);
                        }

                    }
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });
    });
};

//更换图片验证码
Auth.prototype.imageCaptcha = function () {
    var imgCaptcha = $('.img-captcha');
    imgCaptcha.click(function () {
        imgCaptcha.attr("src", "/account/img_captcha"+"?random"+Math.random())
    })
};

//注册按钮事件
Auth.prototype.registerevent = function () {
    $('.register .register-btn').click(function () {
        var auth = $('.auth .register');
        var telephone = auth.find('input[name="telephone"]').val();
        var username = auth.find('input[name="username"]').val();
        var password = auth.find('input[name="password"]').val();
        var re_password = auth.find('input[name="re_password"]').val();
        console.log(telephone,username,password,re_password);
        xfzajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'password': password,
                're_password': re_password
            },
            'success': function (result) {
                if (result['code']==200) {
                    window.location.reload();
                }else {
                    var messageObject = result['message'];
                    if (typeof messageObject == 'string' || messageObject.constructor == String) {
                        window.messageBox.showError(messageObject)
                    }else {
                        for (i in messageObject) {
                            window.messageBox.showError(messageObject[i][0]);
                        }

                    }
                }
            },
            'fail': function (error) {
                window.messageBox.showError('服务器内部错误')
            }
        })
    });
};

Auth.prototype.run = function () {
    var self = this;
    self.header_login();
    self.header_register();
    self.click_close();
    self.register_button();
    self.login_button();
    self.loginevent();
    self.imageCaptcha();
    self.registerevent();
};

$(function () {
    var auth = new Auth();
    auth.run();
});