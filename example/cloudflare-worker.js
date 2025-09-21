// this standalone JS can used in cloudflare workers to return embeddable SVG

export default {
    fetch: async function (request, env, ctx) {
        const url = new URL(request.url)
        const uuid = url.pathname.substring(1)
        console.info({ message: 'UUID glyph requested', uuid: uuid });

        if (!isValidV4(uuid)) {
            return new Response(`${uuid} is not a valid v4 UUID`, {status: 400})
        }

        const svg = createSvg(uuid)

        return new Response(svg, {
            headers: {'Content-Type': 'image/svg+xml'}
        })
    }
};

function isValidV4(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
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