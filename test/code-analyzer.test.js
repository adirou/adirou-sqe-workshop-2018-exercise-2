import assert from 'assert';
import {parseCode,mainParser} from '../src/js/code-analyzer';
import {substitutionRec, substitute} from '../src/js/substituteStatement';
import {toString} from '../src/js/buildStrings';
describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });

    it('empty function', () => {
        let html = mainParser('function f(){}','');
        assert.equal(html,'<pre><code>function f(){</br>}</pre></code>');
    });

    it('function with param empty body', () => {
        let html = mainParser('function f(x){}','');
        assert.equal(html,'<pre><code>function f(x){</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('function f(x){ return x;}','1');
       // console.log(html);
       assert.equal(html,'<pre><code>function f(x){</br>  return x;</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('function f(x){ if(x) {return x;}else {return 2;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">if(x)</span>{</br>    return x;</br>  } </br>  else{</br>    return 2;</br>  }</br>}</pre></code>');
    });
    it('function with param return in body', () => {
        let html = mainParser('function f(x){ if(x) {return x;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">if(x)</span>{</br>    return x;</br>  } </br>}</pre></code>');
    });
    it('function with param return in body', () => {
        let html = mainParser('function f(x){ if(x==2) {return x;}else {return 2;}}','1');
        console.log(html);
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="red">if((x == 2))</span>{</br>    return x;</br>  } </br>  else{</br>    return 2;</br>  }</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('function f(x){ while(x) {return x;}}','1');

        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">while(x)</span>{</br>    return x;</br>  }</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('let a = 1;function f(x){ while(x) {return a;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">while(x)</span>{</br>    return 1;</br>  }</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('let a = 1; function f(x){a=3; while(x) {return a;}}','[20]');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">while(x)</span>{</br>    return 3;</br>  }</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('let a = 1; function f(x){let b = [3,a]; a++; while(a==a) {return b;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">while((1 == 1))</span>{</br>    return [3 , 1];</br>  }</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('let a = 1; function f(x){let b = [3,a]; a++; while(a==a) {return b;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">while((1 == 1))</span>{</br>    return [3 , 1];</br>  }</br>}</pre></code>');
    });

    it('function with param return in body', () => {
        let html = mainParser('function f(x){x = 2;}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  x = 2;</br>}</pre></code>');
    });
    it('function with param return in body', () => {
        let html = mainParser('function f(x){x = x+1;}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  x = (x + 1);</br>}</pre></code>');
    });

    it('function with param while return in body minus (1)', () => {
        let html = mainParser('let a = 1; function f(x){let b = [3,a]; while(-a) {return b;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">while(-1)</span>{</br>    return [3 , 1];</br>  }</br>}</pre></code>');
    });

    it('function with param return in body minus', () => {
        let html = mainParser('let a = [1]; function f(x){let b = [3,a]; while(a.length===1) {return b;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="green">while(([1].length === 1))</span>{</br>    return [3 , [1]];</br>  }</br>}</pre></code>');
    });


   it('function with param return in body (3)', () => {
        let html = mainParser('let a = [20]; function f(x){ while(a[0]==1) {return true;}}','1');
        assert.equal(html,'<pre><code>function f(x){</br>  <span class="red">while(([20][0] == 1))</span>{</br>    return true;</br>  }</br>}</pre></code>');
    });

    it('function with param return in body minus', () => {
        let obj = substitutionRec(null,{});
        assert.equal(JSON.stringify(obj),JSON.stringify({ast:null,symbolValue:{}}));
    });

    it('function with param return in body minus', () => {
        let obj = substitutionRec({type:"ExpressionStatement", expression:{type:'12'}},{});
        assert.equal(JSON.stringify(obj),JSON.stringify({ast:null,symbolValue:{}}));
    });
    
    it('function with param return in body minus', () => {
        let val1 = substitute(null);
        assert.equal(val1,'');
    });
    it('function with param return in body minus', () => {
        let val1 = substitute({typr:'1'});
        assert.equal(val1,'');
    });

    it('function with param return in body minus', () => {
        let val1 = toString(null);
        assert.equal(val1,'');
    });
    it('function with param return in body minus', () => {
        let val1 = toString({typr:'1'});
        assert.equal(val1,'');
    });


});
