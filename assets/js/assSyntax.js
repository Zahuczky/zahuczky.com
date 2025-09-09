(function () {
  function applyAssSyntax(root = document) {
    root.querySelectorAll('ass, code.ass, code.language-ass, [data-syntax="ass"]').forEach(el => {
    let output = el.innerHTML;

    // Patterns and replacements

    brackets = ["{", "}"];

    const tags = [
        "\\1a", "\\1c", "\\2a", "\\2c", "\\3a", "\\3c", "\\4a", "\\4c", "\\an", 
        "\\be", "\\fe", "\\fn", "\\fr", "\\fs", "\\kf", "\\ko", "\\fax", "\\fay", 
        "\\frx", "\\fry", "\\frz", "\\fsp", "\\org", "\\pbo", "\\pos", "\\blur", 
        "\\clip", "\\fad", "\\fade", "\\fscx", "\\fscy", "\\move", "\\shad", 
        "\\alpha", "\\iclip", "\\xbord", "\\xshad", "\\ybord", "\\yshad", "\\K", 
        "\\a", "\\b", "\\c", "\\i", "\\k", "\\p", "\\q", "\\r", "\\s", "\\t", "\\u"
    ];
    
    const inlinevars = [
        "$layer", "$lstart", "$lend", "$ldur", "$lmid", "$style", "$actor", 
        "$margin_l", "$margin_r", "$margin_v", "$margin_t", "$margin_b", "$syln", 
        "$li", "$lleft", "$lcenter", "$lright", "$ltop", "$lmiddle", "$lbottom", 
        "$lwidth", "$lheight", "$sstart", "$send", "$smid", "$sdur", "$skdur", 
        "$si", "$sleft", "$scenter", "$sright", "$sbottom", "$smiddle", "$stop", 
        "$sx", "$sy", "$swidth", "$sheight", "$start", "$end", "$mid", "$dur", 
        "$kdur", "$i", "$left", "$center", "$right", "$top", "$middle", "$bottom", 
        "$x", "$y", "$width", "$height"
    ];


    // Color tag arguments
    output = colorTagArguments(output, tags);

    // Apply color to brackets and inline variables
    output = applyColorToPatterns(output, brackets, "#1432FF");
    output = applyColorToPatterns(output, inlinevars, "#8000C0", true);
    output = applyColorToPatterns(output, tags, "#5A5A5A", true);

    // Additional replacements
    output = replaceSpecialCharacters(output);

    // Correct combined tags
    output = correctCombinedTags(output);

    // if output contains curly brackets,
    // anything thats outside of the curly brackets should be stripped of all formatting
    if (output.includes("{")) {
        const curlyBrackets = output.match(/{[^{}]*}/g);
        const curlyBracketsReplaced = curlyBrackets.map((bracket, index) => {
            return `__${index}__`;
        });
        for (let i = 0; i < curlyBrackets.length; i++) {
            output = output.replace(curlyBrackets[i], curlyBracketsReplaced[i]);
        }
        output = output.replace(/<span[^>]*>/g, '');
        // stip bold
        output = output.replace(/<b>/g, '');
        for (let i = 0; i < curlyBrackets.length; i++) {
            output = output.replace(curlyBracketsReplaced[i], curlyBrackets[i]);
        }
    }

    output = formatVector(output,el.innerHTML);

    el.innerHTML = output;

    // if the first character is a curly bracket, replace it with "as"
    if (el.innerHTML[0] === "{") {
        el.innerHTML = '<span style="color: #1432FF">{</span>' + el.innerHTML.substring(1);
    }

    el.innerHTML = `<span style="font-family: monospace; background-color: #fff; color: #000; padding: 3px; border-radius: 3px; margin: 3px 0;">${el.innerHTML}</span>`;
    }); // end forEach
  }     // end applyAssSyntax

  // expose a callable hook
  window.applyAssSyntax = applyAssSyntax;

  // optional: still run once for static pages
  if (document.readyState !== 'loading') applyAssSyntax();
  else document.addEventListener('DOMContentLoaded', () => applyAssSyntax());
})();

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyColorToPatterns(text, patterns, color, isBold = false) {
    patterns.forEach(pattern => {
        const replaceWith = `<span style="color:${color}">${isBold ? `<b>${pattern}</b>` : pattern}</span>`;
        text = text.replace(new RegExp(escapeRegExp(pattern), 'g'), replaceWith);
    });
    return text;
}

function replaceSpecialCharacters(text) {
    const specialChars = {'\\': '#FF00C8', '(': '#FF00C8', ')': '#FF00C8', ',': '#FF00C8'};
    for (const [char, color] of Object.entries(specialChars)) {
        text = text.replace(new RegExp(`\\${char}`, 'g'), `<span style="color:${color}">${char}</span>`);
    }
    return text;
}

function correctCombinedTags(text) {
    const corrections = {
        'fs</b></span>cy': 'fscy</b></span>',
        'fs</b></span>cx': 'fscx</b></span>',
        '$mid</b></span>dle': '$middle</b></span>',
        '$lmid</b></span>dle': '$lmiddle</b></span>',
        '$smid</b></span>dle': '$smiddle</b></span>'
    };
    for (const [pattern, replacement] of Object.entries(corrections)) {
        text = text.replace(new RegExp(pattern, 'g'), replacement);
    }
    return text;
}

function colorTagArguments(text, tags) {
    tags.forEach(tag => {
        const tagPattern = new RegExp(`\\${tag}(?![a-zA-Z])[^}]+`, 'g');
        text = text.replace(tagPattern, match => {
            const tagIndex = match.indexOf(tag);
            const tagName = match.substring(tagIndex, tagIndex + tag.length);
            const arg = match.substring(tagIndex + tag.length);
            return `<span style="color:#5A5A5A"><b>${tagName}</b></span><span style="color:#285A28">${arg}</span>`;
        });
    });
    return text;
}

function formatVector(input,doesItHaveP1) {
    // if the doesItHaveP1 contains the text "p1" we're gonna do some formatting. Othersiwe we're gonna just return input
    if (doesItHaveP1.includes("p1")) {
        // lets look for regex }.+m and split the string at this point into two parts. The first is the things before the m, and the second part is the m and whats after
        const split = input.split(/}.+m/);
        // if the split is empty, we're gonna return the input
        if (split.length < 2) {
            return input;
        }
        // lets format the first part
        const tags = split[0];
        console.log("tags " + tags);
        // lets format the second part
        const vector = split[1];
        console.log("vector " + vector);

        // in the vector, let's split at every space
        const vectorSplit = vector.split(" ");
        console.log(vectorSplit);

        // the second element should be colored red
        vectorSplit[1] = `<span style="color:#5A2828">${vectorSplit[1]}</span>`;
        // the hird element should be colored green
        vectorSplit[2] = `<span style="color:#285A28">${vectorSplit[2]}</span>`;

        // color coordinate pairs
        for (let i = 0; i < vectorSplit.length; i++) {
            if (!isNaN(vectorSplit[i])) {
                vectorSplit[i] = `<span style="color:#5A2828">${vectorSplit[i]}</span>`;
                vectorSplit[i + 1] = `<span style="color:#285A28">${vectorSplit[i + 1]}</span>`;
            }
        }

        // underlining bezier point coordinates, excluding control points.
        for (let i = 0; i < vectorSplit.length; i++) {
            if (vectorSplit[i] === "b") {
                for (let j = i + 5; j < vectorSplit.length; j += 6) {
                    if (vectorSplit[j] === "m" || vectorSplit[j] === "l" || vectorSplit[j] === "b") {
                        break;
                    }
                vectorSplit[j] = `<span style="text-decoration: underline; text-decoration-color:#5A2828">${vectorSplit[j]}</span>`;
                vectorSplit[j+1] = `<span style="text-decoration: underline; text-decoration-color:#285A28">${vectorSplit[j+1]}</span>`;
                }
            }
        }

        // if its a letter m, l or b, let's make it bold
        for (let i = 0; i < vectorSplit.length; i++) {
            if (vectorSplit[i] === "m" || vectorSplit[i] === "l" || vectorSplit[i] === "b") {
                vectorSplit[i] = `<b>${vectorSplit[i]}</b>`;
            }
        }

        // after these, we join the vectorSplit back together
        const vectorJoined = vectorSplit.join(" ");
        console.log(vectorJoined);
        
        output = tags + `}</span><b>m</b>${vectorJoined}`;

        return output;



    } else {
        return input;
    }
}