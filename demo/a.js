const { glob, globSync, globStream, globStreamSync, Glob }
 =require('glob');
 async function getJsFiles(){
 const jsfiles =  await glob('**/*.js', { ignore: 'node_modules/**' },{
      signal: AbortSignal.timeout(1),
 })
// const jsfiles =  await glob('*/css/*.css', { ignore: 'node_modules/**' },{
//       signal: AbortSignal.timeout(1),
//  })

  /* The line `const jsfiles = await glob(['routes/*.{js,png}', 'controllers/*.{js,png}'])` is using
  the `glob` function to search for files with the extensions `.js` or `.png` in the `routes` and
  `controllers` directories. The result is stored in the `jsfiles` variable. */
  
//   const jsfiles = await glob(['routes/*.{js,png}', 'controllers/*.{js,png}'])
//   console.log(jsfiles);
// console.log(jsfiles);
// const images = await glob(['*/images/*.{png,jpeg}', 'public/*.{png,jpeg}'])
//   console.log(images);

 }
 getJsFiles();
// but of course you can do that with the glob pattern also
// the sync function is the same, just returns a string[] instead
// of Promise<string[]>
//  const imagesAlt = globSync('{*/images,routes}/*.{png,jpeg}');
//    console.log(imagesAlt);
const filesStream = globStream(['**/*.dat', 'logs/**/*.log'])
// console.log(filesStream);

async function findFileInParticularFolder(){
    // construct a Glob object if you wanna do it that way, which
// allows for much faster walks if you have to look in the same
// folder multiple times.
const g = new Glob('**/routes',{})
// glob objects are async iterators, can also do globIterate() or
// g.iterate(), same deal
for await (const file of g) {
  console.log('found a  file:', file)
}

const g2 = new Glob('**/routes', g)
// sync iteration works as well
for await (const file of g2) {
  console.log('found a bar file:', file)
}
}
findFileInParticularFolder();
// const g3 = new Glob('**/routes/**', { withFileTypes: true })
// g3.stream().on('data', path => {
//   console.log(
//     'got a path object',
//     path.fullpath(),
//     path.isDirectory(),
//     path.readdirSync().map(e => e.name)
//   )
// })
const results=async ()=>{
    const results = await glob('**', { stat: true, withFileTypes: true,ignore: 'node_modules/**' });
    const timeSortedFiles = results
  .sort((a, b) => a.mtimeMs - b.mtimeMs)// sort acc to modification time
  .map(path => path.fullpath())
// console.log(timeSortedFiles);
const groupReadableFiles = results
  .filter(path => path.mode & 0o040)//only files having exe permission
  .map(path => path.fullpath())
    console.log((groupReadableFiles));
}
// console.log(res );
// results();


// custom ignores can be done like this, for example by saying
// you'll ignore all markdown files, and all folders named 'docs'

// const customIgnoreResults = await glob('**', {
//   ignore: {
//     ignored: p => /\.md$/.test(p.name) || /\.css$/.test(p.name),
//     childrenIgnored: p => p.isNamed('docs'),
//   },
// });

// const folderNamedModules = async () => {
//   await glob('**/*.{ts,js}', {
//     ignore: {
//       ignored: p => {
//         const pp = p.parent;
//         console.log(pp.name);
//         return (
//           !(p.isNamed(pp.name + '.ts') || p.isNamed(pp.name + '.js'))
//         );
//       },
//     },
//   });
// };
// folderNamedModules();
const newFiles =async ()=>{
    const result=await glob('**', {
     // need stat so we have mtime
     stat: true,
     // only want the files, not the dirs
     nodir: true,
     ignore: {
       ignored: p => {
         return new Date() - p.mtime > 4*60 * 60 * 1000
       },
       // could add similar childrenIgnored here as well, but
       // directory mtime is inconsistent across platforms, so
       // probably better not to, unless you know the system
       // tracks this reliably.
     },
   });
   console.log(result);
}
// newFiles();


