function newUploader(viewFileId, pickerId, thumwidth, thumheight, inputId, index,callback,callbackargs) {
    var imgDomain = 'http://120.55.163.90';
    var returndata;
    var index2 =index;
 
    $list = $('#' + viewFileId);
    // Web Uploader实例
    var uploader = WebUploader.create({

        // 自动上传。
        auto: true,

        // swf文件路径
        swf: '../Uploader.swf',

        // 文件接收服务端。
        server: 'http://120.55.163.90:9000/captain/utility/fileUpload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#' + pickerId,

        // 只允许选择文件，可选。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });

    
    // 当有文件添加进来的时候
    uploader.on('fileQueued', function(file) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img widht=100>' +
                '<div class="info">' + file.name + '</div>' +
                '</div>'
            ),
            $img = $li.find('img');

        $list.append($li);

        // 创建缩略图
        uploader.makeThumb(file, function(error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr('src', src);
        }, thumwidth, thumheight);
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function(file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo($li)
                .find('span');
        }

        $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function(file, response, returndata, imgarg, index2) {
        var imgDomain = 'http://120.55.163.90/';
        $imgArea = $('#' + inputId);
        if (response.success) {
            var url = imgDomain + response.filePath;
            updateUrl = response.filePath;
            returndata = url;
            console.log($imgArea.find('img'));
            if ($imgArea.find('a')) $imgArea.find('a').remove();
            $percent = $('<a class=“image-preview” href="'+url+'" data-lightbox="uploader" data-title=""><img src=' + url + '></a>').appendTo($imgArea);
            $imgArea.find('input').attr('ng-value',url);
            $imgArea.find('input').val(response.filePath);
            if(callback){
                callback(callbackargs);
            }
        } else {
            alert(response.msg);
        }
    });

    // 文件上传失败，现实上传出错。
    uploader.on('uploadError', function(file) {
        var $li = $('#' + file.id),
            $error = $li.find('div.error');

        // 避免重复创建
        if (!$error.length) {
            $error = $('<div class="error"></div>').appendTo($li);
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function(file, response) {
        //$( '#'+file.id ).find('.progress').remove();

    });
    return uploader;
}

function initUploader(configs, imgarg) {
    for (var index = 0; index < configs.length; index++) {
        var obj = configs[index];
        obj.uploader = newUploader(obj.view, obj.picker, obj.thumWidth, obj.thumHeight, obj.input, index,obj.callback,obj.callbackargs);
    }

}
