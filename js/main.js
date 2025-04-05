import commands from "./commands.js";
import executors from "./executors.js";
import { error, render } from "./helpers.js";
import shortcuts from "./shortcuts.js";

const input = document.querySelector(".text");
const block = document.querySelector(".block");
const suggestion = document.querySelector(".suggestion");
let suggestionPresent = false;
addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    enterHandler();
  } else if (isCharacter(e.key)) {
    input.innerText += e.key;
  } else if (e.key === "Backspace") {
    input.innerText = input.innerText.slice(0, -1);
  } else if (e.key === "Tab") {
    e.preventDefault();
    if (suggestionPresent) {
      acceptSuggestion();
    }
    return;
  }
  autoSuggest(input.innerText);
});

const autoSuggest = (searchTerm) => {
  if (searchTerm === "") {
    clearAutoSuggest();
    return;
  }
  const results = [];
  shortcuts.forEach((category) => {
    Object.keys(category.items).forEach((key) => {
      if (key.toLowerCase().startsWith(searchTerm.toLowerCase())) {
        results.push(key.toLowerCase());
      }
    });
  });
  console.log(results);
  if (!results[0]) {
    clearAutoSuggest();
    return;
  }
  const remainingChars = results[0].slice(searchTerm.length);
  if (!remainingChars) {
    clearAutoSuggest();
    return;
  }
  block.innerText = remainingChars[0];
  suggestion.innerText = remainingChars.slice(1);
  suggestionPresent = true;
};

const clearAutoSuggest = () => {
  console.log("clear autosuggest");
  block.innerText = " ";
  suggestion.innerText = "";
  suggestionPresent = false;
};

const acceptSuggestion = () => {
  input.innerText += block.innerText + suggestion.innerText;
  clearAutoSuggest();
};

const enterHandler = () => {
  console.log(suggestionPresent);
  if (suggestionPresent) acceptSuggestion();
  const userInput = input.innerText.trim().split(" ");
  const command = userInput[0].toLowerCase();
  const options = userInput.slice(1);
  render(`<span class="green">❯&nbsp;</span>${input.innerText}`);
  try {
    const commandDetails = commands.find((c) =>
      c.name.map((n) => n.toLowerCase()).includes(command),
    );
    if (commandDetails) {
      if (command === "help") commandDetails.execute(commands);
      else commandDetails.execute(options);
    } else {
      const shortcutDetails = shortcuts
        .flatMap((c) => Object.entries(c.items))
        .find(([i]) => i.toLowerCase().startsWith(input.innerText));
      if (shortcutDetails) {
        render(`Redirecting to ${shortcutDetails[0]}...`);
        window.location.href = shortcutDetails[1];
      } else {
        window.location.href = `https://www.google.com/search?q=${input.innerText}`;
      }
    }
  } catch (e) {
    error("red", "JS Error", e.message);
  }
  input.innerText = "";
};

const isCharacter = (char) => {
  return /^[\S ]$/.test(char);
};

window.addEventListener("load", () => {
  // executors.ls();
  let filenames = ["firefox.jpg"];
  let root = document.getElementsByTagName("html")[0];
  root.style.backgroundImage = `url("./backgrounds/${
    filenames[Math.floor(Math.random() * filenames.length)]
  }")`;
  root.style.backgroundSize = "cover";
  root.style.backgroundPosition = "center";
});
