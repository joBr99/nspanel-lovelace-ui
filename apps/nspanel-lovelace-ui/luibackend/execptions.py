class LuiBackendException(Exception):
    pass

class LuiBackendConfigIncomplete(LuiBackendException):
    pass

class LuiBackendConfigError(LuiBackendException):
    pass