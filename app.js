#!/bin/bash

# Extract metadata:name: value from file1.yaml
name_value=$(grep -oP 'metadata:\s*name:\s*\K\w+' file1.yaml)

# Replace <secret-name> in file2 with the extracted value
sed -i "s/<secret-name>/$name_value/g" file2

Explanation:
 * Extract metadata:name: value:
   * grep -oP 'metadata:\s*name:\s*\K\w+' file1.yaml: This command extracts the value of the name field within the metadata section in file1.yaml.
     * grep: Searches for the specified pattern in the file.
     * -o: Prints only the matched part of the line.
     * -P: Uses Perl Compatible Regular Expressions for more advanced pattern matching.
     * 'metadata:\s*name:\s*\K\w+': This is the regular expression:
       * metadata:\s*name:\s*: Matches the literal string "metadata:" followed by zero or more whitespace characters and then "name:" followed by zero or more whitespace characters.
       * \K: Resets the starting point of the match, effectively discarding everything matched so far.
       * \w+: Matches one or more word characters (letters, digits, underscores).
   * name_value=$(...): Stores the extracted value in the name_value variable.
 * Replace <secret-name> in file2:
   * sed -i "s/<secret-name>/$name_value/g" file2: This command replaces all occurrences of <secret-name> with the value stored in name_value within the file file2.
     * sed: Stream Editor, used for text manipulation.
     * -i: Modifies the file in-place (directly).
     * "s/<secret-name>/$name_value/g": This is the substitution command:
       * s/: Indicates the start of the substitution command.
       * <secret-name>: The pattern to be replaced.
       * /$name_value/: The replacement string.
       * g: Replaces all occurrences on each line.
     * file2: The file to be modified.
How to use:
 * Save the code above as a shell script (e.g., replace_secret.sh).
 * Make the script executable: chmod +x replace_secret.sh
 * Run the script: ./replace_secret.sh
This will modify file2 by replacing all occurrences of <secret-name> with the value of the name field extracted from file1.yaml.
Note:
 * This script assumes that the name field in file1.yaml contains only word characters. You may need to adjust the regular expression if the value can contain other characters.
 * This script modifies file2 in-place. Make sure to have a backup of file2 before running the script.
 * This script provides a basic example. You can further customize it based on your specific requirements, such as handling multiple occurrences of <secret-name> differently or using more complex logic for extracting the value from file1.yaml.
