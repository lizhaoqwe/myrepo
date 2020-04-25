function Banners() {
    var self = this;
}

//cms后台管理系统添加轮播图片
Banners.prototype.addbanners = function () {
    var self = this;
    var addBtn = $('.cms-header .button button');
    addBtn.click(function () {
        if($('.banner-item').length<6) {
            var tpl = template('add-banners');
            var bannerGrouplist = $('.row');
            bannerGrouplist.prepend(tpl);
            var bannerItem = bannerGrouplist.find('.loop-img:first');
            self.addimg(bannerItem);
            self.remveBanners(bannerItem);
            self.saveBtnEvent(bannerItem);
        }else {
            xfzalert.alertErrorToast('已经6张轮播图了，无法在添加')
        }
    });
};
//点击添加图片按钮事件
Banners.prototype.addimg = function (bannerItem) {
    var inputimg = bannerItem.find('img');
    var self = this;
    inputimg.click(function () {
        var inputimage = $(this).parent().siblings('#addimg');
        inputimage.click();
        inputimage.change(function () {
            var file = this.files[0];
            var formdata = new FormData();
            formdata.append('file',file);
            $.post({
                'url': '/cms/upload/',
                'data': formdata,
                'processData': false,
                'contentType': false,
                'success': function (result) {
                    if (result.code === 200) {
                        var url = result.data.url;
                        inputimg.attr('src',url);
                    }
                }
            })
        })
    });


};
//cms移除轮播图输入框,并且从数据库里删除相应的数据
Banners.prototype.remveBanners = function (bannerItem) {
    var self = this;
    bannerItem.parent().siblings().find('.banner-close').click(function () {
        var banner_id = bannerItem.parent().parent().parent().parent().parent().attr('data-banner-id');
        xfzalert.alertConfirm({
            'title': '您确定要删除吗?',
            'confirmCallback': function () {
                bannerItem.parent().parent().parent().parent().parent().remove();
                if(banner_id) {
                    xfzajax.post({
                        url: '/cms/banner_delete/',
                        data: {
                            'banner_id': banner_id
                        }
                    })
                }
            }
        });
    })
};
//将轮播图保存至数据库
Banners.prototype.saveBtnEvent = function (bannerItem) {
    var saveBtn = bannerItem.parent().parent().siblings('.box-footer').find('#save_btn');
    var banner_id = bannerItem.parent().parent().parent().parent().parent().attr('data-banner-id');
    var url = '';
    if(banner_id) {
        url = '/cms/banner_edit/';
    }else {
        url = '/cms/add_banner/'
    }
    saveBtn.click(function (event) {
        event.preventDefault();
        var image_url = bannerItem.find('img').attr('src');
        var link_to = bannerItem.siblings('.loop-content').find('input[name="link-addr"]').val();
        var priority = bannerItem.siblings('.loop-content').find('input[name="priority"]').val();
        xfzajax.post({
            'url': url,
            'data': {
                image_url: image_url,
                link_to: link_to,
                priority: priority,
                pk: banner_id
            },
            success: function (result) {
                if (result.code === 200) {

                    // bannerItem.parent().parent().parent().parent().parent().attr('data-banner-id',bannerId);
                    if (banner_id) {
                        console.log(banner_id)
                        xfzalert.alertSuccessToast('修改成功')
                    }else {
                        var bannerId = result.data.banner_id;
                        xfzalert.alertSuccessToast('保存成功');
                        bannerItem.parent().parent().parent().parent().parent().attr('data-banner-id',bannerId);
                    }
                    var iteml = bannerItem.parent().siblings().find('.iteml');
                    iteml.text('优先级:' + priority);
                }else {
                    xfzalert.alertSuccessToast('保存成功')
                }
            }
        })
    });
};

//网页加载完成就显示添加的轮播图管理界面
Banners.prototype.loadData = function () {
    var self = this;
    xfzajax.get({
        url: '/cms/banner_list/',
        success: function (result) {
            if (result.code === 200) {
               var banners = result.data;
               for (i=0; i<banners.length; i++) {
                   banner = banners[i];
                   tpl = template('add-banners',{'banner': banner});
                   var bannerGrouplist = $('.row');
                   bannerGrouplist.append(tpl);
                   var bannerItem = bannerGrouplist.find('.loop-img:last');
                   self.saveBtnEvent(bannerItem);
                   self.remveBanners(bannerItem);
                   self.addimg(bannerItem);
               }
            }
        }
    });

};


Banners.prototype.run = function () {
    this.addbanners();
    this.loadData();
};

$(function () {
    var banners = new Banners();
    banners.run();
});