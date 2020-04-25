function NewsList() {

}
//点击删除按钮
NewsList.prototype.deleteBtnEvent = function () {
    var self = this;
    var trs = $('.table tbody tr');
    trs.find('.deleteBtn').click(function () {
        var tr = $(this).parent().parent();
        var news_id = $(this).parent().parent().attr('data-news-id');
        xfzalert.alertConfirm({
            title: '你是否确定删除?',
            confirmCallback: function () {
                xfzajax.post({
                    url: '/cms/news_delete/',
                    data: {
                        news_id: news_id
                    },
                    success: function (result) {
                        if (result.code === 200) {
                            tr.empty();
                            xfzalert.alertSuccessToast('删除成功')
                        }else {
                            console.log(result.message);
                        }
                    }
                })
            }
        });

    })
};

//开始时间和结束时间控件
NewsList.prototype.initDatepicker = function () {
    var start_time = $('#start-datepicker');
    var end_time = $('#end-datepicker');
    var today = new Date();
    var todayStr = today.getFullYear() + '/' + (today.getMonth()+1) + '/' + today.getDate();
    var options = {
        showButtonPannel: true,
        format: 'yyyy/mm/dd',
        startDate: '2020/03/22',
        endDate: todayStr,
        todayBtn: 'linked',
        todayHighlight: true,
        clearBtn: true,
        autoclose: true,
    };
    start_time.datepicker(options);
    end_time.datepicker(options);
};

//清除所有输入框内容
NewsList.prototype.clearInput = function () {
    var self = this;
    $('.clearBtn').click(function () {
        $('#start-datepicker').val('');
        $('#end-datepicker').val('');
        $('.titleinput').val('');
    })
};


NewsList.prototype.run = function () {
    var self = this;
    self.initDatepicker();
    self.deleteBtnEvent();
    self.clearInput();
};


$(function () {
    var newslist = new NewsList();
    newslist.run();
});




// var title = result.data.title;
// var category = result.data.category;
// var desc = result.data.desc;
// var thumbnail = result.data.thumbnail;
// var content = result.data.content;
// console.log(title,category,desc,thumbnail,content);
// $('input[name="title"]').val(title);
// $('input[name="category"]').val(category);
// $('input[name="desc"]').val(desc);
// $('input[name="thumbnail"]').val(thumbnail);
// $('input[name="content"]').val(content);