import { PythonShell } from 'python-shell';

function saveSetting(key, value) {
  console.log(key, value);

  let options = {
    mode: 'text',
    pythonPath: './venv/Scripts/python.exe',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'py-scripts',
    args: [key, value]
  };

  PythonShell.run('save-setting.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });
}

export {saveSetting}
