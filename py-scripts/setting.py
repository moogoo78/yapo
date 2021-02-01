import sys
import configparser
import json

INI_FILE = 'camera-trap-desktop.ini'
act = sys.argv[1]
section = sys.argv[2]
#sys.stdout.reconfigure(encoding='utf-8')

config = configparser.ConfigParser()
config.read(INI_FILE)
#lines = sys.stdin.readlines()
#args = json.loads(lines[0])
ret = {
    'result': '-',
    'section': {}
}
if act == 'load':
    ret['section'][section] = list(config.items(section))
    ret['result'] = 'ok'
elif act == 'save':
    key = sys.argv[3]
    value = sys.argv[4]
    config.set(section, key, value)
    ret['section'][section] = list(config.items(section))

    with open(INI_FILE, 'w') as configfile:
        config.write(configfile)
        ret['result'] = 'ok'

print (json.dumps(ret))
