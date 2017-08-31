function parse() {
	var stack = new Array();
	var output = "";
	var input = document.getElementById("input").value;		// 获取输入框里面的内容
	input = input.split('\n');								// 将输入框内容按换行符割裂成数组

	for (var i=0, len=input.length; i < len; i++) {
		var msg = oneLine(input[i], stack[stack.length-1]);
		if (msg.stack) {
			if ((msg.stack=="</pre>" && stack[stack.length-1]=="<pre>") || msg.stack=="</ul>") {
				//delete stack[stack.length-1];
				stack.pop();
				console.log(stack);
			} else {
				stack.push(msg.stack);
			}
		}
		output += msg.html;
	}
	var show = document.getElementById("output");
	show.innerHTML = output;
}

function oneLine(input, flag) {				// 该函数负责检查行首语句，检查完之后检查行内语句
	var res= {
		stack : null,
		html : ""
	};
	if (flag == "<pre>") {					// 1 检查代码块语句
		var reg = /^(```)$/g;	
		if (input.match(reg)) {
			res.stack = "</pre>";
			res.html = "</ol></pre>"
		} else {
			input = input.replace(/(\<)/g, '&lt;');
			input = input.replace(/(\>)/g, '&gt;');
			input = cpp_color(input);
			input = "<li>" + input + "</li>";
			console.log(input);
			res.html = input;// + "\n";
		}
		return res;
	} else {
		var reg = /^(```){1}[^`]*/g;		// '*'指匹配0次或者多次
		if (input.match(reg)) {
			res.stack = "<pre>";
			res.html = "<pre style='border: solid 1px black; border-radius: 5px; padding: 5px 0px 5px 0px;'><ol type='1'>";
			return res;
		} 
	}
	
	var reg = /^[\#]+/g;					// 2 检查标题语句
	if (input.match(reg)) {
		var high = input.match(reg);
		var len = high[0].length;
		res.html += "<h"+len+">";
		res.html += inLine(input.substring(len, input.length));
		res.html += "</h" + len + ">";
		return res;
	}

	var reg = /^[\*\-\+]{1} /g;
	if (input.match(reg)) {
		console.log(input.match(reg));
		if (flag == '<ul>') {
			res.html += ("<li>" + inLine(input.substring(2, input.length)) + "</li>");
		} else {
			res.html += ("<ul><li>" + inLine(input.substring(2, input.length)) + "<li>");
			res.stack = "<ul>";
		}
		return res;
	}
	if (flag == '<ul>') {
		res.html += "</ul>";
		res.stack = "</ul>";
	}
	res.html += ("<p>" + inLine(input) + "</p>");
	return res;
}

function inLine(line) {
	var res = "";
	reg = /(\!*\[[^\]\[]+\]\([^\(\)]+\)|((```)[^`]+(```)))/g;			// 搜寻<img>,<a>和<code>标签
	var ret = line.match(reg);
	if (ret) {
		index = line.search(reg);
		res += line.substring(0, index);
	}
	if (ret && ret[0][0] == '!') {					//
		reg = /\[[^\]\[]+\]/g;
		var name = ret[0].match(reg);				// 生成连接文字
		name = name[0].substring(1, name[0].length-1);
		reg = /\([^\(\)]+\)/g;
		var src = ret[0].match(reg);				// 生成真是url连接
		src = src[0].substring(1, src[0].length-1);
		res += "<img src=\'" + src + "\'>";
		return res;
	}
	//reg = /(\[[^\]\[]+\]\([^\(\)]+\))/g;			// 搜寻<a>标签
	//var ret = line.match(reg);
	if (ret && ret[0][0] == '[') {
		reg = /\[[^\]\[]+\]/g;
		var link = ret[0].match(reg);				// 生成连接文字
		link = link[0].substring(1, link[0].length-1);
		reg = /\([^\(\)]+\)/g;
		var url = ret[0].match(reg);				// 生成真是url连接
		url = url[0].substring(1, url[0].length-1);
		res += "<a href=\'" + url + "\'>" + link + "</a>";
		return res;
	}
	if (ret && ret[0][0] == '`') {
		reg = /(```)[^`]+(```)/;
		var code = ret[0].match(reg);
		code = code[0].substring(3, code[0].length-3);
		res += "<code style='background-color:#FFDF9B; padding: 1px 5px 1px spx;'>" + code + "</code>";
		return res;
	}
	return line;
}

function cpp_color(line) {
	var reg = /[W_]{0}(int)[W_]{0}|(double)|(long long)|(float)|(char)|(class)|(struct)|(if)|(while)|(else)|(for)|(witch)|(case)|(using)|(namespace)/g;
	line = line.replace(reg, '<font color="#00B9C2">$&</font>');
	
	var reg = /(\#include)/g;
	line = line.replace(reg, '<font colot="#A1A8B0">$&</font>');

	return line;
}
