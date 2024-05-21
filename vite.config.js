import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import gltf from 'rollup-plugin-gltf';


export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
            src: 'asset3D/*',
            dest: 'asset3D'
          },
          {
            src: 'music/*',
            dest: 'music'
          }
      ]
    }),
    gltf({
      include: 'asset3D/**/*.gltf',
      // exclude: 'artwork/*.gltf', 
      inlineAssetLimit: 2.5 * 1024 * 1024, //2.5 mb inline limitny
      inline: false, //aset tidak di-inline
    }),
  ],
  base : '/Nostalgia-SeabedLamp3D/'
});
