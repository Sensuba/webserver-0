var Bloc = require('./Bloc');
var Trigger = require('./Trigger');
var Data = require('./Data');

var State = require('./State');
var Play = require('./Play');
var Action = require('./Action');
var Skill = require('./Skill');
var Listener = require('./Listener');
var LastWill = require('./LastWill');
var Frenzy = require('./Frenzy');

var Draw = require('./Draw');
var Damage = require('./Damage');
var Heal = require('./Heal');
var SetCard = require('./Set');
var Boost = require('./Boost');
var Destroy = require('./Destroy');
var LevelUp = require('./LevelUp');
var SetState = require('./SetState');

var CanPay = require('./CanPay');
var FilterStats = require('./FilterStats');
var CheckCard = require('./CheckCard');
var CheckTile = require('./CheckTile');
var CompareCards = require('./CompareCards');
var CompareTiles = require('./CompareTiles');
var MergeCardFilters = require('./MergeCardFilters');
var MergeTileFilters = require('./MergeTileFilters');
var CompareLocations = require('./CompareLocations');
var ComparePlayers = require('./ComparePlayers');
var TileToTiles = require('./TileToTiles');
var CountTiles = require('./CountTiles');
var CardToTileFilter = require('./CardToTileFilter');

var BreakCard = require('./BreakCard');
var BreakModel = require('./BreakModel');
var BreakTile = require('./BreakTile');
var BreakLocation = require('./BreakLocation');
var BreakPlayer = require('./BreakPlayer');

var Archetype = require('./Archetype');
var Timestamp = require('./Timestamp');
var LimitBreak = require('./LimitBreak');
var ManaPool = require('./ManaPool');
var FindRandomCard = require('./FindRandomCard');
var RandomInt = require('./RandomInt');
var RandomBool = require('./RandomBool');

var Branch = require('./Branch');
var Loop = require('./Loop');
var AreaOfEffect = require('./AreaOfEffect');
var ForEachTile = require('./ForEachTile');

var Plus = require('./Plus');
var Minus = require('./Minus');
var Times = require('./Times');
var Div = require('./Div');
var Mod = require('./Mod');
var Not = require('./Not');
var And = require('./And');
var Or = require('./Or');
var Xor = require('./Xor');
var Ternary = require('./Ternary');
var Equal = require('./Equal');
var NotEqual = require('./NotEqual');
var Greater = require('./Greater');
var GreaterEqual = require('./GreaterEqual');
var Lesser = require('./Lesser');
var LesserEqual = require('./LesserEqual');

class Reader {

	static read (blueprint, card) {

		var ctx = { triggers: [], actions: [], parameters: [] };
		Object.keys(ctx).forEach(key => blueprint[key].forEach(el => {
			var bloc = null;
			switch(el.type) {
			case "state": bloc = new State(card, ctx); break;
			case "play": bloc = new Play(card, ctx, el.target); break;
			case "action": bloc = new Action(card, ctx, el.target); break;
			case "skill": bloc = new Skill(card, ctx, el.target); break;
			case "listener": bloc = new Listener(card, ctx); break;
			case "lw": bloc = new LastWill(card, ctx); break;
			case "frenzy": bloc = new Frenzy(card, ctx); break;
			case "draw": bloc = new Draw(card, ctx); break;
			case "damage": bloc = new Damage(card, ctx); break;
			case "heal": bloc = new Heal(card, ctx); break;
			case "set": bloc = new SetCard(card, ctx); break;
			case "boost": bloc = new Boost(card, ctx); break;
			case "destroy": bloc = new Destroy(card, ctx); break;
			case "levelup": bloc = new LevelUp(card, ctx); break;
			case "setstate": bloc = new SetState(card, ctx); break;
			case "canpay": bloc = new CanPay(card, ctx); break;
			case "checkcard": bloc = new CheckCard(card, ctx); break;
			case "checktile": bloc = new CheckTile(card, ctx); break;
			case "mergecfilters": bloc = new MergeCardFilters(card, ctx); break;
			case "mergetfilters": bloc = new MergeTileFilters(card, ctx); break;
			case "cmpcards": bloc = new CompareCards(card, ctx); break;
			case "cmptiles": bloc = new CompareTiles(card, ctx); break;
			case "cmplocations": bloc = new CompareLocations(card, ctx); break;
			case "cmpplayers": bloc = new ComparePlayers(card, ctx); break;
			case "tiletotiles": bloc = new TileToTiles(card, ctx); break;
			case "filterstats": bloc = new FilterStats(card, ctx); break;
			case "counttiles": bloc = new CountTiles(card, ctx); break;
			case "ctotfilter": bloc = new CardToTileFilter(card, ctx); break;
			case "archetype": bloc = new Archetype(card, ctx); break;
			case "timestamp": bloc = new Timestamp(card, ctx); break;
			case "limitbrk": bloc = new LimitBreak(card, ctx); break;
			case "manapool": bloc = new ManaPool(card, ctx); break;
			case "findcard": bloc = new FindRandomCard(card, ctx); break;
			case "randint": bloc = new RandomInt(card, ctx); break;
			case "randbool": bloc = new RandomBool(card, ctx); break;
			case "brkcard": bloc = new BreakCard(card, ctx); break;
			case "brkmodel": bloc = new BreakModel(card, ctx); break;
			case "brktile": bloc = new BreakTile(card, ctx); break;
			case "brklocation": bloc = new BreakLocation(card, ctx); break;
			case "brkplayer": bloc = new BreakPlayer(card, ctx); break;
			case "branch": bloc = new Branch(card, ctx); break;
			case "loop": bloc = new Loop(card, ctx); break;
			case "aoe": bloc = new AreaOfEffect(card, ctx); break;
			case "fortile": bloc = new ForEachTile(card, ctx); break;
			case "opplus": bloc = new Plus(card, ctx); break;
			case "opminus": bloc = new Minus(card, ctx); break;
			case "optimes": bloc = new Times(card, ctx); break;
			case "opdiv": bloc = new Div(card, ctx); break;
			case "opmod": bloc = new Mod(card, ctx); break;
			case "opnot": bloc = new Not(card, ctx); break;
			case "opand": bloc = new And(card, ctx); break;
			case "opor": bloc = new Or(card, ctx); break;
			case "opxor": bloc = new Xor(card, ctx); break;
			case "opter": bloc = new Ternary(card, ctx); break;
			case "ope": bloc = new Equal(card, ctx); break;
			case "opne": bloc = new NotEqual(card, ctx); break;
			case "opg": bloc = new Greater(card, ctx); break;
			case "opge": bloc = new GreaterEqual(card, ctx); break;
			case "opl": bloc = new Lesser(card, ctx); break;
			case "ople": bloc = new LesserEqual(card, ctx); break;
			case "play-trigger": bloc = new Trigger(el.type, card, ctx, "playcard"); break;
			case "play-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[0] ? d.data[0].card : null, d.data[0], d.data[0] !== null && d.data[0] !== undefined]); break;
			default: bloc = new Bloc(el.type, card, ctx); break;
			}
			ctx[key].push(bloc);
		}));
		Object.keys(ctx).forEach(key => blueprint[key].forEach((el, i) => {
			var bloc = ctx[key][i];
			bloc.updateIn(el.in);
		}));
		blueprint.basis.forEach(basis => {
			var src = blueprint[basis.type][basis.index];
			var bloc = ctx[basis.type][basis.index];
			bloc.prepare(src, blueprint);
			bloc.setup();
		})
	}
}

module.exports = Reader;