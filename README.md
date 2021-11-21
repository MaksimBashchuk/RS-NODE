### Ciphering tool

1. To launch this tool dowload project or clone it to your computer.
2. Navigate to newly created folder and run terminal.
3. Type (example) `node .\cipheringTool.js -c "C1-R0-A" -i "./input.txt" -o "./outut.txt"`

   Descrition:

   - -c, --config (required): config for ciphers Config is a string with pattern {XY(-)}n, where:
     - X is a cipher mark:
       - C is for Caesar cipher (with shift 1)
       - A is for Atbash cipher
       - R is for ROT-8 cipher
     - Y is flag of encoding or decoding (mandatory for Caesar cipher and ROT-8 cipher and should not be passed Atbash cipher)
       - 1 is for encoding
       - 0 is for decoding
   - -i, --input (optional): a path to input file, if there is no option, the terminal will be used as input
   - -o, --output (optional): a path to output file, if there is no option, the terminal will be used as output
