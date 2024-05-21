import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';


export default defineConfig({
  assetsInclude: ['**/*.gltf'],
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
    })
  ],
  base : '/Nostalgia-SeabedLamp3D/'
});
