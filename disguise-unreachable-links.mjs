//
// Simple hooks to prevent links being displayed as links if the target of the link isn't OBSERVABLE by the player.
//
const TypeMap = {
	"JournalEntry" : "journal",
	"Actor"        : "actors",
	"RollTable"    : "tables",
	"Scene"        : "scenes",
	"Cards"        : "cards",
	"Playlist"     : "playlists",
	"Item"         : "items",
};

/**
 * For any link in the text which points to a document which is not visible to the current player
 * it will be replaced by the non-link text (so the player will be NOT aware that a link exists)
 * @param {ActorSheet} [sheet] Sheet for renderJournalSheet and renderActorSheet hooks
 * @param {jQuery}     [html]  HTML  for renderJournalSheet and renderActorSheet hooks
 * @param {Object}     [data]  Data for renderJournalSheet and renderActorSheet hooks
 */
function _checkRenderLinks(sheet, html, data) {	
	// sheet = ActorSheet
	// html  = jQuery
	// data  = object
	
	// Original link:
	//     <a class="content-link" draggable="true" [ data-type="JournalEntry" | data-pack="packname" ] [ data-id="{id}" ] data-uuid="JournalEntry.{id}>">
	//     <i class="fas fa-th-list">::before</i>
	//     plain text
	//     </a>
	// If the "data-id" isn't observable by the current user, then replace with just "plain text"
	html.find("a.content-link").filter( (index,a) => {
		// This filter function needs to return true if the link is to be replaced by normal text

		// Firstly, check packs at the compendium level
		let pack = a.getAttribute('data-pack');
		if (pack) return game.packs.get(pack)?.private;

		const datatype = a.getAttribute('data-type');	// RollTable, JournalEntry, Actor
		if (!datatype) return false;

		const gametype = TypeMap[datatype];
		if (!gametype) {
			console.warn(`checkRenderLinks#TypeMap does not have '${datatype}'`);
			return false;
		}
		let id = a.getAttribute("data-id");
		if (!id) id = a.getAttribute("data-uuid").split('.').pop();
		const item = game[gametype].get(id);
		return !item || !item.testUserPermission(game.user, "LIMITED");
	}).replaceWith ( (index,a) => {
		const pos = a.indexOf("</i>");
		return (pos<0) ? a : a.slice(pos+4);
	});
}

Hooks.once('ready', () => {
	// Only check for link visibility if NOT a gm
	console.warn(`disguise unreachable links: ready hook`);
	if (!game.user.isGM) {
		console.warn(`Adding hooks to disguise unreachable links`);
		Hooks.on("renderJournalSheet", _checkRenderLinks);
		Hooks.on("renderJournalPageSheet", _checkRenderLinks);
		Hooks.on("renderActorSheet",   _checkRenderLinks);
	}
})
