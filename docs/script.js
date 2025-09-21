function copyUuid() {
    const uuidImageElement = document.getElementById('uuidImage');
    const uuidTextElement = document.getElementById('uuidText');
    const uuid = uuidTextElement.textContent;

    navigator.clipboard.writeText(uuid);

    uuidImageElement.classList.add("highlight");
    uuidImageElement.style.boxShadow = `0 0 1rem 0.25rem #${uuid.substring(0, 6)}`
    uuidTextElement.classList.add("highlight");
    uuidTextElement.style.textShadow = `0px 0px 0.5rem #${uuid.substring(0, 6)}`
}

function generateUuid() {
    const uuid = crypto.randomUUID();
    const svg = createSvg(uuid);

    const uuidImageElement = document.getElementById('uuidImage');
    const uuidTextElement = document.getElementById('uuidText');

    uuidImageElement.innerHTML = svg;
    uuidImageElement.classList.remove("highlight");
    uuidImageElement.style.boxShadow = "";

    uuidTextElement.textContent = uuid;
    uuidTextElement.classList.remove("highlight");
    uuidTextElement.style.textShadow = "";
}

function createSvg(uuid) {
    const colours = getColours(uuid);
    const rotation = getRotation(uuid);

    return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
                <g transform="rotate(${rotation} 240 240)">
                    <rect fill="${colours[0]}" x="0" y="0" width="100%" height="100%" />
                    <rect fill="${colours[1]}" x="80" y="80" width="320" height="150" />
                    <rect fill="${colours[2]}" x="80" y="250" width="150" height="150" />
                    <rect fill="${colours[3]}" x="250" y="250" width="150" height="150" />
                    <rect fill="${colours[0]}" x="180" y="180" width="120" height="120" />
                    <rect fill="${colours[4]}" x="200" y="200" width="80" height="80" />
                    <rect fill="${colours[5]}" x="220" y="460" width="40" height="20" />
                </g>
            </svg>
        `;
}

function getColours(uuid) {
    const colours = [];
    colours.push(uuid.slice(0, 6));
    colours.push(uuid.slice(6, 8) + uuid.slice(9, 13));
    colours.push(uuid.slice(15, 18) + uuid.slice(20, 23));
    colours.push(uuid.slice(24, 30));
    colours.push(uuid.slice(30, 36));
    colours.push(invert(colours[0]));
    return colours.map(x => `#${x}`);
}

function invert(hex) {
    const r = 255 - parseInt(hex.substring(0, 2), 16);
    const g = 255 - parseInt(hex.substring(2, 4), 16);
    const b = 255 - parseInt(hex.substring(4, 6), 16);
    const toHex = (val) => val.toString(16).padStart(2, '0');
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getRotation(guid) {
    switch (guid.charAt(19).toLocaleLowerCase()) {
        case "8":
            return 0;
        case "9":
            return 90;
        case "a":
            return 180;
        case "b":
            return 270;
        default:
            return 0;
    }
}