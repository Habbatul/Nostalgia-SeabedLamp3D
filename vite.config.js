import { viteStaticCopy } from 'vite-plugin-static-copy';


export default ({
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
  ]
});
