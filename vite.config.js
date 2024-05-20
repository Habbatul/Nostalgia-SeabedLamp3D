import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';


export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
            src: 'assets3D/*',
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
