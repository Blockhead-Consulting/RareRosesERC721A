if __name__ == '__main__':
    with open('../flattened/flattenedRose.sol') as oldfile, open('../flattened/cleanedFlattenedRose.sol', 'w') as newfile:
        for line in oldfile:
            if not "SPDX" in line:
                newfile.write(line)
