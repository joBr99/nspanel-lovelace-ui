const aliasPath = 'alias.0.NSPanel_1.Media';  // ggfs. Anpassen
const aliasDevice = 'PlayerChromecast';       // ggfs. Anpassen
//Ergibt alias.0.NSPanel_1.Media.PlayerChromecast.

const chromecastInstanz = 'chromecast.0.'; // Anpasssen, wenn nicht Instanz 0
const chromecastDevice = 'GoogleHome3224'; // Anpassen an dein eigenes Devoice

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

createAlias(aliasPath + '.' + aliasDevice, '', chromecastInstanz + chromecastDevice, '', 'channel', 'media', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ALBUM', 'ALBUM',  chromecastInstanz + chromecastDevice + '.album', '', 'state', 'media.album', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ARTIST', 'ARTIST', chromecastInstanz + chromecastDevice + '.artist', '', 'state', 'media.artist', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.TITLE', 'TITLE', chromecastInstanz + chromecastDevice + '.title', '', 'state', 'media.title', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.NEXT', 'NEXT', chromecastInstanz + chromecastDevice + '.next', '', 'state', 'button.next', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PREV', 'PREV', chromecastInstanz + chromecastDevice + '.prev', '', 'state', 'button.prev', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PLAY', 'PLAY', chromecastInstanz + chromecastDevice + '.play', '', 'state', 'button.play', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PAUSE', 'PAUSE', chromecastInstanz + chromecastDevice + '.pause', '', 'state', 'button.pause', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STOP', 'STOP', chromecastInstanz + chromecastDevice + '.stop', '', 'state', 'button.stop', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STATE', 'STATE', chromecastInstanz + chromecastDevice + '.state', '', 'state', 'media.state', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME', 'VOLUME', chromecastInstanz + chromecastDevice + '.volume', '', 'state', 'level.volume', 'number');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME_ACTUAL', 'VOLUME_ACTUAL', chromecastInstanz + chromecastDevice + '.volume', '', 'state', 'value.volume', 'number');
