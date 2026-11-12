import importlib.util
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('guard_base_init', ROOT / 'nspanel-lovelace-ui/guard_base_init.py')
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class StandaloneInitTests(unittest.TestCase):
    def test_early_services_skip_supervisor_only_in_standalone(self):
        for directory in ('package/admin/s6-overlay-3.2.2.0/etc/s6-rc/scripts', 'etc/s6-overlay/scripts'):
            with tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                folder = root / directory
                folder.mkdir(parents=True)
                for name in ('base-addon-banner', 'base-addon-log-level'):
                    script = folder / name
                    script.write_text('#!/bin/sh\nprintf "supervisor-called"\n')
                    script.chmod(0o755)
                guard.install(root)
                guard.install(root)  # Idempotent for symlinked installations.
                for script in folder.iterdir():
                    self.assertEqual(script.read_text().count('# NSPANEL_STANDALONE_GUARD'), 1)
                    for settings, expected in [({}, ''), ({'STANDALONE': '1'}, ''),
                            ({'SUPERVISOR_TOKEN': 'token', 'STANDALONE': '1'}, ''),
                            ({'SUPERVISOR_TOKEN': 'token'}, 'supervisor-called')]:
                        environ = {k: v for k, v in os.environ.items() if k not in ('STANDALONE', 'SUPERVISOR_TOKEN')}
                        result = subprocess.run([str(script)], env={**environ, **settings}, capture_output=True, text=True, check=True)
                        self.assertEqual(result.stdout, expected)

    def test_unknown_base_layout_fails_build_explicitly(self):
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaisesRegex(RuntimeError, 'Cannot find base startup service'):
                guard.install(Path(temp))
