const cheerio = require('cheerio'),
      download = require('./download'),
      http = require('http');

module.exports =  function(tagName,callBack){
    download('http://www.w3school.com.cn/tags/tag_'+tagName+'.asp',function(data){
        const $ = cheerio.load(data);
        const table = $('#maincontent .dataintable');
        if(!table.is('table')){
            callBack('你确定标签名传的正确吗？');
            return;
        }
        const trList = table.find('tr');
        let attrList = [];
        for(var i in trList){
            var tdArr = trList.eq(i).find("td");
            var attr = tdArr.eq(0).find('a').text();
            if(attr == ''){
                continue;
            }
            attrList.push(attr);
        }
        callBack(attrList);
    })
};