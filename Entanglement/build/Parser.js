
//  第一步，获取内部元素
// 构建一个对象树
/*
     闭合标签 div/span/p/pre/h1/h2/h3/h4/h5/h6/i/b/form/table/tbody/thead/tr/td
            <!-- -->
     半闭合 img/input
 */

 /*
 * @str : 模板字符串
 * @PRE : entId 前缀
 * @INDEX : 元素所处位置
 */

function getVDom(str,PRE,INDEX){
    str = str.trim()
    // 匹配第一个<>内的数据
    var f = str.match(/<([^><]+)>/)[1]
    // 获取tagname
    var tagname = f.match(/[a-zA-Z][a-zA-Z0-9]*/)[0]
    // 去除tagname
    f = f.replace(tagname,'').trim()
    // 获取属性
    var properties = f.split(' ')
    var events = {}, ref


    var propertiesArr =  properties.map((item)=>{
        item = item.trim()
        // 对于image/input来说，他们是半闭合标签
        if(!item || item=="/") return

        var key = item.indexOf('=')>0 ? item.split('=')[0].trim() : item
        var value = key===item ? undefined : item.split('=')[1].trim()

        if(!value) return
        // 去除双引号 与 花括号
        value = value.startsWith('"')||value.startsWith('{') ? value.slice(1,-1) : value

        // 事件
        if(key.startsWith('on')) {
            key = key.slice(2).toLowerCase()
            events[key] = value
            return
        }
        // props
        if(key==='ref'){
            ref = value
            return
        }

        return {
            key: key ,
            value: value
        }
    })
    // 过滤无用元素
    .filter(item=>item)

    // 获取entId
    var entId = addEntId(PRE, INDEX)

    // 获取子元素
    var children = []
    if( tagname != 'input' && tagname != 'img' ){
        // 标签开
        var itemF = str.indexOf('>')
        // 标签闭合
        var itemL = str.lastIndexOf('<')
        // 截取字符串
        var childrenStr = str.slice(itemF+1, itemL).replace(/\n+/g,'')
        // 分割子元素，返回数组
        splitChildren(childrenStr, children, entId)
    }

    var IS_COMPONENT = /[A-Z][a-z]*/.test(tagname)
    // 其中以on开头的是事件，props是属性值
    return {
        tagName: tagname ,
        properties: IS_COMPONENT ? [] : propertiesArr ,
        entId: entId ,
        // 对于花括号内的数据要支持简单的js语法，?: ! data.key.key 这样子
        events: events ,
        // 如果是以A-Z开头，表示其也是一个组件
        props:  IS_COMPONENT ? propertiesArr : [] ,
        ref: ref,
        children: children,
        type: '元素节点',
        nodeType: 1
    }
}

// 检测是不是半闭合标签
function isSpecialTag(tagname){
    return tagname=='img' || tagname=='input'
}

// 添加entId
function addEntId(PRE, INDEX){
    return PRE ? PRE+'-'+INDEX : '0'
}

// 分割子元素
function splitChildren(str, children, PRE){
    // 获取子元素，子元素需要排序， 文本元素/注释元素/一般元素
    str = str.trim()
    if(!str) return

    // 匹配注释元素
    var comment = str.match(/<!--[^><]+-->/)
    comment = comment?comment[0]:' '
    // console.log( comment, str.indexOf(comment) )
    if(str.indexOf(comment)===0){
        children.push({
            nodeType: 8,
            type: '注释节点',
            text: comment.match(/<!--(.+)-->/)[1] ,
            entId: addEntId(PRE, children.length)
        })
        str = str.replace(comment,'')
        splitChildren(str, children, PRE)
        return
    }

    // 匹配一般元素，对于img/input元素还没有做特殊处理
    var node = str.match(/<[a-zA-Z]{1,}\s*[^><]*>/)
    node = node ? node[0] : ' '
    if(str.indexOf(node)===0){
        // 因为要考虑h1 h2之类的标签
        var lastIndex = findTagClose(str, node.match(/[a-zA-Z][a-zA-Z0-9]*/)[0])

        // 如果没有匹配到闭合标签
        if(lastIndex==='404'){
            str = matchTextNode(str, children, node, PRE)
            splitChildren(str, children, PRE)
            return
        }
        node = str.slice(0, lastIndex)
        children.push(getVDom(node, PRE, children.length) )
        str = str.replace(node,'')

        splitChildren(str, children, PRE)
        return
    }

    // 匹配文本节点
    var text = str.indexOf('<')>=0 ? str.slice(0, str.indexOf('<') ) : str.slice(0) // 文本元素
    if(!text){
        text = str.match(/<[^>]+(?=<)/)
        text = !text || text.index!==0 ? str.match(/<[^a-zA-Z!/]{1,}(?=<)|[^>]*>/) : text
        text = text && text.index===0 ? text[0] : ''
        // debugger
    }
    if(text){
        str = matchTextNode(str, children, text, PRE)
        splitChildren(str, children, PRE)
        return
    }
}

function matchTextNode(str, children, text, PRE){
    console.log(text);
    var lastChild = children[children.length-1]
    lastChild && lastChild.nodeType===3? lastChild.text += text : children.push({
        nodeType: 3,
        type: '文本节点',
        text: text,
        entId: addEntId(PRE, children.length)
    })
    return str.slice(text.length)
}

// 找到闭合标签的位置
function findTagClose(str,tagname){

    var cache = '',
        openNum = 0,
        closeNum = [],
        strCache = str ;
    var close = '</'+tagname+'>'
    var open = new RegExp('<'+tagname+'\s*[^><]*>')

    // console.log('闭合标签',str.match(open)[0], tagname, closeNum);

    if(tagname=='input' || tagname=='img'){
        var openStr = str.match(open)[0]
        return str.indexOf(openStr)+openStr.length
    }

    // var openTag = ''
    // 先找到所有开放标签，在找到所有的闭合标签，然后取 闭合标签中对应的开放标签的那个位置
     while( true  ){
        // 如果没有找到
        if(str.match(open) ){
            openTag = str.match(open)[0]
            // cache += str.slice(0,str.indexOf(openTag)+openTag.length)
            str = str.slice(str.indexOf(openTag)+openTag.length )
            openNum++
        }else break
    }

    str = strCache
    while(1){
        if( str.indexOf(close)>=0 ){
            cache += str.slice(0,str.indexOf(close)+close.length)
            str = str.slice(str.indexOf(close)+close.length )
            closeNum.push( cache )
        }else break
    }

    // 如果找不到闭合标签，1：报错 2：按文本字节处理
    if(closeNum.length< openNum) return '404'

    // 返回结束位置
    return close.length+closeNum[openNum-1].length
}
