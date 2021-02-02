from pathlib import Path, PurePath
import os

from PIL import Image


class Thumpy(object):
    dest_path = ''
    debug = False
    prefix = 'thumb-'
    size_list = []

    def __init__(self, dest_name='.', dir_path='', debug=False, prefix=''):

        dir_name = PurePath(dir_path).parts[-1]

        self.debug = debug
        dest_pure_path = PurePath(Path.home()).joinpath(dest_name, dir_name)
        dest_path = Path(dest_pure_path)
        if not dest_path.exists():
            dest_path.mkdir(parents=True)
            if debug:
                print ('[thumpy] create root dir:', dest_path)
        self.dest_path = dest_path

        if prefix:
            self.prefix = self.prefix

    def thumbnail_by_size(self, infile, size_list):
        name = Path(infile).name
        out_fname = '{}{}'.format(self.prefix, name)
        outfile_path = PurePath(self.dest_path).joinpath(out_fname)
        outfile = str(outfile_path)
        try:
            if self.debug:
                print('[thumpy] Making thumbnail by size {}: {} => {}'.format((size_list), infile, outfile))
            im = Image.open(infile)
            im.thumbnail(size_list, Image.ANTIALIAS)
            im.save(outfile, "JPEG")

        except IOError:
            if self.debug:
                print('[thumpy] make thumbnail failed: ', infile)


    def make(self, infile):
        self.thumbnail_by_size(infile, (100, 100))

