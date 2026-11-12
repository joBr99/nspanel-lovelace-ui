"""Guard Supervisor-only base services before s6 starts them."""
from pathlib import Path

GUARD = '''# NSPANEL_STANDALONE_GUARD
if [ "${STANDALONE+x}" = x ] || [ -z "${SUPERVISOR_TOKEN:-}" ]; then
    exit 0
fi
'''


def install(root=Path('/')):
    directories = [root / 'etc/s6-overlay/scripts']
    directories.extend((root / 'package/admin').glob('s6-overlay*/etc/s6-rc/scripts'))
    for service in ('base-addon-banner', 'base-addon-log-level'):
        paths = { (directory / service).resolve() for directory in directories if (directory / service).is_file() }
        if not paths:
            raise RuntimeError(f'Cannot find base startup service: {service}')
        for path in paths:
            content = path.read_text()
            if '# NSPANEL_STANDALONE_GUARD' not in content:
                first, rest = content.split('\n', 1)
                path.write_text(first + '\n' + GUARD + rest)


if __name__ == '__main__':
    install()
