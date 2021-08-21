const fs = require("fs");
var ar1 = require("./components/data.json");
var ar2 = require("./components/dataTar.json");

const keysToRemove = ["x", "y"];
const nonKeyProperties = ["id", "Longitude", "Latitude"];
const combined = [...ar2, ...ar1].map((el) => {
  const currentKeys = Object.keys(el);
  let keys = currentKeys.filter((key) => !keysToRemove.includes(key));

  const obj = {};
  keys.forEach((key) => {
    obj[key] = el[key];
  });

  return obj;
});

const propertyNames = new Set();
combined.forEach((el) => {
  let keys = Object.keys(el).filter((key) => !nonKeyProperties.includes(key));
  keys.forEach((el) => {
    propertyNames.add(el);
  });
});

const dataObj = { properties: Array.from(propertyNames), data: combined };
console.log(combined.length, propertyNames);

var jsonContent = JSON.stringify(dataObj, null, 4);

fs.writeFile("tarData.json", jsonContent, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("JSON file has been saved.");
});
