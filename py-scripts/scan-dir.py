import argparse
from datetime import datetime
import time
import sys
import os
import json
import sqlite3
import hashlib

import base64
import struct

from thumpy import Thumpy

IGNORE_FILES = ['Thumbs.db', '']
IMAGE_EXTENSIONS = ['.JPG', '.JPEG', '.PNG']

'''
key: {timestamp}:{hash[4:]}
CREATE TABLE images (path TEXT, name TEXT, status TEXT, hash TEXT, key TEXT UNIQUE);
'''

def check_image(dirent):
    _, fext = os.path.splitext(dirent.path)
    if fext.upper() in IMAGE_EXTENSIONS:
        return True
    return False

def get_digest(file_path):
    #via: https://stackoverflow.com/questions/22058048/hashing-a-file-in-python
    h = hashlib.sha256()

    with open(file_path, 'rb') as file:
        while True:
            # Reading is buffered, so we can read smaller chunks.
            chunk = file.read(h.block_size)
            if not chunk:
                break
            h.update(chunk)

    return h.hexdigest()


def main(args):
    '''
    node_list: [[name, is_dir]...],
    img_list: [{'path':'foo_path', 'name': 'foo_name'}]
    '''
    dir_path = args.path
    make_thumb = args.thumb
    save_db = args.db

    ret = {
        'node_list': [],
        'img_list': [],
    }

    key_prefix = str(int(time.time()))

    thumpy = None
    if make_thumb:
        thumpy = Thumpy('camera-trap-desktop-thumbnails', dir_path, True)

    if save_db:
        conn = sqlite3.connect('camera-trap-desktop.db')
        c = conn.cursor()

    with os.scandir(dir_path) as it:
        for entry in it:
            if not entry.name.startswith('.'):
                ret['node_list'].append([entry.name, entry.is_dir()])
                if entry.is_file() and check_image(entry):
                    ret['img_list'].append({
                        'path': entry.path,
                        'name': entry.name,
                    })
                    if save_db:
                        h = get_digest(entry.path)
                        key = '{}-{}'.format(key_prefix, h[:6])
                        sql = "INSERT INTO images VALUES ('{}','{}','{}','{}','{}')".format(
                            entry.path, entry.name, 'I', h, key)
                        c.execute(sql)
                    if make_thumb and thumpy:
                        thumpy.make(entry.path)
        if save_db:
            conn.commit()
            conn.close()
    return ret


'''parser = OptionParser()
parser.add_option("-p", "--path", dest="path",
                  help="dir path")
parser.add_option("--db", dest="save_db",
                  action="store_true", default=False,
                  help="save status in database")
parser.add_option("-t", "--thumb", dest="make_thumb",
                  action="store_true", default=False,
                  help="make thumbnails")
(options, args) = parser.parse_args()
'''

parser = argparse.ArgumentParser(description='scan dir for images, and save status in database')
#parser.add_argument('integers', metavar='N', type=int, nargs='+',
#                                                             help='an integer for the accumulator')
#parser.add_argument('--sum', dest='accumulate', action='store_const',
#                                                             const=sum, default=max,
#                    help='sum the integers (default: find the max)')
parser.add_argument('-p', '--path', required=True,
                    help='dir path')
parser.add_argument('--db', action='store_true',
                    help='save status in database')
parser.add_argument('-t', '--thumb', action='store_true',
                    help='make thumbnails')
args = parser.parse_args()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print ('no args')
    else:
        ret = main(args)
        #print (json.dumps(ret))
        #else:
        #    print ('no path')
