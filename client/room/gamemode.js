// * Импорты. * //
import * as api from `pixel_combats/room`;
import * as base from `pixel_combats/basic`;

try {
	
// * Класс констант, которые поступают в режим для обработок, или взаимодействии с ними. * //
const WaitingPlayersTime = 10;
const RazminkaModeTime = 120;
const GameModeTime = 1500;
const End0fMatchStateValue = 10;
const WaitingStateValue = `WaitingMode`;
const RazminkaModeStateValue = `RazminkaMode`;
const GameStateValue = `Game`;
const End0fMatchStateValue = `End0fMatch`;
const MockModeStateValue = `MockMode`;
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
let RedTeam = CreateNewTeam(`Red`, `Teams/Red\nby: TnT live (official)`, new base.Color(125/255, 0, 0, 0), 1, api.BuildBlocksSet.Red);
let BlueTeam = CreateNewTeam(`Blue`, `Teams/Blue\nby: TnT live (official)`, new base.Color(0, 0, 125/255, 0), 2, api.BuildBlocksSet.Blue);
	
// * Задаём в лидерборде заданные значения, которые нужно вводить в таблицу. * //
api.LeaberBoard.PlayerLeaberBoardValues = [
 new base.DisplayValueHeader(`Kills/Deaths/Spawns`, `\nK/D/S`, `\nK/D/S`),
 new base.DisplayValueHeader(`Scores`, `\nScores`, `\nScores`)
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
 if (t.Id != `Immortality`) t.p.Properties.Immortality.Value = false;
});

// * Обработчик киллов. * //
api.Damage.OnKill.Add(function (p, k) {
 if (p.id !== k.id) { ++p.Properties.Kills.Value;
  p.Properties.Get(`Kills/Deaths/Spawns`).Value = `${p.Properties.Kills.Value}/${p.Properties.Deaths.Value}/${p.Properties.Spawns.Value}`;
  p.Properties.Scores.Value += 10;
}
 if (p.Properties.Kills.Value == 5) { 
  p.Inventory.Melee.Value = false, p.Inventory.Secondary.Value = true;
 }
 if (p.Inventory.Kills.Value == 10) { 
  p.Inventory.Secondary.Value = false, p.Inventory.Explosive.Value = true, p.Inventory.Explosive.Value = true;
 }
 if (p.Properties.Kills.Value == 15) { 
  p.Inventory.Explosive.Value = false, p.Inventory.Main.Value = true;
 }
 if (p.Properties.Kills.Value == 20) {
  p.Inventory.MainInfinity.Value = true;
 }
 if (p.Properties.Kills.Value == 25) {
  p.ContextedProperties.MaxHp.Value = 250;
 }
 if (p.Properties.Kills.Value == 30) { 
  p.ContextedProperties.IventoryType.Value = true, p.Properties.Explosive.Value = true, p.Properties.Melee.Value = true, p.Properties.ExplosiveInfinity.Value = true;
 }
 if (p.Properties.Kills.Value == 35) {
  p.ContextedProperties.InventoryType.Value = false, p.Inventory.Explosive.Value = false, p.Inventory.Melee.Value = false, p.Inventory.Main.Value = true;
 }
 if (p.Properties.Kills.Value == 40) {
  p.Properties.MainInfinity.Value = true;
 }
 if (p.Properties.Kills.Value == 45) {
  p.ContextedProperties.MaxHp.Value = 1500;
 }
 if (p.Properties.Kills.Value >= 50) {
  SetEnd0fMatch();
      }
});

// * Обработчик смертей. * //
api.Damage.OnDeath.Add(function (p) {
 if (StateProp.Value == MockModeStateValue) {
    api.Spawns.GetContext(p).Spawn(); 
	 return;
 }
 ++p.Properties.Deaths.Value;
   p.Properties.Get(`Kills/Deaths/Spawns`).Value = `${p.Properties.Kills.Value}/${p.Properties.Deaths.Value}/${p.Properties.Spawns.Value}`;
});

// * Обработчик респавнов игроков. * //
api.Spawns.OnSpawn.Add(function (p) {
 ++p.Properties.Spawns.Value;
  p.Properties.Get(`Kills/Deaths/Spawns`).Value = `${p.Properties.Kills.Value}/${p.Properties.Deaths.Value}/${p.Properties.Spawns.Value}`;
});

// * Если игрок умирает, контекст смертей игроков уменьшается в прямоугольнике команде. * //
api.Properties.OnPlayerProperty.Add(function (c, v) {
 if (v.Name !== `UiTeam`) return;
 if (c.Player.Team == null) return;
  c.Player.Team.Properties.Get(`UiTeam`).Value--;
});
// * Если числа в команде прямоугольниках занулились, то заыершаем катку. * //
api.Properties.OnTeamProperty.Add(function (c, v) {
 if (v.Name !== `UiTeam`) return;
 if (v.Name <= 0) SetEnd0fMatch();
});

// * Разрешаем игроку, зайти в любую команду. * //
api.Teams.OnRequestJoinTeam.Add(function (p, t) { t.Add(p); });
// * Респавним игрока, после захода в команду. * //
api.Teams.OnPlayerChangeTeam.Add(function (p) { p.Spawns.Spawn(); });

// * Таймер ресурса очков, за время в комнате. * //
ScoresTimer.OnTimer.Add(function () {
if (p.Team == null) continue;
 for (const p of api.Players.All) {
  p.Properties.Scores.Value += 5;
     }
});

// * Основной таймер, переключения режимов игры. * //
MainTimer.OnTimer.Add(function () {
 switch (StateProp.Value) {
  case WaitingStateValue:
   SetRazminkaMode();
    break;
  case RazminkaModeStateValue:
   SetGameMode();
    break;
  case GameStateValue:
   SetEnd0fMatch();
    break;
  case MockModeStateValue:
   SetEnd_End0fMatch();
    break;
  case End0fMatchStateValue:
   RestartGame();
    break;
     }
});

// * Первеночальное игровое состоние игры. * //
SetWaitingMode();

// * Состояние игры. * //
function SetWaitingMode() {
 StateProp.Value = WaitingModeStateValue;
 api.Ui.GetContext().Hint.Value = `<b>Загрузка...</b>`;
 api.Spawns.GetContext().Enable = false;
 MainTimer.Restart(WaitingPlayersTime);
}
function SetRazminkaMode() {
 StateProp.Value = RazminkaModeStateValue;
 api.Ui.GetContext().Hint.Value = `\n<b>Выберите, команду...</b>`;
  RedTeam.Ui.Hint.Value = `\nРазминка.Потренируйтесь, перед матчем!`;
  BlueTeam.Ui.Hint.Value = `\nРазминка.Потренируйтесь, перед матчем!`;
 const inventory = api.Inventory.GetContext();
  inventory.Main.Value = true;
  inventory.Secondary.Value = true;
  inventory.Melee.Value = true;
  inventory.Explosive.Value = true;
  inventory.Build.Value = false;

  api.Spawns.GetContext().Enable = true;
   SpawnTeams();
   MainTimer.Restart(RazminkaModeTime);
}
function SetGameMode() {
 StateProp.Value = GameModeStateValue;
 api.Ui.GetContext().Hint.Value = `\nМатч начался.Победите, в этой схватке!`;
const inventory = api.Inventory.GetContext();
 inventory.Main.Value = false;
 inventory.Secondary.Value = false;
 inventory.Melee.Value = true;
 inventory.Explosive.Value = false;
 inventory.Build.Value = false;

// * Интерфейс команд, в разных частях прямоугольниках карт. * //
 RedTeam.Properties.Get(`UiTeam`).Value = MaxDeaths;
 api.Ui.GetContext().TeamProp1.Value = { Team: `Blue`, Prop: `UiTeam` };
 BlueTeam.Properties.Get(`UiTeam`).Value = MaxDeaths;
 api.Ui.GetContext().TeamProp2.Value = { Team: `Red`, Prop: `UiTeam` };
	
 api.Spawns.GetContext().Despawn();
 SpawnTeams();
 MainTimer.Restart(GameModeTime);
}
function SetEnd0fMatch() {
 const leaberboard = api.LeaberBoard.GetTeams();
  if (leaberboard[0].Weight !== leaberboard[1].Weight) {
    SetMockMode(leaberboard[0].Team, leaberboard[1].Team);
  for (const winPlayer of leaberboard[0].Team.Players) {
   winPlayer.Properties.Scores.Value += 15;
      }
  } else { SetEnd_End0fMatch();
       ScoresTimer.Stop();
       }
  }
function SetMockMode(winners, loosers) {
 StateProp.Value = MockModeStateValue;
 api.Spawns.GetContext().Despawn();
 ScoresTimer.Stop();
 SpawnTeams();
 MainTimer.Restart(20);
 api.ContextedProperties.GetContext(loosers).SkinType.Value = 1;
 api.ContextedProperties.GetContext(winners).SkinType.Value = 2;
 api.Ui.GetContext(loosers).Hint.Value = `\nПоражение.Мы проиграли, в этой битве!`;
 api.Ui.GetContext(winners).Hint.Value = `\nМы победили.Мы выиграли, эту схватку!`;
 api.Spawns.GetContext().RespawnTime.Value = 0;
 api.Damage.GetContext().DamageOut.Value = true;
 //api.Damage.GetContext(winners).FriendlyFire.Value = true;

 const inventory = api Inventory.GetContext(loosers);
  inventory.Main.Value = false;
  inventory.Secondary.Value = false;
  inventory.Melee.Value = false;
  inventory.Explosive.Value = false;
  inventory.Build.Value = false;

 inventory = api.Inventory.GetContext(winners);
  inventory.Main.Value = true;
  inventory.MainInfinity.Value = true;
  inventory.Secondary.Value = true;
  inventory.SecondaryInfinity.Value = true;
  inventory.Melee.Value = true;
  inventory.Explosive.Value = true;
  inventory.ExplosiveInfinity.Value = true;
  inventory.Build.Value = true;
  inventory.BuildInfinity.Value = true;
}
function SetEnd_End0fMatch() {
 StateProp.Value = End0fMatchStateValue;
 api.Ui.GetContext().Hint.Value = `\nКонец матча.Победила команда: ${leaberboard[0].Player.Teams}!`;
 MainTimer.Restart(End0fMatchTime);
 ScoresTimer.Stop();
  const spawns = api.Spawns.GetContext();
   spawns.Enable = false;
   spawns.Despawn();
}
function RestartGame() {
 if (api.GameMode.Parameters.GetBool(`Load`)) { api.Map.LoadRandomMap(); }
  api.Game.RestartGame();    
}

function SpawnTeams() {
 for (const t of api.Teams) {
 if (p.Team == null) continue;
  api.Spawns.GetContext(t).Spawn();
      }
 }

function CreateNewTeam(TeamName, TeamDisplayName, TeamColor, TeamSpawnPointGroup, TeamBuildBlocksSet) {
         api.Teams.Add(TeamName, TeamDisplayName, TeamColor);
        let NewTeam = api.Teams.Get(TeamName);
        NewTeam.Spawns.SpawnPointsGroups.Add(TeamSpawnPointGroup);
        NewTeam.Build.BlocksSet.Value = TeamBuildBlocksSet;
        return NewTeam;
}

ScoresTimer.RestartLoop(12);

} catch(e) {
 api.msg.Show(`${e.name}: ${e.message} ${e.stack}`);
  }


 
    

 

   



 


 
