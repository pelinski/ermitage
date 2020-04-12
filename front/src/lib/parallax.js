export const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];

export const trans = (tx, ty) => (x, y) => `translate3d(${x / tx}px,${y / ty}px,0)`;
