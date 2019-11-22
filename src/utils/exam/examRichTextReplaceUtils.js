/**
 * Created by admin on 2018/7/24.
 */

const examRichTextReplaceUtils = {

    replaceText: (text) => {
        // return text.replace(new RegExp('宋体', "g"), "Microsoft YaHei").replace(new RegExp('<p', "g"), "<div").replace(new RegExp('</p>', "g"), "</div>").replace(new RegExp('<br/>', "g"), "");
        let newText = text.replace(new RegExp('宋体', "g"), "Microsoft YaHei,Heiti SC, SimSun").replace(new RegExp('<p', "g"), "<div").replace(new RegExp('</p>', "g"), "</div>");
        if(newText.indexOf('font-size') >-1){
            newText= newText.replace(/font-size\s?:\s?\d*\s?px(;?)/,"");
        }

        if(text.indexOf('<img')){//设置图片最大宽度
            newText = newText.replace('<img ', '<img width="100%" ');
        }

        while (true) {
            if ((newText.lastIndexOf("<br/>") === newText.length - 5) && (newText.length - 5 != -1)) {
                newText = newText.substr(0, newText.length - 5);
            }
            else {
                break;
            }
        }
        
        newText = "<span style='font-size: 16px;'>"+newText+"</span>";        

        return newText;
    }
};
export {examRichTextReplaceUtils}