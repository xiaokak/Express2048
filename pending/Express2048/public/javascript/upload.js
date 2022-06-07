//建立一可存取到file的url
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

function gome(obj) {
    var objUrl = getObjectURL(obj.files[0]); //获取图片的路径，该路径不是图片在本地的路径
    if (objUrl) {
        $(obj).parent().find('span').html("<img src='" + objUrl + "' width='10%'>"); //将图片路径存入src中，显示出图片
    }
}

// 上传图片 获取图片的宽高 文件大小
var _URL = window.URL || window.webkitURL;
$("#front").change(function(e) {
    var file, img;
    if ((file = this.files[0])) {
        img = new Image();
        img.onload = function() {
            alert('图片宽：' + this.width + " 图片高：" + this.height + " 图片大小：" + file.size);
        };
        img.src = _URL.createObjectURL(file);
    }
});
