import sys
import configparser
import argparse
import json

sys.stdout.reconfigure(encoding='utf-8')

def main(args):
    '''
    should define encoding=utf-8 or Windows will use cp950
    '''
    config = configparser.ConfigParser()
    config.read_file(open(args.ini, encoding='utf-8'))

    #print (args)

    #lines = sys.stdin.readlines()
    #args = json.loads(lines[0])
    ret = {
        'result': '-',
        'section': {}
    }
    if args.action == 'load':
        for section in config.sections():
            ret['section'][section] = config.items(section)
        ret['result'] = 'ok'

    elif args.action == 'save':
        if args.key and args.value and args.section:
            config.set(args.section, args.key, args.value)

        with open(args.ini, 'w', encoding='utf-8') as configfile:
            config.write(configfile)
            ret['result'] = 'ok'

    return ret


parser = argparse.ArgumentParser(description='setting')
parser.add_argument('-i', '--ini', required=True,
                    help='ini path')
parser.add_argument('-k', '--key',
                    help='key for set')
parser.add_argument('-a', '--value',
                    help='value for set')
parser.add_argument('-c', '--section',
                    help='section for set')
parser.add_argument('-x', '--action', choices=['load', 'save'], required=True,
                    help='action')
parser.add_argument('-s', '--ipc', action='store_true',
                    help='for ipc (python-shell)')
args = parser.parse_args()

if __name__ == '__main__':
    ret = main(args)
    if args.ipc:
        print (json.dumps(ret))
