// 正确按钮
function correct() {
	var content = document.getElementById("prediction").textContent;
	var prefix = content.substring(content.length - 1, content.length);
	label(prefix, true);
}

// 错误按钮
function wrong() {
	var content = document.getElementById("prediction").textContent;
	var wrong_prefix = content.substring(content.length - 1, content.length);
	var reg = new RegExp("^\\d{1}$");
	var prefix = prompt("Tell me the digit you write.", "");
	if (prefix == null)
		return;
	if (!reg.test(prefix)) {
		alert("WRONG FORMAT!");
		return;
	}
	if (prefix == wrong_prefix) {
		alert("ISN'T MY PREDICTION WRONG?");
		return;
	}
	label(prefix, false);
}

// 修改文件名
function label(prefix, state) {
	var oldFileName = document.getElementsByTagName("a")[0].textContent;
	var fileName = oldFileName.replace("unknown", prefix);
	$.ajax({
		url: "label.php",
		data: {
			old: oldFileName,
			new: fileName,
			state: state
		},
		type: "post",
		success: function(str) {
			if (str == "true") {
				document.getElementsByTagName("img")[0].setAttribute("alt", fileName);
				if (state) {
					document.getElementsByTagName("img")[0].setAttribute("src", "samples/correct/" + fileName);
					document.getElementsByTagName("a")[0].setAttribute("href", "samples/correct/" + fileName);	
				} else {
					document.getElementsByTagName("img")[0].setAttribute("src", "samples/wrong/" + fileName);
					document.getElementsByTagName("a")[0].setAttribute("href", "samples/wrong/" + fileName);	
				}
				document.getElementsByTagName("a")[0].textContent = fileName;
				document.getElementsByTagName("button")[0].remove();
				document.getElementsByTagName("button")[0].remove();
				alert("Feedback succeeded. I'll learn. Or maybe next time~");
			} else
				alert("Feedback failed. Tell my creator to lecture me.");
		}
	});
}