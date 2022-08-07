import json


def extract_abi(file):
    with open(file) as f:
        artifact = json.load(f)
        f.close()
    abi = artifact["abi"]
    bytecode = artifact["bytecode"]
    bytecode = artifact["bytecode"]
    with open('abi.json', 'w') as f:
        json.dump(abi, f)
        f.close()
    with open('bytecode.txt', 'w') as f:
        f.write(bytecode)
        f.close()
    with open('deployedBytecode.txt', 'w') as f:
        f.write(bytecode)
        f.close()


def get_abi_functions(abi):
    """
    @param abi abi list object
    returns list of functions names
    """
    return [x['name'] for x in abi[1:]]


if __name__ == '__main__':
    extract_abi("../abis/xBatz.json")
