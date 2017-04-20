////////// 画布相关
function mouseDown(e) {
	this.draw = true;
	this.ctx = this.getContext("2d");
	this.ctx.strokeStyle = "#fff";
	this.ctx.lineWidth = 32;
	var o = this;
	this.offsetX = this.offsetLeft;
	this.offsetY = this.offsetTop;
	while (o.offsetParent) {
		o = o.offsetParent;
		this.offsetX += o.offsetLeft;
		this.offsetY += o.offsetTop;
	}
	this.ctx.beginPath();
	this.ctx.moveTo(e.pageX - this.offsetX, e.pageY - this.offsetY);
}

function touchStart(e) {
	this.draw = true;
	this.ctx = this.getContext("2d");
	this.touch = e.targetTouches[0];
	this.ctx.strokeStyle = "#fff";
	this.ctx.lineWidth = 32;
	var o = this;
	this.offsetX = this.offsetLeft;
	this.offsetY = this.offsetTop;
	while (o.offsetParent) {
		o = o.offsetParent;
		this.offsetX += o.offsetLeft;
		this.offsetY += o.offsetTop;
	}
	this.ctx.beginPath();
	this.ctx.moveTo(this.touch.pageX - this.offsetX, this.touch.pageY - this.offsetY);
	e.preventDefault();
}

function mouseMove(e) {
	if (this.draw) {
		this.ctx.lineTo(e.pageX - this.offsetX, e.pageY - this.offsetY);
		this.ctx.stroke();
	}
}

function touchMove(e) {
	this.touch = e.targetTouches[0];
	if (this.draw) {
		this.ctx.lineTo(this.touch.pageX - this.offsetX, this.touch.pageY - this.offsetY);
		this.ctx.stroke();
	}
	e.preventDefault();
}

function mouseUp(e) {
	this.draw = false;
}

function touchEnd(e) {
	this.draw = false;
	e.preventDefault();
}

window.addEventListener("load", function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	canvas.addEventListener("mousedown", mouseDown);
	canvas.addEventListener("mousemove", mouseMove);
	canvas.addEventListener("mouseup", mouseUp);

	canvas.addEventListener("touchstart", touchStart);
	canvas.addEventListener("touchmove", touchMove);
	canvas.addEventListener("touchend", touchEnd);
});

////////// 按钮相关
// 清除按钮
function erase() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var button = document.getElementsByTagName("button")[0];
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if (!button.hasAttribute("onclick")) {
		button.setAttribute("onclick", "predict()");
		button.classList.remove("disabled");
		button.innerHTML = "Predict";
	}
}

// 识别按钮
function predict() {
	// 生成 28 * 28 的 jpg base64
	var image = convert();
	var buttons = document.getElementsByTagName("button");
	if (image == "")
		return alert("Do not trick me with blank! WRITE ONE DIGIT!");
	// 将图片上传至服务器后台，并接收结果
	$.ajax({
		url: "bridge.php",
		data: {
			base64: image
		},
		type: "post",
		beforeSend: function() {
			alert('The prediction will start after this alert is closed. After closed, wait for about 10 seconds patiently.');
			buttons[0].removeAttribute("onclick");
			buttons[0].classList.add("disabled");
			buttons[0].innerHTML = "Predicting...";
			buttons[1].removeAttribute("onclick");
			buttons[1].classList.add("disabled");
		},
		success: function(str) {
			var file = str.substring(1, str.indexOf(";"));
			var fileURL = "samples/" + file;
			var result = str.substring(str.indexOf(";") + 1, str.length - 4).split("\\t").join("&#9;").split("\\n").join("</br>");
			var prediction = str.substring(str.length - 4, str.length - 3);
			var resultWindow = window.open("result.html", "_blank", "menubar=no, scrollbars=no, status=no, titlebar=no, toolbar=no");
			resultWindow.onload = function() {
				resultWindow.document.getElementById("prediction").innerHTML += prediction;
				resultWindow.document.getElementById("result").innerHTML += result;
				resultWindow.document.getElementById("file").innerHTML += ("<a href='" + fileURL + "' download>" + file + "</a>");
				resultWindow.document.getElementsByTagName("img")[0].setAttribute("alt", file);
				resultWindow.document.getElementsByTagName("img")[0].setAttribute("src", fileURL);
			}
			buttons[0].innerHTML = "Wait for erase...";
			buttons[1].setAttribute("onclick", "erase()");
			buttons[1].classList.remove("disabled");
		}
	});
}

////////// 功能相关
// 裁剪补白，并将图像居中放置在新的 28 * 28 的黑色画布中，同时留 4px 补白
function convert() {
    // 获取全图
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // 获取实际尺寸
    var contentSize = scan(imageData);
    if (contentSize.top + contentSize.right + contentSize.bottom + contentSize.left == 0)
        return ""; // 没内容
    var contentWidth = contentSize.right - contentSize.left;
    var contentHeight = contentSize.bottom - contentSize.top;
    
    // 创建临时 28 * 28 画布，并涂黑
    document.getElementsByTagName("body")[0].appendChild(document.createElement("canvas"));
    var tmpCanvas = document.getElementsByTagName("canvas")[1];
    var tmpCtx = tmpCanvas.getContext("2d");
    tmpCtx.canvas.width = 28;
    tmpCtx.canvas.height = 28;
    tmpCtx.fillStyle = "#000";
    tmpCtx.fillRect(0, 0, 28, 28);
    
    // 计算按比例缩放裁剪后的图像至 20 * 20 时的画笔起始点
    var ratio = Math.min(20 / contentWidth, 20 / contentHeight);
    var centerShift_x = (20 - contentWidth * ratio) / 2 + 4;
    var centerShift_y = (20 - contentHeight * ratio) / 2 + 4;
    
    // 将图像居中放置在临时的 28 * 28 的黑色画布中，同时留 4px 补白
    if (contentWidth > contentHeight) {
        tmpCtx.drawImage(canvas, contentSize.left, contentSize.top, contentWidth, contentHeight, 4, centerShift_y, contentWidth * ratio, contentHeight * ratio);
    } else {
        tmpCtx.drawImage(canvas, contentSize.left, contentSize.top, contentWidth, contentHeight, centerShift_x, 4, contentWidth * ratio, contentHeight * ratio);
    }
    
    // 返回图像 URI
    return tmpCanvas.toDataURL("image/jpeg");
}

// 用于扫描图像内容范围
function scan(imageData) {
    var data = imageData.data;
    var width = imageData.width;
    var height = imageData.height;
    
    // 用于判断像素点是否是白色
    function isWhite(x, y) {
        // 获取像素点的 RGB 值
        var rgb = {
            red: data[(width * y + x) * 4],
            green: data[(width * y + x) * 4 + 1],
            blue: data[(width * y + x) * 4 + 2]
        };
        
        // 判断并返回
        return rgb.red == 255 && rgb.green == 255 && rgb.blue == 255;
    };
    
    // 扫描图像 x 轴
    function scanX(fromLeft) {
        var offset = fromLeft ? 1 : -1;
        // 扫描列
        for(var x = fromLeft ? 0 : width - 1; fromLeft ? (x < width - 1) : (x > -1); x += offset) {
            // 扫描行
            for(var y = 0; y < height - 1; y++) {
                if (isWhite(x, y)) {
                    return x;
                }
            }
        }
        return 0; // 全黑，没内容
    };
    
    // 扫描图像 y 轴
    function scanY(fromTop) {
        var offset = fromTop ? 1 : -1;
        // 扫描行
        for(var y = fromTop ? 0 : height - 1; fromTop ? (y < height - 1) : (y > -1); y += offset) {
            // 扫描列
            for(var x = 0; x < width - 1; x++) {
                if (isWhite(x, y)) {
                    return y;
                }
            }
        }
        return 0; // 全黑，没内容
    };
    
    // 完全无留白
    return {
        top: scanY(true),
        right: scanX(false),
        bottom: scanY(false),
        left: scanX(true)
    };
}
