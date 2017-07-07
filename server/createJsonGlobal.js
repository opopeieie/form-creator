var download = require('./download'),
    fs = require('fs'),
    cheerio = require('cheerio');

Array.prototype.unique3 = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};


download('http://www.w3school.com.cn/tags/html_ref_standardattributes.asp', function (data) {
    const $ = cheerio.load(data);
    const table = $('#maincontent .dataintable');
    if (!table.is('table')) {
        return;
    }
    const globalJson = {
        sub: []
    };
    const trList = table.find('tr');
    let attrList = [];
    for (var i in trList) {
        var tdArr = trList.eq(i).find("td");
        var attr = tdArr.eq(0).find('a').text();
        if (attr == '') {
            continue;
        }
        attrList.push(attr);
    }

    globalJson.global = attrList;


    const liList = $('#course ul').eq(1).find('li');
    for (var j = 0; j < liList.length; j++) {
        if ($(liList).is('li'))
            var aText = $(liList[j]).find('a').text();
        if (aText == '') {
            continue;
        }
        aText = aText.match(/<(\S*)>/)[1];
        download('http://www.w3school.com.cn/tags/tag_' + aText + '.asp', function (data1) {
            const $$ = cheerio.load(data1);
            const table = $$('#maincontent .dataintable');
            if (!table.is('table')) {
                return;
            }
            const trList = table.find('tr');
            for (var i in trList) {
                var tdArr = trList.eq(i).find("td");
                var attr = tdArr.eq(0).find('a').text();
                if (attr == '') {
                    continue;
                }
                globalJson.sub.push(attr);
            }
        })
    }
    setTimeout(function () {//......
        globalJson.sub = globalJson.sub.unique3();
        var obj = {
            columns: [
                {text: 'tagName', dataField: 'tagName', minWidth: 100, width: 200},
                {text: 'labelName', dataField: 'labelName', minWidth: 100, width: 200},
                {text: 'text', dataField: 'text', minWidth: 100, width: 200},
            ],
            dataFields: [
                {name: 'tagName', type: 'string'},
                {name: 'labelName', type: 'string'},
                {name: 'text', type: 'string'}
            ]
        };
        for (var i = 0; i < globalJson.sub.length; i++) {
            obj.columns.push({text: globalJson.sub[i], dataField: globalJson.sub[i], width: 100})
        }
        for (var j = 0; j < globalJson.sub.length; j++) {
            obj.dataFields.push({name: globalJson.sub[j], type: 'string'})
        }
        for (var k = 0; k < globalJson.global.length; k++) {
            obj.columns.push({text: globalJson.global[k], dataField: globalJson.global[k], width: 100})
        }
        for (var l = 0; l < globalJson.global.length; l++) {
            obj.dataFields.push({name: globalJson.sub[l], type: 'string'})
        }
        obj.inline = [
            "a",
            "abbr",
            "acronym",
            "b",
            "bdo",
            "br",
            "big",
            "cite",
            "code",
            "dfn",
            "em",
            "i",
            "img",
            "input",
            "samp",
            "select",
            "small",
            "strong",
            "sub",
            "sup",
            "textarea",
            "tt",
            "var"
        ];


        fs.writeFileSync('C:\\Users\\Oscar.Hogan-PC\\Desktop\\form-creator\\json\\global.json', JSON.stringify(obj));
    }, 5000);

});