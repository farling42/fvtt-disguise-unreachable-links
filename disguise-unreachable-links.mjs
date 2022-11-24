//
// Simple hooks to prevent links being displayed as links if the target of the link isn't OBSERVABLE by the player.
//

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

		// Now we can use the uuid to check for general access to the relevant document
		let uuid = a.getAttribute('data-uuid');
		if (!uuid) return false;
		let doc = fromUuidSync(uuid);
		if (!doc) return false;
		return !doc.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED);

	}).replaceWith ( (index,a) => {
		const pos = a.indexOf("</i>");
		return (pos<0) ? a : a.slice(pos+4);
	});
}

Hooks.once('ready', () => {
	// Only check for link visibility if NOT a gm
	console.warn(`disguise unreachable links: ready hook`);
	if (!game.user.isGM) {
		Hooks.on("renderJournalSheet",     _checkRenderLinks);
		Hooks.on("renderJournalPageSheet", _checkRenderLinks);
		Hooks.on("renderActorSheet",       _checkRenderLinks);
	}
})
