const aliasPath = 'alias.0.Media.LMS';  // ggfs. Anpassen
const aliasDevice = 'SqueezePlay';       // ggfs. Anpassen
//Ergibt alias.0.NSPanel_1.Media.SqueezeBoxRPC

const squeezeBoxInstanz = 'squeezeboxrpc.0.Players.'; // Anpasssen, wenn nicht Instanz 0
const squeezeBoxDevice = 'SqueezePlay'; // Anpassen an dein eigenes Device

var typeAlias, read, write, nameAlias, role, desc, min, max, unit, states, custom;

function createAlias(idDst, idName,idSrc, idRd, idType, idRole, idAliasType) {
  if(existsState(idDst)) log(idDst + ' schon vorhanden !', 'warn');
  else {
     var obj = {};
     obj.type = idType;
     obj.common = getObject(idSrc).common
     obj.common.alias = {};
     if(idRd) {
         obj.common.alias.id = {};
         obj.common.alias.id.read = idRd;
         obj.common.alias.id.write = idSrc;
         obj.common.read = true;
     } else {
         obj.common.alias.id = idSrc;
     }
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

createAlias(aliasPath + '.' + aliasDevice + '.ALBUM', 'ALBUM',  squeezeBoxInstanz + squeezeBoxDevice + '.Album', '', 'state', 'media.album', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.ARTIST', 'ARTIST', squeezeBoxInstanz + squeezeBoxDevice + '.Artist', '', 'state', 'media.artist', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.TITLE', 'TITLE', squeezeBoxInstanz + squeezeBoxDevice + '.Title', '', 'state', 'media.title', 'string');
createAlias(aliasPath + '.' + aliasDevice + '.NEXT', 'NEXT', squeezeBoxInstanz + squeezeBoxDevice + '.btnForward', '', 'state', 'button.forward', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PREV', 'PREV', squeezeBoxInstanz + squeezeBoxDevice + '.btnRewind', '', 'state', 'button.reverse', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PLAY', 'PLAY', squeezeBoxInstanz + squeezeBoxDevice + '.state', '', 'state', 'media.state', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.PAUSE', 'PAUSE', squeezeBoxInstanz + squeezeBoxDevice + '.state', '', 'state', 'media.state', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STOP', 'STOP', squeezeBoxInstanz + squeezeBoxDevice + '.state', '', 'state', 'media.state', 'boolean');
createAlias(aliasPath + '.' + aliasDevice + '.STATE', 'STATE', squeezeBoxInstanz + squeezeBoxDevice + '.Power', '', 'state', 'switch', 'number');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME', 'VOLUME', squeezeBoxInstanz + squeezeBoxDevice + '.Volume', '', 'state', 'level.volume', 'number');
createAlias(aliasPath + '.' + aliasDevice + '.VOLUME_ACTUAL', 'VOLUME_ACTUAL', squeezeBoxInstanz + squeezeBoxDevice + '.Volume', '', 'state', 'value.volume', 'number');
