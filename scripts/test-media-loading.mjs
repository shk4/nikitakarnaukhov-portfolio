import assert from 'node:assert/strict';
import { test } from 'node:test';
import { watchImageLoading } from '../app/media-load-state.ts';

class ImageStub extends EventTarget {
  complete = false;
  naturalWidth = 0;
  finish(success = true) {
    this.complete = true;
    this.naturalWidth = success ? 640 : 0;
    this.dispatchEvent(new Event(success ? 'load' : 'error'));
  }
}

test('slow image keeps its placeholder until the actual load event', () => {
  const image = new ImageStub();
  const states = [];
  const stop = watchImageLoading(image, state => states.push(state));
  assert.deepEqual(states, []);
  image.finish();
  assert.deepEqual(states, ['ready']);
  stop();
});

test('a cached image loaded before hydration clears the placeholder', () => {
  const image = new ImageStub();
  image.finish();
  const states = [];
  watchImageLoading(image, state => states.push(state))();
  assert.deepEqual(states, ['ready']);
});

test('an error during loading leaves the loading state', () => {
  const image = new ImageStub();
  const states = [];
  const stop = watchImageLoading(image, state => states.push(state));
  image.finish(false);
  assert.deepEqual(states, ['error']);
  stop();
});

test('a failed image before hydration is not mistaken for a cached success', () => {
  const image = new ImageStub();
  image.finish(false);
  const states = [];
  watchImageLoading(image, state => states.push(state))();
  assert.deepEqual(states, ['error']);
});

test('cleanup prevents late old-source events from updating the new image', () => {
  const oldImage = new ImageStub();
  const newImage = new ImageStub();
  const states = [];
  watchImageLoading(oldImage, state => states.push(state))();
  const stop = watchImageLoading(newImage, state => states.push(state));
  oldImage.finish();
  oldImage.finish(false);
  assert.deepEqual(states, []);
  newImage.finish();
  assert.deepEqual(states, ['ready']);
  stop();
});
