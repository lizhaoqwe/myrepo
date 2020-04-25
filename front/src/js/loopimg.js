function Banner() {
    var self = this;
    self.countLi = $('.banner-group .bannerUl li').length;
    self.bannerUl = $('.banner-group .bannerUl');
    self.bannerGroup = $('.banner-group');
    self.arrow = $('.arrow');
    self.leftarrow = $('.arrow-left');
    self.rightarrow = $('.arrow-right');
    self.bannerControl = $('.bannerControl');
    self.index = 1;
}

Banner.prototype.animate = function(){
    var self = this;
    self.bannerUl.stop().animate({'left':-798*self.index},500);
    var index = self.index;
    if (index===0){
        index = self.countLi-1;
    }else if(index === self.countLi+1){
        index = 0
    }else {
        index = self.index-1;
    }
    self.bannerControl.children('li').eq(index).css('background-color','white').siblings('li').css('background-color','');
};

//初始化小圆点
Banner.prototype.bannerInit = function () {
    var self = this;
    self.bannerUl.css({'left':-798});
    self.bannerUl.css('width',798*(self.countLi+2));
    self.bannerControl.css('width',12*self.countLi+20*self.countLi);
    for (i=0;i<self.countLi;i++){
        var cirle = $('<li></li>');
        self.bannerControl.append(cirle);
        if(i===0){
            self.bannerControl.children('li').eq(0).css('background-color','white');
        }
    }
    var first = self.bannerUl.children('li').eq(0).clone();
    var last = self.bannerUl.children('li').eq(self.countLi-1).clone();
    self.bannerUl.append(first);
    self.bannerUl.prepend(last);
};

//实现轮播图自动轮播
Banner.prototype.loop = function() {
    var self = this;
    self.timer = setInterval(function () {
        if (self.index>=self.countLi+1){
            self.bannerUl.css({'left':-798});
            self.index=2;
        }else {
            self.index++;
        }
        self.animate();
    },1000);
};

// 监听鼠标是否在轮播图上面
Banner.prototype.listenHover = function(){
    var self = this;
    self.bannerGroup.hover(function () {
        clearInterval(self.timer);
        self.listenArrow(true);
    }, function () {
        self.loop();
        self.listenArrow(false);
    })
};

//监听箭头隐藏事件
Banner.prototype.listenArrow = function(isshow){
    var self = this;
    if (isshow){
        self.arrow.show();
    }else {
        self.arrow.hide();
    }
};
//监听箭头点击事件
Banner.prototype.clickArrow = function () {
    var self = this;
    self.rightarrow.click(function () {
        if(self.index>=self.countLi+1){
            self.bannerUl.css({'left':-798});
            self.index=2;
        }else {
            self.index++;
        }
        self.animate();
    });
    self.leftarrow.click(function () {
        if(self.index===0){
            self.bannerUl.css({'left':-self.countLi*798});
            self.index = self.countLi-1;
        }else {
            self.index--
        }
        self.animate();
    })
};



//小圆点控制轮播图
// Banner.prototype.bannerControlUl = function(){
//     var self = this;
//     self.bannerControl.children('li').eq(self.index+1).css('background-color','white').siblings('li').css('background-color','');
// };

//小圆点点击事件
Banner.prototype.clickControl = function () {
    var self = this;
    self.bannerControl.children('li').each(function (index,obj) {
        $(obj).click(function () {
            console.log(index);
            self.bannerUl.stop().animate({'left':-798*(index+1)},500);
            self.bannerControl.children('li').eq(index).css('background-color','white').siblings('li').css('background-color','');
        })
    })
};


Banner.prototype.run = function () {
    var self = this;
    self.loop();
    self.listenArrow(false);
    self.listenHover();
    self.clickArrow();
    self.bannerInit();
    self.clickControl();
};
$(function () {
    var banner = new Banner();
    banner.run();
});