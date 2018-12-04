import * as esprima from 'esprima';
import * as evalExpression from 'eval-expression';
import {toString,substitute} from './buildStrings';
import * as splitter from 'split-string';

const parseCode = (codeToParse) => esprima.parseScript(codeToParse);

const apllySubstituteAndMerge = (oldSym,newSym) =>{
    return Object.assign({},oldSym,newSym);
};

const varDeclarToSymbol = (ast,symbolValue)=>{
    let newSymbols={};
    switch (ast.type){
    case 'VariableDeclaration':
        ast.declarations.forEach(elm => {
            newSymbols[elm.id.name] = substitute(elm.init,symbolValue);
        });
        break;
    case 'AssignmentExpression':
        newSymbols[ast.left.name] = substitute(ast.right,symbolValue);
        break;
    }
    return apllySubstituteAndMerge(symbolValue,newSymbols);
};

const ExpressionExpander = (expr,symbolValue,input) => {
    expr = substitute(expr,symbolValue);
    let str = toString(expr);
    let strToEval=toString(expr,input);
    return {expression:str,color:evalExpression(strToEval)?'green':'red'};
};

const parseInputs = (inputToParse,funcParams) =>{
    let symbols = {};
    const mapFunction = (e) => e.body[0].expression;
    let parsedInputs = splitter(inputToParse, {brackets: true, separator: ',' }).map(parseCode);
    if(parsedInputs[0].body.length === 0) return symbols;
    let vals = parsedInputs.map(mapFunction);
    for(let i=0; i< funcParams.length;i++){
        symbols[funcParams[i].name]=vals[i];
    }
    return symbols;
};

const substitutionFunction = (parsedAst,symbolValue,input)=>
    ({ast:{type:'func',
        name: parsedAst.id.name,
        params: parsedAst.params,
        body: substitutionRec(parsedAst.body,symbolValue,input).ast},
    symbolValue});

const substitutionVariable = (parsedAst,symbolValue)=>
    ({ast:null,symbolValue:varDeclarToSymbol(parsedAst,symbolValue)});

const substitutionExpression = (parsedAst,symbolValue)=>{
    if(!parsedAst.expression.type==='AssignmentExpression')
        throw '555';
    else 
        return {ast:null,symbolValue:varDeclarToSymbol(parsedAst.expression,symbolValue)};
};
const substitutionIf = (parsedAst,symbolValue,input)=>
    ({ast:{type:'ifElse',
        test: ExpressionExpander(parsedAst.test,symbolValue,input),
        consequent: substitutionRec(parsedAst.consequent,symbolValue,input).ast,
        alternate: substitutionRec(parsedAst.alternate,symbolValue,input).ast},
    symbolValue});
const substitutionWhile = (parsedAst,symbolValue,input)=>
    ({ast:{type:'while',
        test: ExpressionExpander(parsedAst.test,symbolValue,input),
        body: substitutionRec(parsedAst.body,symbolValue,input).ast},
    symbolValue});

const substitutionBlockStatement = (parsedAst,symbolValue,input)=>{
    let body=[];
    for(let i=0;i<parsedAst.body.length;i++){
        let astSym = substitutionRec(parsedAst.body[i],symbolValue,input);
        if(!astSym.ast)
            symbolValue = astSym.symbolValue;
        else
            body=[...body,astSym.ast];
    }
    return {ast:{type:'block',body},
        symbolValue};
};

const substitutionReturn = (parsedAst,symbolValue,input)=>(
    {ast:{type:'return',
        arg: ExpressionExpander(parsedAst.argument,symbolValue,input)},
    symbolValue});



//should return parsed with subsitions with lines to draw
const substitutionRec=(parsedAst,symbolValue,input)=>{
    if(!parsedAst) return {ast:null,symbolValue};
    return subsFunc[parsedAst.type](parsedAst,symbolValue,input);
  
};
const getGlobalsAndFunc = (parsedCode)=>{
    let parsedFunc;
    let symbolValue = {};
    let bodyAst = parsedCode.body;
   
    for( let i = 0; i<bodyAst.length ; i++){
        if(bodyAst[i].type==='VariableDeclaration')
            symbolValue = varDeclarToSymbol(bodyAst[i],symbolValue);
        if(bodyAst[i].type==='FunctionDeclaration'){
            parsedFunc = bodyAst[i];
            break;
        }
    }
    parsedFunc.params.forEach((e)=>{
        symbolValue[e.name]=undefined;
    });
    
    return {symbolValue, parsedFunc};
};

const generateFuncString = (func) => {
    return `<pre><code>function ${func.name}(${func.params.map((e)=>e.name).join(' , ')})${HTMLgeneration(func.body,'')}</pre></code>`;
};

const HTMLgeneration = (ast,indent) =>{
    return functionsGeneration[ast.type](ast,indent);
};
const generateIfString = (ifSt,indent) => {
    let elseStr = ifSt.alternate?`</br>${indent}else${HTMLgeneration(ifSt.alternate,indent)}` :'';
    let consequent = ifSt.consequent?`${HTMLgeneration(ifSt.consequent, indent)}` :`{</br>${indent}}`;
    return `${indent}<span class="${ifSt.test.color}">if(${ifSt.test.expression})</span>${consequent} ${elseStr}`;
};

const generateWhileString = (whileSt,indent) => {
    let body = whileSt.body?`${HTMLgeneration(whileSt.body,indent)}` :`{</br> ${indent}}`;
    return `${indent}while(${whileSt.test.expression})${body}`;
};

const generateBlock = (blockSt,indent) => {
    return `{${blockSt.body.map(e=>`</br>${HTMLgeneration(e,indent+'  ')}`).join('')}</br>${indent}}`;
};

const generateReturn = (returnSt,indent) => {
    return `${indent}return ${returnSt.arg.expression};`;
};


const mainParser = (codeToParse,inputToParse) =>{
    let parsedCode = parseCode(codeToParse);
    let {symbolValue,parsedFunc} = getGlobalsAndFunc(parsedCode);
    let symbolValueInput = parseInputs(inputToParse, parsedFunc.params);
    let funcAfterSub = substitutionRec(parsedFunc,symbolValue,symbolValueInput);
    let generatedHtml = generateFuncString(funcAfterSub.ast);
    return generatedHtml;
};

const subsFunc={
    FunctionDeclaration:substitutionFunction,
    VariableDeclaration:substitutionVariable,
    ExpressionStatement:substitutionExpression,
    IfStatement:substitutionIf,
    WhileStatement:substitutionWhile,
    BlockStatement:substitutionBlockStatement,
    ReturnStatement:substitutionReturn};
const functionsGeneration ={block:generateBlock,ifElse:generateIfString,while:generateWhileString,return:generateReturn};

export {parseCode,mainParser};
