import { PythonShell } from 'python-shell';

function runPython(script, xargs, callback) {
  let options = {
    mode: 'text',
    pythonPath: './venv/Scripts/python.exe',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'py-scripts',
    args: xargs,
  }

  /*
  let pyshell = new PythonShell(script, options);
  pyshell.send(kwargs);

  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err,code,signal) {
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
  });
  */

  PythonShell.run(script, options, callback);
};

export {runPython}
