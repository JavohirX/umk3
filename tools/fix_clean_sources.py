import re, os, glob

for f in ['AudioClipNode.java', 'AudioManager.java', 'ConcreteImage.java', 'EncodedTextBuffer.java', 'GameMidletLoop.java', 'MarketPanelController.java']:
    path = os.path.join('src_clean', f)
    with open(path, 'r', encoding='utf-8') as fp:
        c = fp.read()
    c = re.sub(r'\./\*.*?\*/<init>', '', c)
    with open(path, 'w', encoding='utf-8') as fp:
        fp.write(c)

print('Constructors fixed')
