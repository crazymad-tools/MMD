/**
 * @Class MdParse
 * @constructor
 * @description 返回md解析器
 */
function MdParse() {
    this.lastLineStatus = 0;    // 0:上一行是空行, 1: 上一行不是空行, 2:上一行是code块, 3:上一行是列表项
    this.nowStstus = 0;
    this.contentHtml = "";
    this.tagStack = [];
}

// 清除
MdParse.prototype.clear = function () {
    this.contentHtml = "";
    this.lastLineStatus = 1;
    this.tagStack = [];
}
// 解析整段md
MdParse.prototype.parseText = function (text) {
    return;
}
// 解析单行md
MdParse.prototype.parseOneLine = function (line) {
    if (this.isEmptyLineParse(line)) return;
    alert(this.flag);
    if (this.lastLineStatus === 2 || this.lastLineStatus === 3) {

    }
    this.closeLastLineTag();
    line = this.parseLineHead(line);
}
// 处理单行(上一行遗留下来的)闭合元素
MdParse.prototype.closeLastLineTag = function () {
    var len = this.tagStack.length;
    var tag = "";
    if ((tag = this.tagStack[length - 1].match(/h[1-6]/g)) != null) {
        this.contentHtml += "</" + tag + ">";
        tag.pop();
        length--;
    }
    if ((tag = this.tagStack[length - 1].match(/li/g)) != null) {
        /*if (this.lastLineStatus == 4) {
            this.contentHtml += "</li>";
            tag.pop();
            length--;
        }*/
    }
}
// 解析行首元素
MdParse.prototype.parseLineHead = function (line) {
    var sub = "";
    var title_p = /^\s{0,3}#{1,6}/g;
    var code_p = /\t+/g;
    if ((sub = line.match(title_p)) != null) {
        sub[0] = sub[0].replace(/\s/, "");
        this.tagStack.push("h" + sub[0].length);
        this.contentHtml += "<" + sub[0] + ">";
    } else if ((sub = line.match(code_p)) != null) {
    }
}
// 解析行内元素
MdParse.prototype.parseInLine = function () {
    return;
}
// 当前行是否是空行，如果是的话，进行进一步处理
MdParse.prototype.isEmptyLineParse = function (line) {
    if ("" != line) {
        return false;
    }
    switch (this.lastLineStatus) {
        case 0:                 // 原文上一行是无状态的空行
            this.lastLineStatus = 1;
            this.contentHtml += "<br>\n";
            break;
        case 1:                 // 原文上一行不是空行
            break;
        case 2:                 // 原文上一行是code内容
            break;
        case 3:                 // 原文上一行是列表项
            this.lastLineStatus = 4;        // 表明当前行为列表项下一行的空行
            break;
        default:
            break;
    }
    return false;
}
