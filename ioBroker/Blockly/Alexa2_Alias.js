const aliasPath = 'alias.0.NSPanel_1.Media';
const aliasDevice = 'PlayerAlexa2';
//Ergibt alias.0.NSPanel_1.Media.PlayerAlexa2.

const alexaInstanz = 'alexa2.0.Echo-Devices.';
const alexaDevice = 'G0XXXXXXXXXXXXXXXX'; //!!! Anpassen !!! Seriennummer des Primär Device (Kann auch Gruppe sein)

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

createAlias(aliasPath + '.' + aliasDevice, '', alexaInstanz + alexaDevice, '', 'channel', 'media', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ALBUM', 'ALBUM',  alexaInstanz + alexaDevice + '.Player.currentAlbum', '', 'state', 'media.album', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ARTIST', 'ARTIST', alexaInstanz + alexaDevice + '.Player.currentArtist', '', 'state', 'media.artist', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.TITLE', 'TITLE', alexaInstanz + alexaDevice + '.Player.currentTitle', '', 'state', 'media.title', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.NEXT', 'NEXT', alexaInstanz + alexaDevice + '.Player.controlNext', '', 'state', 'button.next', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PREV', 'PREV', alexaInstanz + alexaDevice + '.Player.controlPrevious', '', 'state', 'button.prev', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PLAY', 'PLAY', alexaInstanz + alexaDevice + '.Player.controlPlay', '', 'state', 'button.play', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PAUSE', 'PAUSE', alexaInstanz + alexaDevice + '.Player.controlPause', '', 'state', 'button.pause', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STOP', 'STOP', alexaInstanz + alexaDevice + '.Commands.deviceStop', '', 'state', 'button.stop', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STATE', 'STATE', alexaInstanz + alexaDevice + '.Player.currentState', '', 'state', 'media.state', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME', 'VOLUME', alexaInstanz + alexaDevice + '.Player.volume', '', 'state', 'level.volume', 'number');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME_ACTUAL', 'VOLUME_ACTUAL', alexaInstanz + alexaDevice + '.Player.volume', '', 'state', 'value.volume', 'number');
