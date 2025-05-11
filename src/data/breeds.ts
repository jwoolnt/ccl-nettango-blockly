type Breed = [string, string];
const RESERVED_WORDS = ["repeat", "random", "if", "else", "while", "for", "to", "end", "report"];

let turtleBreeds: Breed[] = [
	["turtles", "turtle"]
];

let undirectedLinkBreeds: Breed[] = [];

let directedLinkBreeds: Breed[] = [];

export function getTurtleBreeds(): Breed[] {
	return [...turtleBreeds];
}

export function getLinkBreeds(): Breed[] {
	return [
		["links", "link"],
		...undirectedLinkBreeds,
		...directedLinkBreeds
	];
}

export function getBreeds(): Breed[] {
	return [
		...getTurtleBreeds(),
		...getLinkBreeds()
	];
}

export function getAgentSets(): Breed[] {
	return [
		["patches", "patch"],
		...getBreeds()
	];
}

export function specifyPlurality(breeds: Breed[], plural: boolean): string[] {
	if (plural) {
		return breeds.map(([plural,]) => plural);
	} else {
		return breeds.map(([, singular]) => singular);
	}
}

//  Add a new breed with validation
export function addBreed(type: string, breed: Breed) {
	const [plural, singular] = breed;
    
    // Validate both plural and singular forms
    if (!isValidBreedName(plural)) {
        throw new Error(`Invalid plural name: "${plural}"`);
    }
    
    if (!isValidBreedName(singular)) {
        throw new Error(`Invalid singular name: "${singular}"`);
    }
    
    // Check for duplicates
    if (breedNameExists(plural)) {
        throw new Error(`Breed plural name "${plural}" already exists`);
    }
    
    if (breedNameExists(singular)) {
        throw new Error(`Breed singular name "${singular}" already exists`);
    }
    
    // Add the breed to the appropriate array
    switch (type) {
        case "turtle":
            turtleBreeds.push([...breed]); // Add a copy to prevent reference issues
            break;
        case "ulink":
        case "undirected-link":
            undirectedLinkBreeds.push([...breed]);
            break;
        case "dlink":
        case "directed-link":
            directedLinkBreeds.push([...breed]);
            break;
        default:
            throw new Error(`Unsupported breed type: ${type}`);
    }
}


export function removeBreed(type: string, targetBreed: Breed) {
	switch (type) {
		case "turtle":
			turtleBreeds = turtleBreeds.filter(breed => breed !== targetBreed);
			break;
		case "ulink":
		case "undirected-link":
			undirectedLinkBreeds = undirectedLinkBreeds.filter(breed => breed !== targetBreed);
			break;
		case "dlink":
		case "directed-link":
			directedLinkBreeds = directedLinkBreeds.filter(breed => breed !== targetBreed);
			break;
		default:
			console.error(`Unsupported type: ${type}`);
			break;
	}
}

export function resetBreeds(): void {
	turtleBreeds = [
		["turtles", "turtle"]
	];
	undirectedLinkBreeds = [];
	directedLinkBreeds = [];
}


// Check if a breed name is valid
function isValidBreedName(name: string): boolean {
    if (!name || name.trim() === "") return false;
    if (RESERVED_WORDS.includes(name.toLowerCase())) return false;

    // Allow letters, numbers, underscores, and hyphens
    return /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(name);
}

// Check if a breed name already exists
function breedNameExists(name: string): boolean {
    const normalizedName = name.toLowerCase();
    
    // Check turtle breeds
    if (turtleBreeds.some(([plural, singular]) => 
        plural.toLowerCase() === normalizedName || 
        singular.toLowerCase() === normalizedName)) {
        return true;
    }
    
    // Check undirected link breeds
    if (undirectedLinkBreeds.some(([plural, singular]) => 
        plural.toLowerCase() === normalizedName || 
        singular.toLowerCase() === normalizedName)) {
        return true;
    }
    
    // Check directed link breeds
    if (directedLinkBreeds.some(([plural, singular]) => 
        plural.toLowerCase() === normalizedName || 
        singular.toLowerCase() === normalizedName)) {
        return true;
    }
    
    return false;
}
