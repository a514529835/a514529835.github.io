// 入口函数
$(function () {
    setTimeout(function () {
        $('.img').hide();
    }, 2000)



    /*
    1.分析需求(交互)：
    1.1 输入框按下回车键 将接口返回的数据放在歌单中
    1.2 点击歌单列表，将li里面的文本传给接口，返回的数据给下面的播放控件播放
        边上的歌词显示
        注重点：1.歌单列表是后面添加的元素，交互事件需要事件委托
                2.返回的歌词如何变成一段一段的p标签
    */

    // 1.1 输入框按下回车键 将接口返回的数据放在歌单中
    $('.search').on('keydown', function (e) {
        if (e.keyCode == 13) {
            var keywords = $(this).val();
            $(this).val('')
            // 发送请求
            $.ajax({
                url: 'https://autumnfish.cn/search',
                type: 'get',
                dataType: 'json',
                data: {
                    keywords: keywords
                },
                success: function (backData) {
                    // 渲染
                    $('.music_name ul').empty();
                    $('.music_name ul').append(template('musicName', backData));
                }
            });
        };
    });

    // 1.2 点击歌单列表，将li里面的文本传给接口，返回的数据给下面的播放控件播放
    $('body').on('click', '.music_name ul li', function () {
        var index = $(this).index();
        var id = $(this).attr('id');
        var name = $(this).text();
        // 获取歌词
        // 发送请求
        $.ajax({
            url: 'https://autumnfish.cn/lyric',
            type: 'get',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (backData) {
                $('.warp').empty();
                var reg = /\[.+\]/g;
                var str = backData.lrc.lyric.replace(reg, '')
                var arr = str.split('\n');
                $('.warp').append(template('musicText', {
                    a: arr,
                    b: name
                }))
            }
        });
        // 播放音乐
        // 发送请求
        $.ajax({
            url: 'https://autumnfish.cn/song/url',
            type: 'get',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (backData) {
                console.log(backData.data[0].url);
                $('#play').attr('src', backData.data[0].url);
                $('#play')[0].play();
                setTimeout(function () {
                    var playTime = Math.ceil($('#play')[0].duration);
                    $('.warp').stop(true, false).animate({
                        top: '-200%'
                    }, playTime * 500, function () {
                        $('.warp').css('top', '40%')
                    })

                }, 200);
                $('#play')[0].onended = function () {
                    if (index == ($('body .music_name ul li')).length) {
                        return
                    }
                    // 当前播放完之后继续播放下一首
                    $('body .music_name ul li').eq(index + 1).click();
                };
            }
        });
    });
});