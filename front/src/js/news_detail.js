function NewsList() {

}

//评论事件
NewsList.prototype.clickcomment = function () {
    var commentBtn = $('.commentBtn');
    var textarea = $('.comment-content');
    commentBtn.click(function () {
        var content = textarea.val();
        var news_id = commentBtn.attr('data-news-id');
        xfzajax.post({
            'url':'/news/news_comment/',
            'data': {
                'content': content,
                'news_id': news_id
            },
            'success': function (result) {
                if (result['code']===200) {
                    var comment = result['data'];
                    var tpl = template('comment-item',{'comment': comment});
                    console.log(tpl);
                    var commentGroup = $('.comment-detail');
                    commentGroup.prepend(tpl);
                    window.messageBox.showSuccess('评论发表成功');
                    textarea.val('')
                }else {
                    window.messageBox.showError(result['message'])
                }
            }
        })
    })
};


NewsList.prototype.run = function () {
    var self = this;
    self.clickcomment();
};

$(function () {
    var newslist = new NewsList();
    newslist.run();
});