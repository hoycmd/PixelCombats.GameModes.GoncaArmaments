// * Импорты. * //
import * as api from `pixel_combats/room`;
import * as base from `pixel_combats/basic`;

// * Класс констант, которые поступают в режим для обработок, или взаимодействии с ними. * //
const WaitingPlayersTime = 10;
const RazminkaModeTime = 120;
const GameModeTime = 1500;
const End0fMatchStateValue = 10;
const WaitingStateValue = `Waiting`;
const RazminkaModeStateValue = `RazminkaMode`;
const GameStateValue = `Game`;
const End0fMatchStateValue = `End0fMatch`;

// * Задаём обработку переменных констант, которые сослужат для взаимодействий с режимом. * //
const MainTimer = api.Timers.GetContext().Get(`Main`);
const StateProp = api.Properties.GetContext().Get(`State`);
const ScoresTimer = api.Timers.GetContext().Get(`Scores`);

// * Настраиваем конструктор выборов настроек, для пред создании команты. * //
const MapRotation = api.GameMode.Parameters.Get(`MapRotation`);
api.Damage.GetContext().FriendlyFire.Value = api.GameMode.Parameters.Get(`FriendlyFire`);
api.BreackGraph.OnlyPlayerBlocksDmg = api.GameMode.Parameters.Get(`PartialDesruction`);
api.BreackGraph.WeakBlocks = api.GameMode.Parameters.Get(`LoosenBlocks`);

// * Параметры режима, которые помогают в игре дублировать сборку основных типов игровых режимов. * //
api.BreackGraph.PlayerBlockBoost = true; 
api.Ui.GetContext().MaiTimerId.Value = MainTimer.Id;

