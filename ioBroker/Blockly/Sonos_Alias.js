const aliasPath = 'alias.0.NSPanel_1.Media';
const aliasDevice = 'PlayerSonos';
//Ergibt alias.0.NSPanel_1.Media.PlayerSonos.

const sonosInstanz = 'sonos.0.root.';
const sonosIP = '192_168_1_212';

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

createAlias(aliasPath + '.' + aliasDevice, '', sonosInstanz + sonosIP, '', 'channel', 'media', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ALBUM', 'ALBUM',  sonosInstanz + sonosIP + '.current_album', '', 'state', 'media.album', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ARTIST', 'ARTIST', sonosInstanz + sonosIP + '.current_artist', '', 'state', 'media.artist', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.TITLE', 'TITLE', sonosInstanz + sonosIP + '.current_title', '', 'state', 'media.title', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.CONTEXT_DESCRIPTION', 'CONTEXT_DESCRIPTION', sonosInstanz + sonosIP + '.current_station', '', 'state', 'media.station', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.NEXT', 'NEXT', sonosInstanz + sonosIP + '.next', '', 'state', 'button.next', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PREV', 'PREV', sonosInstanz + sonosIP + '.prev', '', 'state', 'button.prev', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PLAY', 'PLAY', sonosInstanz + sonosIP + '.play', '', 'state', 'button.play', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PAUSE', 'PAUSE', sonosInstanz + sonosIP + '.pause', '', 'state', 'button.pause', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STOP', 'STOP', sonosInstanz + sonosIP + '.stop', '', 'state', 'button.stop', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STATE', 'STATE', sonosInstanz + sonosIP + '.state_simple', '', 'state', 'media.state', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME', 'VOLUME', sonosInstanz + sonosIP + '.volume', '', 'state', 'level.volume', 'number');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME_ACTUAL', 'VOLUME_ACTUAL', sonosInstanz + sonosIP + '.volume', '', 'state', 'value.volume', 'number');
