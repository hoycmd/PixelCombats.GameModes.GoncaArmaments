
import * as Room from 'pixel_combats/room';

// * Константы имён, объектов. * //
const length = Room.GameMode.Parameters.GetString('GameLength');

// * Длинна, матча. * //
export function GameModeMtchTime() {
    switch (length) {
        case 'Min30MatchTime': return 1801;
        case 'Length_M': return 3601; 
        case 'Length_L': return 1201;
    }   
    return 1201;
}
