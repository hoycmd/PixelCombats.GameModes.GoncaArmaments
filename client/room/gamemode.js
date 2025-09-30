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
const MaxDeaths = api.Players.MaxCount * 5;

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
//api.Properties.GetContext().GameModeName.Value = `GameModes/TeamDeadMatch`;
api.Damage.GetContext().GranadeTouchExplosive.Value = true;
api.TeamsBalancer.IsAutoBalance = true;

// * Создаём, 2 сбора команд которые сортируем их в названия. * //
let RedTeam = libraryTeams.CreateNewTeam(`Red`, `Teams/Red\nby: TnT live (official)`, new base.Color(125/255, 0, 0, 0), 1, api.BuildBlocksSet.Red);
let BlueTeam = libraryTeams.CreateNewTeam(`Blue`, `Teams/Blue\nby: TnT live (official)`, new base.Color(0, 0, 125/255, 0), 2, api.BuildBlocksSet.Blue);
// * Интерфейс команд, в разных частях прямоугольниках карт. * //
if (StateProp.Value == GameModeStateValue) {
 RedTeam.Properties.Get(`UiRedTeam`).Value = MaxDeaths;
 api.Ui.GetContext().TeamProp1.Value = { Team: `Blue`, Prop: `UiRedTeam` };
 BlueTeam.Properties.Get(`UiBlueTeam`).Value = MaxDeaths;
 api.Ui.GetContext().TeamProp2.Value = { Team: `Red`, Prop: `UiBlueTeam` };
} 

// * Задаём в лидерборде заданные значения, которые нужно вводить в таблицу. * //
api.LeaberBoard.PlayerLeaberBoardValues = [
 new base.DisplayValueHeader(`Kills/Deaths/Spawns`, `\nK/D/S`, `\nK/D/S`),
 new base.DisplayValueHeader(`Scores`, `\nScores`, `\nScores`),
 new base.DisplayValueHeader(`RoomID`, `RID`, `RID`)
];

// * Задаём список лидирующих, для игроков за самые наилучшие значения по киллам. * //
api.LeaberBoard.PlayersWeightGetter.Set(function (p) {
  return p.Properties.Get(`Kills/Deaths/Spawns`).Value;
});
// * Список лидирующих команд, за самые наибольшие смерти в команде. * //
api.LeaberBoard.TeamWeightGetter.Set(function (t) {
 return t.Properties.Get(`Kills/Deaths/Spawns`).Value;
});

// * Дублируем щит игрока, где появляется после респавна. * //
api.Spawns.GetContext().OnSpawn.Add(function (p) {
 t = p.Timers.Get(`Immortality`).Restart(5);
 p.Properties.Immortality.Value = true;
});
api.Timers.OnPlayerTimer.Add(function (t) {
 if (!t.Id == `Immortality`) t.p.Properties.Immortality.Value = false;
});

// * Обработчик киллов. * //
api.Damage.OnKill.Add(function (p, k) {
 if (!p.id == k.id) { ++p.Properties.Kills.Value;
  p.Properties.Get(`Kills/Deaths/Spawns`).Value = `${p.Properties.Kills.Value}/${p.Properties.Deaths.Value}/${p.Properties.Spawns.Value}`;
  p.Properties.Scores.Value += 15;
} 


 
