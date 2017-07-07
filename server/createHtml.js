var cheerio = require('cheerio'),
    fs = require('fs');
var parentTag = cheerio('<div id="main"></div>');
module.exports = createHtml;

createHtml(require('../json/form.json'));


function createHtml(data){
    // fs.writeFileSync('C:\\Users\\Oscar.Hogan-PC\\Desktop\\form-creator\\json\\form.json',JSON.stringify(data),{encoding:'utf8'});
    var $ = cheerio('<div id="main"></div>');
    var attrs = '';
    if(data.length>=1){
        for(var i = 0;i<data.length;i++){

            var tag = struHtml(data[i]);
            attrs +=tag;
            $.append(cheerio(tag));

        }
        console.log($.html());
        console.log('attrs:'+attrs);

        fs.writeFileSync('C:\\Users\\Oscar.Hogan-PC\\Desktop\\form-creator\\empty.html',$.html(),{encoding:'utf8'});
    }

















    // console.log(data+"?????????");
    // $ = cheerio.load($);
    // console.log($.html()+'$$$$$$$$$$$$frist');
    // if(data.length>=1){
    //     for(var i = 0;i<data.length;i++){
    //         var tagParent = null;
    //         var attr = Object.keys(data[i]);
    //         var tag = cheerio('<'+data[i].tagName+'></'+data[i].tagName+'>');
    //         for(var j = 0;j<attr.length;j++){
    //             if(data[i][attr[j]] == '' || attr[j] == 'records' || attr[j] == 'tagname'
    //                 || attr[j] == 'uid' || attr[j] == 'level' || attr[j] == '_visible' || attr[j] == 'parent'
    //             ){
    //                 continue;
    //             }
    //             tag.attr(attr[j],data[i][attr[j]]);
    //         }
    //         console.log(tag+'this is tag');
    //         console.log($.html()+'append before');
    //
    //         if($('div').length<=1){
    //             $('div').append(tag);
    //         }else if(data[i].parent){
    //             $('#'+data[i].parent).append(tag)
    //         }
    //         console.log($.html()+'append after');
    //
    //         if(data[i].hasOwnProperty('records')){
    //             console.log('????records');
    //             console.log($.html());
    //             arguments.callee(data[i].records,$.html());
    //         }
    //     }
    //     console.log($.html()+'this is $.html()');
    //     fs.writeFileSync('C:\\Users\\dell\\Desktop\\form-creator\\empty.html',$.html(),{encoding:'utf8'});
    // }

};

/**
 * 处理一个
 * @param data
 * @param tag
 * @return cheerio
 */
function struHtml(data){
    if(data)
        var tag;
    var tagBefore = '<'+data.tagName+' ';
    var dataKeys = Object.keys(data);
    console.log('data.tagName:'+data.tagName+dataKeys)
    for(var i in dataKeys){
        if(data[dataKeys[i]] == '' || dataKeys[i] == 'tagName'|| dataKeys[i] == 'uid'|| dataKeys[i] == 'level'|| dataKeys[i] == '_visible'
            || dataKeys[i] == 'records'|| dataKeys[i] == 'leaf' || dataKeys[i] == 'parent' || dataKeys[i] == 'expanded'){
            continue;
        }
        tagBefore += dataKeys[i]+'='+data[dataKeys[i]]+' ';
    }
    var inlineList = require('../json/global.json').inline;
    tag = tagBefore+'></'+data.tagName+'>';
    console.log(tag);
    for(var i in inlineList){
        if(data.tagName == inlineList[i]){
            tag = tagBefore+'></'+data.tagName+'';
            break;
        }
    }
    if(data.hasOwnProperty('records')){
        for(var i in data.records){
            var subTag = struHtml(data.records[i]);
            console.log(subTag);
            var before = tagBefore+'>';
            before = tagBefore;
            tag = before+subTag+'</'+data.tagName+'>';
            tagBefore = tagBefore+'>'+subTag;
        }
    }
    return tag;
}