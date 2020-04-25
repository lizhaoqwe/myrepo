function Index() {
    var self = this;
    self.page = 2;
    self.newsGroup = $('.news-detail-ul');
    self.category_id = 0;
}

//监听点击查看更多事件
Index.prototype.clickmore = function() {
    var self = this;
    $('.more').click(function () {
        xfzajax.get({
            'url': '/news/news_list/',
            'data': {
                'p': self.page,
                'category_id': self.category_id
            },
            'success': function (result) {
                if (result['code']===200){
                    var newses = result['data'];
                    if (newses.length>0) {
                        var tpl = template("news-item",{"newses":newses});
                        self.newsGroup.append(tpl);
                        self.page += 1
                    }else {
                        $('.more').hide();
                    }
                }else {
                    console.log(result['code'])
                }
            }

        });
    })
};



//监听点击分类事件
Index.prototype.clickcategory = function () {
    var self = this;
    $('.news-group .news').children().click(function () {
        var li = $(this);
        var category_id = li.attr('data-category');
        var page = 1;
        xfzajax.get({
            'url': '/news/news_list/',
            'data':{
                'category_id': category_id,
                'p': page,
            },
            'success': function (result) {
                if (result['code']===200) {
                    var newses = result['data'];
                    var tpl = template("news-item",{"newses":newses});
                    self.newsGroup.empty();
                    self.newsGroup.append(tpl);
                    self.page = 2;
                    self.category_id = category_id;
                    li.children().addClass('toggle');
                    li.siblings('li').children().removeClass('toggle');
                    $('.more').show();
                }
            }
        })
    })

};


Index.prototype.run = function () {
    var self = this;
    self.clickmore();
    self.clickcategory();

};


$(function () {
    var index = new Index();
    index.run()
});