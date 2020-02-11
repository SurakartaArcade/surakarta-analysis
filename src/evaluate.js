import { RED_PLAYER, BLACK_PLAYER } from 'surakarta'

function isCorner (r, c) {
    return (r === c || r === 5 - c) && (r === 0 || r === 5)
}

export function evaluate (surakarta) {
    let advantage = 0

    surakarta.forEach((player, row, column) => {
        let pebbleValue = 0

        if (player === RED_PLAYER) {
            pebbleValue = 1
        } else if (player === BLACK_PLAYER) {
            pebbleValue = -1
        }

        if (isCorner(row, column)) {
            pebbleValue *= 0.5
        }

        advantage += pebbleValue
    })

    return advantage
}
