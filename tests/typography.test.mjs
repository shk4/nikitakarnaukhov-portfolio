import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const sandbox = {exports:{}};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../app/typography.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,sandbox);
const {typograph}=sandbox.exports;
test('binds consecutive Russian prepositions and conjunctions, including formatted text',()=>{
 assert.equal(typograph('В одной галерее и в **новом** конструкторе'), 'В\u00a0одной галерее и\u00a0в\u00a0**новом** конструкторе');
 assert.equal(typograph('из-за ошибки, без лишнего клика'), 'из-за\u00a0ошибки, без\u00a0лишнего клика');
});
test('preserves links, code, component identifiers and decimal metrics',()=>{
 const url='https://example.com/a?name=hello&percent=60%25#top';
 assert.equal(typograph(url),url);
 assert.equal(typograph('`const value = "a - b"` <br/> email-конструктор'), '`const value = "a - b"` <br/> email-конструктор');
 assert.equal(typograph('3,9 из 5 — CSAT. 60% за 2 месяца.'),'3,9 из\u00a05\u00a0– CSAT. 60\u00a0% за\u00a02\u00a0месяца.');
});
test('normalizes punctuation and is stable across repeated rendering',()=>{
 const once=typograph('Это "пример" ... Результат — 40%. Стало бы проще.');
 assert.equal(once,'Это\u00a0«пример»… Результат\u00a0– 40\u00a0%. Стало\u00a0бы проще.');
 assert.equal(typograph(once),once);
});
