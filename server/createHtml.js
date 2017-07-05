var cheerio = require('cheerio'),
    fs = require('fs');
module.exports = function(data,$){
    console.log(data+"?????????");
    $ = cheerio.load($);
    console.log($.html()+'$$$$$$$$$$$$frist');
    if(data.length>=1){
        for(var i = 0;i<data.length;i++){
            var tagParent = null;
            var attr = Object.keys(data[i]);
            var tag = cheerio('<'+data[i].tagName+'></'+data[i].tagName+'>');
            for(var j = 0;j<attr.length;j++){
                if(data[i][attr[j]] == '' || attr[j] == 'records' || attr[j] == 'tagname'
                    || attr[j] == 'uid' || attr[j] == 'level' || attr[j] == '_visible' || attr[j] == 'parent'
                ){
                    continue;
                }
                tag.attr(attr[j],data[i][attr[j]]);
            }
            console.log(tag+'this is tag');
            console.log($.html()+'append before');

            if($('div').length<=1){
                $('div').append(tag);
            }else if(data[i].parent){
                $('#'+data[i].parent).append(tag)
            }
            console.log($.html()+'append after');

            if(data[i].hasOwnProperty('records')){
                console.log('????records');
                console.log($.html());
                arguments.callee(data[i].records,$.html());
            }
        }
        console.log($.html()+'this is $.html()');
        fs.writeFileSync('C:\\Users\\dell\\Desktop\\form-creator\\empty.html',$.html(),{encoding:'utf8'});
    }

};