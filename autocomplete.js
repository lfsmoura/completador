var autocomplete = (function() {

  function buildTrie(words, node) {
    node = node || {};
    for (var i in words) {
      if (words[i].length === 0) {
        continue;
      }
      var firstLetter = words[i][0];
      node[firstLetter] = node[firstLetter] || {};
      buildTrie([words[i].slice(1)], node[firstLetter]);
    }
    return node;
  }

  function getMatches(prefix, trie) {
    var keys = Object.keys(trie);
    if (keys.length === 0) {
      return [""];
    }
    var matches = [];
    for (var i in keys) {
      if(prefix[0] && prefix[0].toLowerCase() !== keys[i].toLowerCase()) {
        continue;
      }
      var m = getMatches(prefix.slice(1), trie[keys[i]]);
      for (var j in m) {
        matches.push(keys[i] + m[j]);
      }
    }
    return matches;
  }
  
  return function(element, options) {
    var defaultOptions = {
      words: []
    };
    options = options || {};
    var words = options.words || defaultOptions.words;  

    var trie = buildTrie(words);
    
    // create a div to place elements
    var autocompleteElement = document.createElement("div");
    element.parentElement.appendChild(autocompleteElement);

    // maybe override the element onkeyup is not a good idea
    element.onkeyup = function(e) {
      var matches = getMatches(element.value, trie);
      autocompleteElement.innerHTML = matches.join("<br>");
    };
  }
})();
