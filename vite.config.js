import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';


export default defineConfig({
  assetsInclude: ['**/*.glb'],
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
