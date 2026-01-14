// Function to show the selected section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.editor-section'); // Select all editor sections
    sections.forEach(section => {
        section.style.display = 'none'; // Hide each section
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block'; // Show the selected section
    }
}

// Set the default section to show when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showSection('js-editor'); // Show JavaScript Compiler by default
});


// JavaScript Compiler: Run JS code
// Initialize CodeMirror for JavaScript Editor
const jsCodeArea = CodeMirror(document.getElementById("js-code-editor"), {
    mode: "javascript", // JavaScript mode
    theme: "material-darker", // Default theme
    lineNumbers: true, // Line numbers
    tabSize: 2, // Tab size of 2 spaces
    indentUnit: 2, // Indentation size
    placeholderText: "Write JavaScript code here", // Placeholder text
});

// Theme selector event listener
document.getElementById("theme-selector").addEventListener("change", function () {
    const selectedTheme = this.value; // Get selected theme
    jsCodeArea.setOption("theme", selectedTheme); // Update CodeMirror theme
});


// Functionality for JavaScript Compiler Buttons
(function () {
    const outputElement = document.getElementById("js-output");

    // Override console.log
    const originalLog = console.log;
    console.log = function (...args) {
        args.forEach(arg => {
            const message = document.createElement("div");
            message.textContent = `${arg}`;
            outputElement.appendChild(message);
        });
        originalLog.apply(console, args); // Retain original browser console behavior
    };

    // Override document.write (no longer alters the page)
    document.write = function (...args) {
        args.forEach(arg => {
            const message = document.createElement("div");
            message.textContent = `document.write: ${arg}`;
            outputElement.appendChild(message);
        });
    };

    // Override alert (no popup, displays output in the output section)
    window.alert = function (message) {
        const alertMessage = document.createElement("div");
        alertMessage.textContent = `alert: ${message}`;
        outputElement.appendChild(alertMessage);
    };
})();

// "Run" Button: Execute JavaScript code and display the output
document.getElementById("js-run-button").addEventListener("click", function () {
    const jsCode = jsCodeArea.getValue(); // Get code from the CodeMirror editor
    const outputElement = document.getElementById("js-output"); // Output container

    outputElement.innerHTML = ""; // Clear previous output

    try {
        // Evaluate the JavaScript code
        const result = eval(jsCode); // Executes the code
        if (result !== undefined) {
            const resultMessage = document.createElement("div");
            resultMessage.textContent = `Result: ${result}`;
            outputElement.appendChild(resultMessage);
        }
    } catch (error) {
        // Display any errors
        const errorMessage = document.createElement("div");
        errorMessage.textContent = `Error: ${error.message}`;
        outputElement.appendChild(errorMessage);
    }
});

// "Save" Button: Save the JavaScript code to a .js file
document.getElementById("js-save-button").addEventListener("click", function () {
    const jsCode = jsCodeArea.getValue(); // Get code from the CodeMirror editor

    // Create a Blob and download link for saving the file
    const blob = new Blob([jsCode], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "script.js"; // File name
    link.click();
});

// "Clear All" Button: Clear the textarea and output section
document.getElementById("js-clear-all-button").addEventListener("click", function () {
    jsCodeArea.setValue(""); // Clear the CodeMirror editor
    document.getElementById("js-output").textContent = ""; // Clear the output
});

// Python Compiler: Run Python code
// Initialize CodeMirror for Python Compiler
const pythonCodeEditor = CodeMirror(document.getElementById('python-code-editor'), {
    mode: 'python',
    theme: 'material-darker',
    lineNumbers: true,
    indentUnit: 4,
    indentWithTabs: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    extraKeys: {
        Tab: (cm) => cm.replaceSelection('    '), // Insert spaces on Tab
    },
    placeholder: 'Write Python code here...',
});

// Update CodeMirror theme for Python Compiler
document.getElementById('python-theme-selector').addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    pythonCodeEditor.setOption('theme', selectedTheme);
});

// Run Python Code
document.querySelector('#python-run-button').addEventListener('click', function () {
    const pythonCode = pythonCodeEditor.getValue();

    try {
        document.querySelector('#python-output').innerText = '';
        Sk.configure({
            output: (text) => {
                document.querySelector('#python-output').innerText += text + '\n';
            },
        });

        Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('main', false, pythonCode))
            .catch((err) => {
                document.querySelector('#python-output').innerText = `Error: ${err.toString()}`;
            });
    } catch (error) {
        document.querySelector('#python-output').innerText = `Error: ${error.message}`;
    }
});

// Save Python Code
document.querySelector('#python-save-button').addEventListener('click', function () {
    const pythonCode = pythonCodeEditor.getValue();
    const blob = new Blob([pythonCode], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'python_code.py';
    a.click();
});

// Clear Python Code
document.querySelector('#python-clear-button').addEventListener('click', function () {
    pythonCodeEditor.setValue('');
    document.querySelector('#python-output').innerText = '';
});


// HTML Compiler: Run HTML code
// Initialize CodeMirror for HTML Editor
document.addEventListener("DOMContentLoaded", function () {
    // Initialize CodeMirror for Basic HTML Editor
    const htmlCodeArea = CodeMirror(document.getElementById("html-code-editor"), {
        mode: "xml", // XML mode for HTML highlighting
        theme: "material-darker", // Default theme
        lineNumbers: true, // Line numbers
        tabSize: 2, // Tab size
        indentUnit: 2, // Indentation size
        placeholder: "Write HTML code here...", // Placeholder text
    });

    // Ensure the editor is empty on load to display the placeholder
    htmlCodeArea.setValue("");

    // Add event listener to the theme selector
    document.getElementById("html-theme-selector").addEventListener("change", function () {
        const selectedTheme = this.value; // Get selected theme from the dropdown
        htmlCodeArea.setOption("theme", selectedTheme); // Update the CodeMirror theme
    });

    // Save Button: Save the HTML code to a .html file
    document.getElementById("html-save-button").addEventListener("click", function () {
        const htmlCode = htmlCodeArea.getValue(); // Get code from the CodeMirror editor

        // Create a Blob and download link for saving the file
        const blob = new Blob([htmlCode], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "index.html"; // File name
        link.click();
    });

    // Clear All Button: Clear the CodeMirror editor and output iframe
    document.getElementById("html-clear-all-button").addEventListener("click", function () {
        htmlCodeArea.setValue(""); // Clear the CodeMirror editor
        document.getElementById("html-output").srcdoc = ""; // Clear the iframe output
    });

    // Dynamically render HTML code in the iframe
    htmlCodeArea.on("change", function () {
        const htmlCode = htmlCodeArea.getValue(); // Get code from the CodeMirror editor
        document.getElementById("html-output").srcdoc = htmlCode; // Dynamically update iframe content
    });
});

// Voice-to-Code: CodeMirror Setup
// Voice-to-Code: Enhanced CodeMirror Setup
const voiceCodeMirror = CodeMirror(document.getElementById('voice-code-editor'), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'material-darker',
    placeholder: 'Your voice input will appear here',
});

// Check for Speech Recognition Support
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
} else {
    document.getElementById('start-listening').disabled = true;
    document.getElementById('start-listening').innerText = 'Speech Recognition Not Supported';
    alert('Your browser does not support Speech Recognition. Use Chrome for full functionality.');
}

// Voice-to-Code Mappings
const commandMappings = {
    // JavaScript Commands
    'console log statement': { output: 'console.log("");', aliases: ['log message', 'print in console', 'console log'] },
    'function declaration': { output: 'function name() {\n\n}', aliases: ['define function', 'create function'] },
    'if statement': { output: 'if (condition) {\n\n}', aliases: ['conditional statement', 'if condition'] },
    'for loop': { output: 'for (let i = 0; i < length; i++) {\n\n}', aliases: ['iterate loop', 'loop statement'] },
    'while loop': { output: 'while (condition) {\n\n}', aliases: ['while condition', 'loop while'] },
    'variable declaration': { output: 'let varName = value;', aliases: ['declare variable', 'initialize variable'] },
    'arrow function': { output: 'const functionName = () => {\n\n};', aliases: ['lambda function', 'arrow syntax'] },

    // Python Commands
    'print statement': { output: 'print("")', aliases: ['display message', 'print'] },
    'import statement': { output: 'import module', aliases: ['import module', 'module import'] },
    'if statement python': { output: 'if condition:\n    pass', aliases: ['conditional statement python', 'python if'] },
    'for loop python': { output: 'for item in iterable:\n    pass', aliases: ['python loop', 'loop in python'] },
    'while loop python': { output: 'while condition:\n    pass', aliases: ['loop while python', 'python while'] },
    'define function python': { output: 'def function_name():\n    pass', aliases: ['python function', 'function definition python'] },
    'class definition python': { output: 'class ClassName:\n    def __init__(self):\n        pass', aliases: ['python class', 'define class python'] },

    // HTML Commands
    'html paragraph': { output: '<p></p>', aliases: ['paragraph tag', 'html p'] },
    'html heading one': { output: '<h1></h1>', aliases: ['h1 tag', 'heading one'] },
    'html heading two': { output: '<h2></h2>', aliases: ['h2 tag', 'heading two'] },
    'html div': { output: '<div></div>', aliases: ['div tag', 'html container'] },
    'html span': { output: '<span></span>', aliases: ['span tag', 'inline container'] },
    'html link': { output: '<a href=""></a>', aliases: ['anchor tag', 'hyperlink'] },
    'html image': { output: '<img src="" alt="">', aliases: ['image tag', 'html img'] },
    'html head': { output: '<head>\n\n</head>', aliases: ['head tag', 'html head section'] },
    'html body': { output: '<body>\n\n</body>', aliases: ['body tag', 'html body section'] },
    'html title': { output: '<title></title>', aliases: ['title tag', 'html title'] },
    'html html': { output: '<html>\n\n</html>', aliases: ['html tag', 'html structure'] },
    'html doctype': { output: '<!DOCTYPE html>', aliases: ['doctype declaration', 'html doctype'] },
    'html script': { output: '<script>\n\n</script>', aliases: ['script tag', 'html script'] },
    'html style': { output: '<style>\n\n</style>', aliases: ['style tag', 'html style'] },

    // Symbols and Miscellaneous (Updated)
    'comma': { output: ',', aliases: [] },
    'semicolon': { output: ';', aliases: ['semi colon'] },
    'colon': { output: ':', aliases: [] },
    'open bracket': { output: '{', aliases: ['opening curly bracket'] },
    'close bracket': { output: '}', aliases: ['closing curly bracket'] },
    'open parentheses': { output: '(', aliases: ['opening parenthesis'] },
    'close parentheses': { output: ')', aliases: ['closing parenthesis'] },
    'equal to': { output: '=', aliases: [] },
    'double equal to': { output: '==', aliases: ['equals equals', 'is equal to'] },
    'not equal to': { output: '!=', aliases: ['not equals', 'not equal'] },
    'arrow function': { output: '=>', aliases: ['fat arrow', 'lambda'] },
    'next line': { output: '\n', aliases: ['new line', 'line break'] }
};



// Start Listening Button
document.getElementById('start-listening').addEventListener('click', () => {
    if (recognition) {
        recognition.start();
        document.getElementById('start-listening').style.display = 'none';
        document.getElementById('stop-listening').style.display = 'inline-block';
    }
});

// Stop Listening Button
document.getElementById('stop-listening').addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
        document.getElementById('stop-listening').style.display = 'none';
        document.getElementById('start-listening').style.display = 'inline-block';
    }
});

// Handle Speech Recognition Results
if (recognition) {
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript.trim() + ' ';
        }
        processVoiceCommand(transcript.trim());
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
        console.log('Speech recognition stopped.');
    };
}

// Process Voice Command
function processVoiceCommand(transcript) {
    const words = transcript.toLowerCase().split(' ');
    let output = '';

    for (const command in commandMappings) {
        const { output: template, aliases } = commandMappings[command];
        const allTriggers = [command, ...aliases]; // Combine command and aliases
        for (const trigger of allTriggers) {
            if (transcript.startsWith(trigger)) {
                // Replace placeholders dynamically
                const remainingText = transcript.replace(trigger, '').trim();
                output = template
                    .replace('{{text}}', remainingText)
                    .replace('{{condition}}', remainingText)
                    .replace('{{content}}', remainingText)
                    .replace('{{url}}', remainingText.split(' ')[0]) // First word as URL
                    .replace('{{alt}}', remainingText.split(' ').slice(1).join(' ')) // Rest as alt text
                    .replace('{{name}}', remainingText)
                    .replace('{{number}}', parseInt(remainingText) || 0)
                    .replace('{{variable}}', remainingText.split(' ')[1] || 'var')
                    .replace('{{format}}', 'd'); // Default format for scan statement

                // Insert into CodeMirror editor
                voiceCodeMirror.replaceRange(output, voiceCodeMirror.getCursor());
                return;
            }
        }
    }

    // Fallback for unrecognized commands
    voiceCodeMirror.replaceRange(transcript, voiceCodeMirror.getCursor());
}



// Clear Last Word Button
document.getElementById('voice-clear-last-word-button').addEventListener('click', () => {
    const content = voiceCodeMirror.getValue();
    const updatedContent = content.trim().split(' ').slice(0, -1).join(' ');
    voiceCodeMirror.setValue(updatedContent);
});

// Clear All Button
document.getElementById('voice-clear-all-button').addEventListener('click', () => {
    voiceCodeMirror.setValue('');
});

// Copy Button
document.getElementById('voice-copy-button').addEventListener('click', () => {
    navigator.clipboard.writeText(voiceCodeMirror.getValue())
        .then(() => alert('Code copied to clipboard!'))
        .catch((err) => alert('Failed to copy code: ' + err));
});















