
export const generateHtml = (func) => {
    return `<pre><code>function ${func.name}(${func.params.map((e)=>e.name).join(' , ')})${HTMLgeneration(func.body,'')}</pre></code>`;
};

const HTMLgeneration = (ast,indent) =>{
    return functionsGeneration[ast.type](ast,indent);
};
const generateIfString = (ifSt,indent) => {
    let elseStr = ifSt.alternate?`</br>${indent}else${HTMLgeneration(ifSt.alternate,indent)}` :'';
    let consequent =`${HTMLgeneration(ifSt.consequent, indent)}`;
    return `${indent}<span class="${ifSt.test.color}">if(${ifSt.test.expression})</span>${consequent} ${elseStr}`;
};

const generateWhileString = (whileSt,indent) => {
    let body =`${HTMLgeneration(whileSt.body,indent)}`;
    return `${indent}<span class="${whileSt.test.color}">while(${whileSt.test.expression})</span>${body}`;
};

const generateBlock = (blockSt,indent) => {
    return `{${blockSt.body.map(e=>`</br>${HTMLgeneration(e,indent+'  ')}`).join('')}</br>${indent}}`;
};

const generateReturn = (returnSt,indent) => {
    return `${indent}return ${returnSt.arg.expression};`;
};
const generateAssign = (assignSt,indent) => {
    return `${indent}${assignSt.left} = ${assignSt.right};`;
};

const functionsGeneration ={assign:generateAssign,block:generateBlock,ifElse:generateIfString,while:generateWhileString,return:generateReturn};

