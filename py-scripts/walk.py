from sys import argv
import sys
import os
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

##folder_path = os.path.join('.', '/mnt')
x = []
for i in os.scandir(path='.'):
    #print (i.name, i.path, i.is_dir())
    if i.is_dir():
        #print([i.name, i.path])
        x.append((i.name))
#for r, d, f in os.walk('d:\\foto'):
#    for i in d:
#        print (r, i)
    #for i in f:
        #ret.append(f)
    #    filename = os.path.join(r, i)
    #    print(filename)
        #im = Image.open(filename)
        #print(im.getexif())
print('x-x'.join(x))
