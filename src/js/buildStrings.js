export const toString = (ast,substitution={}) =>
    !ast?'':
        funcs[ast.type]!==undefined?
            funcs[ast.type](ast,substitution):'';

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
    return `(${left} ${ast.operator} ${right})`;
};

const buildStringUnaryExpression = (ast,substitution) =>{
    let argument = toString(ast.argument,substitution);  
    return `${ast.operator}${argument}`;
};

/*
const buildStringUpdateExpression = (ast,substitution) => {
    let argument = toString(ast.argument,substitution);  
    return `${argument}${ast.operator}`;
};*/

const buildStringIdentifier = (ast,substitution) => substitution[ast.name]===undefined? `${ast.name}`: toString(substitution[ast.name]);

const buildStringLiteral= (ast) => `${ast.value}`;

const funcs =  { MemberExpression:buildStringMemberExpression,
    StaticMemberExpression:buildStringMemberExpression,
    UnaryExpression:buildStringUnaryExpression,
    BinaryExpression: buildStringBinaryExpression,
    //UpdateExpression: buildStringUpdateExpression,
    Literal : buildStringLiteral,
    Identifier : buildStringIdentifier,
    ArrayExpression: buildStringArrayExpression};

