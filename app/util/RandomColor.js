export default function getRandomColor() {
    return `hsl(${360 * Math.random()},${40 + 50 * Math.random()}%,${40 + 10 * Math.random()}%)`;
}