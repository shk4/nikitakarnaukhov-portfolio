import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
import { readFileSync } from 'node:fs';

const source = ts.transpileModule(readFileSync(new URL('../app/scroll-position.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;

function setup() {
  const viewport = { x: 15, y: 8700 };
  const sandbox = { exports: {}, window: { scrollTo({top,left,behavior}) {
    assert.equal(behavior, 'instant'); viewport.x=left; viewport.y=top;
  }}};
  vm.runInNewContext(source, sandbox);
  return { viewport, ...sandbox.exports };
}

test('opening a case resets both the viewport and an unfinished inertial gesture', () => {
  const api = setup();
  const engine = {
    isStopped:false, target:9200, animated:8700, velocity:500, animating:true,
    stop() { this.isStopped=true; this.animating=false; this.velocity=0; },
    resize() {},
    scrollTo(target, options) {
      assert.equal(options.immediate,true); assert.equal(options.force,true);
      this.target=this.animated=target; api.viewport.y=target;
    },
    start() { this.isStopped=false; },
    tick() { if(this.animating) api.viewport.y=this.target; },
  };
  api.registerScrollEngine(engine);
  api.resetPageScroll();
  engine.tick();
  assert.deepEqual(api.viewport,{x:0,y:0});
  assert.equal(engine.target,0); assert.equal(engine.animated,0);
  assert.equal(engine.velocity,0); assert.equal(engine.isStopped,false);
  api.resetPageScroll(); engine.tick(); assert.equal(api.viewport.y,0);
});

test('works without a smooth scroll engine, including reduced motion', () => {
  const api=setup(); api.resetPageScroll(); assert.deepEqual(api.viewport,{x:0,y:0});
});

test('does not restart a deliberately stopped engine or retain a destroyed one', () => {
  const api=setup(); let calls=0;
  const engine={isStopped:true,stop(){},resize(){},scrollTo(){calls++},start(){throw new Error('must remain stopped')}};
  const unregister=api.registerScrollEngine(engine);
  api.resetPageScroll(); assert.equal(calls,1);
  unregister(); api.viewport.y=9000; api.resetPageScroll();
  assert.equal(calls,1); assert.equal(api.viewport.y,0);
});
