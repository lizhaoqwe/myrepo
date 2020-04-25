function NewsCategory () {

}



//添加分类
NewsCategory.prototype.add_category = function () {
    $('.box-header .btn').click(function () {
        xfzalert.alertOneInput({
            'title': '添加新闻分类',
            'placeholder': '请输入新闻分类',
            'confirmCallback': function (inpuValue) {
                xfzajax.post({
                    'url': '/cms/add_news_gategory/',
                    'data': {
                        'name': inpuValue
                    },
                    'success': function (result) {
                        if (result['code']==200) {
                            xfzalert.alertSuccessToast('已经添加成功!');
                            window.location.reload();
                        }else {
                            xfzalert.alertErrorToast('您输入的分类已经存在!')
                        }
                    },
                })
            }
        });
    })
};

//删除分类
NewsCategory.prototype.delete_category = function () {
    $('.table .btn-danger').click(function () {
        var tr = $(this).parent().parent();
        console.log(tr);
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
         xfzalert.alertConfirm({
            'title': '您确定要删除吗?',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_news_gategory/',
                    'data': {
                        'pk': pk,
                        'name': name
                    },
                    'success': function (result) {
                        if (result['code']===200) {
                            window.location.reload();
                        }else {
                            xfzalert.alertErrorToast(result['message'])
                        }
                    }
                })
            }
         });

    });
};

//编辑分类
NewsCategory.prototype.edit_category = function () {
    $('.table .btn-warning').click(function () {
        var tr = $(this).parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        xfzalert.alertOneInput({
            "title": '请修改分类',
            "value": name,
            "confirmCallback": function (inputValue) {
                xfzajax.post({
                    'url': '/cms/edit_news_gategory/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code']===200) {
                            window.location.reload();
                        }else {
                            xfzalert.alertErrorToast(result['message'])
                        }
                    }
                })
            }
        })
    });
    

};


NewsCategory.prototype.run = function () {
    self = this;
    self.add_category();
    self.delete_category();
    self.edit_category();
};
$(function () {
    var newscategory = new NewsCategory();
    newscategory.run();
});



