
import { GameMode } from 'pixel_combats/room';

// * Константы имён, объектов. * //
const length = GameMode.Parameters.GetString('GameLength');

// * Длинна, матча. * //
export function GameModeMatchTime() {
    switch (length) {
        case 'Min30MatchTime': return 1801;
        case 'Hour1MatchTime': return 3601; 
        case 'Min20MatchTime': return 1201;
    }   
    return 1201;
}
