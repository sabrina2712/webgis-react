import salento422data from "./salento_4_2_2 .json";

/**
 * write a function, that should take 5 params e.g. name, id, age, height, weight
 * and return a object like this:
 * {
 * id: 23,
 * name: "john doe",
 * properties: {
 *               age: 12,
 *              height: 181,
 *              weight: 56
 *              }
 * }
 *
 * makeMan(23, "john doe", 12, 181, 56);
 */
const len = salento422data.length;

function dataCOnvert(coor, spc) {
  let result = {
    Longitude: coor[0],
    Lattitude: coor[1],
    SPC: spc,
  };

  return result;
}
let coordinates = salento422data.map((el) => el.geometry.coordinates);
let spc = salento422data.map(
  (el) => el.properties["Specific capacity [l/(s*m)]"]
);

let newData = dataCOnvert(coordinates, spc);

console.log(newData);
