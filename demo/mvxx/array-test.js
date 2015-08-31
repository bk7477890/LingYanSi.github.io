/*
 * @Author: 灵岩寺
 * @Date:   2015-08-30 17:57:18
 * @Last Modified by:   灵岩寺
 * @Last Modified time: 2015-08-30 18:52:56
 */

'use strict';
(function() {
    var partyArr = [];
    Lyan_Arr.create({
        data: partyArr,
        template: '<div class="ju-item"> <div><img src="{{$party.avatar}}" alt="" /><div>{{$party.username}}</div></div> <div>{{$party.intro}}</div> </div>',
        ele: 'bottom',
        renderBefore: function() {
            console.log('数组开始渲染', '监听ajax数组');
        },
        renderAfter: function() {
            console.log('数组渲染结束', '监听ajax数组');
        },
        render: function() {
            console.log('数组渲染中');
            console.log(partyArr, '监听ajax数组');
        }
    });


    $.jsonp({
        type: 'get',
        url: 'http://app.nacute.com/api/ajax/party/list?pageNo='+1+'&pageSize=10',
        success: function(data) {
            data.info.unshift(partyArr.length)
            data.info.unshift(0);
            partyArr.splice.apply(partyArr,data.info);
        }
    });


    /* lyan_arr(arrName, function() {
         console.log('数组长度改变了');
         console.log([].slice.call(arguments));
     });*/
    var bitch = {};
    Lyan.create({
        data: bitch,
        property: 'name',
        render: function() {
            // alert('bitch的名字改变了')
        }
    });
    bitch.name = "周恩来";
})();
