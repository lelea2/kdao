import ScriptLoader from './loadScript';

const loader = new ScriptLoader({
  src: 'cdn.segment.com/analytics.js',
  global: 'Segment',
});

// scriptToLoad will now be a reference to `window.Segment`
const scriptToLoad = await loader.load();