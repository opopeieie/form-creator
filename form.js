$(document).ready(function () {


    var globalData = {};
    $.get('./global.json').then(function(data){
        globalData = data;
        var source =
        {
            dataType: "json",
            dataFields: data.dataFields,
            hierarchy:
            {
                root: 'disabled'
            },
            id: 'tagName'
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        // create Tree Grid
        $("#treeGrid").jqxTreeGrid(
            {
                width: 1300,
                source: dataAdapter,
                pageable: false,
                columnsResize: true,
                ready: function()
                {
                    // expand row with 'EmployeeKey = 32'
                    $("#treeGrid").jqxTreeGrid('expandRow', 32);
                },
                columns: data.columns
            });
    },function(error){

    })




    /**
     * 模态窗口
     */
    /**
     * 添加按钮
     */
    $('#addBtn').on('click',function(){
        $('#modifyCommit').hide();
        $('#addCommit').show();
        $('#addModal').modal('show');
    });




    /**
     * 模态窗口确定按钮 +一行
     */
    $('#addCommit').on('click',function(){
        var selection = $("#treeGrid").jqxTreeGrid('getSelection');
        var key;
        if(selection.length < 1){
            key = null;
        }else{
            key = selection[0].uid;
        }
        var obj = {};
        $.each($('.col-sm-10').find('input'),function(index,val){
            for(var i = 0;i<globalData.columns.length;i++){
                if($(val).attr('id') == globalData.columns[i].text){
                    obj[$(val).attr('id')] = $(val).val();
                    break;
                }
            }
        });
        $("#treeGrid").jqxTreeGrid('addRow', null, obj,'first',key);
        var tagName = $('#tagName').val();

        $("#treeGrid").jqxTreeGrid('clearSelection');
        $('#modalForm')[0].reset();
        $('#'+$(this).attr('data-modal')).modal('hide');
    });


    /**
     * 模态窗口修改按钮 修改一行
     */
    $('#modifyCommit').on('click',function(){
        var tagName = $('#tagName').val();
        var key = $("#treeGrid").jqxTreeGrid('getSelection')[0].uid;
        $("#treeGrid").jqxTreeGrid('updateRow', key, {tagName: tagName});
        $("#treeGrid").jqxTreeGrid('clearSelection');
        $('#'+$(this).attr('data-modal')).modal('hide');

    });


    /**
     * 删除一行
     */
    $('#delBtn').on('click',function(){
        if( window.confirm('你确定要删除?')){
            var selection = $("#treeGrid").jqxTreeGrid('getSelection');
            if(selection.length>=1){
                for(var i in selection){
                    $("#treeGrid").jqxTreeGrid('deleteRow',selection[i].uid);
                }
            }else{
                window.alert('啥都没选删啥删!');
            }
        }
    });


    /**
     * 修改一行
     */
    $('#modifyBtn').on('click',function(){
        $('#modifyCommit').show();
        $('#addCommit').hide();
        var selection = $("#treeGrid").jqxTreeGrid('getSelection');
        if(selection.length<1){
            window.alert('啥都没选修啥修!');
            return;
        }
        $('#addModal').modal('show');
        var row = $("#treeGrid").jqxTreeGrid('getRow',selection[0].uid);
        $('#tagName').val(row.tagName);
    });







    $('#tagName').on('blur',function(){
        var val = $(this).val();
        $('.form-group').each(function(index,val){
            if(index == 0 || index == 1 || index == 2 || index == 3){
                return true;
            }
            $(val).remove();
        });
        $.get('/findAttr?tagName='+val).then(function(data){
            try{
                data = JSON.parse(data);
                for(var i in data){
                    $('#modalForm').append('<div class="form-group"> <label for="'+data[i]+'" class="col-sm-2 control-label">'+data[i]+':</label> <div class="col-sm-10"> <input type="text" class="form-control" id="'+data[i]+'" > </div> </div>')
                }
            }catch(e){
                window.alert(data)
            }
        },function(error){
            console.log('出错了:'+error);
        });
    });



    // $('#addBtn').on('click',function(){
    //     var self = this;
    //     $('#addBtn').modal('toggle');
    //     setTimeout(function(){
    //         $('#addBtn').modal('toggle');
    //     },2000);
    // })



















});