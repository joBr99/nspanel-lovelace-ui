# Test an unreleased add-on branch

For local testing, create a branch containing your changes. In that branch's `nspanel-lovelace-ui/config.yaml`, give the add-on a recognizable name and unique version, for example:

```yaml
name: NSPanel Lovelace UI Test
version: "4.8.0-test.1"
```

Remove the `image:` line **on the test branch** so Supervisor builds its Dockerfile locally. Leaving that line in place downloads the configured registry image, regardless of the source changes in the branch. Keep the production image configuration when merging back to the release branch.

Push the branch, then add its repository URL in Home Assistant, replacing the branch name below with yours:

```text
https://github.com/joBr99/nspanel-lovelace-ui#test-web-editor
```

Install the test add-on, open its web interface, and import your configuration. The branch installation has separate storage. Stop the regular backend before saving a configuration that uses the same panel topics.

For each subsequent update, increment the version, commit, and push. Refresh/check for updates in Home Assistant and update the test add-on. The existing repository workflow publishes production images on pushes to `main`; it does not publish arbitrary test branches.

Home Assistant documents [branch selection](https://developers.home-assistant.io/docs/apps/presentation/) and [local builds without an image setting](https://contributors.home-assistant.io/apps/how-apps-work/).
