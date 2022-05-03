const petsJSON = await fetch('../../assets/json/pets.json');
const petsObjects = await petsJSON.json();

export default petsObjects;