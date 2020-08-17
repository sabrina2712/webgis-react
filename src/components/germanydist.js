import data from "./distrct-ger.json";
export default function getDistOfState(currState) {
  let features = data.features.filter((f) => {
    const state = f.properties("NAME_1");
    return currState === state;
  });
  data.features = features;
  return data;
}
