if __name__ == '__main__':
    with open('../flattened/bat_Flattened.sol') as oldfile, open('../flattened/0xBatzflattened.sol', 'w') as newfile:
        for line in oldfile:
            if not "SPDX" in line:
                newfile.write(line)
