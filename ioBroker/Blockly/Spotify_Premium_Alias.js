const aliasPath = 'alias.0.NSPanel_1.Media';
const aliasDevice = 'PlayerSpotifyPremium';
//Ergibt alias.0.NSPanel_1.Media.PlayerSpotifyPremium.

const spotifyPremiumInstanz = 'spotify-premium.0.'; //Falls abweichende Instanznummer, bitte ändern


var typeAlias, read, write, nameAlias, role, desc, min, max, unit, states, custom;

function createAlias(idDst, idName,idSrc, idRd, idType, idRole, idAliasType) {
  if(existsState(idDst)) log(idDst + ' schon vorhanden !', 'warn');
  else {
     var obj = {};
     obj.type = idType;
     obj.common = getObject(idSrc).common;
     obj.common.alias = {};
     if(idRd) {
         obj.common.alias.id = {};
         obj.common.alias.id.read = idRd;
         obj.common.alias.id.write = idSrc;
         obj.common.read = true;
     } else obj.common.alias.id = idSrc;
     obj.common.type = idAliasType;
     if(obj.common.read !== false && read) obj.common.alias.read = read;
     if(obj.common.write !== false && write) obj.common.alias.write = write;
     obj.common.name = idName;
     obj.common.role = idRole;
     obj.common.desc = idDst;
     if(min !== undefined) obj.common.min = min;
     if(max !== undefined) obj.common.max = max;
     if(unit) obj.common.unit = unit;
     obj.common.states = states;
     if(custom && obj.common.custom) obj.common.custom = custom;
     obj.native = {};
     setObject(idDst, obj);
  } 
}

createAlias(aliasPath + '.' + aliasDevice, '', spotifyPremiumInstanz + 'player', '', 'channel', 'media', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ALBUM', 'ALBUM',  spotifyPremiumInstanz + 'player.album', '', 'state', 'media.album', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ARTIST', 'ARTIST', spotifyPremiumInstanz + 'player.artistName', '', 'state', 'media.artist', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.TITLE', 'TITLE', spotifyPremiumInstanz + 'player.trackName', '', 'state', 'media.title', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.CONTEXT_DESCRIPTION', 'CONTEXT_DESCRIPTION', spotifyPremiumInstanz + 'player.contextDescription', '', 'state', 'media.station', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.NEXT', 'NEXT', spotifyPremiumInstanz + 'player.skipPlus', '', 'state', 'button.next', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PREV', 'PREV', spotifyPremiumInstanz + 'player.skipMinus', '', 'state', 'button.prev', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PLAY', 'PLAY', spotifyPremiumInstanz + 'player.play', '', 'state', 'button.play', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PAUSE', 'PAUSE', spotifyPremiumInstanz + 'player.pause', '', 'state', 'button.pause', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STOP', 'STOP', spotifyPremiumInstanz + 'player.pause', '', 'state', 'button.stop', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STATE', 'STATE', spotifyPremiumInstanz + 'player.isPlaying', '', 'state', 'media.state', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME', 'VOLUME', spotifyPremiumInstanz + 'player.volume', '', 'state', 'level.volume', 'number');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME_ACTUAL', 'VOLUME_ACTUAL', spotifyPremiumInstanz + 'player.volume', '', 'state', 'value.volume', 'number');
