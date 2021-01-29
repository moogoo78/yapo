import sqlite3
import sys

#sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('ct.db')
c = conn.cursor()


# Create table
#c.execute('''CREATE TABLE ct_setting
#             (key text, value text)''')

c.execute("INSERT INTO ct_setting VALUES ('{}','{}')".format(sys.argv[1], sys.argv[2]))
conn.commit()
conn.close()
print('sqlite3 save {}: {}'.format(sys.argv[1], sys.argv[2]))
