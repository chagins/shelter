const petsJSON = await fetch('/shelter/assets/json/pets.json');
const petsObjects = await petsJSON.json();

export default petsObjects;