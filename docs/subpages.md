# Subpages

You can configure entities with with the prefix `navigate`, that are navigating to cards, in case it's hidden card, the navigation items will change and the arrow is bringing you back to the previous page.

```yaml
          - entity: navigate.testKey
```

will allow you to navigate to a cardGrid page with the configured key testKey

```yaml
    hiddenCards:
      - type: cardGrid
        title: Exmaple Grid
        entities:
          - entity: light.test_item
        key: testKey
```

# Override Status of Navigation Items

You can override the status of navigation items, to make them look like different entities.

```yaml
          - entity: navigate.testKey
            status: climate.test
```

# Override Navigation Items itself

![image](https://user-images.githubusercontent.com/29555657/210870248-dfbaf95a-3dcb-4482-a24f-afca2e426406.png)

```
    cards:
      - type: cardGrid
        title: Wohnzimmer
        navItem1:
          entity: light.bad_lights
        navItem2:
          entity: light.bad_lights
        entities:
```

This can be used to add an home button to your subpages:

```
    cards:
      - type: cardGrid
        title: Home
        key: home
        entities:
          - entity: light.bad

    hiddenCards:
      - type: cardGrid
        title: Wohnzimmer
        navItem2:
          entity: navigate.home
          icon: mdi:home
        entities:
          - entity: light.kitchen
```
