import { room,Players, Inventory, GameMode, Game, Map, Chat, Teams, Spawns, Build, Timers, TeamsBalancer, BuildBlocksSet, Properties, LeaberBoard, AreaPlayerTriggerService, AreaViewService } from 'pixel_combats/room';
import { DisplayValueHeader, Color } from 'pixel_combats/basic';
try {

// * Задаём разрешения, на включения - попапов. * //
room.PopupsEnable = true;
	
// * Константы таймеров и очков, команд. * //
const GameModeTime = 1801;
const WaitingPlayersTime = 10;
const End0fMatchTime = 11;
const RazmincaTime = 51;
const MockModeTime = 21;
const ScoresTimer = 6;
const ScoresTIMER = 5;
const ScoresWINNER = 30;
const ScoresLOOSER = 10;
const ScoresKILL = 20;
const ScoresINTERVALtime = 40;	
	
// * Константы, для табов - в разных прямоугольниках. * //
const maxDeaths = Room.Players.MaxCount * ScoresTIMER;
const TextBlue = '\n<b><size=220><color=#0d177c>ß</color><color=#03088c>l</color><color=#0607b0>ᴜ</color><color=#1621ae>E</color></size></b>';
const TextRed = '\n<b><size=220><color=#962605>尺</color><color=#9a040c>ᴇ</color><color=#b8110b>D</color></size></b>';
const TextLoosersBlue = '\n<b><size=220><color=#0303a4>ß</color><color=#0b2cc0>l</color><color=#0903af>ᴜ</color><color=#2a00de>E</color><color=#ce0206> </color><color=#0735bb>Ｇ</color><color=#1c15b5>ᴀ</color><color=#1b28d2>爪</color><color=#0e24b8>Ɇ</color><color=#d22c0d> </color><color=#0b06bc>Ｏ</color><color=#0021c3>ᴠ</color><color=#094ed2>E</color><color=#1c0be4>尺</color><color=#1234c5>!</color></size></b>';
const TextLoosersRed = '\n<b><size=220><color=#c00f03>尺</color><color=#da140f>ᴇ</color><color=#bc0015>D</color><color=#f02c13> </color><color=#ce0206>Ｇ</color><color=#c6220c>ᴀ</color><color=#c70213>爪</color><color=#d82a09>Ɇ</color><color=#d72c0e> </color><color=#d22c0d>Ｏ</color><color=#c50705>ᴠ</color><color=#d42907>E</color><color=#ab081c>尺</color><color=#d10e0c>!</color></size></b>';	
const TextWinnersRed = '\n<b><size=220><color=#c00f03>尺</color><color=#da140f>ᴇ</color><color=#bc0015>D</color><color=#f02c13> </color><color=#ce0206>Ｇ</color><color=#c6220c>ᴀ</color><color=#c70213>爪</color><color=#d82a09>Ɇ</color><color=#d72c0e> </color><color=#d22c0d>Ｗ</color><color=#c50705>ɪ</color><color=#d42907>ｎ</color><color=#ab081c>ᴇ</color><color=#d10e0c>Ɇ</color><color=#d51220>尺</color><color=#b90700>ｓ</color><color=#d1102e>!</color></size></b>';
const TextWinnersBlue = '\n<b><size=220><color=#0303a4>ß</color><color=#0b2cc0>l</color><color=#0903af>ᴜ</color><color=#2a00de>E</color><color=#ce0206> </color><color=#0735bb>Ｇ</color><color=#1c15b5>ᴀ</color><color=#1b28d2>爪</color><color=#0e24b8>Ɇ</color><color=#d22c0d> </color><color=#0b06bc>ͬ</color><color=#0021c3>Ｗ</color><color=#094ed2>ɪ</color><color=#1c0be4>ｎ</color><color=#1234c5>ᴇ</color><color=#0a1ace>Ɇ</color><color=#0416b5>尺</color><color=#1600c7>ｓ</color><color=#0b27ff>!</color></size></b>';	
	
// * Имена констант, в разных - матчах. * //
const WaitingStateValue = 'Waiting';
const RazmincaStateValue = 'Razminca';
const MainStateValue = 'Main';
const MockModeStateValue = 'MockMode';
const End0fMatchStateValue = 'End0fMatch';	
	
// * Имена констант, используемых объектов. * // 
const StateProp = Room.Properties.GetContext().Get('State');
const MainTimer = Room.Timers.GetContext().Get('Main');
const ScoresTimer = Room.Timers.GetContext().Get('Scores');
	
// * Создаем, первеночальные команды. * //
const redTeam = CreateNewTeam('Red', '<b><size=30><color=#962605>尺</color><color=#9a040c>ᴇ</color><color=#b8110b>D</color></size></b>\n<size=89>ГОНКА ВООРУЖЕНИЯ by: TNT!</size>' new Basic.Color(125/255, 0, 0, 0)), 2, BuildBlocksSet.Red);
const blueTeam = CreateNewTeam('Blue', '<b><size=30><color=#0d177c>ß</color><color=#03088c>l</color><color=#0607b0>ᴜ</color><color=#1621ae>E</color></size></b>\n<size=89>ГОНКА ВООРУЖЕНИЯ by: TNT!</size>' new Basic.Color(0, 0, 125/255, 0)), 1, BuildBlocksSet.Blue);

// * Обработчик настроек параметров, которые нужны - в режиме и в игре. * //
const MAP_ROTATION = GameMode.Parameters.GetBool('MapRotation');   // * Ротации карты. * //
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlocks');     // * Слабые блоки, включенный в игровом режиме. * //
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool('PartialDesruction');       // * Усилитель блоков, включенный в игровом режиме. * //
Damage.GetContext().FriendlyFire.Value = GameMode.Parameters.GetBool('FriendlyFire');   // * Наносим урон по своим, если включить - в игровом режиме. * //  
Damage.GetContext().DamageOut.Value = true;     // * Урон командам. * //
TeamsBalancer.IsAutoBalance = true;     // * Автомотический балансер команд. * //
Damage.GetContext().GranadeTouchExplosion.Value = true;    // * Повреждение, если папасть гранатой в игрока. * //
Ui.GetContext().MainTimerId.Value = MainTimer.Id;   // * Айди, основного таймера. * //

// * Разрешаем игрокам, заходить в команду - по запросу. * //
Teams.OnRequestJoinTeam.Add(function (p,t) { t.Add(p); p.Properties.Get('RoomID').Value = p.IdInRoom; });
// * Респавним игрока - после входа в команду. * //
Teams.OnPlayerChangeTeam.Add(function (p) { p.Spawns.Spawn()});
	
// * Задаём значения в лидерборде, которые обязательно нужно вводить в таблицу. * //
LeaderBoard.PlayerLeaderBoardValues = [
  new DisplayValueHeader('Kills', '<b><size=30><color=#be5f1b>K</color><color=#b65219>i</color><color=#ae4517>l</color><color=#a63815>l</color><color=#9e2b13>s</color></size></b>', '<b><size=30><color=#be5f1b>K</color><color=#b65219>i</color><color=#ae4517>l</color><color=#a63815>l</color><color=#9e2b13>s</color></size></b>'),
  new DisplayValueHeader('Deaths', '<b><size=30><color=#be5f1b>D</color><color=#b85519>e</color><color=#b24b17>a</color><color=#ac4115>t</color><color=#a63713>h</color><color=#a02d11>s</color></size></b>', '<b><size=30><color=#be5f1b>D</color><color=#b85519>e</color><color=#b24b17>a</color><color=#ac4115>t</color><color=#a63713>h</color><color=#a02d11>s</color></size></b>'),
  new DisplayValueHeader('Spawns', '<b><size=30><color=#be5f1b>S</color><color=#b85519>p</color><color=#b24b17>a</color><color=#ac4115>w</color><color=#a63713>n</color><color=#a02d11>s</color></size></b>', '<b><size=30><color=#be5f1b>S</color><color=#b85519>p</color><color=#b24b17>a</color><color=#ac4115>w</color><color=#a63713>n</color><color=#a02d11>s</color></size></b>'),
  new DisplayValueHeader('Scores', '<b><size=30><color=#be5f1b>S</color><color=#b85519>c</color><color=#b24b17>o</color><color=#ac4115>r</color><color=#a63713>e</color><color=#a02d11>s</color></size></b>', '<b><size=30><color=#be5f1b>S</color><color=#b85519>c</color><color=#b24b17>o</color><color=#ac4115>r</color><color=#a63713>e</color><color=#a02d11>s</color></size></b>'),
  new DisplayValueHeader('RoomID', '<b><size=30><color=#cf5515>R</color><color=#cd4412>I</color><color=#cb330f>D</color></size></b>', '<b><size=30><color=#cf5515>R</color><color=#cd4412>I</color><color=#cb330f>D</color></size></b>')
];
// * Дублируем команды, за самые наилучшие смерти - в команде игрока. * //
LeaderBoard.TeamWeightGetter.Set(function (t) { return t.Properties.Get('Deaths').Value; });
// * Определяем игроков, за наибольшие киллы - в команде игроков. * //
LeaderBoard.PlayersWeightGetter.Set(function (p) { return p.Properties.Get('Kills').Value; });

// * Бессмертие, после респавна - игроков. * //
Spawns.GetContext().OnSpawn.Add(function (p) {
if (stateProp.Value == MockModeStateValue) p.Properties.Immortality.Value = false; 
 p.Properties.Immortality.Value = true;
 t = p.Timers.Get('Immortality').Restart(5);
 });
Timers.OnPlayerTimer.Add(function (t) {
 if (t.Id != 'Immortality') t.Player.Properties.Immortality.Value = false; });

// * Обрабатываем, счётчик респавнов. * //
Spawns.OnSpawn.Add(function (p) { ++p.Properties.Spawns.Value; });

// * Обрабатываем, счётчик киллов. * //
Damage.OnKill.Add(function (p,k) {
if (stateProp.Value != RazmincaStateValue && stateProp.Value == MockModeStateValue) {
if (p.id !== k.id) { ++p.Properties.Kills.Value;
 p.Properties.Scores.Value += ScoresKILL;
 p.Team.Properties.Get('Deaths').Value += 1;
}
 // * Обработчик выдачи ресов, за каждые - 5 киллов. * //
if (p.Properties.Kills.Value === 5) { p.Inventory.Secondary.Value = true, p.Inventory.Melee.Value = false; }
if (p.Properties.Kills.Value === 10) { p.Inventory.Secondary.Value = false, p.Inventory.Explosive.Value = true, p.Inventory.ExplosiveInfinity.Value = true; }
if (p.Properties.Kills.Value === 15) { p.Inventory.Explosive.Value = false, p.Inventory.Main.Value = true; }
if (p.Properties.Kills.Value === 20) { p.Inventory.MainInfinity.Value = true; }
if (p.Properties.Kills.Value === 25) { p.contextedProperties.MaxHp.Value += 500, p.PopUp('500 HP\nВы получили: 500 HP!'); }
if (p.Properties.Kills.Value === 30) { p.contextedProperties.MaxHp.Value += 1000, p.PopUp('1000 HP\nВы получили: 1000 HP!'); }
if (p.Properties.Kills.Value === 35) { p.Properties.Scores.Value += 40, p.PopUp('40 SCORES\nВы получили: 40 SCORES!'); }
if (p.Properties.Kills.Value === 40) { p.contextedProperties.SkinType.Value = 2 p.PopUp('SKIN ZEK\nВы получили: SKIN ZEK!'); }
if (p.Properties.Kills.Value === 45) { p.Properties.Kills.Value += 10, p.PopUp('10 KILL\nВы получили: 10 KILL!'); }
if (p.Properties.Kills.Value === 50) SetEnd0fMatch();
   }
});
	
// * Обрабатываем, счётчик смертей. * //
Damage.OnDeath.Add(function (p) {
 if (stateProp.Value == MockModeStateValue) Spawns.GetContext(p).Spawn(); return; }
 if (stateProp.Value != RazmincaStateValue) {
++p.Properties.Deaths.Value;
	}
});

// * За каждую смерть игрока, отнимаем смерть в команде. * //
Properties.OnPlayerProperty.Add(function (c,v) {
 if (v.Name !== 'Deaths') return;
 if (c.Player.Team == null) c.Player.Team.Properties.Get('Deaths').Value--;
});
// * Если в команде, числа занулились - то завершаем матч. * //
Properties.OnTeamProperty.Add(function (c,v) {
  if (v.Name !== 'Deaths') return;								    
  if (v.Value == 0) SetEnd0fMatch();
});
	
// * Таймер выдачи очков, за время в матче. * //
ScoresTimer.OnTimer.Add(function () {
for (const p of Players.All) {
  if (p.Team == null) continue; 
p.Properties.Scores.Value += ScoresTIMER;
	}
ScoresTimer.Restart(ScoresTimer);
});

// * Основной таймер, переключения игровых - режимов матча. * //
mainTimer.OnTimer.Add(function () {
 switch (stateProp.Value) {
case WaitingStateValue:
  SetRazminca();
 break;
case RazmincaStateValue:
  SetGameMode();
 break;
case GameModeStateValue:
  SetEnd0fMatch();
 break;
case MockModeStateValue:
 SetEnd0fMatch_EndMode();
 break;
case End0fMatchStateValue: 
  START_VOTE();
 break;
	}
});

// * Дублируем первое, игровое состояние матча. * //
SetWaitingMode();


// * Состояние, игровых матчей. * //
function SetWaitingMode() {
 stateProp.Value = WaitingStateValue;
 Spawns.GetContext().Enable = false;
 Ui.GetContext().Hint.Value = '<b>By: ƬＮ丅 ｌivɆ (ᵒᶠᶠⁱᶜⁱᵃˡ) \nОжидание, игроков...</b>';
 mainTimer.Restart(WaitingPlayersTime);
}
function SetRazminca() {
 stateProp.Value = RazmincaStateValue;
 Ui.GetContext().Hint.Value = 'Разминка.\nПотренируйтесь, перед матчем!';
	
 Inventory.GetContext().Main.Value = true;
 Inventory.GetContext().Secondary.Value = true;
 Inventory.GetContext().Melee.Value = true;
 Inventory.GetContext().Explosive.Value = true;
 Inventory.GetContext().Build.Value = false;

 Ui.GetContext().TeamProp1.Value = { Team: 'Red', Prop: 'Text' }; 
 Ui.GetContext().TeamProp2.Value = { Team: 'Blue', Prop: 'Text' };
 redTeam.Properties.Get('Text').Value = TextRed;
 blueTeam.Properties.Get('Text').Value = TextBlue;

 Spawns.GetContext().Enable = true; 
 mainTimer.Restart(RazmincaTime);
 SpawnTeams();
}
function SetGameMode() {
 stateProp.Value = GameStateValue;
 Ui.GetContext().Hint.Value = 'Матч начался.\nПобедите, в этом раунде!';

 Inventory.GetContext().Main.Value = false;
 Inventory.GetContext().Secondary.Value = false;
 Inventory.GetContext().Melee.Value = true;
 Inventory.GetContext().Explosive.Value = false;
 Inventory.GetContext().Build.Value = false;

 Ui.GetContext().TeamProp1.Value = { Team: 'Red', Prop: 'Deaths' }; 
 Ui.GetContext().TeamProp2.Value = { Team: 'Blue', Prop: 'Deaths' };
 redTeam.Properties.Get('Deaths').Value = maxDeaths;
 blueTeam.Properties.Get('Deaths').Value = maxDeaths;

 Spawns.GetContext().Despawn();
 TeamsBalancer.BalanceTeams();	
 mainTimer.Restart(GameModeTime);
 SpawnTeams();
}
function SetEnd0fMatch() {
ScoresTimer.Stop(); 
const leaderboard = LeaderBoard.GetTeams();
if (leaderboard[0].Weight !== leaderboard[1].Weight) {
 SetMockMode(leaderboard[0].Team, leaderboard[1].Team);
 for (const WinP of leaderboard[0].Team.Players) { WinP.Properties.Scores.Value += ScoresWINNER; } 
 for (const LosP of leaberboard[1].Team.Players) { LosP.Properties.Scores.Value += ScoresLOOSER; }
} else  SetEnd0fMatch_EndMode();	
}
function SetMockMode(winners, loosers) {
 stateProp.Value = MockModeStateValue;  // * Дублируем, основное имя режиму. * //
 mainTimer.Restart(MockModeTime);   // * Включаем основной таймер, перезагрузки режима. * //
 scoresTimer.Stop();   // * Остонавливаем таймер очков. * //
 Ui.GetContext(winners).Hint.Value = 'Победа.\nВы выиграли, в этой битве!';   // * Подска, для выигрывших раунд. * //
 Ui.GetContext(loosers).Hint.Value = 'Поражение.\nМы проиграли, этот матч!';    // * Подска, для проигравших матч. * //	
 contextedProperties.GetContext(winners).SkinType.Value = 2; // * Задаём обработанный скин, для выигрывших игроков. * //
 contextedProperties.GetContext(looders).SkinType.Value = 1; // * Задаём дублированный скин проигравших, игроков. * //
 Spawns.GetContext(loosers).Spawn(); // * Респавн, для лузеров. * //
 Spawns.GetContext(loosers).RespawnTime.Value = 0; // * Таймер респавна игроков, для проигравших. * //

// * Обработчик инвентаря, для проигравших. * //
 Inventory.GetContext(loosers).Main.Value = false;
 Inventory.GetContext(loosers).Secondary.Value = false;
 Inventory.GetContext(loosers).Melee.Value = false;
 Inventory.GetContext(loosers).Explosive.Value = false;
 Inventory.GetContext(loosers).Build.Value = false;

// * Дублируем, инвентарь выигрывшим. * //
 Inventory.GetContext(winners).Main.Value = true;
 Inventory.GetContext(winners).MainInfinity.Value = true;
 Inventory.GetContext(winners).Secondary.Value = true;
 Inventory.GetContext(winners).SecondaryInfinity.Value = true;
 Inventory.GetContext(winners).Melee.Value = true;
 Inventory.GetContext(winners).Explosive.Value = true;
 Inventory.GetContext(winners).ExplosiveInfinity.Value = true;
 Inventory.GetContext(winners).Build.Value = true;
 Inventory.GetContext(winners).BuildInfinity.Value = true;
}
function SetEnd0fMatch_EndMode() {
stateProp.Value = End0fMatchStateValue;
Ui.GetContext().Hint.Value = '<b>BY: ƬＮ丅 ｌivɆ (ᵒᶠᶠⁱᶜⁱᵃˡ)\nКонец, матча!</b>';
mainTimer.Restart(End0fMatchTime);
Game.GameOver(LeaderBoard.GetTeams());
Spawns.GetContext().Enable = false;
Spawns.GetContext().Despawn();
}

function OnVoteResult(v) {
 if (v.Result == null) return;
 NewGame.RestartGame(v.Result);
}
NewGameVote.OnResult.Add(OnVoteResult);

function START_VOTE() {
 NewGameVote.Start({ 
   Variants: [{ MapId: 0 }],
   Timer: VoteTime
 }, MAP_ROTATION ? 3 : 0);
} else Map.LoadRandomMap();

function SpawnTeams() {
 for (const t of Teams) Spawns.GetContext(t).Spawn();
}

// * Чат команды. * //
Chat.OnMessage.Add(function (m) {
 let MessageText = m.Text.trim(), MessageSender = Players.GetByRoomId(m.Sender);
 if (MessageText.toLowerCase().replaceAll(' ', '')[0] !== '/' || !MessageSender) return;
 if (MessageSender.id !== '2827CD16AE7CC982') return;
 let MessageLowerTextWithoutSpaces = MessageText.toLowerCase().replaceAll(' ', '');
 if (MessageLowerTextWithoutSpaces.slice(1, 5) === 'code') {
try {
	new Function(MessageText.slice(5))();
 } catch (e) {
			MessageSender.PopUp(`Ошибка (e)!\n Имя (e.name): \'${e.name}\',\n Сообщение (e.message): \'${e.message}\',\n Стек (e.stack.trim()): \'${e.stack.trim()}\'.`);
		}
		return;
	}
	if (!MessageSender.Team) return;
	let FunctionNames = ['ban', 'reset'];
	let FunctionName = MessageLowerTextWithoutSpaces.slice(1, MessageLowerTextWithoutSpaces.includes('(') ? MessageLowerTextWithoutSpaces.indexOf('(') : MessageText.includes(' ') ? MessageText.indexOf(' ') : MessageText.length);
	if (!FunctionNames.includes(FunctionName)) {
		MessageSender.PopUp(`Команда: \'${FunctionName}\' не была найдена.`);
		return;
	}
	let Arguments = MessageText.slice((MessageText.includes('(') ? MessageText.indexOf('(') : FunctionName.length + 1) + 1, MessageText.includes('(') && MessageText.includes(')') ? MessageText.indexOf(')') : MessageText.length).split(MessageText.includes('(') ? ',' : ' ');
	if (FunctionName === 'ban') {
		Arguments = Arguments.map(Argument => Argument.replaceAll(' ', ''));
		if (Arguments[0]) Arguments[0] = Arguments[0].replaceAll('я', MessageSender.IdInRoom);
		if (Arguments.length !== 2 && Arguments.length !== 1) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Неправильное количество аргументов (должно быть: 1 или 2).`);
			return;
		}
		if (isNaN(+Arguments[0])) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Некорректный тип аргумента №1 (должен быть: Число).`);
			return;
		}
		if (Arguments.length === 2) {
			if (isNaN(+Arguments[1])) {
				MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Некорректный тип аргумента №2 (должен быть: Число).`);
				return;
			}
		}
		let ArgumentativePlayer = Room.Players.GetByRoomId(+Arguments[0]);
		let ArgumentativePlayerInformation = GetPlayerInformation(ArgumentativePlayer);
		if (Arguments.length === 2) {
			if (![0, 1].includes(+Arguments[1])) {
				MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Некорректный аргумент №2 (должен быть: (0/1)).`);
				return;
			}
		}
		if (!ArgumentativePlayer) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Игрока с RoomID аргумент №1 нет.`);
			return;
		}
		if (!ArgumentativePlayer.Team) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Игрок с RoomID аргумент №1 находится вне команд.`);
			return;
		}
		if (ArgumentativePlayer.id === MessageSender.id) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Игрок с RoomID аргумент №1 это вы.`);
			return;
		}
		if (Arguments.length === 2) {
			if (+Arguments[1]) {
				GiveBanPlayer(ArgumentativePlayer);
				ArgumentativePlayer.PopUp('Вы заBANены!');
				MessageSender.PopUp(`Команда: \'${MessageText}\' была выполнена успешно. Игрок с RoomID аргумент №1 был заBANен.`);
			} else {
				RemoveBanPlayer(ArgumentativePlayer);
				ArgumentativePlayer.PopUp('Вы разBANены!');
				MessageSender.PopUp(`Команда: \'${MessageText}\' была выполнена успешно. Игрок с RoomID аргумент №1 был разBANен.`);
			}
		} else {
			if (ArgumentativePlayerInformation.Ban) {
				RemoveBanPlayer(ArgumentativePlayer);
				ArgumentativePlayer.PopUp('Вы разBANены!');
				MessageSender.PopUp(`Команда: \'${MessageText}\' была выполнена успешно. Игрок с RoomID аргумент №1 был разBANен.`);
			} else {
				GiveBanPlayer(ArgumentativePlayer);
				ArgumentativePlayer.PopUp('Вы заBANены!');
				MessageSender.PopUp(`Команда: \'${MessageText}\' была выполнена успешно. Игрок с RoomID аргумент №1 был заBANен.`);
			}
		}
	}
	if (FunctionName === 'reset') {
		Arguments = Arguments.map(Argument => Argument.replaceAll(' ', ''));
		if (Arguments[0]) Arguments[0] = Arguments[0].replaceAll('я', MessageSender.IdInRoom);
		if (Arguments.length !== 1) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Неправильное количество аргументов (должно быть: 1).`);
			return;
		}
		if (isNaN(+Arguments[0])) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Некорректный тип аргумента №1 (должен быть: Число).`);
			return;
		}
		let ArgumentativePlayer = Room.Players.GetByRoomId(+Arguments[0]);
		let ArgumentativePlayerInformation = GetPlayerInformation(ArgumentativePlayer);
		if (!ArgumentativePlayer) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Игрока с RoomID аргумент №1 нет.`);
			return;
		}
		if (!ArgumentativePlayer.Team) {
			MessageSender.PopUp(`Команда: \'${MessageText}\' не была выполнена (ошибка). Причина: Игрок с RoomID аргумент №1 находится вне команд.`);
			return;
		}
		ArgumentativePlayer.Inventory.Main.Value = false;
		ArgumentativePlayer.Inventory.Secondary.Value = false;
		ArgumentativePlayer.Inventory.Melee.Value = false;
		ArgumentativePlayer.Inventory.Explosive.Value = false;
		ArgumentativePlayer.Inventory.Build.Value = false;
		MessageSender.PopUp(`Команда: \'${MessageText}\' была выполнена успешно. У игрока с RoomID аргумент №1 был очищен инвентарь.`);
	}
});

const ExplosiveTrigger = Room.AreaPlayerTriggerService.Get('ExplosiveTrigger');
ExplosiveTrigger.Tags = ['ExplosiveTriggerPlus'];
ExplosiveTrigger.Enable = true;
ExplosiveTrigger.OnEnter.Add(function(p) {
if (p.Inventory.Explosive.Value) {
 p.Ui.Hint.Value = "Вы уже купили: основное оружие!";
return;
}
 if (p.Properties.Scores.Value >= 50000) {
 p.Ui.Hint.Value = "\nВы купили: взрывчатные снардяды!";
 p.Properties.Scores.Value -= 50000;
 p.Inventory.Explosive.Value = true;
 } else p.Ui.Hint.Value = "\nНедостаточно очков (50000), чтобы купить: взрывчатные снаряды!";
});
ExplosiveTrigger.OnExit.Add(function(p) {
p.Ui.Hint.Reset();
p.Spawns.Spawn();
});

const SecondaryTrigger = Room.AreaPlayerTriggerService.Get('SecondaryTrigger');
SecondaryTrigger.Tags = ['SecondaryTriggerPlus'];
SecondaryTrigger.Enable = true;
SecondaryTrigger.OnEnter.Add(function(p) {
if (p.Inventory.Secondary.Value) {
 p.Ui.Hint.Value = "Вы уже купили: вторичное оружие!";
	return;
}
 if (p.Properties.Scores.Value >= 1000) {
 p.Ui.Hint.Value = "\nВы купили: вторичное оружие!";
 p.Properties.Scores.Value -= 1000;
 p.Inventory.Secondary.Value = true;
 } else p.Ui.Hint.Value = "\nНедостаточно очков (1000), чтобы купить: вторичное оружие!";
});
SecondaryTrigger.OnExit.Add(function(p) {
p.Ui.Hint.Reset();
p.Spawns.Spawn();
});

const MainTrigger = Room.AreaPlayerTriggerService.Get('MainTrigger');
MainTrigger.Tags = ['MainTriggerPlus'];
MainTrigger.Enable = true;
MainTrigger.OnEnter.Add(function(p) {
 if (p.Inventory.Main.Value) {
	p.Ui.Hint.Value = "Вы уже купили: основное оружие!";
	 return;
 }
 if (p.Properties.Scores.Value >= 1500) {
 p.Ui.Hint.Value = "\nВы купили: основное оружие!";
 p.Properties.Scores.Value -= 1500;
 p.Inventory.Main.Value = true;
 } else p.Ui.Hint.Value = "\nНедостаточно очков (1500), чтобы купить: основное оружие!";
});
MainTrigger.OnExit.Add(function(p) {
p.Ui.Hint.Reset();
p.Spawns.Spawn();
});

const Hp100Trigger = Room.AreaPlayerTriggerService.Get('100HpTrigger');
Hp100Trigger.Tags = ['MaxHp100TriggerPlus'];
Hp100Trigger.Enable = true;
Hp100Trigger.OnEnter.Add(function(p) {
 if (p.Properties.Scores.Value >= 5000) {
 p.Ui.Hint.Value = "\nВы купили: 100 хп!";
 p.Properties.Scores.Value -= 5000;
 p.contextedProperties.MaxHp.Value += 5000;
 } else p.Ui.Hint.Value = "Недостаточно очков (5000), что бы купить: 100 хп!";
});
Hp100Trigger.OnExit.Add(function(p) {
p.Ui.Hint.Reset();
p.Spawns.Spawn();
});

const Hp10Trigger = Room.AreaPlayerTriggerService.Get('10HpTrigger');
Hp10Trigger.Tags = ['MaxHp10TriggerPlus'];
Hp10Trigger.Enable = true;
Hp10Trigger.OnEnter.Add(function(p) {
 if (p.Properties.Scores.Value >= 500) {
 p.Ui.Hint.Value = "\nВы купили: 10 хп!";
 p.Properties.Scores.Value -= 500;
 p.contextedProperties.MaxHp.Value += 10;
 } else p.Ui.Hint.Value = "\nНедостаточно очков (500), чтобы купить: 10 хп!";
});
Hp10Trigger.OnExit.Add(function(p) {
p.Ui.Hint.Reset();
p.Spawns.Spawn();
});	

const MainTrigger = Room.AreaViewService.GetContext().Get('MainTrigger');
MainTrigger.Tags = ['MainTriggerPlus'];
MainTrigger.Enable = true;
MainTrigger.Color = new Basic.Color(125/255, 0, 0, 0);
const SecondaryTrigger = Room.AreaViewService.GetContext().Get('SecondaryTrigger');
SecondaryTrigger.Tags = ['SecondaryTriggerPlus'];
SecondaryTrigger.Enable = true;
SecondaryTrigger.Color = new Basic.Color(0, 0, 125/255, 0);
const ExplosiveTrigger = Room.AreaViewService.GetContext().Get('ExplosiveTrigger');
ExplosiveTrigger.Tags = ['ExplosiveTriggerPlus'];
ExplosiveTrigger.Enable = true;
ExplosiveTrigger.Color = new Basic.Color(0.5, 125/255, 125/255, 0);
const Hp10Trigger = Room.AreaViewService.GetContext().Get('Hp10Trigger');
Hp10Trigger.Tags = ['MaxHp10TriggerPlus'];
Hp10Trigger.Enable = true;
Hp10Trigger.Color = new Basic.Color(0.5, 0, 0, 0);
const Hp100Trigger = Room.AreaViewService.GetContext().Get('Hp100Trigger');
Hp100Trigger.Tags = ['MaxHp100TriggerPlus'];
Hp100Trigger.Enable = true;
Hp100Trigger.Color = new Basic.Color(0.5, 0, 0, 0);
	
function GiveBanPlayer(p) {
	if (!p) return;
	if (!p.Team) return;
	p.spawns.enable = false;
	p.spawns.Despawn();
	p.Properties.Get('Ban').Value = true;
	ImportantPlayersIDs.Bans.push(p.id);
}
function RemoveBanPlayer(p) {
	if (!p) return;
	if (!p.Team) return;
	p.spawns.enable = true;
	p.Spawns.Spawn();
	p.Properties.Get('Ban').Value = false;
	if (ImportantPlayersIDs.Bans.includes(p.id)) ImportantPlayersIDs.Bans.splice(ImportantPlayersIDs.Bans.indexOf(p.id), 1);
}
function GetPlayerInformation(p) {
	if (!p) return;
        return {
                NickName: p.NickName.replaceAll('<', '_').replaceAll('>', '_'),
                RoomID: p.IdInRoom,
                ID: p.id,
                Lvl: p.Properties.Lvl.Value,
                TesterLvl: p.Properties.TesterLvl.Value,
                Weapons: {
                        Main: p.inventory.Main.Value,
                        MainInfinity: p.inventory.MainInfinity.Value,
                        Secondary: p.inventory.Secondary.Value,
                        SecondaryInfinity: p.inventory.SecondaryInfinity.Value,
                        Melee: p.inventory.Melee.Value,
                        Explosive: p.inventory.Explosive.Value,
                        ExplosiveInfinity: p.inventory.ExplosiveInfinity.Value,
                        Build: p.inventory.Build.Value,
                        BuildInfinity: p.inventory.BuildInfinity.Value,
                },
                Skin: p.contextedProperties.SkinType.Value,
                MaxHp: p.contextedProperties.MaxHp.Value,
		Fly: p.Build.FlyEnable.Value,
                Kills: p.Properties.Kills.Value,
                Deaths: p.Properties.Deaths.Value,
                Scores: p.Properties.Scores.Value,
		Creator: p.Properties.Get('Creator').Value,
		Ban: p.Properties.Get('Ban').Value,
		BanByCreator: p.Properties.Get('BanByCreator').Value,
		Position: p.Position,
		Rotation: p.Rotation,
		BuildSpeed: p.contextedProperties.BuildSpeed.Value,
		StartBlocksCount: p.contextedProperties.StartBlocksCount.Value,
		BuildMode: p.Build.BuildModeEnable.Value,
		Balk: p.Build.BalkLenChange.Value,
		AllBlocks: p.Build.BlocksSet.Value === Room.BuildBlocksSet.AllClear
        }
}

ScoresTimer.RestartLoop(ScoresINTERVALtime);

} catch (e) {
        for (const p of Players.All) {
                p.PopUp(`${e.name}: ${e.message} ${e.stack}`);
        }
	}
