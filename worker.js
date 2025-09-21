// standalone JS used in cloudflare workers to return embeddable SVG
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url)
        const uuid = url.pathname.substring(1)

        function isValidV4(uuid) {
            const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return regex.test(uuid);
        }

        if (!isValidV4(uuid)) {
            return new Response(`${uuid} is not a valid v4 UUID`, { status: 400 })
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
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);

            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
            return `${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        }

        function getRotation(guid) {
            let degrees;

            switch (guid.charAt(19).toUpperCase()) {
                case "8":
                    degrees = 0;
                    break;
                case "9":
                    degrees = 90;
                    break;
                case "A":
                    degrees = 180;
                    break;
                case "B":
                    degrees = 270;
                    break;
            }

            return degrees;
        }

        const svgContent = createSvg(uuid)

        return new Response(svgContent, {
            headers: { 'Content-Type': 'image/svg+xml' }
        })
    }
};