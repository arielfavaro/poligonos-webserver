export function simplifyFactor(map, factor) {
    const mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    return (mapWidth / map.getSize().y) * factor;
}