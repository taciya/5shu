# with open("zwds.exe", "rb") as f:
#     data = f.read()

# for s in [b"Password", b"PWD", b"Jet", b"OLEDB", b"Database Password", b".mdb"]:
#     pos = data.find(s)
#     if pos >= 0:
#         print(s, pos)


# b'Password' 301826
# b'PWD' 666078
# b'Jet' 1129107
# b'OLEDB' 1129111
# b'Database Password' 1129192
# b'.mdb' 1129149


with open("zwds.exe", "rb") as f:
    data = f.read()

pos = data.find(b"Jet OLEDB")

print(data[pos:pos+1000].decode("latin1", errors="ignore"))
