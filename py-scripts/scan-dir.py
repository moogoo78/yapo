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
from pathlib import Path, PurePath

from thumpy import Thumpy

IGNORE_FILES = ['Thumbs.db', '']
IMAGE_EXTENSIONS = ['.JPG', '.JPEG', '.PNG']

'''
key: {timestamp}:{hash[:6]}
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
    thumb_dir = args.thumb
    db_file = args.db
    is_debug = args.verbose

    if is_debug:
        print (args)

    if args.ipc:
        is_debug = False

    ret = {
        'node_list': [],
        'img_list': [],
    }

    key_prefix = str(int(time.time()))

    thumpy = None
    if thumb_dir:
        thumpy = Thumpy(thumb_dir, dir_path, is_debug)

    if db_file:
        conn = sqlite3.connect(db_file)
        c = conn.cursor()
        sql = "CREATE TABLE IF NOT EXISTS images (path TEXT, name TEXT, status TEXT, hash TEXT, key TEXT UNIQUE);"
        c.execute(sql)
        # working dir
        sql = "CREATE TABLE IF NOT EXISTS working (key TEXT, name TEXT, status TEXT);"
        c.execute(sql)
        sql = "INSERT INTO working VALUES ('{}','{}','{}')".format(key_prefix, dir_path, 'I')
        c.execute(sql)

    with os.scandir(dir_path) as it:
        for entry in it:
            if not entry.name.startswith('.'):
                ret['node_list'].append([entry.name, entry.is_dir()])
                if entry.is_file() and check_image(entry):
                    ret['img_list'].append({
                        'path': entry.path,
                        'name': entry.name,
                    })

                    if thumpy:
                        thumpy.make(entry.path)

                    if db_file:
                        if h:= get_digest(entry.path):
                            key = '{}-{}'.format(key_prefix, h[:6])
                            sql = "INSERT INTO images VALUES ('{}','{}','{}','{}','{}')".format(
                                entry.path, entry.name, 'I', h, key)
                            c.execute(sql)
        if db_file:
            conn.commit()
            conn.close()
    return ret


parser = argparse.ArgumentParser(description='scan dir for images, and save status in database')
parser.add_argument('-p', '--path', required=True,
                    help='dir path')
parser.add_argument('-d', '--db',
                    help='save status in database (SQLite)')
parser.add_argument('-t', '--thumb',
                    help='thumbnails dir name in HOME path')
parser.add_argument('-s', '--ipc', action='store_true',
                    help='for ipc (python-shell)')
parser.add_argument('-v', '--verbose', action='store_true',
                    help='verbose for debug')
args = parser.parse_args()

if __name__ == '__main__':
    ret = main(args)
    if args.ipc:
        print (json.dumps(ret))

