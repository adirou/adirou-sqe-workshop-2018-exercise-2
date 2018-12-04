
const buildStringMemberExpression = (ast,substitution) =>{

    let object = toString(ast.object,substitution); 
    let property = toString(ast.property,substitution); 
    return ast.computed?`${object}[${property}]`:`${object}.${property}`;
};

const buildStringArrayExpression = (ast,substitution) =>{
    const toStringWithSubs = (ast)=> toString(ast,substitution);
    let elements = ast.elements.map(toStringWithSubs); 
    return `[${elements.join(' , ')}]`;
};

const buildStringBinaryExpression= (ast,substitution) => {
    let left = toString(ast.left,substitution);
    let right = toString(ast.right,substitution);
    return `${left} ${ast.operator} ${right}`;
};

const buildStringUnaryExpression = (ast,substitution) =>{
    let argument = toString(ast.argument,substitution);  
    return `${ast.operator}${argument}`;
};

const buildStringUpdateExpression = (ast,substitution) => {
    let argument = toString(ast.argument,substitution);  
    return `${argument}${ast.operator}`;
};
const buildStringIdentifier = (ast,substitution) => substitution[ast.name]===undefined? `${ast.name}`: toString(substitution[ast.name]);

const buildStringLiteral= (ast) => `${ast.value}`;

const funcs =  { MemberExpression:buildStringMemberExpression,
    StaticMemberExpression:buildStringMemberExpression,
    UnaryExpression:buildStringUnaryExpression,
    BinaryExpression: buildStringBinaryExpression,
    UpdateExpression: buildStringUpdateExpression,
    Literal : buildStringLiteral,
    Identifier : buildStringIdentifier,
    ArrayExpression: buildStringArrayExpression};

export const toString = (ast,substitution={}) =>
    !ast?'':
        funcs[ast.type]!==undefined?
            funcs[ast.type](ast,substitution):'';



const subMemberExpression = (ast,substitution) =>{
    let object = substitute(ast.object,substitution); 
    let property = substitute(ast.property,substitution); 
    return Object.assign(ast,{object,property});
};

const subBinaryExpression= (ast,substitution) => {
    let left = substitute(ast.left,substitution);
    let right = substitute(ast.right,substitution);
    return Object.assign(ast,{left,right});
};

const subUnaryExpression = (ast,substitution) =>{
    let argument = substitute(ast.argument,substitution);  
    return Object.assign(ast,{argument});
};

const subUpdateExpression = (ast,substitution) => {
    let argument = substitute(ast.argument,substitution);  
    return Object.assign(ast,{argument});
};
const subIdentifier = (ast,substitution) => substitution[ast.name]===undefined? ast: substitute(substitution[ast.name],substitution);

const subLiteral= (ast) => ast;

const subArrayExpression = (ast,substitution) =>{
    const subWithSubst = (ast)=> substitute(ast,substitution);
    let elements = ast.elements.map(subWithSubst);  
    return Object.assign(ast,{elements});
};

const subFuncs =  { MemberExpression:subMemberExpression,
    StaticMemberExpression:subMemberExpression,
    UnaryExpression:subUnaryExpression,
    BinaryExpression: subBinaryExpression,
    UpdateExpression: subUpdateExpression,
    Literal : subLiteral,
    Identifier : subIdentifier,
    ArrayExpression: subArrayExpression};

export const substitute = (ast,symbolTable) =>
    !ast?'':
        subFuncs[ast.type]!==undefined?
            subFuncs[ast.type](ast,symbolTable):'';
